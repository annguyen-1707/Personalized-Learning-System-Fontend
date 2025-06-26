// src/pages/UserManagement.jsx
import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';

export default function UserManagement() {
  const [fullName, setFullName] = useState('');
  const [membershipLevel, setMembershipLevel] = useState('');
  const [status, setStatus] = useState('');
  const [registeredFrom, setRegisteredFrom] = useState('');
  const [registeredTo, setRegisteredTo] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [statusOptions, setStatusOptions] = useState([]);
  const [membershipOptions, setMembershipOptions] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    status: '',
    membershipLevel: '',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    address: '',
    gender: '',
    membershipLevel: '',
  });

  // Fetch dropdown options
  const fetchOptions = async () => {
    try {
      const [statusRes, membershipRes] = await Promise.all([
        fetch('http://localhost:8080/options/user-statuses'),
        fetch('http://localhost:8080/options/membership-levels'),
      ]);
      setStatusOptions(await statusRes.json());
      setMembershipOptions(await membershipRes.json());
    } catch (err) {
      console.error('Failed to fetch options', err);
    }
  };

  // Fetch user list
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fullName) params.append('fullName', fullName);
      if (membershipLevel) params.append('membershipLevel', membershipLevel);
      if (status) params.append('status', status);
      if (registeredFrom) params.append('registeredFrom', registeredFrom);
      if (registeredTo) {
        const toDate = new Date(registeredTo);
        toDate.setDate(toDate.getDate() + 1);
        params.append('registeredTo', toDate.toISOString().split('T')[0]);
      }
      params.append('currentPage', page);
      params.append('pageSize', pageSize);

      const res = await fetch(`http://localhost:8080/admin/users?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status === 'success' && json.data?.content) {
        setUsers(json.data.content);
        setTotalPages(json.data.page?.totalPages || 1);
      } else {
        setUsers([]);
        setError(json.message || 'Failed to load users');
      }
    } catch (err) {
      setError(err.message || 'Fetch error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const startEdit = (user) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      membershipLevel: user.membershipLevel,
    });
    setIsEditing(user.userId);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ fullName: '', email: '', status: '', membershipLevel: '' });
  };

  const formatProvider = (p) => {
    switch (p) {
      case 'LOCAL': return 'Local';
      case 'GOOGLE': return 'Google';
      case 'FACEBOOK': return 'Facebook';
      default: return p;
    }
  };

  const formatMembership = (level) => {
    switch (level) {
      case 'NORMAL': return 'Normal';
      case 'ONE_MONTH': return '1 Month';
      case 'SIX_MONTHS': return '6 Months';
      case 'ONE_YEAR': return '1 Year';
      default: return level;
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert('Full Name and Email cannot be empty');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${isEditing}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.status === 'success') {
        fetchUsers();
        cancelEdit();
      } else {
        alert(json.message || 'Update failed');
      }
    } catch (err) {
      alert('Update error: ' + err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers();
        setShowDeleteConfirm(null);
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, username, password } = newUser;
    if (![fullName, email, username, password].every((f) => f.trim())) {
      alert('Full Name, Email, Username & Password cannot be empty');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, provider: 'LOCAL', status: 'INACTIVE' }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        fetchUsers();
        setShowAddUser(false);
        setNewUser({ fullName: '', email: '', username: '', password: '', phone: '', address: '', gender: '', membershipLevel: '' });
      } else {
        alert(json.message || 'Add user failed');
      }
    } catch (err) {
      alert('Add user error: ' + err.message);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Filters */}
      <div className="bg-white shadow p-4 mb-6 rounded">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border p-2 rounded"
            placeholder="Full Name"
          />
          <select
            value={membershipLevel}
            onChange={(e) => setMembershipLevel(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Memberships</option>
            {membershipOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            value={registeredFrom}
            onChange={(e) => setRegisteredFrom(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={registeredTo}
            onChange={(e) => setRegisteredTo(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            disabled={loading}
          >
            <Search size={16} className="mr-1" /> Search
          </button>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-center">
                {['Full Name', 'Email', 'Status', 'Membership', 'Created', 'Updated', 'Provider', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-2 border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center">No users found.</td>
                </tr>
              )}
              {users.map((user) => (
                isEditing === user.userId ? (
                  <tr key={user.userId}>
                    <td className="border p-2">
                      <input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="border p-1 rounded w-full"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">
                      <select
                        value={formData.membershipLevel}
                        onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
                        className="border p-1 rounded w-full"
                      >
                        {membershipOptions.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="border p-2">{new Date(user.updatedAt).toLocaleString()}</td>
                    <td className="border p-2">{user.provider}</td>
                    <td className="border p-2 flex gap-2">
                      <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.userId}>
                    <td className="border p-2">{user.fullName}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                         ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="border p-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${user.membershipLevel === 'NORMAL' ? 'bg-gray-100 text-gray-800' :
                          user.membershipLevel === 'ONE_MONTH' ? 'bg-yellow-100 text-yellow-800' :
                            user.membershipLevel === 'SIX_MONTHS' ? 'bg-blue-100 text-blue-800' :
                              user.membershipLevel === 'ONE_YEAR' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {formatMembership(user.membershipLevel)}
                      </span>
                    </td>

                    <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="border p-2">{new Date(user.updatedAt).toLocaleString()}</td>
                    <td className="border p-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${user.provider === 'LOCAL' ? 'bg-gray-100 text-gray-800' :
                          user.provider === 'GOOGLE' ? 'bg-red-100 text-red-800' :
                            user.provider === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {formatProvider(user.provider)}
                      </span>
                    </td>

                    <td className="border p-2 flex gap-2">
                      <button onClick={() => startEdit(user)} className="text-blue-600"><Edit size={16} /></button>
                      <button onClick={() => setShowDeleteConfirm(user.userId)} className="text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 border rounded ${i === page ? 'bg-blue-600 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 transition-all duration-300">
          <form onSubmit={handleAddUserSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Add New User</h2>
            <input
              className="w-full border p-2 rounded"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            {/* Optional fields */}
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border p-2 rounded"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              />
              <select
                className="border p-2 rounded"
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <select
                className="border p-2 rounded"
                value={newUser.membershipLevel}
                onChange={(e) => setNewUser({ ...newUser, membershipLevel: e.target.value })}
              >
                <option value="">Select Membership</option>
                {membershipOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
