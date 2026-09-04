import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { ShoppingBag, Trash2, Plus, Minus, Store, Clock, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const Cart = () => {
  const {
    cartItems,
    canteen,
    pickupSlot,
    setPickupSlot,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
  } = useCart();

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!canteen) return;
      setLoadingSlots(true);
      try {
        const response = await api.get(`/pickup-slots/${canteen._id}`);
        setSlots(response.data);
      } catch (err) {
        console.error('Error fetching pickup slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [canteen]);

  const handleProceed = () => {
    setError('');
    if (!pickupSlot) {
      setError('Please select a pickup time slot before proceeding');
      return;
    }

    const selectedSlotObj = slots.find((s) => s.slotTime === pickupSlot);
    if (selectedSlotObj && selectedSlotObj.isFull) {
      setError('The selected pickup slot is full. Please choose another time slot.');
      return;
    }

    navigate('/student/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mt-2">
          Looks like you haven't added any food items yet.
        </p>
        <Link
          to="/student/canteens"
          className="mt-6 inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition"
        >
          <span>Browse College Canteens</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      {canteen && (
        <Link
          to={`/student/canteens/${canteen._id}/menu`}
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-orange-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to {canteen.name} Menu</span>
        </Link>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Review Your Cart</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Canteen: <span className="font-bold text-gray-800">{canteen?.name}</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm font-semibold text-orange-600 mt-0.5">
                  ₹{item.price} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-sm font-bold text-gray-900 min-w-[50px] text-right">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item._id)}
                  title="Remove item"
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pickup Slot Selection */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-bold text-gray-900">
                Select Pickup Time Slot
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Slots have limited capacity to avoid rush at the canteen counter. Choose when you will collect your meal.
            </p>

            {loadingSlots ? (
              <Loading message="Checking slot availability..." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((slot) => {
                  const isSelected = pickupSlot === slot.slotTime;
                  return (
                    <button
                      key={slot.slotTime}
                      type="button"
                      disabled={slot.isFull}
                      onClick={() => setPickupSlot(slot.slotTime)}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                        slot.isFull
                          ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500 text-orange-950'
                          : 'bg-white border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-bold block">{slot.slotTime}</span>
                        <span
                          className={`text-[11px] font-semibold mt-0.5 block ${
                            slot.isFull
                              ? 'text-red-600'
                              : isSelected
                              ? 'text-orange-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {slot.isFull
                            ? `${slot.bookedCount} / ${slot.maxCapacity} FULL`
                            : `${slot.availableSlots} / ${slot.maxCapacity} slots available`}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-20">
            <h3 className="text-base font-bold text-gray-900 pb-4 border-b border-gray-100">
              Order Summary
            </h3>

            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Canteen</span>
                <span className="font-semibold text-gray-800">{canteen?.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Items</span>
                <span className="font-semibold text-gray-800">{totalItems}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Selected Slot</span>
                <span className="font-semibold text-orange-600">
                  {pickupSlot || 'Not Selected'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-black text-gray-900">
              <span>Total Payable</span>
              <span className="text-orange-600">₹{totalAmount}</span>
            </div>

            <button
              onClick={handleProceed}
              disabled={!pickupSlot}
              className={`w-full mt-6 py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition flex items-center justify-center space-x-2 ${
                pickupSlot
                  ? 'bg-orange-600 hover:bg-orange-700 active:scale-98 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
