import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import { use } from "react";

import { useAuth } from "../../../context/AuthContext";
import DoExerciseService from "../../../services/DoExersiceService";
import { duration } from "@mui/material/styles";

function DoExercise() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(); 
  const {exerciseId, subjectId} = useParams();
  const [exercise, setExercise] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, showResults]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const exercise = await DoExerciseService.getSource(exerciseId);
        setExercise({
          id: exercise?.id,
          title: exercise?.title,
          duration: exercise?.duration,
          lessonId: exercise?.lessonId,
          content: exercise?.content,
        });
        setTimeRemaining(exercise?.duration || 0); // Set initial time remaining
      }catch(error){
        console.error("Error fetching exercise data:", error);
      }
    }
    fetchData();

  }, []);

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getCorrectCount = () => {
    if (!exercise?.content) return 0;
    return exercise.content.filter((question) => {
    const selectedAnswer = answers[question.exerciseQuestionId];
    const correctAnswer = question.answerQuestions.find((a) => a.correct);
    return selectedAnswer === correctAnswer?.answerId;
  }).length;
  };

  const formatTime = (seconds) => {
   const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
  };

  const getQuestionStatus = (index) => {
  if (!exercise?.content) return "unanswered";
  const questionId = exercise.content[index].exerciseQuestionId;
  return answers[questionId] ? "answered" : "unanswered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-success-500 text-white";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    }
  };

  const handleBack = () => {
    // Handle back navigation
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(exercise?.duration || 0); // Reset time remaining
    window.history.back(); // Navigate back to the previous page
  };

  if (!exercise?.content || exercise?.content?.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No questions available for this exercise.</p>
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
                <p className="text-gray-600">{exercise?.title}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {getCorrectCount()}/{exercise?.questions?.length}
                </div>
                <div className="text-gray-600">
                  Score:{" "}
                  {Math.round(
                    (getCorrectCount() / exercise?.content?.length) * 100
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
            {exercise?.content?.map((question, index) => {
              const isCorrect = answers[question?.exerciseQuestionId] === question?.answerQuestions?.find(a => a.correct)?.answerId;

              return (
                <div
                  key={question?.id}
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
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link onClick={handleBack} className="btn btn-primary">
              Take Another Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };
  const cuQuestion = exercise?.content[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Question Navigation */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">Questions</h3>
          <p className="text-sm text-gray-600">
            {exercise?.content?.length} questions
          </p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {exercise?.content?.map((_, index) => {
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
                    <span className="font-medium">{exercise?.title}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ExamID: {exercise?.id}
                  </div>
                </div>

                <div className="border-l pl-8">
                  <div className="flex items-center text-gray-600">
                    <FiUser className="h-5 w-5 mr-2" />
                    <span className="font-medium">{user?.fullName}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    UserID: {user?.userId}
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
                  Question {currentQuestion + 1} of {exercise?.content?.length}
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
                  {cuQuestion?.questionText}
                </p>
              </div>

              <div className="space-y-3">
                {cuQuestion?.answerQuestions.map((option, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[cuQuestion?.exerciseQuestionId] === option.answerId
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${cuQuestion?.exerciseQuestionId}`}
                      value={option}
                      checked={answers[cuQuestion?.exerciseQuestionId] === option.answerId}
                      onChange={() => handleAnswer(cuQuestion?.exerciseQuestionId, option.answerId)}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-900">{option.answerText}</span>
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
                    Math.min(exercise?.content?.length - 1, currentQuestion + 1)
                  )
                }
                disabled={currentQuestion === exercise?.content?.length - 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="flex space-x-4">
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
