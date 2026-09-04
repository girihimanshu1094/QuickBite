import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Utensils, ShoppingBag, Clock, ArrowRight, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import Loading from '../components/Loading';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { totalItems, totalAmount } = useCart();
  const [canteens, setCanteens] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [canteensRes, ordersRes] = await Promise.all([
          api.get('/canteens'),
          api.get('/orders/my-orders'),
        ]);
        setCanteens(canteensRes.data);
        setRecentOrders(ordersRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading message="Loading student dashboard..." />;

  const activeOrders = recentOrders.filter(
    (o) => o.status === 'preparing' || o.status === 'ready'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lunch Time Fast Ordering</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-orange-100 text-sm sm:text-base">
            Roll No: <span className="font-semibold text-white">{user?.rollNo}</span> • Avoid lunch queues by ordering your favorite food before reaching the canteen.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student/canteens"
              className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition flex items-center space-x-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Browse Canteens</span>
            </Link>
            <Link
              to="/student/orders"
              className="bg-orange-700/60 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-white/20 transition flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-4 -bottom-6 text-8xl opacity-15 select-none hidden md:block">
          🍔🍟
        </div>
      </div>

      {/* Active Orders Alert / Live Tracker Banner */}
      {activeOrders.length > 0 && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <h3 className="font-bold text-orange-950 text-base">
                Active Order in Progress
              </h3>
            </div>
            <Link
              to={`/student/orders/${activeOrders[0]._id}`}
              className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center"
            >
              <span>Track Order Live</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-orange-100 gap-3">
            <div>
              <span className="text-xs font-bold text-gray-500">
                Order #{activeOrders[0].orderNumber} • {activeOrders[0].canteenId?.name}
              </span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                Pickup Slot: <span className="text-orange-600">{activeOrders[0].pickupSlot}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  activeOrders[0].status === 'ready'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}
              >
                {activeOrders[0].status}
              </span>
              <Link
                to={`/student/orders/${activeOrders[0]._id}`}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                View Status
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Canteens Column */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Choose Your Canteen</h2>
              <p className="text-xs text-gray-500">Select a canteen to view today's available menu</p>
            </div>
            <Link
              to="/student/canteens"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center"
            >
              <span>View All ({canteens.length})</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {canteens.map((canteen) => (
              <Link
                key={canteen._id}
                to={`/student/canteens/${canteen._id}/menu`}
                className="group p-5 bg-white border border-gray-200 hover:border-orange-500 rounded-2xl shadow-sm hover:shadow-md transition card-hover"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white text-orange-600 rounded-xl flex items-center justify-center transition">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition">
                      {canteen.name}
                    </h3>
                    <p className="text-xs text-green-600 font-medium mt-0.5">● Open for orders</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Cart & Quick Orders */}
        <div className="space-y-6">
          {/* Quick Cart Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2 text-orange-500" />
                <span>Your Food Cart</span>
              </h3>
              {totalItems > 0 && (
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {totalItems} items
                </span>
              )}
            </div>

            {totalItems > 0 ? (
              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold text-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-orange-600 font-bold">₹{totalAmount}</span>
                </div>
                <Link
                  to="/student/cart"
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition"
                >
                  <span>Review Cart & Slots</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-400">
                <p className="text-xs">Your cart is currently empty.</p>
                <Link
                  to="/student/canteens"
                  className="mt-2 inline-block text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Browse menus now →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              <span>Recent Orders</span>
            </h3>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <Link
                    key={ord._id}
                    to={`/student/orders/${ord._id}`}
                    className="block p-3 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          ord.status === 'collected'
                            ? 'bg-gray-200 text-gray-700'
                            : ord.status === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                      <span>{ord.canteenId?.name}</span>
                      <span className="font-semibold text-gray-700">₹{ord.totalAmount}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">No orders placed yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
