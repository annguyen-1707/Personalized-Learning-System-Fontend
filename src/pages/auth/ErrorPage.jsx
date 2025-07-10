import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-6">
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">
            <FiAlertTriangle className="text-5xl" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-red-600 tracking-tight">500</h1>
        <p className="text-2xl font-semibold text-gray-800">
          Oops! Something went wrong on our server.
        </p>
        <p className="text-gray-500">
          We're working to fix it. Please try again later or contact support if the issue persists.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-medium hover:bg-red-700 transition duration-200"
        >
          ⬅ Back to Home Page
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;