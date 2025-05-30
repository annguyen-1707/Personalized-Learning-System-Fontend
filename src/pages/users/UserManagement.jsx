import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';

function UserManagement() {
  const [fullName, setFullName] = useState('');
  const [membershipLevel, setMembershipLevel] = useState('');
  const [status, setStatus] = useState('');
  const [registeredFrom, setRegisteredFrom] = useState('');
  const [registeredTo, setRegisteredTo] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    status: '',
    membershipLevel: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Add User state
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
        // Thêm một ngày vào registeredTo để bao gồm toàn bộ ngày đã chọn
        const toDate = new Date(registeredTo);
        toDate.setDate(toDate.getDate() + 1);
        const adjustedTo = toDate.toISOString().split('T')[0];
        params.append('registeredTo', adjustedTo);
      }

      const url = `http://localhost:8080/admin/users?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.status === 'success' && Array.isArray(json.data)) {
        setUsers(json.data);
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
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers();
  };

  const startEdit = (user) => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      status: user.status || '',
      membershipLevel: user.membershipLevel || '',
    });
    setIsEditing(user.userId);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({
      fullName: '',
      email: '',
      status: '',
      membershipLevel: '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert('Full Name và Email không được để trống');
      return;
    }

    const payload = {};
    if (formData.fullName) payload.fullName = formData.fullName.trim();
    if (formData.email) payload.email = formData.email.trim();
    if (formData.status) payload.status = formData.status;
    if (formData.membershipLevel) payload.membershipLevel = formData.membershipLevel;

    try {
      const res = await fetch(`http://localhost:8080/admin/users/${isEditing}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.status === 'success') {
        alert('Cập nhật thành công');
        fetchUsers();
        cancelEdit();
      } else {
        alert(json.message || 'Update failed');
      }
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.status === 'success') {
        fetchUsers();
        setShowDeleteConfirm(null);
      } else {
        alert(json.message || 'Delete failed');
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Handle add user submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      alert('Full Name, Email, Username và Password không được để trống');
      return;
    }

    const payload = {
      ...newUser,
      provider: 'LOCAL',
      status: 'INACTIVE',
    };

    try {
      const res = await fetch(`http://localhost:8080/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.status === 'success') {
        alert('Thêm user thành công');
        fetchUsers();
        setShowAddUser(false);
        setNewUser({
          fullName: '',
          email: '',
          username: '',
          password: '',
          phone: '',
          address: '',
          gender: '',
          membershipLevel: '',
        });
      } else {
        alert(json.message || 'Lỗi khi thêm user');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Filter/Search */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Membership</label>
            <select
              value={membershipLevel}
              onChange={(e) => setMembershipLevel(e.target.value)}
              className="input"
            >
              <option value="">All Memberships</option>
              <option value="NORMAL">NORMAL</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BANNED">BANNED</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Registered From</label>
            <input
              type="date"
              value={registeredFrom}
              onChange={(e) => setRegisteredFrom(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Registered To</label>
            <input
              type="date"
              value={registeredTo}
              onChange={(e) => setRegisteredTo(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="mt-4 text-right flex justify-between items-center">
          <button
            onClick={handleSearch}
            className="btn-primary flex items-center justify-center"
            disabled={loading}
          >
            <Search size={16} className="mr-1" />
            Tìm
          </button>

          <button
            onClick={() => setShowAddUser(true)}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={16} className="mr-1" />
            Add User
          </button>
        </div>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Add New User</h2>
          <form onSubmit={handleAddUserSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                className="input"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Username"
                required
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="input"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                className="input"
              />
              <select
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                className="input"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <select
                value={newUser.membershipLevel}
                onChange={(e) => setNewUser({ ...newUser, membershipLevel: e.target.value })}
                className="input"
              >
                <option value="">Select Membership Level</option>
                <option value="NORMAL">NORMAL</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="mb-4">
              <p>
                Provider: <strong>LOCAL</strong> (default, fixed)
              </p>
              <p>
                Status: <strong>INACTIVE</strong> (default, fixed)
              </p>
            </div>
            <div className="flex space-x-2 justify-end">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Full Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Membership Level</th>
              <th className="border border-gray-300 p-2">Created At</th>
              <th className="border border-gray-300 p-2">Updated At</th>
              <th className="border border-gray-300 p-2">Provider</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) =>
                isEditing === user.userId ? (
                  <tr key={user.userId}>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="input"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="input"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BANNED">BANNED</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={formData.membershipLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, membershipLevel: e.target.value })
                        }
                        className="input"
                      >
                        <option value="NORMAL">NORMAL</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(user.updatedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">{user.provider}</td>
                    <td className="border border-gray-300 p-2 flex space-x-2">
                      <button
                        onClick={handleEditSubmit}
                        className="btn-primary"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="btn-secondary">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.userId}>
                    <td className="border border-gray-300 p-2">{user.fullName}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.status}</td>
                    <td className="border border-gray-300 p-2">{user.membershipLevel}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(user.updatedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">{user.provider}</td>
                    <td className="border border-gray-300 p-2 flex space-x-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="btn-primary"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.userId)}
                        className="btn-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="mb-4">Bạn có chắc chắn muốn xóa user này không?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
