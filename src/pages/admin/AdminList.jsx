import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, UserCog, Check, X } from 'lucide-react';

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Admin'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const roles = ['Super Admin', 'Content Admin', 'User Admin', 'Analytics Admin'];

  // Load data from API
  useEffect(() => {
    axios.get('http://localhost:8080/admins')
      .then(res => {
        const fetchedAdmins = res.data.data.content.map(admin => ({
          id: admin.adminId,
          name: admin.username,
          email: admin.username + '@example.com', // giả định email nếu chưa có trong BE
          role: admin.roles.map(r => r.name).join(', '),
          lastLogin: new Date().toISOString() // placeholder nếu chưa có
        }));
        setAdmins(fetchedAdmins);
      })
      .catch(err => {
        console.error('Error fetching admins:', err);
      });
  }, []);

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase()) ||
    admin.role.toLowerCase().includes(search.toLowerCase())
  );

  // ... giữ nguyên giao diện UI như bạn gửi ban đầu

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

      {/* Search bar, form, table... giữ nguyên từ code bạn gửi */}
      {/* Chỉ cần thay đổi phần fetch data như trên */}
    </div>
  );
}

export default AdminList;
