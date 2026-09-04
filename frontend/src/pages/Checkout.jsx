import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, CreditCard, Clock, Store, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const Checkout = () => {
  const { cartItems, canteen, pickupSlot, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [demoModal, setDemoModal] = useState(null);
  const navigate = useNavigate();

  if (cartItems.length === 0 || !canteen || !pickupSlot) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">No active checkout session</h2>
        <Link to="/student/cart" className="mt-4 inline-block text-orange-600 font-bold">
          ← Return to Cart
        </Link>
      </div>
    );
  }

  // Handle Online Payment with Razorpay
  const handlePayment = async () => {
    setError('');
    setProcessing(true);

    try {
      // 1. Create Razorpay Order on Backend
      const orderData = {
        amount: totalAmount,
        canteenId: canteen._id,
        items: cartItems,
        pickupSlot,
      };

      const { data: rzpOrder } = await api.post('/payment/create-order', orderData);

      // Check if real Razorpay script is loaded and ready
      if (window.Razorpay && !rzpOrder.isDemoMode) {
        const options = {
          key: rzpOrder.key,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'QuickBite Canteen Booking',
          description: `Order at ${canteen.name} (Slot: ${pickupSlot})`,
          order_id: rzpOrder.id,
          handler: async (response) => {
            await verifyAndCompleteOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#ea580c',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setProcessing(false);
      } else {
        // Test / Demo Mode simulated dialog
        setDemoModal({
          orderId: rzpOrder.id,
          amount: totalAmount,
        });
        setProcessing(false);
      }
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || 'Payment initiation failed. Please try again.');
    }
  };

  // Complete Payment Verification & Order Placement
  const verifyAndCompleteOrder = async (paymentDetails) => {
    setProcessing(true);
    try {
      const payload = {
        ...paymentDetails,
        canteenId: canteen._id,
        items: cartItems,
        pickupSlot,
        totalAmount,
      };

      const response = await api.post('/payment/verify-and-order', payload);
      clearCart();
      setDemoModal(null);
      navigate(`/student/orders/${response.data.order._id}`);
    } catch (err) {
      setProcessing(false);
      setError(
        err.response?.data?.message || 'Payment verification failed. Please contact canteen staff.'
      );
    }
  };

  // Simulated Test Mode Payment Submission for Demo / Viva
  const handleSimulatedPayment = async () => {
    if (!demoModal) return;
    await verifyAndCompleteOrder({
      razorpay_order_id: demoModal.orderId,
      razorpay_payment_id: `pay_demo_${Date.now()}`,
      razorpay_signature: 'demo_verified_signature',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/student/cart"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-orange-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>Back to Cart</span>
      </Link>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Checkout</h1>
        <p className="text-sm text-gray-500 mb-6">
          Review your order details and proceed to secure online payment
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Canteen & Pickup Slot Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-orange-50/60 border border-orange-100 rounded-2xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
                Canteen
              </span>
              <p className="text-sm font-bold text-gray-900">{canteen.name}</p>
            </div>
          </div>

          <div className="p-4 bg-orange-50/60 border border-orange-100 rounded-2xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
                Pickup Slot
              </span>
              <p className="text-sm font-bold text-gray-900">{pickupSlot}</p>
            </div>
          </div>
        </div>

        {/* Food Items Breakdown */}
        <div className="border border-gray-200 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Items Ordered
          </h3>

          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item._id} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-gray-800">{item.name}</span>
                  <span className="text-gray-400 text-xs ml-2">× {item.quantity}</span>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-base font-black text-gray-900">
            <span>Total Amount</span>
            <span className="text-xl text-orange-600">₹{totalAmount}</span>
          </div>
        </div>

        {/* Security and Payment CTA */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>
              Secure 256-bit encrypted online payment powered by Razorpay. No card details stored.
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 text-base"
          >
            {processing ? (
              <span>Processing Payment...</span>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹{totalAmount} & Book Slot</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulated Razorpay Test Dialog for Viva/Offline Testing */}
      {demoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Razorpay Payment Window</h3>
            <p className="text-xs text-gray-500 mt-1">
              Order ID: <span className="font-mono text-gray-700">{demoModal.orderId}</span>
            </p>

            <div className="my-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Merchant:</span>
                <span className="font-bold text-gray-800">QuickBite Canteen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Student:</span>
                <span className="font-bold text-gray-800">{user.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black">
                <span>Amount:</span>
                <span className="text-orange-600">₹{demoModal.amount}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setDemoModal(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulatedPayment}
                disabled={processing}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                {processing ? 'Verifying...' : 'Complete Payment ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
