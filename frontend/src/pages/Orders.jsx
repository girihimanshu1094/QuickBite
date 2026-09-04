import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, Store, ChevronRight, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import Loading from '../components/Loading';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching student orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loading message="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Orders Yet</h2>
        <p className="text-sm text-gray-500 mt-2">
          You haven't placed any canteen orders yet. Skip the lunch queue by placing your first order!
        </p>
        <Link
          to="/student/canteens"
          className="mt-6 inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition"
        >
          <span>Browse Canteens</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track live preparation and view your order history
          </p>
        </div>
        <Link
          to="/student/canteens"
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>New Order</span>
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isLive = order.status === 'preparing' || order.status === 'ready';

          return (
            <div
              key={order._id}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isLive ? 'border-orange-300 ring-1 ring-orange-200' : 'border-gray-200'
              }`}
            >
              {/* Left Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-black text-gray-900">
                    Order #{order.orderNumber}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      order.status === 'collected'
                        ? 'bg-gray-100 text-gray-600 border border-gray-200'
                        : order.status === 'ready'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}
                  >
                    ● {order.status}
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                    Paid
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center text-xs text-gray-600 gap-y-1 gap-x-4">
                  <span className="flex items-center font-medium">
                    <Store className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {order.canteenId?.name || 'Canteen'}
                  </span>
                  <span className="flex items-center font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1 text-orange-500" />
                    Slot: <strong className="ml-1 text-gray-800">{order.pickupSlot}</strong>
                  </span>
                  <span className="text-gray-400">
                    Date: {order.orderDate || new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Items preview snippet */}
                <p className="mt-2 text-xs text-gray-500 line-clamp-1">
                  Items:{' '}
                  {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                </p>
              </div>

              {/* Right: Amount & Track Button */}
              <div className="flex items-center justify-between md:justify-end md:space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-gray-400 block font-medium">Total</span>
                  <span className="text-lg font-black text-orange-600">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <Link
                  to={`/student/orders/${order._id}`}
                  className={`inline-flex items-center space-x-1.5 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition ${
                    isLive
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <span>{isLive ? 'Track Live' : 'View Details'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
