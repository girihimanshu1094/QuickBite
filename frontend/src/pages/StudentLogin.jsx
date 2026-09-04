import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverifiedToken, setUnverifiedToken] = useState(null);

  const { loginStudent, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedToken(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const res = await loginStudent(email, password);
    if (res.success) {
      navigate('/student/dashboard');
    } else {
      setError(res.message);
      if (res.verificationToken) {
        setUnverifiedToken(res.verificationToken);
      }
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Student Login</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to order food from your campus canteen</p>
        </div>

        {/* Demo Fast Login Helper for Viva */}
        

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-orange-600 hover:text-orange-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have a student account?{' '}
          <Link to="/student/register" className="font-bold text-orange-600 hover:text-orange-700">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
