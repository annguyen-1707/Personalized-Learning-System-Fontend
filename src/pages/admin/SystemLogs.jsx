import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Search,
  Download,
  User,
  Book,
  Shield,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  XCircle
} from 'lucide-react';

// Reusable Button Component for better consistency
const Button = ({ children, className = '', onClick, disabled, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : ''}
                ${className}`}
    {...props}
  >
    {children}
  </button>
);

// LogDetailsModal component remains similar, with minor aesthetic tweaks
function LogDetailsModal({ details }) {
  const [showModal, setShowModal] = useState(false);
  const shortText = details.length > 100 ? details.slice(0, 100) + "..." : details;

  return (
    <>
      <p
        onClick={() => setShowModal(true)}
        className="cursor-pointer text-blue-600 hover:text-blue-800 underline text-sm transition-colors duration-200"
        title="Click to view full details"
      >
        {shortText}
      </p>

      {showModal && (
        // *** ĐIỀU CHỈNH 1: Thay đổi màu nền overlay và hiệu ứng mờ ***
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in border border-gray-200">
            <h3 className="mb-4 font-bold text-xl text-gray-800 border-b pb-3 flex items-center justify-between">
              Log Details
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Close"
              >
                <XCircle size={24} />
              </button>
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200 leading-relaxed font-mono">
              {details}
            </pre>
            <Button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// Main SystemLogs Component
function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = useMemo(() => [
    'USER', 'PARENT', 'CONTENT_MANAGER', 'USER_MANAGER', 'SUPER_ADMIN'
  ], []);

  const formatDateToLocalDateTime = (dateStr, endOfDay = false) => {
    if (!dateStr) return null;
    return endOfDay ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`;
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        action: filterAction || null,
        details: search || null,
        role: filterRole || null,
        startTimestamp: formatDateToLocalDateTime(dateRange.start, false),
        endTimestamp: formatDateToLocalDateTime(dateRange.end, true),
        currentPage: currentPage,
        pageSize: pageSize,
      };
      const res = await axios.get('http://localhost:8080/super-admin/system-logs', { params });

      setLogs(res.data.data.content || []);
      setTotalPages(res.data.data.page.totalPages || 0);
      setTotalElements(res.data.data.page.totalElements || 0);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load logs. Please try again. Ensure the backend server is running and accessible.');
      setLogs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [filterAction, search, filterRole, dateRange, currentPage, pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterAction('');
    setFilterRole('');
    setDateRange({ start: '', end: '' });
    setCurrentPage(0); // Reset to first page
  };

  const getLogIcon = (action) => {
    if (action.includes('User') || action.includes('Admin')) return User;
    if (action.includes('Course') || action.includes('Lesson') || action.includes('Study')) return Book;
    if (action.includes('Permission') || action.includes('Role')) return Shield;
    if (action.includes('System') || action.includes('Option')) return Database;
    return Activity; // Default icon
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        const parts = timestamp.split('.');
        return new Date(parts[0]).toLocaleString();
      }
      return date.toLocaleString();
    } catch (e) {
      console.error("Error formatting timestamp:", timestamp, e);
      return 'Invalid Date';
    }
  };

  const exportLogs = async () => {
    try {
      const params = {
        action: filterAction || null,
        details: search || null,
        role: filterRole || null,
        startTimestamp: formatDateToLocalDateTime(dateRange.start, false),
        endTimestamp: formatDateToLocalDateTime(dateRange.end, true),
        pageSize: totalElements > 0 ? totalElements : 10000,
        currentPage: 0
      };
      const res = await axios.get('http://localhost:8080/super-admin/system-logs', { params });
      const logsToExport = res.data.data.content || [];

      if (logsToExport.length === 0) {
        alert("No logs to export based on current filters.");
        return;
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logsToExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `system_logs_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Error exporting logs:', error);
      alert('Failed to export logs. Please try again.');
    }
  };

  // *** ĐIỀU CHỈNH 2: Logic tạo số trang cho phân trang ***
  const getPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số lượng nút trang hiển thị tối đa (ví dụ: 2 trước, trang hiện tại, 2 sau)
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang nhỏ hơn hoặc bằng số lượng tối đa muốn hiển thị
      startPage = 0;
      endPage = totalPages - 1;
    } else {
      // Nếu tổng số trang lớn hơn, tính toán để hiển thị quanh trang hiện tại
      const half = Math.floor(maxPagesToShow / 2);
      startPage = Math.max(0, currentPage - half);
      endPage = Math.min(totalPages - 1, currentPage + half);

      // Điều chỉnh nếu ở gần đầu hoặc cuối
      if (endPage - startPage + 1 < maxPagesToShow) {
        if (startPage === 0) {
          endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
        } else if (endPage === totalPages - 1) {
          startPage = Math.max(0, totalPages - maxPagesToShow);
        }
      }
    }

    // Luôn thêm trang đầu tiên nếu nó không nằm trong khoảng đã tính
    if (startPage > 0) {
      pageNumbers.push(0);
      if (startPage > 1) { // Thêm dấu ... nếu có khoảng trống
        pageNumbers.push('...');
      }
    }

    // Thêm các trang trong khoảng đã tính
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Luôn thêm trang cuối cùng nếu nó không nằm trong khoảng đã tính
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) { // Thêm dấu ... nếu có khoảng trống
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };


  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Activity size={32} className="mr-3 text-blue-600" />
          System Logs Overview
        </h1>
        <Button
          onClick={exportLogs}
          className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm hover:shadow-md"
        >
          <Download size={18} className="mr-2" />
          Export All Logs
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
          <Filter size={20} className="mr-2 text-blue-500" />
          Filter Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
          {/* Search in details */}
          <div className="lg:col-span-2">
            <label htmlFor="searchDetails" className="block text-sm font-medium text-gray-700 mb-2">Search Details</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                id="searchDetails"
                type="text"
                placeholder="Search by details (e.g., user ID, error message)..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm text-gray-800 bg-gray-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Action input */}
          <div>
            <label htmlFor="filterAction" className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <input
              id="filterAction"
              type="text"
              className="px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm text-gray-800 bg-gray-50"
              placeholder="e.g., Login, Update, Delete"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            />
          </div>

          {/* Role filter */}
          <div>
            <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
            <select
              id="filterRole"
              className="px-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</option>
              ))}
            </select>
          </div>

          {/* Start date filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              id="startDate"
              type="date"
              className="px-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>

          {/* End date filter */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              id="endDate"
              type="date"
              className="px-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-full flex justify-end gap-4 mt-2">
            <Button
              onClick={handleClearFilters}
              className="bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 shadow-sm hover:shadow-md"
            >
              <XCircle size={18} className="mr-2" />
              Clear Filters
            </Button>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              <Search size={18} className="mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-lg">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading system logs...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-red-600 text-lg">
                    <div className="flex items-center justify-center">
                      <XCircle size={24} className="mr-2" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log, index) => {
                  const LogIcon = getLogIcon(log.action);
                  return (
                    <tr key={`${log.timestamp}-${log.action}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatTimestamp(log.timestamp)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="h-9 w-9 min-w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                            <LogIcon size={20} className="text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <LogDetailsModal details={log.details} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {log.role || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-lg">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalElements > 0 && totalPages > 1 && (
          <div className="px-6 py-5 border-t border-gray-100 bg-white flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{(currentPage * pageSize) + 1}</span> to <span className="font-semibold">{Math.min((currentPage + 1) * pageSize, totalElements)}</span> of <span className="font-semibold">{totalElements}</span> results
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0 || loading}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                title="First Page"
              >
                <span className="sr-only">First</span>
                <ChevronsLeft size={18} aria-hidden="true" />
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0 || loading}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                title="Previous Page"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft size={18} aria-hidden="true" />
              </Button>

              {getPaginationNumbers().map((pageNumber, index) => (
                pageNumber === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={loading}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                                ${currentPage === pageNumber
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {pageNumber + 1}
                  </Button>
                )
              ))}

              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1 || loading}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                title="Next Page"
              >
                <span className="sr-only">Next</span>
                <ChevronRight size={18} aria-hidden="true" />
              </Button>
              <Button
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                title="Last Page"
              >
                <span className="sr-only">Last</span>
                <ChevronsRight size={18} aria-hidden="true" />
              </Button>
            </nav>

            <div className="flex items-center space-x-2">
              <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700">Items per page:</label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0); // Reset to first page when page size changes
                }}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        )}
        {totalElements === 0 && !loading && !error && (
          <div className="px-6 py-5 text-center text-gray-500 text-sm border-t border-gray-100">
            No logs found.
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemLogs;