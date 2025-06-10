import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

function ParentPage() {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const studentList = [
    {
      id: 1,
      name: 'Nguyen Van A',
      level: 'Grade 5',
      membership: 'VIP',
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'Tran Thi B',
      level: 'Grade 3',
      membership: 'NORMAL',
      status: 'INACTIVE',
    },
  ];

  const generateInviteCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/invite-code'); // gọi đến backend
      setInviteCode(response.data.code);
    } catch (error) {
      setInviteCode('AB2XY1');
      console.error("Error generating invite code:", error);
      alert("Failed to generate invite code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderMembershipBadge = (type) => {
    if (type === 'VIP') {
      return (
        <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded mr-2">
          VIP
        </span>
      );
    }
    return (
      <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded mr-2">
        Normal
      </span>
    );
  };

  const renderStatus = (status) => {
    if (status === 'ACTIVE') {
      return <span className="text-green-600 text-sm">Active</span>;
    }
    return <span className="text-gray-500 text-sm">Inactive</span>;
  };

  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Hello, {user?.name} 👋</h2>
        <p className="text-lg text-gray-600">Below is the list of students you are managing:</p>

        {/* Generate invite code section */}
        <div className="space-y-2">
          <button
            onClick={generateInviteCode}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Invite Code"}
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
          {studentList.map((student) => (
            <div
              key={student.id}
              className="border rounded-xl p-4 shadow bg-white hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-700">{student.name}</h3>
              <p className="text-gray-500 mb-1">{student.level}</p>
              <div className="flex items-center space-x-2 mb-2">
                {renderMembershipBadge(student.membership)}
                {renderStatus(student.status)}
              </div>
              <Link
                to={`/student/${student.id}`}
                className="inline-block mt-2 text-primary-600 hover:underline text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ParentPage;
