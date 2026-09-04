import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import OrderTracker from '../components/OrderTracker';
import Loading from '../components/Loading';
import { ArrowLeft, RefreshCw, Store, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto-poll status every 6 seconds if order is still in progress
    const interval = setInterval(() => {
      if (order?.status !== 'collected') {
        fetchOrder();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  if (loading) return <Loading message="Loading live order status..." />;

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <Link to="/student/orders" className="mt-4 inline-block text-orange-600 font-bold">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/student/orders"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Orders</span>
        </Link>

        <button
          onClick={() => fetchOrder(true)}
          disabled={refreshing}
          className="flex items-center space-x-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Live Visual Tracker (Preparing -> Ready -> Collected) */}
      <OrderTracker status={order.status} orderNumber={order.orderNumber} />

      {/* Pickup Slot Guidance Alert */}
      {order.status === 'ready' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3 text-green-900 animate-pulse">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Your order is READY at the counter!</h4>
            <p className="text-xs text-green-700 mt-0.5">
              Please head to <span className="font-bold">{order.canteenId?.name}</span> counter and show Order #{order.orderNumber} to collect your food.
            </p>
          </div>
        </div>
      )}

      {/* Order Details Breakdown */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Ordered Food Items
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-gray-800">{item.name}</span>
                  <p className="text-xs text-gray-400">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total Paid</span>
            <span className="text-xl font-black text-orange-600">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Pickup & Payment Meta info */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Canteen & Pickup
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Store className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block">Canteen</span>
                  <span className="font-bold text-gray-800">{order.canteenId?.name}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block">Scheduled Pickup Slot</span>
                  <span className="font-bold text-orange-600">{order.pickupSlot}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Payment Information
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono text-gray-700 text-[11px] truncate max-w-[130px]">
                  {order.razorpayPaymentId || 'pay_online'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Order Date:</span>
                <span className="font-medium text-gray-700">{order.orderDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
