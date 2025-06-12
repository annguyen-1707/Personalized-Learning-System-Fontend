import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiPlay,
  FiCheck,
  FiClock,
  FiBook,
  FiUsers,
} from "react-icons/fi";
import { CourseContentService } from "../../../services/CourseContentService";

function CourseContentPage() {
  const { subjectId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const { getCourseContentById, getLessonsBySubjectId, getProgressByLessonId, } =
    CourseContentService;

  const fetchCourseContent = async () => {
    try {
      const courseData = await getCourseContentById(subjectId);
      setCourse(courseData.data);
    } catch (error) {
      console.error("Error fetching course content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const lessonsData = await getLessonsBySubjectId(subjectId);
      setLessons(lessonsData.data);
      const progressPromises = lessonsData.data.map((lesson) =>
        getProgressByLessonId(lesson.lessonId)
      );
      const progressResults = await Promise.all(progressPromises);
      setCompletedLessons(
        progressResults
          .filter((result) => result?.data?.status === "COMPLETED")
          .map((result) => result?.data?.lesson?.lessonId)
      );
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    fetchCourseContent();
    fetchLessons();
    debugger
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <p className="mt-2 text-gray-600">
          The requested course could not be found. Please return to the courses
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

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/learning"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft className="mr-2" />
          Back to Courses
        </Link>
      </div>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
      >
        <div className="relative">
          <img
            src={course.thumbnailUrl || "https://via.placeholder.com/800x400"}
            alt={course.subjectName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{course.subjectName}</h1>
              <p className="text-lg opacity-90">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Course Stats */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-2">
                    <FiBook className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {course.countLessons}
                  </div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-2">
                    <FiUsers className="h-6 w-6 text-success-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {course.countUsers}
                  </div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lessons List */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Course Lessons
              </h2>
              <p className="text-gray-600 mt-1">
                {course.countLessons} lessons
                <span className="mx-2">•</span>
                {completedLessons.length} completed
                <FiCheck className="inline-block ml-2 text-green-600" />
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.lessonId);

                return (
                  <motion.div
                    key={lesson.lessonId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="flex items-center">
                      {/* Lesson Status Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          isCompleted
                            ? "bg-success-100 text-success-600"
                            : "bg-primary-100 text-primary-600"
                        }`}
                      >
                        {isCompleted ? (
                          <FiCheck className="h-5 w-5" />
                        ) : (
                          <FiPlay className="h-5 w-5" />
                        )}
                      </div>

                      {/* Lesson Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Lesson {index + 1}: {lesson.name}
                            </h3>
                            {lesson.description && (
                              <p className="text-gray-600 mt-1 line-clamp-2">
                                {lesson.description}
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="ml-4">
                            <Link
                              to={`/learning/${subjectId}/lesson/${lesson.lessonId}`}
                              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                                isCompleted
                                  ? "bg-success-100 text-success-700 hover:bg-success-200"
                                  : "bg-primary-500 text-white hover:bg-primary-600"
                              }`}
                            >
                              {isCompleted ? "Review" : "Start Lesson"}
                            </Link>
                          </div>
                        </div>

                        {/* Lesson Meta */}
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          {lesson.vocabularies && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                {lesson.vocabularies.length} vocabulary words
                              </span>
                            </>
                          )}
                          {lesson.grammars && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                {lesson.grammars.length} grammar points
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CourseContentPage;
