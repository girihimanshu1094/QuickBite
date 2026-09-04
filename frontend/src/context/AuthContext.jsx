import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('quickbite_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('quickbite_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('quickbite_user');
    }
  }, [user]);

  // Student Login
  const loginStudent = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/student/login', { email, password });
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
        isVerified: error.response?.data?.isVerified,
        verificationToken: error.response?.data?.verificationToken,
      };
    } finally {
      setLoading(false);
    }
  };

  // Staff Login
  const loginStaff = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/staff/login', { email, password });
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
        isVerified: error.response?.data?.isVerified,
        verificationToken: error.response?.data?.verificationToken,
      };
    } finally {
      setLoading(false);
    }
  };

  // Student Register
  const registerStudent = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/student/register', formData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Staff Register
  const registerStaff = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/staff/register', formData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify Email
  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-email', { token });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('quickbite_user');
    localStorage.removeItem('quickbite_cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginStudent,
        loginStaff,
        registerStudent,
        registerStaff,
        verifyEmail,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
