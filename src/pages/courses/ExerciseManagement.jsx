import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import {
  ArrowLeft,
  Book,
  FileText,
  Dumbbell,
  Check,
  Trash2,
  X,
} from "lucide-react";
import ReactPaginate from "react-paginate";
import { g } from "framer-motion/client";
import { useAuth } from "../../context/AuthContext";

function ExerciseManagement() {
  const { subjectId, lessonId, exerciseId } = useParams();
  const { getSubjectById, getLessonById, getExerciseDetailsById } = useData();
  const { user } = useAuth();

  const [subject, setSubject] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [lessonExercises, setLessonExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const isStaff =
    user &&
    Array.isArray(user.role) &&
    user.role.some((role) => ["STAFF"].includes(role));
  const isContentManagerment =
    user &&
    Array.isArray(user.role) &&
    user.role.some(role =>
      ["CONTENT_MANAGER"].includes(role)
    );

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

  const getLessons = async () => {
    try {
      const lessons = await getLessonById(lessonId);
      if (lessons) {
        setLesson(lessons);
      }
    } catch (error) {
      console.error("Error in getLessons:", error);
    }
  };

  const getLessonExercises = async () => {
    try {
      const lessonExercises = await getExerciseDetailsById(
        exerciseId,
        currentPage
      );

      console.log("Lesson Exercises:", lessonExercises);
      if (lessonExercises) {
        setLessonExercises(lessonExercises.content);
        setTotalPages(lessonExercises.page.totalPages);
        setTotalElements(lessonExercises.page.totalElements);
      }
    } catch (error) {
      console.error("Error in getLessonExercises:", error);
    }
  };

  useEffect(() => {
    getSubject();
    getLessons();
    getLessonExercises();
    console.log("list question", lessonExercises);
  }, [subjectId, lessonId, exerciseId]);

  if (!lessonExercises || !subject || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className="card space-y-6">
        {lessonExercises.length > 0 ? (
          lessonExercises.map((question) => (
            <div
              key={question.exerciseQuestionId}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Question + Status */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">
                  {question.questionText}
                </p>
                <span
                  className={`
                  text-xs font-semibold px-2 py-1 rounded-full
                  ${question.status === "DRAFT"
                      ? "bg-gray-200 text-gray-700"
                      : question.status === "REJECT"
                        ? "bg-red-200 text-red-700"
                        : question.status === "PUBLIC"
                          ? "bg-green-200 text-green-700"
                          : "bg-gray-100 text-gray-500"
                    }
                `}
                >
                  {question.status}
                </span>
              </div>

              {/* Answer list */}
              <div className="space-y-2">
                {question.answerQuestions.map((answer, aIndex) => (
                  <div
                    key={aIndex}
                    className={`
                    flex items-center space-x-2 text-sm px-3 py-2 rounded-md border
                    ${answer.correct
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                  `}
                  >
                    <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold bg-white">
                      {String.fromCharCode(65 + aIndex)}
                    </span>
                    <span className="flex-1">{answer.answerText}</span>
                    {answer.correct && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end pt-2 space-x-2">
                {isContentManagerment && question.status === "PUBLIC" && (
                  <button
                    onClick={() => handleReject(question.exerciseQuestionId)}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-1 py-1 rounded"
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </button>
                )}
                {isContentManagerment && question.status === "DRAFT" && (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleAccept(question.exerciseQuestionId)}
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white px-1 py-1 rounded"
                    >
                      <Check size={16} className="mr-1" />
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(question.exerciseQuestionId)}
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white px-1 py-1 rounded"
                    >
                      <X size={16} className="mr-1" />
                      Reject
                    </button>
                  </div>
                )}
                <button
                  onClick={() =>
                    setShowDeleteConfirm(question.exerciseQuestionId)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No question found. Please add a new question.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link
          to={`/admin/courses/${subjectId}/lessons/${lessonId}/content`}
          className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Lessons Content
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lesson.name} - Exercise Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage exercises for the lesson "{lesson.name}" in the subject "
              {subject.subjectName}".
            </p>
          </div>
        </div>
      </div>

      {/* Course and Lesson Details Card */}
      <div className="card p-4 mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
            <Book className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium">{subject.subjectName}</p>
          </div>
          <div className="mx-4 text-gray-300">|</div>
          <div className="h-10 w-10 rounded-md bg-secondary-100 flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lesson {lessonId}</p>
            <p className="font-medium">{lesson.name}</p>
          </div>
          <div className="mx-4 text-gray-300">|</div>
          <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
            <Book className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Exercise</p>
            <p className="font-medium">{exerciseTitle}</p>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div>{renderContent()}</div>

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

export default ExerciseManagement;
