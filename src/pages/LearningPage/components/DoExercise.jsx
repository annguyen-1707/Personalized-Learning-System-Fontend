import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiHelpCircle,
  FiClock,
  FiUser,
  FiFileText,
  FiSave,
  FiSend,
} from "react-icons/fi";

function DoExercise() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [savedAnswers, setSavedAnswers] = useState(new Set());

  // Student info - in real app, this would come from auth context
  const studentInfo = {
    name: "Alex Johnson",
    studentId: "ST001234",
    examCode: "JP-N5-001",
  };

  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, showResults]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSaveAnswer = () => {
    if (lesson?.exercises && lesson?.exercises[currentQuestion]) {
      const questionId = lesson?.exercises[currentQuestion].id;
      setSavedAnswers((prev) => new Set([...prev, questionId]));
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getCorrectCount = () => {
    if (!lesson?.exercises) return 0;

    return lesson?.exercises.filter(
      (exercise) => answers[exercise?.id] === exercise?.correctAnswer
    ).length;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getQuestionStatus = (index) => {
    if (!lesson?.exercises) return "unanswered";
    const questionId = lesson?.exercises[index].id;
    if (answers[questionId]) return "answered";
    if (savedAnswers.has(questionId)) return "saved";
    return "unanswered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-success-500 text-white";
      case "saved":
        return "bg-warning-500 text-white";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    }
  };

  if (!lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No exercises available for this lesson.</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Results Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Exam Results
                </h1>
                <p className="text-gray-600">{lesson?.title}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {getCorrectCount()}/{lesson?.exercises?.length}
                </div>
                <div className="text-gray-600">
                  Score:{" "}
                  {Math.round(
                    (getCorrectCount() / lesson?.exercises?.length) * 100
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {lesson?.exercises.map((exercise, index) => {
              const isCorrect = answers[exercise?.id] === exercise?.correctAnswer;

              return (
                <div
                  key={exercise?.id}
                  className={`bg-white border-2 rounded-lg overflow-hidden ${
                    isCorrect ? "border-success-500" : "border-error-500"
                  }`}
                >
                  <div
                    className={`p-4 flex justify-between items-center ${
                      isCorrect ? "bg-success-50" : "bg-error-50"
                    }`}
                  >
                    <h3 className="text-lg font-medium">
                      Question {index + 1}
                    </h3>
                    <div
                      className={`flex items-center ${
                        isCorrect ? "text-success-600" : "text-error-600"
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <FiCheck className="h-5 w-5 mr-1" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <FiX className="h-5 w-5 mr-1" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-800 mb-4">{exercise?.question}</p>

                    <div className="space-y-2">
                      {exercise?.options.map((option, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg flex items-center ${
                            answers[exercise?.id] === option && isCorrect
                              ? "bg-success-100 border border-success-500"
                              : answers[exercise ?.id] === option && !isCorrect
                              ? "bg-error-100 border border-error-500"
                              : exercise?.correctAnswer === option
                              ? "bg-success-50 border border-success-500"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span className="flex-1">{option}</span>
                          {answers[exercise?.id] === option && isCorrect && (
                            <FiCheck className="h-5 w-5 text-success-600" />
                          )}
                          {answers[exercise?.id] === option && !isCorrect && (
                            <FiX className="h-5 w-5 text-error-600" />
                          )}
                          {exercise?.correctAnswer === option &&
                            answers[exercise?.id] !== option && (
                              <span className="text-sm text-success-600">
                                Correct answer
                              </span>
                            )}
                        </div>
                      ))}
                    </div>

                    {!isCorrect && exercise?.explanation && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
                        <div className="font-medium mb-1">Explanation:</div>
                        {exercise?.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setShowResults(false)}
              className="btn btn-secondary"
            >
              Review Again
            </button>
            <Link to="/quiz" className="btn btn-primary">
              Take Another Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = lesson?.exercises[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Question Navigation */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">Questions</h3>
          <p className="text-sm text-gray-600">
            {lesson?.exercises?.length} questions
          </p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {lesson?.exercises.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentQuestion === index
                      ? "ring-2 ring-primary-500 " + getStatusColor(status)
                      : getStatusColor(status)
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-success-500 rounded mr-2"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-warning-500 rounded mr-2"></div>
              <span>Saved</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <span>Not answered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div>
                  <div className="flex items-center text-gray-600">
                    <FiFileText className="h-5 w-5 mr-2" />
                    <span className="font-medium">{lesson?.title}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Exam Code: {studentInfo?.examCode}
                  </div>
                </div>

                <div className="border-l pl-8">
                  <div className="flex items-center text-gray-600">
                    <FiUser className="h-5 w-5 mr-2" />
                    <span className="font-medium">{studentInfo?.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ID: {studentInfo?.studentId}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div
                  className={`flex items-center ${
                    timeRemaining < 300 ? "text-error-600" : "text-gray-600"
                  }`}
                >
                  <FiClock className="h-5 w-5 mr-2" />
                  <span className="font-mono text-lg font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {lesson?.exercises?.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-gray-900">
                    Question {currentQuestion + 1}
                  </h2>
                
                </div>

                <p className="text-lg text-gray-800 leading-relaxed">
                  {currentExercise?.question}
                </p>
              </div>

              <div className="space-y-3">
                {currentExercise?.options.map((option, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentExercise?.id] === option
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentExercise?.id}`}
                      value={option}
                      checked={answers[currentExercise?.id] === option}
                      onChange={() => handleAnswer(currentExercise?.id, option)}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-white border-t px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                }
                disabled={currentQuestion === 0}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setCurrentQuestion(
                    Math.min(lesson?.exercises.length - 1, currentQuestion + 1)
                  )
                }
                disabled={currentQuestion === lesson?.exercises.length - 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSaveAnswer}
                disabled={!answers[currentExercise.id]}
                className="btn btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="h-4 w-4 mr-2" />
                Save Answer
              </button>

              <button
                onClick={handleSubmit}
                className="btn btn-primary flex items-center"
              >
                <FiSend className="h-4 w-4 mr-2" />
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoExercise;
