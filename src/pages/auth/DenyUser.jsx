import { ShieldOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccessDeniedUserPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <ShieldOff size={48} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>
        <button
          onClick={() => {
            if (user?.roleName === 'PARENT') {
              navigate('/parentPage');
            } else {
              navigate('/');
            }
          }}
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}