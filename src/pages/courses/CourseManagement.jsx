import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { toast } from "react-toastify";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Book,
  Layers,
  Users,
  Check,
  X,
} from "lucide-react";

function CourseManagement() {
  // Replace courses with subjects and update methods accordingly
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    addLog,
    fetchSubjects,
  } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    description: "",
    status: "ACTIVE",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const status = ["ACTIVE", "DRAFT"];

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter subjects based on search and status
  const filteredSubjects = subjects.filter((subject) => {
    // Search filter (case insensitive)
    const searchMatch =
      search === "" ||
      subject.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      subject.description?.toLowerCase().includes(search.toLowerCase()) ||
      subject.subjectCode?.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const statusMatch = filter === "all" || subject.status === filter;

    return searchMatch && statusMatch;
  });

  // Handle form submission for adding subjects
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const subjectPayload = {
      ...formData,
    };

    try {
      const newSubject = await addSubject(subjectPayload);
      addLog(
        "Subject Created",
        `New subject "${newSubject.subjectCode}" was created`
      );
      setFormData({
        subjectCode: "",
        subjectName: "",
        description: "",
        status: "ACTIVE",
      }); // Reset form
      setIsAdding(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to add subject:", error);
      setErrorMessage(error.message || "Failed to add subject.");
    }
  };

  // Handle form submission for editing subjects
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSubject = await updateSubject(isEditing, {
        ...formData,
      });

      toast.success("Subject updated successfully.");
      addLog(
        "Subject Updated",
        `Subject "${formData.subjectCode}" was updated`
      );
      setFormData({
        subjectCode: "",
        subjectName: "",
        description: "",
        status: "ACTIVE",
      });

      setIsEditing(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to update subject:", error);
      setErrorMessage(error.message || "Failed to update subject.");
    }
  };

  const handleDelete = async (id) => {
    setShowDeleteConfirm(null);
    try {
      await deleteSubject(id);
      addLog("Subject Deleted", `Subject with ID ${id} was deleted`);
      toast.success("Subject deleted successfully.");
    } catch (error) {
      console.error("Failed to delete subject:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete subject.";
      toast.error(message);
    }
  };

  const startEdit = (subject) => {
    setErrorMessage("");
    setFormData({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      description: subject.description,
      status: subject.status,
    });
    setIsEditing(subject.subjectId);
    setIsAdding(false);
  };

  const cancelAction = () => {
    setErrorMessage("");
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      subjectCode: "",
      subjectName: "",
      description: "",
      status: "ACTIVE",
    });
  };

  // Helper to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success-50 text-success-700";
      case "DRAFT":
        return "bg-warning-50 text-warning-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Subject Management
        </h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
          }}
          className="btn-primary flex items-center"
          disabled={isAdding || isEditing}
        >
          <Plus size={16} className="mr-1" />
          Add Subject
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search subjects by title or description..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? "Add New Subject" : "Edit Subject"}
          </h2>
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm flex items-center justify-between">
              <p className="mb-2">{errorMessage}</p>
              <button
                className="text-red-700 hover:text-red-900"
                onClick={() => setErrorMessage("")}
              >
                X
              </button>
            </div>
          )}
          <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="subjectCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject Code
                </label>
                <input
                  id="subjectCode"
                  type="text"
                  required
                  value={formData.subjectCode}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectCode: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="subjectName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject Name
                </label>
                <input
                  id="subjectName"
                  type="text"
                  required
                  value={formData.subjectName}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectName: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                >
                  {Array.isArray(status) &&
                    status.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
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
              <button type="submit" className="btn-primary">
                {isAdding ? "Add Subject" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subject Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col">Subject Name</th>
                <th scope="col">Subject Code</th>
                <th scope="col">Students</th>
                <th scope="col">Status</th>
                <th scope="col">Last Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <tr key={subject.subjectId} className="animate-fade-in">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md bg-primary-100 flex items-center justify-center">
                          <Book className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {subject.subjectName}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {subject.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge bg-primary-50 text-primary-700">
                        {subject.subjectCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {subject.countUsers}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`badge ${getStatusBadgeClass(
                          subject.status
                        )}`}
                      >
                        {subject.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subject.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === subject.subjectId ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Confirm?
                          </span>
                          <button
                            onClick={() => handleDelete(subject.subjectId)}
                            className="text-error-500 hover:text-error-700"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/courses/${subject.subjectId}/lessons`}
                            className="text-secondary-600 hover:text-secondary-800"
                            title="Manage Lessons"
                          >
                            <Layers size={16} />
                          </Link>
                          <button
                            onClick={() => startEdit(subject)}
                            className="text-primary-600 hover:text-primary-800"
                            disabled={isAdding || isEditing}
                            title="Edit Subject"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setShowDeleteConfirm(subject.subjectId)
                            }
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                            title="Delete Subject"
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
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No subjects found.{" "}
                    {search && "Try a different search term."}
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

export default CourseManagement;
