import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Edit, Trash2, Plus, Search, UserCog, Check, X } from 'lucide-react';

function AdminList() {
  const { admins, addAdmin, updateAdmin, deleteAdmin, addLog } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Admin'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const roles = ['Super Admin', 'Content Admin', 'User Admin', 'Analytics Admin'];

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase()) ||
    admin.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newAdmin = addAdmin(formData);
    addLog('Admin Created', `New admin "${formData.name}" was created`);
    setFormData({ name: '', email: '', role: 'Admin' });
    setIsAdding(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAdmin(isEditing, formData);
    addLog('Admin Updated', `Admin "${formData.name}" was updated`);
    setFormData({ name: '', email: '', role: 'Admin' });
    setIsEditing(null);
  };

  const handleDelete = (id) => {
    const adminToDelete = admins.find(admin => admin.id === id);
    deleteAdmin(id);
    addLog('Admin Deleted', `Admin "${adminToDelete.name}" was deleted`);
    setShowDeleteConfirm(null);
  };

  const startEdit = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    setIsEditing(admin.id);
    setIsAdding(false);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({ name: '', email: '', role: 'Admin' });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Admin Management</h1>
        <button
          onClick={() => { setIsAdding(true); setIsEditing(null); }}
          className="btn-primary flex items-center"
          disabled={isAdding || isEditing}
        >
          <Plus size={16} className="mr-1" />
          Add Admin
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search admins by name, email, or role..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? 'Add New Admin' : 'Edit Admin'}
          </h2>
          <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelAction}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {isAdding ? 'Add Admin' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="animate-fade-in hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserCog className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{admin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge bg-primary-50 text-primary-700">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.lastLogin).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/permissions/${admin.id}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View Permissions
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === admin.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Confirm?</span>
                          <button onClick={() => handleDelete(admin.id)} className="text-error-500 hover:text-error-700">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(admin)}
                            className="text-primary-600 hover:text-primary-800"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(admin.id)}
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No admins found. {search && 'Try a different search term.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminList;
