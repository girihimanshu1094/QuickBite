import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Store, Clock, Utensils, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6">
          <span>⚡ College Lunch-Hour Fast Booking</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight">
          Quick<span className="text-orange-600">Bite</span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-bold text-gray-700">
          Skip the Queue. Enjoy Your Food.
        </p>

        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Order food before reaching the canteen, select a convenient pickup slot, pay online with Razorpay, and pick up your hot food without standing in long queues.
        </p>

        {/* Role Selection Options */}
        <div className="mt-10 max-w-xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Choose how you want to continue
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Role Card */}
            <Link
              to="/student/login"
              className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 hover:border-orange-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-center"
            >
              <div className="w-14 h-14 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white text-orange-600 rounded-2xl flex items-center justify-center transition mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Student Portal</h3>
              <p className="text-xs text-gray-500 mt-1">Browse menus, book pickup slots & order food</p>
              <div className="mt-4 flex items-center text-sm font-bold text-orange-600 group-hover:text-orange-700">
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Staff Role Card */}
            <Link
              to="/staff/login"
              className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 hover:border-orange-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-center"
            >
              <div className="w-14 h-14 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white text-orange-600 rounded-2xl flex items-center justify-center transition mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Staff Portal</h3>
              <p className="text-xs text-gray-500 mt-1">Manage bulk menu & update live order status</p>
              <div className="mt-4 flex items-center text-sm font-bold text-orange-600 group-hover:text-orange-700">
                <span>Continue as Staff</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto pt-8 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Pickup Slots</h4>
              <p className="text-xs text-gray-500 mt-0.5">Pre-select time slots with limited capacity to prevent crowding.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Multi-Canteen</h4>
              <p className="text-xs text-gray-500 mt-0.5">Browse menus across campus canteens dynamically in one place.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Live 3-Stage Tracking</h4>
              <p className="text-xs text-gray-500 mt-0.5">Clear visibility: Preparing → Ready → Collected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
