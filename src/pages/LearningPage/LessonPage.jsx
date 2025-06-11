import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookmark,
  FiVolume2,
  FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { coursesData } from "../../data/coursesData";
import LessonContent from "./components/LessonContent";
import LessonVocabulary from "./components/LessonVocabulary";
import LessonGrammar from "./components/LessonGrammar";
import LessonExercises from "./components/LessonExercises";

function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the course and lesson based on the URL parameters
    const foundCourse = coursesData.find((c) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundLesson = foundCourse.lessons.find((l) => l.id === lessonId);
      if (foundLesson) {
        setLesson(foundLesson);
      }
    }
    setLoading(false);
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
        <p className="mt-2 text-gray-600">
          The requested lesson could not be found. Please return to the courses
          page.
        </p>
        <Link
          to="/learning"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  // Find the current lesson index to determine previous and next lessons
  const currentLessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson =
    currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < course.lessons.length - 1
      ? course.lessons[currentLessonIndex + 1]
      : null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          to="/learning"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft className="mr-2" />
          Back to Courses
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Lesson header */}
        <div className="bg-primary-500 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <button className="p-2 rounded-full hover:bg-primary-400 transition-colors">
              <FiBookmark className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 opacity-90">
            {course.title} - Lesson {currentLessonIndex + 1}
          </p>
        </div>

        {/* Lesson navigation tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("content")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "content"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("vocabulary")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "vocabulary"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Vocabulary
            </button>
            <button
              onClick={() => setActiveTab("grammar")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "grammar"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "exercises"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Exercises
            </button>
          </nav>
        </div>

        {/* Lesson content based on active tab */}
        <div className="p-6">
          {activeTab === "content" && <LessonContent lesson={lesson} />}
          {activeTab === "vocabulary" && <LessonVocabulary lesson={lesson} />}
          {activeTab === "grammar" && <LessonGrammar lesson={lesson} />}
          {activeTab === "exercises" && <LessonExercises lesson={lesson} />}
        </div>

        {/* Lesson navigation */}
        <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
          {prevLesson ? (
            <Link
              to={`/learning/${courseId}/${prevLesson.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2" />
              Previous Lesson
            </Link>
          ) : (
            <div></div>
          )}

          {nextLesson ? (
            <Link
              to={`/learning/${courseId}/${nextLesson.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
            >
              Next Lesson
              <FiArrowRight className="ml-2" />
            </Link>
          ) : (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success-500 hover:bg-success-600">
              Complete Course
              <FiCheck className="ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default LessonPage;
