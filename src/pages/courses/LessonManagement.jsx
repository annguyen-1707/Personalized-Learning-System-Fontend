import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { g, s, sub } from "framer-motion/client";
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
    fetchSubjects
  } = useData();

  const [subject, setSubject] = useState(null);
  const [subjectLessons, setSubjectLessons] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totolElements, setTotolElements] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PUBLIC",
    subjectId: subjectId,
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const getStatus = async () => {
    let res = await fetchLessonStatus();
    if (res) {
      setStatusOptions(res)
    }
  }

  const getLessons = async () => {
    try {
      const res = await lessonsFetch(subjectId, currentPage);
      if (res) {
        setSubjectLessons(res.content);
        setTotalPages(res.page.totalPages);
        setTotolElements(res.page.totalElements);
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
    const subjects = await fetchSubjects();
    const found = subjects?.find((subj) => subj.subjectId == subjectId);
    if (found) {
      setSubject(found);
      getLessons();
      getStatus();
    }
  } catch (error) {
    console.error("Error in getSubject:", error);
  }
};

    useEffect(() => {
      getSubject();
    }, [subjectId, currentPage, totolElements]);

 
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLesson = await addLesson({
        ...formData,
      });
      console.log("New lesson added:", newLesson);
      if (newLesson) {
        setErrorMessage("");
        const message = `New lesson "${formData.name}" was created successfully!`;
        toast.success(message);
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
        });
        setIsAdding(false);
      } else {
        console.error("Failed to add lesson:", newLesson);
        setErrorMessage(newLesson.message || "Failed to add lesson.");
      }
    } catch (error) {
      console.error("Failed to add lesson:", error);
      setErrorMessage(error.message || "Failed to add lesson.");
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    updateLesson(isEditing, {
      ...formData,
    });

    addLog("Lesson Updated", `Lesson "${formData.name}" was updated`);

    setFormData({
      name: "",
      description: "",
      duration: "",
      status: "PUBLIC",
      subjectId: subjectId,
    });

    setIsEditing(null);
  };

  const handleDelete = (id) => {
    const lessonToDelete = subjectLessons.find(
      (lesson) => lesson.lessonId === id
    );
    deleteLesson(id);
    addLog(
      "Lesson Deleted",
      `Lesson "${lessonToDelete.name}" was deleted from course "${subject.subjectName}"`
    );
    setShowDeleteConfirm(null);
  };

  const startEdit = (lesson) => {
    setFormData({
      name: lesson.name,
      description: lesson.description,
      status: lesson.status,
      subjectId: lesson.subjectId,
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
      duration: "",
      status: "PUBLIC",
      subjectId: subjectId,
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

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? "Add New Lesson" : "Edit Lesson"}
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
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lesson Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
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
                {isAdding ? "Add Lesson" : "Save Changes"}
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
            <span className="text-gray-900">{subjectLessons.length}</span>
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {subjectLessons.length > 0 ? (
            subjectLessons.map((lesson, index) => (
              <div
                key={lesson.lessonId}
                className="p-4 hover:bg-gray-50 animate-fade-in"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          Lesson {index + 1}:
                        </span>
                        <h3 className="text-lg font-medium text-gray-900">
                          {lesson.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {lesson.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <GiOpenBook className="h-4 w-4 text-gray-400" />
                        <span
                          className={`badge ${
                            lesson.status === "PUBLIC"
                              ? "bg-success-50 text-success-700"
                              : "bg-warning-50 text-warning-700"
                          }`}
                        >
                          {lesson.status === "PUBLIC" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Link
                      to={`/courses/${subjectId}/lessons/${lesson.lessonId}/content`}
                      className="text-secondary-600 hover:text-secondary-800 mr-3"
                      title="Manage Content"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    {showDeleteConfirm === lesson.lessonId ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button
                          onClick={() => handleDelete(lesson.lessonId)}
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
                      <>
                        <button
                          onClick={() => startEdit(lesson)}
                          className="text-primary-600 hover:text-primary-800 mr-2"
                          disabled={isAdding || isEditing}
                          title="Edit Lesson"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(lesson.id)}
                          className="text-error-500 hover:text-error-700"
                          disabled={isAdding || isEditing}
                          title="Delete Lesson"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
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
