import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const handleGetCode = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    setCooldown(30); // Always wait 30s regardless of result
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      await axios.post(
        'http://localhost:8080/api/auth/forgot-password',
        { email },
        { withCredentials: true }
      );
      setMessage('Reset code has been sent to your email.');
      setCodeSent(true);
    } catch (err) {
      let msg = err.response?.data?.message || 'Email is not registered';
      setError(msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!code) {
      setError('Please enter the code you received.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/auth/verify-reset-code',
        { email, code },
        { withCredentials: true }
      );
      setMessage('Code verified! Please enter your new password.');
      setCodeVerified(true);
    } catch (err) {
      let msg = err.response?.data?.message || 'Invalid or expired code';
      setError(msg);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/auth/reset-password',
        { token: code, newPassword, confirmPassword },
        { withCredentials: true }
      );
      setMessage('Your password has been reset successfully! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
      setCodeVerified(false);
    } catch (err) {
      let msg = err.response?.data?.message || 'Failed to reset password';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-primary-600 text-white flex items-center justify-center">
            <BookOpen className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 bg-success-50 border border-success-500 text-success-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {!codeVerified ? (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="ml-2 btn btn-outline btn-primary"
                    onClick={handleGetCode}
                    disabled={loading || !email || cooldown > 0}
                  >
                    {loading
                      ? "Sending..."
                      : cooldown > 0
                        ? `Get code (${cooldown}s)`
                        : "Get code"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Enter code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="input input-bordered w-full"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the code you received"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full btn-primary py-2 px-4"
                >
                  Submit code
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input input-bordered w-full pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input input-bordered w-full pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full btn-primary py-2 px-4"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;