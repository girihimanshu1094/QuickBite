import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Loading from '../components/Loading';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const doVerify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token');
        return;
      }

      const res = await verifyEmail(token);
      if (res.success) {
        setStatus('success');
        setMessage(res.message);
      } else {
        setStatus('error');
        setMessage(res.message);
      }
    };

    doVerify();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        {status === 'verifying' && <Loading message="Verifying your QuickBite account..." />}

        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
            <div className="mt-8">
              <Link
                to="/student/dashboard"
                className="w-full inline-flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
            <div className="mt-8 space-y-3">
              <Link
                to="/student/login"
                className="w-full block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
