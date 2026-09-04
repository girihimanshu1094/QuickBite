import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, RefreshCw, ChefHat, BellRing, CheckCircle2, ArrowLeft, Filter, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const StaffOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchOrders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await api.get('/staff/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching staff orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-poll orders every 10s for incoming tickets
    const timer = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setError('');
    setUpdatingId(orderId);
    try {
      await api.put(`/staff/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === 'all') return true;
    return order.status === selectedStatus;
  });

  if (loading) return <Loading message="Loading canteen orders..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            to="/staff/dashboard"
            className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-orange-600 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {user?.canteenName} Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage incoming live orders and update preparation status
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center space-x-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-2 rounded-xl transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6 text-xs font-bold">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            selectedStatus === 'all'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span>All Orders</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-xs">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('preparing')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            selectedStatus === 'preparing'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Preparing</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 text-xs">
            {orders.filter((o) => o.status === 'preparing').length}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('ready')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            selectedStatus === 'ready'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Ready for Pickup</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-green-100 text-green-800 text-xs">
            {orders.filter((o) => o.status === 'ready').length}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('collected')}
          className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            selectedStatus === 'collected'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Collected</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700 text-xs">
            {orders.filter((o) => o.status === 'collected').length}
          </span>
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                  order.status === 'preparing'
                    ? 'border-orange-300 ring-1 ring-orange-100'
                    : order.status === 'ready'
                    ? 'border-green-300 ring-1 ring-green-100'
                    : 'border-gray-200 opacity-80'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-base font-black text-gray-900 block">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Student: <span className="font-semibold text-gray-800">{order.studentId?.name}</span> ({order.studentId?.rollNo})
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'collected'
                          ? 'bg-gray-100 text-gray-600'
                          : order.status === 'ready'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      ● {order.status}
                    </span>
                  </div>

                  {/* Pickup Slot & Date */}
                  <div className="bg-gray-50 p-2.5 rounded-xl text-xs flex justify-between items-center mb-4">
                    <span className="text-gray-500">Pickup Slot:</span>
                    <span className="font-bold text-orange-700">{order.pickupSlot}</span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100 text-xs text-gray-700 mb-4">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between items-center">
                        <span>
                          <strong className="font-semibold text-gray-900">{it.name}</strong> × {it.quantity}
                        </span>
                        <span className="text-gray-500 font-medium">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer / Status Actions */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-400 font-medium">Total Paid:</span>
                    <span className="text-base font-black text-gray-900">₹{order.totalAmount}</span>
                  </div>

                  {/* 1-Click Action Stepper */}
                  {order.status === 'preparing' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order._id, 'ready')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{isUpdating ? 'Updating...' : 'Mark Ready for Pickup'}</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order._id, 'collected')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isUpdating ? 'Updating...' : 'Mark Collected ✓'}</span>
                    </button>
                  )}

                  {order.status === 'collected' && (
                    <div className="w-full bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded-xl text-xs text-center">
                      Order Completed & Handed Over
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-base font-bold">No orders found</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Orders matching the selected filter will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffOrders;
