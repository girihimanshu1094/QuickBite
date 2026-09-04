import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { KeyRound, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setResetToken(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(response.data.message);
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-700 font-medium">{successMessage}</p>

            <div className="mt-6">
              <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
            >
              {loading ? <span>Sending...</span> : <span>Send Reset Link</span>}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/" className="font-bold text-orange-600 hover:text-orange-700">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
