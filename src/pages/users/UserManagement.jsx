import { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, Plus, X, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify'; // Make sure you have react-toastify installed and configured
import axios from 'axios';

export default function UserManagement() {
  // State for search filters
  const [fullName, setFullName] = useState('');
  const [membershipLevel, setMembershipLevel] = useState('');
  const [status, setStatus] = useState('');
  const [registeredFrom, setRegisteredFrom] = useState('');
  const [registeredTo, setRegisteredTo] = useState('');

  const [emailToCheck, setEmailToCheck] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  // State for user data and pagination
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Current page (0-indexed)
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Fixed page size
  const [restoreInfo, setRestoreInfo] = useState({ show: false, userId: null, fullName: '', status: '', membershipLevel: '' });
  // State for dropdown options (status, membership)
  const [statusOptions, setStatusOptions] = useState([]);
  const [membershipOptions, setMembershipOptions] = useState([]);

  // State for user editing modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Stores the user object being edited
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    status: '',
    membershipLevel: '',
  });

  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Stores userId to delete

  // State for add new user modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    gender: '',
    membershipLevel: '',
    dob: '',
  });

  // --- Helper Functions for Formatting Data ---
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // --- Fetch Dropdown Options (Status, Membership) ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusRes, membershipRes] = await Promise.all([
          fetch('http://localhost:8080/options/user-statuses'),
          fetch('http://localhost:8080/options/membership-levels'),
        ]);

        if (!statusRes.ok || !membershipRes.ok) {
          throw new Error('Failed to fetch dropdown options');
        }

        setStatusOptions(await statusRes.json());
        setMembershipOptions(await membershipRes.json());
      } catch (err) {
        console.error('Error fetching dropdown options:', err);
        toast.error('Failed to load dropdown options.');
      }
    };
    fetchOptions();
  }, []);

  // --- Date Validation Helper ---
  // Checks if a string is a valid YYYY-MM-DD format (4-digit year)
  const isValidDateString = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
  };

  // --- Fetch User List (with useCallback for better memoization) ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (fullName) params.append('fullName', fullName);
      if (membershipLevel) params.append('membershipLevel', membershipLevel);
      if (status) params.append('status', status);

      if (registeredFrom && isValidDateString(registeredFrom)) {
        params.append('registeredFrom', registeredFrom);
      } else if (registeredFrom) {
        toast.error('Invalid "Registered From" date format. Please use YYYY-MM-DD.');
        setLoading(false);
        return;
      }

      if (registeredTo && isValidDateString(registeredTo)) {
        params.append('registeredTo', registeredTo);
      } else if (registeredTo) {
        toast.error('Invalid "Registered To" date format. Please use YYYY-MM-DD.');
        setLoading(false);
        return;
      }

      params.append('currentPage', page);
      params.append('pageSize', pageSize);

      const res = await fetch(`http://localhost:8080/admin/users?${params.toString()}`);

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `HTTP Error: ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (parseError) {
          errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const json = await res.json();

      if (json.status === 'Fetch successfully' && json.data?.content) {
        setUsers(json.data.content);
        setTotalPages(json.data.page?.totalPages || 1);
      } else {
        setUsers([]);
        setError(json.message || 'Failed to load users: Invalid API response status.');
        toast.error(json.message || 'Failed to load users.');
      }
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
      setUsers([]);
      toast.error(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [fullName, membershipLevel, status, registeredFrom, registeredTo, page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // If any filter is active and we are not on the first page, reset to page 0
      const filtersActive = fullName || membershipLevel || status || registeredFrom || registeredTo;
      if (filtersActive && page !== 0) {
        setPage(0); // This will trigger fetchUsers via its own useEffect dependency
      } else {
        fetchUsers(); // Otherwise, fetch users with current page and filters
      }
    }, 300); // Debounce
    return () => clearTimeout(handler);
  }, [fullName, membershipLevel, status, registeredFrom, registeredTo, page, fetchUsers]);


  // --- Edit User Modal Functions ---
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      membershipLevel: user.membershipLevel,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      status: '',
      membershipLevel: '',
    });
  };

  const handleCheckEmail = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/admin/users/check-email?email=${encodeURIComponent(emailToCheck)}`);
      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch (err) {
        console.error('❌ JSON.parse failed:', text);
        toast.error('Invalid response from server.');
        return;
      }

      const data = json.data;
      console.log('✅ JSON received:', data);

      if (json.status === 'Fetch successfully' && data?.emailExists) {
        if (data.isDeleted) {
          setRestoreInfo({
            show: true,
            userId: data.userId,
            fullName: data.fullName ?? '',
            status: data.status ?? '',
            membershipLevel: data.membershipLevel ?? '',
          });
          return;
        } else {
          toast.error('Email already used by another user.');
          return;
        }
      }

      // Nếu chưa tồn tại
      setEmailChecked(true);
      setNewUser(prev => ({
        ...prev,
        email: emailToCheck,
      }));
    } catch (err) {
      console.error('Email check failed:', err);
      toast.error('Error checking email: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async () => {
    console.log("Restoring user ID:", restoreInfo.userId);
    if (!restoreInfo.userId) return;
    setLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin/users/${restoreInfo.userId}/recover`);
      toast.success('User restored successfully.');
      setShowAddUser(false);
      setEmailChecked(false);
      setEmailToCheck('');
      setRestoreInfo({ show: false, userId: null, fullName: '', status: '', membershipLevel: '' });
      setNewUser({ // Reset form
        fullName: '', email: '', password: '',
        phone: '', address: '', gender: '', membershipLevel: '',
      });
      fetchUsers();
    } catch (err) {
      toast.error('Failed to restore user.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!formData.fullName || !formData.email || !formData.status || !formData.membershipLevel) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${editingUser.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Failed to update user: HTTP Error ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (parseError) {
          errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const json = await res.json();
      if (json.status === 'Update successfully') {
        toast.success('User updated successfully!');
        closeEditModal();
        fetchUsers(); // Refresh the list
      } else {
        toast.error(json.message || 'Failed to update user.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(`Error updating user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete User Function ---
  const handleDelete = async (userId) => {
    setShowDeleteConfirm(null); // Close the confirmation modal
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Failed to delete user: HTTP Error ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (parseError) {
          errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const json = await res.json();
      if (json.status === 'Delete successfully') {
        toast.success('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } else {
        toast.error(json.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(`Error deleting user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Add New User Functions ---
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      toast.error('Full Name, Email and Password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Failed to add user: HTTP Error ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (parseError) {
          errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const json = await res.json();
      if (json.status === 'Create successfully') {
        toast.success('User added successfully!');
        setShowAddUser(false); // Close modal
        setNewUser({ // Reset form
          fullName: '', email: '', password: '',
          phone: '', address: '', gender: '', membershipLevel: '',
        });
        setEmailChecked(false); // Reset email check state
        setEmailToCheck(''); // Clear email to check field
        fetchUsers(); // Refresh the list
      } else {
        toast.error(json.message || 'Failed to add user.');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error(`Error adding user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Clear Filters Function ---
  const clearFilters = () => {
    setFullName('');
    setMembershipLevel('');
    setStatus('');
    setRegisteredFrom('');
    setRegisteredTo('');
    setPage(0); // Reset to first page after clearing filters
    // fetchUsers will be called by useEffect due to filter state changes
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">User Management</h1>

      {/* --- Filters & Add New User Section --- */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by Full Name"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={membershipLevel}
            onChange={(e) => setMembershipLevel(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Memberships</option>
            {membershipOptions.map((m) => (
              <option key={m} value={m}>{formatMembership(m)}</option>
            ))}
          </select>
          <input
            type="date"
            value={registeredFrom}
            onChange={(e) => setRegisteredFrom(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            title="Registered From"
          />
          <input
            type="date"
            value={registeredTo}
            onChange={(e) => setRegisteredTo(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            title="Registered To"
          />
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={() => {
                if (page !== 0) {
                  setPage(0); // Reset page to 0 if not already on it
                } else {
                  fetchUsers(); // If already on page 0, just refetch
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Search size={18} className="mr-2" /> Refresh
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-400 text-white px-6 py-2 rounded-md flex items-center hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <RotateCcw size={18} className="mr-2" /> Clear Filters
            </button>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Plus size={18} className="mr-2" /> Add User
          </button>
        </div>
      </div>

      {/* --- Users Table --- */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-blue-600 animate-pulse">Loading data...</p>
        </div>
      ) : error ? (
        <div className="text-center text-xl text-red-500 font-semibold py-8 bg-white rounded-lg shadow-md">
          <p>{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]">Full Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]">Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Membership</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Created</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Updated</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">Provider</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[6%]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 py-2 whitespace-normal text-sm font-medium text-gray-900">{user.fullName}</td>
                    <td className="px-3 py-2 whitespace-normal text-sm text-gray-500 break-words">{user.email}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.membershipLevel === 'NORMAL' ? 'bg-gray-100 text-gray-800' :
                          user.membershipLevel === 'ONE_MONTH' ? 'bg-yellow-100 text-yellow-800' :
                            user.membershipLevel === 'SIX_MONTHS' ? 'bg-blue-100 text-blue-800' :
                              user.membershipLevel === 'ONE_YEAR' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {formatMembership(user.membershipLevel)}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{formatDate(user.updatedAt)}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.provider === 'LOCAL' ? 'bg-gray-100 text-gray-800' :
                          user.provider === 'GOOGLE' ? 'bg-red-100 text-red-800' :
                            user.provider === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {formatProvider(user.provider)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-medium">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.userId)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 border border-gray-300 rounded-md transition-colors duration-200 ${i === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              disabled={loading}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page + 1 >= totalPages || loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 bg-gray-200 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md transform transition-transform duration-300 scale-95 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
              <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <p className="mb-8 text-center text-lg text-gray-700">Are you sure you want to delete this user?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit User Modal --- */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 bg-gray-200 bg-opacity-50 backdrop-blur-sm">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md space-y-5 transform transition-transform duration-300 scale-95 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
              <button onClick={closeEditModal} type="button" className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="edit-fullName"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="edit-email"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-membership" className="block text-sm font-medium text-gray-700 mb-1">Membership Level</label>
                <select
                  id="edit-membership"
                  value={formData.membershipLevel}
                  onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {membershipOptions.map((m) => (
                    <option key={m} value={m}>{formatMembership(m)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                disabled={loading}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Add New User Modal --- */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 bg-gray-200 bg-opacity-50 backdrop-blur-sm">
          <form
            // Form submission logic remains the same
            onSubmit={emailChecked ? handleAddUserSubmit : (e) => e.preventDefault()}
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md space-y-5 transform transition-transform duration-300 scale-95 animate-scale-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
              <button onClick={() => {
                setShowAddUser(false);
                setEmailChecked(false); // Reset email check state
                setEmailToCheck(''); // Clear email to check field
                setRestoreInfo({ show: false, userId: null, fullName: '', status: '', membershipLevel: '' }); // Reset restore info
                setNewUser({ // Reset form for fresh start next time
                  fullName: '', email: '', password: '',
                  phone: '', address: '', gender: '', membershipLevel: '',
                });
              }} type="button" className="text-gray-400 hover:text-gray-600">
                {/* Assuming X is an icon component, e.g., from 'react-feather' */}
                <X size={24} />
              </button>
            </div>

            {restoreInfo.show ? (
              // Ưu tiên hiển thị khôi phục nếu có
              <div className="space-y-4">
                <div className="text-yellow-700 text-center font-medium">
                  This email belongs to a deleted user. Do you want to restore this account?
                  <p className="text-sm mt-2 text-gray-600">
                    User: {restoreInfo.fullName} (Status: {restoreInfo.status}, Membership: {formatMembership(restoreInfo.membershipLevel)})
                  </p>
                </div>
                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleRestoreUser}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    Restore User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRestoreInfo({ show: false, userId: null, fullName: '', status: '', membershipLevel: '' });
                      setEmailChecked(false); // Allow user to enter a different email or re-check
                      setEmailToCheck(''); // Clear email input
                      setNewUser({ // Reset newUser data if they decide not to restore
                        fullName: '', email: '', password: '',
                        phone: '', address: '', gender: '', membershipLevel: '',
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Hiển thị form kiểm tra email hoặc form thêm người dùng mới
              <>
                {!emailChecked ? (
                  // Phần nhập và kiểm tra email (Email input bây giờ sẽ rộng toàn bộ)
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="new-user-email-check" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        id="new-user-email-check"
                        type="email"
                        // Bỏ flex, input tự động chiếm hết chiều rộng của cha
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500" // rounded-md cho tất cả các góc
                        value={emailToCheck}
                        onChange={(e) => setEmailToCheck(e.target.value)}
                        required
                        disabled={loading}
                      />
                      {/* Nút "Check" đã được di chuyển xuống khu vực nút hành động chung bên dưới */}
                    </div>
                  </div>
                ) : (
                  // Form thêm người dùng mới (chỉ hiện khi emailChecked là true)
                  <div className="space-y-4">
                    {/* Các trường nhập liệu cho người dùng mới */}
                    <div>
                      <label htmlFor="new-user-fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
                      <input
                        id="new-user-fullName"
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-user-email" className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                      <input
                        id="new-user-email"
                        type="email"
                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-100 cursor-not-allowed"
                        value={newUser.email}
                        disabled // Email is pre-filled and not editable here
                      />
                    </div>
                    <div>
                      <label htmlFor="new-user-password" className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
                      <input
                        id="new-user-password"
                        type="password"
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-user-dob" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        id="new-user-dob"
                        type="date"
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newUser.dob}
                        onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="new-user-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        id="new-user-phone"
                        type="tel"
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-user-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        id="new-user-address"
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-user-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        id="new-user-gender"
                        value={newUser.gender}
                        onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="new-user-membership" className="block text-sm font-medium text-gray-700 mb-1">Membership Level</label>
                      <select
                        id="new-user-membership"
                        value={newUser.membershipLevel}
                        onChange={(e) => setNewUser({ ...newUser, membershipLevel: e.target.value })}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                        required
                      >
                        <option value="">Select Membership</option>
                        {/* Assuming membershipOptions is an array of membership levels */}
                        {membershipOptions.map((m) => (
                          <option key={m} value={m}>{formatMembership(m)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Khu vực chứa các nút hành động chung ở cuối modal */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUser(false);
                      setEmailChecked(false);
                      setEmailToCheck('');
                      setRestoreInfo({ show: false, userId: null, fullName: '', status: '', membershipLevel: '' });
                      setNewUser({ // Reset form
                        fullName: '', email: '', password: '',
                        phone: '', address: '', gender: '', membershipLevel: '',
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  {/* Logic hiển thị nút "Check" hoặc "Add User" tùy thuộc vào trạng thái emailChecked */}
                  {!emailChecked ? ( // Nút "Check" chỉ hiện khi email CHƯA được kiểm tra
                    <button
                      type="button" // Luôn là type="button" để không submit form
                      onClick={handleCheckEmail}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || !emailToCheck}
                    >
                      Check
                    </button>
                  ) : ( // Nút "Add User" chỉ hiện khi email ĐÃ được kiểm tra và hợp lệ
                    <button
                      type="submit" // Type="submit" để submit form
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      disabled={loading}
                    >
                      Add User
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}