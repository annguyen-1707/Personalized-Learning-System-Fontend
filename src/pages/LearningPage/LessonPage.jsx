import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CourseContentService } from "../../services/CourseContentService";
import Swal from 'sweetalert2';

import {
  FiArrowLeft,
  FiArrowRight,
  FiBookmark,
  FiVideoOff,
  FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";
import LessonContent from "./components/LessonContent";
import LessonVocabulary from "./components/LessonVocabulary";
import LessonGrammar from "./components/LessonGrammar";
import LessonExercises from "./components/LessonExercises";

function LessonPage() {
  const { subjectId, lessonId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [lesson, setLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { getProgressByLessonId, handleStartLesson } = CourseContentService;
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [courseCompleted, setCourseCompleted] = useState(false);

  useEffect(() => {
    // Find the course and lesson based on the URL parameters
    const getLesson = async () => {
      try {
        const lessonsData = await CourseContentService.getLessonsBySubjectId(
          subjectId
        );
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
        const lessonsList = lessonsData.data || [];
        const currentIndex = lessonsList.findIndex(
          (l) => String(l.lessonId) === lessonId
        );
        if (currentIndex !== -1) {
          setCurrentLessonIndex(currentIndex);
          setLesson(lessonsList[currentIndex]);
          setPrevLesson(
            currentIndex > 0 ? lessonsList[currentIndex - 1] : null
          );
          setNextLesson(
            currentIndex < lessonsList.length - 1
              ? lessonsList[currentIndex + 1]
              : null
          );
        } else {
          setLesson(null);
          setPrevLesson(null);
          setNextLesson(null);
        }
      } catch (error) {
        console.error("Error fetching course or lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    getLesson();
  }, [subjectId, lessonId]);

  const startLesson = async (lessonId) => {
    // Navigate to the lesson content page
    const res = await handleStartLesson(lessonId);
    if (res?.status === 200) {
      console.log("Lesson started successfully:", lessonId);
    } else {
      console.error("Failed to start lesson:", res?.message || "Unknown error");
    }
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  const markLessonComplete = async () => {
  try {
    await CourseContentService.markCourseComplete(subjectId);
    setCourseCompleted(true);
    
    // Hiển thị alert
    Swal.fire({
      title: '🎉 Congratulations!',
      text: 'You have successfully completed the course.',
      icon: 'success',
      confirmButtonText: 'Cotninue learning',
      confirmButtonColor: '#10B981',
    });
  } catch (error) {
    console.error("Error marking course complete:", error);
    Swal.fire({
      title: 'Oops!',
      text: 'Something went wrong when completing the course.',
      icon: 'error',
    });
  }
};

  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
        <p className="mt-2 text-gray-600">
          The requested lesson could not be found. Please return to the courses
          page.
        </p>
        <Link
          to={`/learning/${subjectId}`}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
        >
          Back to Courses
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to={`/learning/${subjectId}`}
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Back to Course
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-500">
                <FiBookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              <div className="relative aspect-video w-full">
                {/* YouTube Video */}
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                    lesson.videoUrl
                  )}?autoplay=0`}
                  title="YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h1 className="text-xl font-bold text-gray-900">
                  {lesson.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {lesson.name} - Lesson {currentLessonIndex + 1}
                </p>
              </div>
            </motion.div>

            {/* Lesson Content Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
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
                {activeTab === "vocabulary" && (
                  <LessonVocabulary lesson={lesson} />
                )}
                {activeTab === "grammar" && <LessonGrammar lesson={lesson} />}
                {activeTab === "exercises" && (
                  <LessonExercises lessonId={lesson.lessonId} />
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Lesson Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6"
            >
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Course Lessons
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {completedLessons.length} of {lessons.length} completed
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {lessons?.map((courseLesson, index) => {
                  const isCompleted = isLessonCompleted(courseLesson.lessonId);
                  const isCurrent = courseLesson.lessonId === lessonId;

                  return (
                    <Link
                      key={courseLesson.lessonId}
                      to={`/learning/${subjectId}/lesson/${courseLesson.lessonId}`}
                      className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isCurrent
                          ? "bg-primary-50 border-l-4 border-l-primary-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                            isCompleted
                              ? "bg-success-100 text-success-600"
                              : isCurrent
                              ? "bg-primary-100 text-primary-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isCompleted ? (
                            <FiCheck className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col items-start justify-center text-center h-full">
                          <h3
                            className={`text-sm font-medium ${
                              isCurrent ? "text-primary-900" : "text-gray-900"
                            }`}
                          >
                            {courseLesson.name}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {courseLesson.description}
                          </p>

                          <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                            {isCompleted && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="text-success-600">
                                  Completed
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Progress Summary */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(
                      (completedLessons.length / lessons.length) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (completedLessons.length / lessons.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="flex justify-between items-center mt-8 bg-white rounded-lg shadow-md p-6">
          {prevLesson ? (
            <Link
              onClick={() => startLesson(prevLesson.lessonId)}
              to={`/learning/${subjectId}/lesson/${prevLesson.lessonId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2" />
              Previous: {prevLesson.title}
            </Link>
          ) : (
            <div></div>
          )}

          {nextLesson ? (
            <Link
              onClick={() => startLesson(nextLesson.lessonId)}
              to={`/learning/${subjectId}/lesson/${nextLesson.lessonId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
            >
              Next: {nextLesson.title}
              <FiArrowRight className="ml-2" />
            </Link>
          ) : (
            <button
              onClick={markLessonComplete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success-500 hover:bg-success-600"
            >
              Complete Course
              <FiCheck className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
