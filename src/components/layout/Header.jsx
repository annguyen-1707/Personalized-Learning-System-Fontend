import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiUser, FiBell, FiSearch, FiUserPlus } from 'react-icons/fi';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

function Header({ setSidebarOpen, onNotificationClick }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 lg:hidden"
              onClick={() => setSidebarOpen && setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
            <Link to="/" className="flex items-center">
              <Logo className="h-14 w-auto" />
            </Link>
          </div>

          {/* Search */}


          {/* Right */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Nút thông báo */}
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700"
                  onClick={onNotificationClick}
                >
                  <span className="sr-only">Notifications</span>
                  <FiBell className="h-6 w-6" />
                </button>

                {/* Nếu là PARENT thì có nút tạo tài khoản học sinh */}
                {user?.roleName === "PARENT" && (
                  <button
                    onClick={() => navigate("/register1")}
                    className="p-1 rounded-full text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Create Account for Student</span>
                    <FiUserPlus className="h-6 w-6" />
                  </button>
                )}

                {/* Nếu KHÔNG phải PARENT thì có nút Profile */}
                {user?.roleName !== "PARENT" && (
                  <Link to="/profile" className="p-1 rounded-full text-gray-500 hover:text-gray-700">
                    <span className="sr-only">Profile</span>
                    <FiUser className="h-6 w-6" />
                  </Link>
                )}

                {/* Nút logout */}
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register1")}
                  className="text-green-500 hover:underline text-sm"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;