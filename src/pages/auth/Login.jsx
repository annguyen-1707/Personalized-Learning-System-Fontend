import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Mail, Lock, Github, ToggleLeft as Google, Facebook } from 'lucide-react';

function Login() {
  const { login, loginWithProvider, loading, handleLogout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const isAdminLogin = location.pathname.startsWith('/admin');
  const accessToken = localStorage.getItem('accessToken');


  useEffect(() => {
    if (accessToken) {
      handleLogout
    }
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // 5 giây

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password, isAdminLogin);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProviderLogin = async (provider) => {
    try {
      setError('');
      await loginWithProvider(provider);

    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
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
          Sign in to your account
        </h2>
        {!isAdminLogin && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register1" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type={isAdminLogin ? 'text' : 'email'}
                  autoComplete={isAdminLogin ? 'username' : 'email'}
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">

              {!isAdminLogin && (
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2 px-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          {!isAdminLogin && (
            <div className="mt-6">
              <div className= "flex gap-3 justify-between">
                <button
                  onClick={() => handleProviderLogin('google')}
                  className="btn-outline py-2 px-4 flex justify-center items-center w-40"
                >
                  <Google className="h-5 w-5" />
                </button>


                <button
                  onClick={() => handleProviderLogin('facebook')}
                  className="btn-outline py-2 px-4 flex justify-center items-center w-40"
                >
                  <Facebook className="h-5 w-5" />
                </button>

              </div>
            </div>)}
        </div>
      </div>
    </div>
  );
}

export default Login;