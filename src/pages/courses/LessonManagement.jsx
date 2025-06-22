import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Book,
  FileText,
  Check,
  X,
  ExternalLink,
  Search,
  Video,
  Upload,
} from "lucide-react";
import { g, s, sub, u } from "framer-motion/client";
import { GiOpenBook } from "react-icons/gi";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { use } from "react";

function LessonManagement() {
  const { subjectId } = useParams();

  const {
    addLesson,
    updateLesson,
    deleteLesson,
    addLog,
    lessonsFetch,
    fetchLessonStatus,
    getSubjectById,
  } = useData();

  const [subject, setSubject] = useState(null);
  const [subjectLessons, setSubjectLessons] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PUBLIC",
    subjectId: subjectId,
    videoUrl: null,
    videoPreview: null,
    videoDuration: null,
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const getStatus = async () => {
    let res = await fetchLessonStatus();
    if (res) {
      setStatusOptions(res);
    }
  };

  function extractYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  }

  const filteredLessons = subjectLessons.filter((lesson) => {
    // Search filter (case insensitive)
    const searchMatch =
      search === "" ||
      lesson.name?.toLowerCase().includes(search.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const statusMatch = filter === "all" || lesson.status === filter;

    return searchMatch && statusMatch;
  });

  const getLessons = async () => {
    try {
      const res = await lessonsFetch(subjectId, currentPage);
      if (res) {
        setSubjectLessons(res.content);
        setTotalPages(res.page.totalPages);
        setTotalElements(res.page.totalElements);
      } else {
        console.error("Failed to fetch lessons:", res);
        setErrorMessage("Failed to fetch lessons.");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setErrorMessage(error.message || "Failed to fetch lessons.");
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const getSubject = async () => {
    try {
      const subject = await getSubjectById(subjectId);
      if (subject) {
        setSubject(subject);
      }
    } catch (error) {
      console.error("Error in getSubject:", error);
    }
  };

  useEffect(() => {
    getSubject();
    getLessons();
    getStatus();
  }, [subjectId, currentPage, totalElements, totalPages]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({
        ...prev,
        videoUrl: file,
        videoPreview: URL.createObjectURL(file),
      }));

      // Get video duration
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setFormData((prev) => ({
          ...prev,
          videoDuration: Math.round(video.duration),
        }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(
      "Waiting for uploading video into YouTube..."
    );
    try {
      const newLesson = await addLesson(formData);
      console.log("New lesson added:", newLesson);
      debugger;
      if (newLesson) {
        setErrorMessage("");
        toast.dismiss(toastId);

        setTimeout(() => {
          toast.success(`Lesson "${formData.name}" created successfully!`);
        }, 200);
        addLog(
          "Lesson Created",
          `New lesson "${formData.name}" was created for subject "${subject.name}"`
        );
        setSubjectLessons([...subjectLessons, newLesson]);
        setFormData({
          name: "",
          description: "",
          status: "PUBLIC",
          subjectId: subjectId,
          videoUrl: null,
          videoPreview: null,
          videoDuration: null,
        });
        setIsAdding(false);
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to add lesson.");
      }
    } catch (error) {
      console.error("Failed to add lesson:", error);
      setErrorMessage(error.message || "Failed to add lesson.");
      toast.dismiss(toastId);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(
      "Waiting for uploading video into YouTube..."
    );

    try {
      const updatedLesson = await updateLesson(isEditing, formData);
      if (updatedLesson.status === "error") {
        setErrorMessage(updatedLesson.message);
        return;
      }
      toast.dismiss(toastId);
      setTimeout(() => {
        toast.success(`Lesson "${formData.name}" updated successfully!`);
      }, 200);
      setSubjectLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson.lessonId === isEditing ? { ...lesson, ...formData } : lesson
        )
      );
      setFormData({
        name: "",
        description: "",
        status: "PUBLIC",
        subjectId: subjectId,
        videoUrl: null,
        videoPreview: null,
        videoDuration: null,
      });
      setErrorMessage("");
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating lesson:", error);
      setErrorMessage(error.message || "Failed to update lesson.");
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteLesson(id);
    if (result.status === "error") {
      toast.error(result.message);
      setShowDeleteConfirm(null);
      return;
    }
    toast.success("Lesson deleted successfully!");
    setShowDeleteConfirm(null);
    setSubjectLessons((prevLessons) =>
      prevLessons.filter((lesson) => lesson.lessonId !== id)
    );
  };

  const startEdit = (lesson) => {
    setFormData({
      name: lesson.name,
      description: lesson.description,
      status: lesson.status,
      subjectId: lesson.subjectId,
      videoUrl: null,
      videoPreview: lesson.videoUrl || null,
      videoDuration: lesson.duration || null,
    });
    setIsEditing(lesson.lessonId);
    setIsAdding(false);
  };

  const cancelAction = () => {
    setErrorMessage("");
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      name: "",
      description: "",
      status: "PUBLIC",
      subjectId: subjectId,
      videoUrl: null,
      videoPreview: null,
      videoDuration: null,
    });
  };

  if (!subject) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link
          to="/admin/courses"
          className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Courses
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {subject.subjectName} - Lessons
            </h1>
            <p className="text-gray-500 mt-1">
              Manage lessons for this Subject
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setIsEditing(null);
            }}
            className="btn-primary flex items-center"
            disabled={isAdding || isEditing}
          >
            <Plus size={16} className="mr-1" />
            Add Lesson
          </button>
        </div>
      </div>

      {/* Course Details Card */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Subject Code
            </h3>
            <p className="text-lg font-medium">{subject.subjectCode}</p>
          </div>
          {/* <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
            <p className="text-lg font-medium">{course.duration}</p>
          </div> */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Enrolled Students
            </h3>
            <p className="text-lg font-medium">{subject.countUsers}</p>
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search lessons by title or description..."
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
              {statusOptions.map((status) => (
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
              {isAdding ? "Add New Lesson" : "Edit Lesson"}
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
                <div className="flex-shrink-0">
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
              {/* Lesson Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lesson Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter lesson name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  A descriptive name for the lesson
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
                  placeholder="Enter lesson description"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a detailed description of the lesson content
                </p>
              </div>

              {/* Video Upload */}
              <div className="md:col-span-2">
                <label
                  htmlFor="video"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lesson Video
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {formData.videoPreview ? (
                      <div className="relative">
                        {isEditing && isYouTubeUrl(formData.videoPreview) ? (
                          <iframe
                            title="Video Preview"
                            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                              formData.videoPreview
                            )}`}
                            className="mx-auto h-48 w-auto rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            className="mx-auto h-48 w-auto rounded-lg"
                            src={formData.videoPreview}
                            controls
                          />
                        )}

                        {formData.videoDuration && (
                          <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                            {formatDuration(formData.videoDuration)}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              videoUrl: null,
                              videoPreview: null,
                              videoDuration: null,
                            }))
                          }
                          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                          aria-label="Remove video preview"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="video"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a video</span>
                            <input
                              id="video"
                              type="file"
                              accept="video/*"
                              onChange={handleVideoChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          MP4, WebM up to 100MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Set the visibility of the lesson
                </p>
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
                {isAdding ? "Create Lesson" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Subject Lessons -{" "}
            <span className="text-gray-900">{`(${subjectLessons.length})`}</span>
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredLessons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Lesson Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Video
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLessons.map((lesson, index) => (
                    <tr key={lesson.lessonId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {lesson.name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {lesson.description}
                      </td>
                      <td className="px-4 py-2 text-blue-600">
                        {lesson.videoUrl ? (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-sm"
                          >
                            {lesson.videoUrl}
                          </a>
                        ) : (
                          <span className="text-gray-400">No video</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`badge ${
                            lesson.status === "PUBLIC"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lesson.status === "PUBLIC" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {/* Nút quản lý nội dung */}
                          <Link
                            to={`/admin/courses/${subjectId}/lessons/${lesson.lessonId}/content`}
                            title="Manage Content"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          {/* Nếu đang confirm xóa */}
                          {showDeleteConfirm === lesson.lessonId ? (
                            <>
                              <button
                                onClick={() => handleDelete(lesson.lessonId)}
                                className="text-red-600 hover:text-red-800"
                                title="Confirm Delete"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(lesson)}
                                className="text-indigo-600 hover:text-indigo-800"
                                disabled={isAdding || isEditing}
                                title="Edit Lesson"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  setShowDeleteConfirm(lesson.lessonId)
                                }
                                className="text-red-500 hover:text-red-700"
                                disabled={isAdding || isEditing}
                                title="Delete Lesson"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No lessons have been added to this course yet.</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(null);
                }}
                className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                disabled={isAdding || isEditing}
              >
                Add your first lesson
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Phan Trang */}
      <ReactPaginate
        className="pagination mt-6 justify-center"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3} // giới hạn trang bên trái 1 2 3 .... 99 100
        marginPagesDisplayed={2} // giới hạn trang bên phải 1 2 3 .... 99 100
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
}

export default LessonManagement;
