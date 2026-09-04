import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Store, ChefHat, Clock, CheckCircle2, IndianRupee, ArrowRight, BellRing } from 'lucide-react';
import Loading from '../components/Loading';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/staff/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching staff metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading message="Loading canteen management dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-orange-600/30 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5" />
            <span>Canteen Staff Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mt-1">
            Assigned Canteen: <strong className="text-orange-400 font-bold">{user?.canteenName || 'Central Cafe'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/staff/menu"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition flex items-center space-x-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Manage Menu</span>
          </Link>
          <Link
            to="/staff/orders"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-sm border border-white/20 transition flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Today's Orders</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Orders */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase">Today's Orders</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{stats?.totalToday || 0}</p>
        </div>

        {/* Preparing */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-orange-600 mb-2">
            <span className="text-xs font-bold uppercase">Preparing</span>
            <ChefHat className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-orange-600">{stats?.preparing || 0}</p>
        </div>

        {/* Ready */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-green-600 mb-2">
            <span className="text-xs font-bold uppercase">Ready</span>
            <BellRing className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-green-600">{stats?.ready || 0}</p>
        </div>

        {/* Collected */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase">Collected</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{stats?.collected || 0}</p>
        </div>

        {/* Total Revenue */}
        <div className="col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase">Today's Revenue</span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600">₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Bulk Menu & Daily Templates</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Add multiple menu items at once, toggle availability, and save your daily default menu so you don't have to enter it manually every day.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/staff/menu"
              className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center"
            >
              <span>Open Menu Manager</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Live Canteen Orders</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              View incoming student orders for {user?.canteenName}. Update order statuses with 1-click (Preparing → Ready → Collected) in real-time.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/staff/orders"
              className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center"
            >
              <span>View Live Orders</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
