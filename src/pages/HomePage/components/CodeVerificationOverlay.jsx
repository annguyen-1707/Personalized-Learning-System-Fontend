import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { FiX } from 'react-icons/fi'; // icon nút đóng
import axios from '../../../services/customixe-axios';

export default function ParentVerificationOverlay({ children }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'pending' | 'approved' | 'rejected'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mess, setMess] = useState(`We've sent a verification request to your parent.
              Please wait while they review your request.`);
  const { user, setUser } = useAuth();


  // useEffect(() => {
  //   if (!loading && user.roleName === 'PARENT'  ) {
  //     handleLogout();       
  //   }
  // }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (!code || code.length !== 6) {
      setError('Parent code must be 6 characters');
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post('/api/parent-student/approve', {
        parentCode: code
      });
      setMess(response.data.mess)
      setStatus('pending');
    } catch (err) {
      setError('Failed to send request');
      console.error('WebSocket error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

 if (!user || !Array.isArray(user.parents) || user.parents.length !== 0) {
  return children;
}

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700"
      >
        {/* Nút Đóng X */}
        <button
          onClick={handleLogout}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <FiX className="w-6 h-6" />
        </button>
        {status === 'pending' ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <FiClock className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Waiting for Parent Approval
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
             {mess}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setStatus('idle');
                  setIsLoading(false);
                }}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Cancel Request
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50">
                <FiLock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                Parent Verification Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Enter your parent's code to request access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter parent's unique code"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition"
                    required
                  />
                  <FiMail className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 px-2 py-1.5 rounded bg-red-50 dark:bg-red-900/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition disabled:opacity-70"
              >
                {isLoading ? 'Sending Request...' : 'Request Approval'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}