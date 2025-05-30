import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search,
  Download,
  User,
  Book,
  Shield,
  Database,
  Activity,
} from 'lucide-react';

function LogDetailsModal({ details }) {
  const [showModal, setShowModal] = useState(false);
  const shortText = details.length > 100 ? details.slice(0, 100) + "..." : details;

  return (
    <>
      <p
        onClick={() => setShowModal(true)}
        className="cursor-pointer text-blue-600 underline"
        title="Click to view details"
      >
        {shortText}
      </p>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg max-h-[80vh] overflow-auto">
            <h3 className="mb-4 font-bold text-lg">Log Details</h3>
            <pre className="whitespace-pre-wrap">{details}</pre>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchAllLogs();
  }, []);

  const fetchAllLogs = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/system-logs/search');
      setLogs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const formatDateToLocalDateTime = (dateStr, endOfDay = false) => {
    if (!dateStr) return null;
    return endOfDay ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`;
  };

  const fetchFilteredLogs = async () => {
    try {
      const params = {
        action: filterAction || null,
        details: search || null,
        role: filterRole || null,
        startTimestamp: formatDateToLocalDateTime(dateRange.start, false),
        endTimestamp: formatDateToLocalDateTime(dateRange.end, true),
      };
      const res = await axios.get('http://localhost:8080/admin/system-logs/search', { params });
      setLogs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching filtered logs:', error);
    }
  };

  const roles = ['USER', 'PARENT', 'CONTENT_MANAGER', 'USER_MANAGER', 'SUPER_ADMIN'];

  const getLogIcon = (action) => {
    if (action.includes('User')) return User;
    if (action.includes('Course') || action.includes('Lesson')) return Book;
    if (action.includes('Permission')) return Shield;
    if (action.includes('System')) return Database;
    return Activity;
  };

  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();

  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "system_logs.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <button onClick={exportLogs} className="btn-outline flex items-center">
          <Download size={16} className="mr-1" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search in details */}
          <div className="md:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Search Details</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Action input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Action</label>
            <input
              type="text"
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full transition"
              placeholder="Enter action"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            />
          </div>

          {/* Role filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full transition"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Start date filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full transition"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>

          {/* End date filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full transition"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={fetchFilteredLogs}
              className="btn-primary w-full py-2 px-4 rounded-lg transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>


      {/* Logs Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Details</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map(log => {
                const LogIcon = getLogIcon(log.action);
                return (
                  <tr key={log.timestamp + log.action}>
                    <td>{formatTimestamp(log.timestamp)}</td>
                    <td>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                          <LogIcon size={16} className="text-primary-600" />
                        </div>
                        <span>{log.action}</span>
                      </div>
                    </td>
                    <td>
                      <LogDetailsModal details={log.details} />
                    </td>
                    <td>{log.role}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500">No logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SystemLogs;
