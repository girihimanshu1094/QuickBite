import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StaffLogin from './pages/StaffLogin';
import StaffRegister from './pages/StaffRegister';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import StudentDashboard from './pages/StudentDashboard';
import Canteens from './pages/Canteens';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

import StaffDashboard from './pages/StaffDashboard';
import StaffMenu from './pages/StaffMenu';
import StaffOrders from './pages/StaffOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/register" element={<StudentRegister />} />
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route path="/staff/register" element={<StaffRegister />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Student Protected Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/canteens"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Canteens />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/canteens/:id/menu"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Menu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/cart"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/orders"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/orders/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'staff']}>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />

                {/* Staff Protected Routes */}
                <Route
                  path="/staff/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/menu"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffMenu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/orders"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffOrders />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
