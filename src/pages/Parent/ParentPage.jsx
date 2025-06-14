
import { Link } from 'react-router-dom';
import { useAuth  } from '../../context/AuthContext';
import { useState } from 'react';
import axios from '../../services/customixe-axios';

function ParentPage() {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

if ( !user || !user.children) {
  return <div>Đang tải thông tin người dùng...</div>;
}

  const generateInviteCode = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/parent-student/generateCode');
      const code = response?.data; // gọi đến backend

      setInviteCode(code);
    } catch (error) {
      console.error("Error generating invite code:", error);
    alert(error.response?.data?.message || "Failed to generate invite code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMembershipBadge = (type) => {
    if (type === 'NORMAL') {
      return (
        <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded mr-2">
          NORMAL
        </span>
      );
    }
    return (
      <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded mr-2">
        VIP
      </span>
    );
  };

  const renderStatus = (status) => {
    if (status === 'ACTIVE') {
      return <span className="text-green-600 text-sm">Active</span>;
    }
    if (status === 'BANNED') {
      return <span className="text-green-600 text-sm">BANNED</span>;
    }
    return <span className="text-gray-500 text-sm">Inactive</span>;
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Hello, {user?.fullName} 👋</h2>
        <p className="text-lg text-gray-600">Below is the list of students you are managing:</p>

        {/* Generate invite code section */}
        <div className="space-y-2">
          <button
            onClick={generateInviteCode}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Invite Code"}
          </button>

          {inviteCode && (
            <div className="flex items-center space-x-2 mt-3">
              <input
                type="text"
                value={inviteCode}
                readOnly
                className="border border-gray-300 rounded px-3 py-1 text-sm w-48 font-mono text-green-700 bg-green-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
              >
                Copy
              </button>
            </div>
          )}

        </div>

        {/* Student list */}

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {user.children.map((student) => (
    <div
      key={student.user.userId}
      className="border rounded-2xl p-5 shadow-md bg-white hover:shadow-lg transition duration-300"
    >
      <div className="flex flex-col space-y-1 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          👤 {student.user.fullName}
        </h3>
        <p className="text-sm text-gray-600">
          Gender: {student.user.gender === 'MALE' ? 'Male' : 'Female'}
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        {renderMembershipBadge(student.user.membershipLevel)}
        {renderStatus(student.user.status)}
      </div>

      <Link
        to={`/parentPage/${student.user.userId}/view_children`}
        className="inline-block text-blue-600 hover:underline text-sm font-medium"
      >
        🔍 View Details
      </Link>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ParentPage;
