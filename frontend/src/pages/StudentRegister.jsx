import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User as UserIcon, Hash, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
  });
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const { registerStudent, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.rollNo) {
      setError('Please fill in all 4 fields (Name, Email, Password, Roll No.)');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const res = await registerStudent(formData);
    if (res.success) {
      setSuccessData(res.data);
    } else {
      setError(res.message);
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
          <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Create your QuickBite student account</p>
        </div>

        {/* Registration Success / Verification State */}
        {successData ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Registration Successful!</h3>
            <p className="text-sm text-gray-600 mt-2">
              A verification email has been sent to <span className="font-semibold">{formData.email}</span>.
            </p>

            <div className="mt-6">
              <Link to="/student/login" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                Back to Student Login
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  College Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Roll No.
                </label>
                <div className="relative">
                  <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="rollNo"
                    required
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="Enter Roll No."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
              >
                {loading ? <span>Registering...</span> : <span>Register as Student</span>}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/student/login" className="font-bold text-orange-600 hover:text-orange-700">
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentRegister;
