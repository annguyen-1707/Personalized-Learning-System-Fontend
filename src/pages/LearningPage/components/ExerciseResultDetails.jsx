import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiX,
  FiArrowLeft,
  FiUser,
  FiFileText,
  FiClock,
} from "react-icons/fi";

function ExerciseResultDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const details = state?.details;
  const exercise = state?.exercise;

  if (!details || !exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-500">
        No result data available.
      </div>
    );
  }

  const getUserAnswer = (questionId) => {
    return details.userQuestionResponseRequests.find(
      (res) => res.questionId === questionId
    )?.selectedAnswerId;
  };

  const isCorrectAnswer = (question) => {
    const correct = question.answerQuestions.find((a) => a.correct)?.answerId;
    const selected = getUserAnswer(question.exerciseQuestionId);
    return correct === selected;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex space-x-8">
            <div>
              <div className="flex items-center text-gray-700">
                <FiFileText className="mr-2" />
                <span className="font-semibold">{exercise?.title}</span>
              </div>
              <div className="text-sm text-gray-500">
                Exercise ID: {exercise?.id}
              </div>
            </div>

            <div className="border-l pl-8">
              <div className="flex items-center text-gray-700">
                <FiUser className="mr-2" />
                <span className="font-semibold">{details?.userId}</span>
              </div>
              <div className="text-sm text-gray-500">User ID</div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center text-gray-600">
              <FiClock className="mr-2" />
              <span className="font-mono text-lg">
                {details?.totalTime}s used
              </span>
            </div>
            <button
              onClick={() => navigate(-2)}
              className="text-sm text-primary-600 hover:underline flex items-center"
            >
              <FiArrowLeft className="mr-1" /> Back
            </button>
          </div>
        </div>
      </div>

      {/* Result Content */}
      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        {exercise?.content?.map((question, index) => {
          const correctAnswerId = question.answerQuestions.find(
            (a) => a.correct
          )?.answerId;
          const selectedAnswerId = getUserAnswer(question.exerciseQuestionId);
          const isCorrect = selectedAnswerId === correctAnswerId;

          return (
            <div
              key={question.exerciseQuestionId}
              className={`rounded-xl border-2 shadow-sm p-6 transition ${
                isCorrect
                  ? "border-success-500 bg-success-50"
                  : "border-error-500 bg-error-50"
              }`}
            >
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h2>
                <div
                  className={`flex items-center text-sm font-medium ${
                    isCorrect ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <FiCheck className="mr-1" />
                      Correct
                    </>
                  ) : (
                    <>
                      <FiX className="mr-1" />
                      Incorrect
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-800 mb-4 leading-relaxed text-base">
                {question.questionText}
              </p>

              <div className="space-y-3">
                {question.answerQuestions.map((option) => {
                  const isSelected = option.answerId === selectedAnswerId;
                  const isCorrectOption = option.answerId === correctAnswerId;

                  return (
                    <div
                      key={option.answerId}
                      className={`flex items-center justify-between border rounded-lg px-4 py-3 transition ${
                        isCorrectOption
                          ? "border-success-500 bg-success-100"
                          : isSelected
                          ? "border-error-500 bg-error-100"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-gray-900">{option.answerText}</span>
                      <div className="text-sm font-medium">
                        {isCorrectOption && (
                          <span className="text-success-700">✅ Correct</span>
                        )}
                        {isSelected && !isCorrectOption && (
                          <span className="text-error-700">❌ Your Choice</span>
                        )}
                        {isSelected && isCorrectOption && (
                          <span className="text-success-700">
                            🎯 You chose this
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExerciseResultDetails;
