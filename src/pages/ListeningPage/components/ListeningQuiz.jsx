import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth
import axios from '../../../services/customixe-axios';

function ListeningQuiz({ questions = [], currentTime, contentListeningId }) {
  const { user } = useAuth(); // Get user from AuthContext
  const userId = user?.userId; // Adjust this if your user object uses a different key

  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    setQuizQuestions(questions);
  }, [questions]);

  const handleAnswer = (exerciseQuestionId, answerText) => {
    if (showResults) return;
    setAnswers(prev => ({
      ...prev,
      [exerciseQuestionId]: { answerText }
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting answers for answer:", answers.questionId || answers.exerciseQuestionId);
    const userAnswers = Object.entries(answers).map(([exerciseQuestionId, { answerText }]) => {
      const question = quizQuestions.find(q => q.exerciseQuestionId === Number(exerciseQuestionId));
      const selectedOption = question?.answerQuestions.find(opt => opt.answerText === answerText);
      return {
        exerciseQuestionId: selectedOption?.exerciseQuestionId,
        answerText
      };
    });
    console.log("User answers and contentid:", contentListeningId, userAnswers);
    const contentId = contentListeningId;
    const response = await axios.post(`http://localhost:8080/content-listening/submit-answers?contentListeningId=${contentId}`, userAnswers);
    const result = response.data;

    setAnswers(prev =>
      result.reduce((acc, curr) => {
        const question = quizQuestions.find(q =>
          q.answerQuestions.some(opt => opt.exerciseQuestionId === curr.exerciseQuestionId)
        );
          console.log("Updated answers:", acc || curr.exerciseQuestionId, curr.answerText, curr.isCorrect);
        if (!question) return acc;
        return {
          ...acc,
          [question.exerciseQuestionId]: {
            answerText: curr.answerText,
            isCorrect: curr.isCorrect
          }
        };
      }, prev)
    );
    console.log("Updated answers:", acc || curr.exerciseQuestionId, curr.answerText, curr.isCorrect);

    setShowResults(true);
  };

  const activeQuestions = quizQuestions.filter(q =>
    typeof q.startTime === 'number' && typeof q.endTime === 'number'
      ? currentTime >= q.startTime && currentTime <= q.endTime
      : true
  );

  if (!quizQuestions.length) {
    return <div>No questions available.</div>;
  }

  return (
    <div>
      {activeQuestions.map((question, idx) => (
        <div key={question.exerciseQuestionId} className="mb-6 bg-white rounded-lg shadow-md p-6">
          <div className="font-semibold mb-2">Question {idx + 1}</div>
          <div className="mb-4">{question.questionText}</div>
          <div className="space-y-3">
            {Array.isArray(question.answerQuestions) && question.answerQuestions.map((option) => {
              const selected = answers[question.exerciseQuestionId]?.answerText === option.answerText;
              const isCorrect = answers[question.exerciseQuestionId]?.isCorrect;

              return (
                <button
                  key={option.exerciseQuestionId}
                  onClick={() => handleAnswer(question.exerciseQuestionId, option.answerText)}
                  className={`w-full p-3 rounded-lg text-left transition-colors border flex items-center justify-between
        ${selected && !showResults
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : selected && showResults && isCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : selected && showResults && isCorrect === false
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  disabled={showResults}
                >
                  <span>{option.answerText}</span>
                  {showResults && selected && (
                    isCorrect
                      ? <FiCheck className="ml-2 text-green-500" />
                      : <FiX className="ml-2 text-red-500" />
                  )}
                  {showResults && !selected && option.isCorrect && (
                    <FiCheck className="ml-2 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!showResults && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded"
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default ListeningQuiz;