import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { ArrowLeft, Book, FileText, Dumbbell, Check } from "lucide-react";
import ReactPaginate from "react-paginate";
import { g } from "framer-motion/client";

function ExerciseManagement() {
  const { subjectId, lessonId, exerciseId } = useParams();
  const { getSubjectById, getLessonById, getExerciseDetailsById } = useData();

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
          lessonExercises.map((exercise, eIndex) => (
            <div
              key={exercise.exerciseQuestionId}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-200 flex items-center justify-center text-sm font-medium text-primary-700">
                  {eIndex + 1 + currentPage * 10}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-black-900 mb-3">
                    {exercise.questionText}
                  </p>
                  <div className="space-y-2">
                    {exercise.answerQuestions.map((answer, aIndex) => (
                      <div
                        key={aIndex}
                        className={`flex items-center space-x-2 text-sm ${
                          answer.correct
                            ? "text-green-800 bg-green-50"
                            : "text-gray-700 bg-white"
                        } px-3 py-2 rounded-md`}
                      >
                        <span className="flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center text-xs">
                          {String.fromCharCode(65 + aIndex)}
                        </span>
                        <span className="flex-1">{answer.answerText}</span>
                        {answer.correct && (
                          <span className="flex-shrink-0 text-green-600">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Dumbbell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Exercises Available
              </h3>
              <p className="text-gray-500 max-w-sm">
                There are no exercises added to this lesson yet. Add some
                exercises to help students practice and learn.
              </p>
            </div>
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
