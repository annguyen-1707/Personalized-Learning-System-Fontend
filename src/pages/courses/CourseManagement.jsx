import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useAuth } from "../../context/AuthContext";
import {
  acceptCourse,
  rejectCourse,
  inactiveCourse,
} from "../../services/ContentBankService";

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
import { a, div, sub } from "framer-motion/client";

function CourseManagement() {
  const {
    addSubject,
    updateSubject,
    deleteSubject,
    addLog,
    fetchSubjects,
    fetchSubjectStatus,
  } = useData();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    description: "",
    status: "DRAFT",
    thumbnailFile: null,
    thumbnailPreview: null,
  });

  const isStaff =
    user &&
    Array.isArray(user.role) &&
    user.role.some((role) => ["STAFF"].includes(role));
  const isContentManagerment =
    user &&
    Array.isArray(user.role) &&
    user.role.some((role) => ["CONTENT_MANAGER"].includes(role));

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const getSubjectStatus = async () => {
    try {
      const status = await fetchSubjectStatus();
      setStatus(status);
    } catch (error) {
      console.error("Failed to fetch subject status:", error);
      toast.error("Failed to fetch subject status.");
      return [];
    }
  };

  const loadSubjects = async () => {
    const result = await fetchSubjects(currentPage);
    setSubjects(result.content);
    setTotalPages(result.page.totalPages);
    setTotalElements(result.page.totalElements);
    if (result.page.number !== currentPage) {
      setCurrentPage(result.page.number); // Chỉ cập nhật nếu khác
    }
  };

  useEffect(() => {
    loadSubjects();
    getSubjectStatus();
  }, [currentPage, totalElements, totalPages]);

  //Filter subjects based on search and status
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnailFile: file,
          thumbnailPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission for adding subjects
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSubject = await addSubject(formData);
      toast.success("Subject added successfully.");
      addLog(
        "Subject Created",
        `New subject "${newSubject.subjectCode}" was created`
      );
      setFormData({
        subjectCode: "",
        subjectName: "",
        description: "",
        status: "DRAFT",
        thumbnailFile: null,
        thumbnailPreview: null,
      });
      setIsAdding(false);
      setErrorMessage("");
      await loadSubjects();
    } catch (error) {
      console.error("Failed to add subject:", error);
      setErrorMessage(error.message || "Failed to add subject.");
    }
  };

  // Handle form submission for editing subjects
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSubject = await updateSubject(isEditing, formData);
      toast.success("Subject updated successfully.");
      addLog(
        "Subject Updated",
        `Subject "${formData.subjectCode}" was updated`
      );
      setFormData({
        subjectCode: "",
        subjectName: "",
        description: "",
        status: "DRAFT",
        thumbnailFile: null,
        thumbnailPreview: null,
      });
      setIsEditing(null);
      setErrorMessage("");
      await loadSubjects();
    } catch (error) {
      console.error("Failed to update subject:", error);
      setErrorMessage(error.message || "Failed to update subject.");
    }
  };

  const handleDelete = async (id) => {
    setShowDeleteConfirm(null);
    console.log("Deleting subject with ID:", id);
    try {
      await deleteSubject(id);
      addLog("Subject Deleted", `Subject with ID ${id} was deleted`);
      toast.success("Subject deleted successfully.");
      await loadSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      toast.error("Subject has many lessons, cannot delete.");
      showDeleteConfirm(null);
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const startEdit = (subject) => {
    setErrorMessage("");
    setFormData({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      description: subject.description,
      status: subject.status,
      thumbnailFile: null,
      thumbnailPreview:
        "http://localhost:8080/images/content_learning/" +
          subject.thumbnailUrl || null,
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
      status: "DRAFT",
      thumbnailFile: null,
      thumbnailPreview: null,
    });
  };

  const handleAccept = async (id) => {
    try {
      await acceptCourse(id);
      loadSubjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCourse(id);
      loadSubjects();
    } catch (error) {
      console.error("Failed to reject course:", error);
    }
  };

  const handleInactive = async (id) => {
    try {
      await inactiveCourse(id);
      loadSubjects();
    } catch (error) {
      console.error("Failed to inactive course:", error);
    }
  };

  // Helper to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PUBLIC":
        return "bg-success-50 text-success-700";
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "IN_ACTIVE":
        return "bg-warning-50 text-warning-700";
      case "REJECTED":
        return "bg-error-50 text-error-700";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Subject Management
        </h1>
        {isStaff && (
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
        )}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdding ? "Add New Subject" : "Edit Subject"}
            </h2>
            <button
              onClick={cancelAction}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex">
                <div
                  className="flex-shrink-0"
                  onClick={() => setErrorMessage("")}
                >
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error occurred
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Code */}
              <div className="md:col-span-2">
                <label
                  htmlFor="subjectCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="subjectCode"
                    type="text"
                    required
                    value={formData.subjectCode}
                    onChange={(e) =>
                      setFormData({ ...formData, subjectCode: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter subject code"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  A unique identifier for the subject
                </p>
              </div>

              {/* Subject Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="subjectName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="subjectName"
                    type="text"
                    required
                    value={formData.subjectName}
                    onChange={(e) =>
                      setFormData({ ...formData, subjectName: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter subject name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  The full name of the subject
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter subject description"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a detailed description of the subject
                </p>
              </div>

              {/* Thumbnail Upload */}
              <div className="md:col-span-2">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thumbnail Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {formData.thumbnailPreview ? (
                      <div className="relative">
                        <img
                          src={formData.thumbnailPreview}
                          alt="Thumbnail preview"
                          className="mx-auto h-32 w-auto object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              thumbnailFile: null,
                              thumbnailPreview: null,
                            }))
                          }
                          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="thumbnail"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="thumbnail"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={cancelAction}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isAdding ? "Create Subject" : "Save Changes"}
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
                <th scope="col">Created At</th>
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
                        <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                          <img
                            src={
                              subject.thumbnailUrl
                                ? `http://localhost:8080/images/content_learning/${subject.thumbnailUrl}`
                                : "https://via.placeholder.com/40"
                            }
                            alt={subject.subjectName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {subject.subjectName}
                          </div>
                          <div className="text-sm text-gray-500 whitespace-pre-line max-h-20 overflow-y-auto">
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
                      {new Date(subject.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subject.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
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
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
                          {/* Hàng 1: Manage / Edit / Delete */}
                          <div className="flex flex-wrap gap-3">
                            <Link
                              to={`/admin/courses/${subject.subjectId}/lessons?subjectPage=${currentPage}`}
                              className="text-secondary-600 hover:text-secondary-800 flex items-center"
                              title="Manage Lessons"
                            >
                              <Layers size={16} className="mr-1" />
                            </Link>

                            {isStaff && subject.status != "PUBLIC" && (
                              <button
                                onClick={() => startEdit(subject)}
                                className="text-primary-600 hover:text-primary-800 flex items-center"
                                disabled={isAdding || isEditing}
                                title="Edit Subject"
                              >
                                <Edit size={16} className="mr-1" />
                              </button>
                            )}

                            {isContentManagerment && (
                              <button
                                onClick={() =>
                                  setShowDeleteConfirm(subject.subjectId)
                                }
                                className="text-error-500 hover:text-error-700 flex items-center"
                                disabled={isAdding || isEditing}
                                title="Delete Subject"
                              >
                                <Trash2 size={16} className="mr-1" />
                              </button>
                            )}
                          </div>

                          {/* Hàng 2: Accept / Reject */}
                          {isContentManagerment && (
                            <div className="flex flex-wrap gap-2">
                              {subject.status === "DRAFT" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAccept(subject.subjectId)
                                    }
                                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                                  >
                                    <Check size={16} className="mr-1" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReject(subject.subjectId)
                                    }
                                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                  >
                                    <X size={16} className="mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}

                              {subject.status === "PUBLIC" && (
                                <button
                                  onClick={() =>
                                    handleInactive(subject.subjectId)
                                  }
                                  className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                                >
                                  Inactive
                                </button>
                              )}
                            </div>
                          )}
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
      {/* Phan Trang */}
      <ReactPaginate
        className="pagination mt-6 justify-center"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </div>
  );

  const value = {
    currentPage,
  };
}

export default CourseManagement;
