import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Utensils, LogOut, User as UserIcon, ChefHat, Clock } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center">
            <Link to={user ? (user.role === 'staff' ? '/staff/dashboard' : '/student/dashboard') : '/'} className="flex items-center space-x-2">
              <span className="text-2xl">🍔</span>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  QuickBite
                </span>
                <span className="hidden sm:inline-block text-xs text-gray-500 ml-2 font-medium">
                  College Canteen Booking
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/student/login"
                  className="text-gray-700 hover:text-orange-600 text-sm font-medium transition px-3 py-1.5 rounded-md hover:bg-orange-50"
                >
                  Student Portal
                </Link>
                <Link
                  to="/staff/login"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Staff Portal
                </Link>
              </>
            ) : user.role === 'student' ? (
              <>
                <Link
                  to="/student/canteens"
                  className="flex items-center text-gray-700 hover:text-orange-600 text-sm font-medium transition"
                >
                  <Utensils className="w-4 h-4 mr-1 text-orange-500" />
                  <span>Canteens</span>
                </Link>

                <Link
                  to="/student/orders"
                  className="flex items-center text-gray-700 hover:text-orange-600 text-sm font-medium transition"
                >
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  <span>My Orders</span>
                </Link>

                <Link
                  to="/student/cart"
                  className="relative flex items-center bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="ml-1.5 bg-orange-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <div className="flex items-center pl-2 border-l border-gray-200 space-x-2">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{user.rollNo}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              // Staff Navigation
              <>
                <Link
                  to="/staff/dashboard"
                  className="text-gray-700 hover:text-orange-600 text-sm font-medium transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/staff/menu"
                  className="flex items-center text-gray-700 hover:text-orange-600 text-sm font-medium transition"
                >
                  <ChefHat className="w-4 h-4 mr-1 text-orange-500" />
                  <span>Manage Menu</span>
                </Link>

                <Link
                  to="/staff/orders"
                  className="flex items-center text-gray-700 hover:text-orange-600 text-sm font-medium transition"
                >
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  <span>Canteen Orders</span>
                </Link>

                <div className="flex items-center pl-2 border-l border-gray-200 space-x-2">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                    <p className="text-[10px] text-orange-600 font-medium">
                      {user.canteenName || 'Staff'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
