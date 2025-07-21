import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, UserCog, Check, X, Info, RotateCcw } from 'lucide-react';

// Define a mapping for role colors
const ROLE_COLORS = {
  "SUPER_ADMIN": { bg: "bg-purple-100", text: "text-purple-800" },
  "CONTENT_MANAGER": { bg: "bg-teal-100", text: "text-teal-800" },
  "USER_MANAGER": { bg: "bg-indigo-100", text: "text-indigo-800" },
  "PARENT": { bg: "bg-orange-100", text: "text-orange-800" },
  "USER": { bg: "bg-blue-100", text: "text-blue-800" },
  "STAFF": { bg: "bg-green-100", text: "text-green-800" },
  // Add more roles and their desired colors here
  "DEFAULT": { bg: "bg-gray-100", text: "text-gray-600" } // Fallback color
};

function AdminList() {
  // --- State management for data and UI ---
  const [admins, setAdmins] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedRoleNames, setSelectedRoleNames] = useState(new Set());
  const [availableRoles, setAvailableRoles] = useState([]); // Used for filter options and add/edit modal roles

  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // Form data for add/edit operations (now includes passwords and multiple roles)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    roles: [] // Now an array for multiple roles
  });

  // States for username check logic
  const [usernameCheckDone, setUsernameCheckDone] = useState(false); // True after username API call, regardless of result
  const [usernameAvailabilityStatus, setUsernameAvailabilityStatus] = useState(null); // 'available', 'exists', 'deleted'
  const [adminIdToRecover, setAdminIdToRecover] = useState(null); // Stores adminId for recovery (Case 3)
  const [checkingUsername, setCheckingUsername] = useState(false); // Loading state for username check

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(0); // Corresponds to currentPage in PagingRequest
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(11); // 11 items per page

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // --- Helper function to get role color classes ---
  const getRoleColorClasses = (roleName) => {
    const color = ROLE_COLORS[roleName] || ROLE_COLORS.DEFAULT;
    return `${color.bg} ${color.text}`;
  };

  // --- Function to fetch admin data from API ---
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const params = {
        currentPage: currentPage, // Use currentPage from state
        pageSize: pageSize,        // Use pageSize from state
      };

      if (searchUsername) {
        params.username = searchUsername;
      }
      if (selectedRoleNames.size > 0) {
        params.roles = Array.from(selectedRoleNames).join(',');
      }

      const res = await axios.get('http://localhost:8080/super-admin/admins', { params });

      const fetchedAdmins = res.data.data.content.map(admin => {
        const adminRoles = Array.isArray(admin.roles) ? admin.roles : [];

        // Direct use of role name and description from backend response
        const adminRolesFormatted = adminRoles.map(r => ({
          name: String(r.name).replace(/_/g, ' '),
          originalName: r.name, // Keep original name for color mapping
          description: r.description || ''
        }));

        // Extract unique permissions for display
        const permissionsDisplay = adminRoles
          .flatMap(r => r.permissions || []) // Assuming permissions might be nested under role objects if backend sends them
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(p => String(p).replace(/_/g, ' '))
          .join(', ');

        return {
          id: admin.adminId,
          name: admin.username,
          roles: adminRolesFormatted, // Use formatted roles directly from API
          permissionsDisplay: permissionsDisplay,
        };
      });
      setAdmins(fetchedAdmins);
      setTotalPages(res.data.data.page.totalPages);
    } catch (err) {
      console.error('Error fetching admin list:', err);
      setError('Failed to load admin list. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchUsername, selectedRoleNames]);

  // --- Effect to load available roles from backend (for filters and add/edit form) ---
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get('http://localhost:8080/options/roles');
        const formattedRoles = res.data.map(roleName => ({
          name: roleName,
          description: `Role ${String(roleName).replace(/_/g, ' ').toLowerCase()}`
        }));
        setAvailableRoles(formattedRoles);
      } catch (err) {
        console.error('Error fetching role list for filters/form:', err);
        setError('Failed to load role options. Please try again.');
      }
    };
    fetchRoles();
  }, []);

  // --- Effect to load admins whenever filter parameters or current page change ---
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // --- Event handlers for changes ---
  const handleSearchChange = (e) => {
    setSearchUsername(e.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleRoleFilterChange = (roleName) => {
    setSelectedRoleNames(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleName)) {
        newSet.delete(roleName);
      } else {
        newSet.add(roleName);
      }
      return newSet;
    });
    setCurrentPage(0); // Reset to first page on new filter
  };

  // PAGINATION HANDLER
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'username' && !isEditing) {
      setUsernameCheckDone(false);
      setUsernameAvailabilityStatus(null);
      setAdminIdToRecover(null);
      setError(null);
      setMessage(null);
    }
  };

  // Handle role selection for the form (multi-select)
  const handleFormRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newRoles = checked
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value);
      return { ...prev, roles: newRoles };
    });
  };

  // --- Open Add Admin Modal ---
  const handleAddClick = () => {
    setIsEditing(null);
    setFormData({ username: '', password: '', confirmPassword: '', roles: [] });
    setUsernameCheckDone(false);
    setUsernameAvailabilityStatus(null);
    setAdminIdToRecover(null);
    setError(null);
    setMessage(null);
    setShowAddEditModal(true);
  };

  // --- Open Edit Admin Modal ---
  const handleEditClick = (admin) => {
    setIsEditing(admin.id);
    const originalRoleNames = admin.roles.map(r => r.originalName); // Use originalName for form
    setFormData({
      username: admin.name,
      password: '',
      confirmPassword: '',
      roles: originalRoleNames
    });
    setUsernameCheckDone(true);
    setUsernameAvailabilityStatus('edited');
    setAdminIdToRecover(null);
    setError(null);
    setMessage(null);
    setShowAddEditModal(true);
  };

  // --- Close Add/Edit Modal ---
  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setIsEditing(null);
    setFormData({ username: '', password: '', confirmPassword: '', roles: [] });
    setUsernameCheckDone(false);
    setUsernameAvailabilityStatus(null);
    setAdminIdToRecover(null);
    setError(null);
    setMessage(null);
  };

  // --- Handle Username Check API Call ---
  const handleCheckUsername = async () => {
    setError(null);
    setMessage(null);
    if (!formData.username.trim()) {
      setError('Please enter a username to check.');
      return;
    }
    setCheckingUsername(true);
    try {
      const res = await axios.get(`http://localhost:8080/super-admin/admins/check-username?username=${formData.username}`);
      const data = res.data.data;

      setUsernameCheckDone(true);

      if (data.usernameExists) {
        if (data.isDeleted) {
          setUsernameAvailabilityStatus('deleted');
          setAdminIdToRecover(data.adminId);
          setMessage(`Username '${formData.username}' is available for recovery. Do you want to recover this admin?`);
        } else {
          setUsernameAvailabilityStatus('exists');
          setError(`Username '${formData.username}' already exists. Please choose a different username.`);
        }
      } else {
        setUsernameAvailabilityStatus('available');
        setMessage(`Username '${formData.username}' is available. You can now create a new admin.`);
      }
    } catch (err) {
      console.error('Error checking username:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while checking username. Please try again.';
      setError(errorMessage);
      setUsernameCheckDone(false);
      setUsernameAvailabilityStatus(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // --- Handle Recovery API Call ---
  const handleRecoverAdmin = async () => {
    setError(null);
    setMessage(null);
    if (!adminIdToRecover) {
      setError("No admin ID found for recovery.");
      return;
    }
    try {
      await axios.patch(`http://localhost:8080/super-admin/admins/${adminIdToRecover}/recover`);
      setMessage(`Admin '${formData.username}' recovered successfully!`);
      handleCloseAddEditModal();
      fetchAdmins();
    } catch (err) {
      console.error('Error recovering admin:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while recovering the admin. Please try again.';
      setError(errorMessage);
    }
  };

  // --- Handle form submission (create new or update admin) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    console.log('--- Submitting Form ---');
    console.log('Username from formData:', formData.username); // KIỂM TRA DÒNG NÀY TRONG CONSOLE!
    console.log('Password exists:', !!formData.password);
    console.log('Roles selected:', formData.roles);


    if (!formData.username.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    if (!isEditing) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please enter and confirm password.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if ((formData.password && !formData.confirmPassword) || (!formData.password && formData.confirmPassword)) {
        setError('Please enter both new password fields or leave both empty.');
        return;
      }
      if (formData.password && formData.password !== formData.confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    if (formData.roles.length === 0) {
      setError('Please select at least one role.');
      return;
    }

    try {
      const payload = {
        username: formData.username, // ĐẢM BẢO username CŨNG ĐƯỢC GỬI ĐI KHI TẠO MỚI!
        ...(formData.password && { password: formData.password }),
        roles: formData.roles // Pass array of role enums
      };

      console.log('Payload being sent:', payload); // KIỂM TRA PAYLOAD NÀY TRONG CONSOLE!

      if (isEditing) {
        // Khi chỉnh sửa, username được lấy từ URL, không gửi trong payload
        await axios.patch(`http://localhost:8080/super-admin/admins/${isEditing}`, {
          ...(formData.password && { password: formData.password }),
          roles: formData.roles
        });
        setMessage('Admin updated successfully!');
      } else {
        // Khi tạo mới, gửi username trong payload
        await axios.post('http://localhost:8080/super-admin/admins', payload); // <--- ĐÃ SỬA TỪ /users SANG /admins
        setMessage('Admin created successfully!');
      }
      handleCloseAddEditModal();
      fetchAdmins();
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while saving the admin. Please try again.';
      setError(errorMessage);
    }
  };

  // --- Handle admin deletion ---
  const handleDelete = async (adminId) => {
    setError(null);
    setMessage(null);
    try {
      await axios.delete(`http://localhost:8080/super-admin/admins/${adminId}`);
      setMessage('Admin deleted successfully!');
      setShowDeleteConfirm(null);
      fetchAdmins();
    } catch (err) {
      console.error('Error deleting admin:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while deleting the admin. Please try again.';
      setError(errorMessage);
    }
  };

  // --- Component UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        {/* Title and Add Admin Button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">Admin Management</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <Plus size={20} className="mr-2" />
            Add New Admin
          </button>
        </div>

        {/* Search Bar and Role Filters */}
        <div className="mb-10 p-7 bg-gray-50 rounded-xl shadow-inner border border-gray-100">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username..."
              className="w-full pl-12 pr-5 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm"
              value={searchUsername}
              onChange={handleSearchChange}
            />
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-gray-700 font-medium text-lg mr-2">Filter by Role:</span>
            {availableRoles.length > 0 ? (
              availableRoles.map((role) => (
                <label key={role.name} className="inline-flex items-center cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-800 shadow-sm hover:bg-blue-50 transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 focus:ring-offset-1 border-gray-300"
                    value={role.name}
                    checked={selectedRoleNames.has(role.name)}
                    onChange={() => handleRoleFilterChange(role.name)}
                  />
                  <span className="ml-3">{String(role.name).replace(/_/g, ' ')}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-base">Loading roles or no roles available.</p>
            )}
          </div>
        </div>

        {/* Loading, Error, and Message Display (for general page operations) */}
        {loading && (
          <div className="text-center py-12">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-16 w-16 mb-4 mx-auto animate-spin"></div>
            <p className="text-gray-700 text-lg font-medium">Loading admin data...</p>
          </div>
        )}

        {error && !showAddEditModal && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 flex items-center shadow-md animate-fade-in" role="alert">
            <Info size={24} className="mr-3 flex-shrink-0" />
            <div>
              <strong className="font-bold text-lg">Error:</strong>
              <span className="block sm:inline ml-2 text-base">{error}</span>
            </div>
          </div>
        )}

        {message && !error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6 flex items-center shadow-md animate-fade-in" role="alert">
            <Check size={24} className="mr-3 flex-shrink-0" />
            <div>
              <strong className="font-bold text-lg">Success:</strong>
              <span className="block sm:inline ml-2 text-base">{message}</span>
            </div>
          </div>
        )}

        {/* Admin List Table */}
        {!loading && !error && (
          <div className="overflow-hidden bg-white rounded-xl shadow-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Admin Username
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role & Description
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-blue-50 transition-colors duration-200 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserCog size={20} className="text-blue-500 mr-3" />
                          <div className="text-base font-medium text-gray-900">{admin.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {admin.roles.length > 0 ? (
                          admin.roles.map((role, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm mb-1 mr-2 ${getRoleColorClasses(role.originalName)}`}
                            >
                              {role.name}{role.description ? ` (${role.description})` : ''}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600 shadow-sm">
                            No Role
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {admin.permissionsDisplay ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 shadow-sm">
                            {admin.permissionsDisplay}
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600 shadow-sm">
                            Permissions
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(admin)}
                          className="text-indigo-600 hover:text-indigo-800 mr-4 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                          title="Edit admin"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(admin.id)}
                          className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                          title="Delete admin"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-lg">
                      {!loading && "No admins found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            {/* Previous Page button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-sm"
            >
              Previous
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out shadow-sm
                                        ${currentPage === i
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next Page button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-sm"
            >
              Next
            </button>
          </div>
        )}

        {/* Add/Edit Admin Modal */}
        {showAddEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-blue-300 transform transition-transform duration-300 scale-100 animate-fade-in">
              <button
                onClick={handleCloseAddEditModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 border-blue-100">
                {isEditing ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              {/* Display specific error/message for modal form */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                  {error}
                </div>
              )}
              {message && !error && ( // Show message if no error
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                  {message}
                </div>
              )}

              {/* Username Input & Check Button (always visible in add mode, read-only in edit mode) */}
              <div className="mb-6">
                <label htmlFor="username" className="block text-base font-semibold text-gray-700 mb-2">Admin Username</label>
                <div className="flex">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isEditing || usernameCheckDone} // Disable after check or in edit mode
                    placeholder="Enter username"
                  />
                  {!isEditing && !usernameCheckDone && ( // Only show check button if not editing and not checked yet
                    <button
                      type="button"
                      onClick={handleCheckUsername}
                      disabled={checkingUsername || !formData.username.trim()}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out flex items-center justify-center"
                    >
                      {checkingUsername ? (
                        <div className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5 animate-spin"></div>
                      ) : (
                        <Search size={18} className="mr-2" />
                      )}
                      Check
                    </button>
                  )}
                  {isEditing && <p className="text-sm text-gray-500 mt-2 ml-4 self-center">Username cannot be changed when editing.</p>}
                </div>
              </div>

              {/* Conditional Forms/Actions based on Username Check Result */}
              {!isEditing && usernameCheckDone && (
                <>
                  {/* Case 2: Username exists and is NOT deleted */}
                  {usernameAvailabilityStatus === 'exists' && (
                    <div className="text-center py-4">
                      {/* Error message is already displayed above by the common error state */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, username: '' })); // Clear username
                          setUsernameCheckDone(false);
                          setUsernameAvailabilityStatus(null);
                          setError(null);
                          setMessage(null);
                        }}
                        className="mt-4 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 ease-in-out"
                      >
                        Try Another Username
                      </button>
                    </div>
                  )}

                  {/* Case 3: Username exists and IS deleted - Recovery Option */}
                  {usernameAvailabilityStatus === 'deleted' && (
                    <div className="text-center py-4">
                      {/* Message is already displayed above by the common message state */}
                      <div className="flex justify-center space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={handleRecoverAdmin}
                          className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 ease-in-out"
                        >
                          <RotateCcw size={18} className="mr-2" />
                          Yes, Recover
                        </button>
                        <button
                          type="button"
                          onClick={handleCloseAddEditModal}
                          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 ease-in-out"
                        >
                          No, Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case 1: Username does NOT exist - Show Full Creation Form */}
                  {usernameAvailabilityStatus === 'available' && (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm"
                          required
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm"
                          required
                          placeholder="Confirm password"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">Roles</label>
                        <div className="grid grid-cols-2 gap-4">
                          {availableRoles.map((role) => (
                            <label key={role.name} className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 focus:ring-offset-1 border-gray-300"
                                value={role.name}
                                checked={formData.roles.includes(role.name)}
                                onChange={handleFormRoleChange}
                              />
                              <span className="ml-3 text-gray-700">{String(role.name).replace(/_/g, ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={handleCloseAddEditModal}
                          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Create Admin
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* Edit Admin Form (visible only in edit mode) */}
              {isEditing && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                  {/* Username is read-only in edit mode, shown above */}
                  <div>
                    <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">New Password (optional)</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm"
                      placeholder="Leave empty to keep current password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">Roles</label>
                    <div className="grid grid-cols-2 gap-4">
                      {availableRoles.map((role) => (
                        <label key={role.name} className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 focus:ring-offset-1 border-gray-300"
                            value={role.name}
                            checked={formData.roles.includes(role.name)}
                            onChange={handleFormRoleChange}
                          />
                          <span className="ml-3 text-gray-700">{String(role.name).replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCloseAddEditModal}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Update Admin
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4 sm:p-6">
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-red-300 w-full max-w-sm transform scale-105 animate-scale-up text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">Are you sure you want to delete this admin? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminList;