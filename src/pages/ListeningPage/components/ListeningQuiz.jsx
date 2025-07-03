import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../services/customixe-axios';

function ListeningQuiz({ questions = [], currentTime, contentListeningId }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });

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
    const unanswered = quizQuestions.filter(q => !answers[q.exerciseQuestionId]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm("Some questions are unanswered. Are you sure you want to submit?");
      if (!confirmSubmit) return;
    }

    const userAnswers = Object.entries(answers).map(([exerciseQuestionId, { answerText }]) => ({
      questionId: Number(exerciseQuestionId),
      answerText
    }));

    const contentId = contentListeningId;
    const response = await axios.post(
      `http://localhost:8080/content-listening/submit-answers?contentListeningId=${contentId}`,
      userAnswers
    );

    const result = response;

    let correctCount = 0;
    const updatedAnswers = result.reduce((acc, curr) => {
      const questionId = curr.questionId;
      if (curr.correct) correctCount++;
      return {
        ...acc,
        [questionId]: {
          answerText: curr.answerText,
          isCorrect: curr.correct
        }
      };
    }, {});

    setAnswers(updatedAnswers);
    setScore({ correct: correctCount, total: quizQuestions.length });
    setShowResults(true);
  };

  const handleDoAgain = () => {
    setAnswers({});
    setShowResults(false);
    setScore({ correct: 0, total: 0 });
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
      {showResults && (
        <div className="mb-4 font-semibold text-lg text-center">
          You answered <span className="text-green-600">{score.correct}</span> out of <span className="text-blue-600">{score.total}</span> questions correctly.
          <br />
          Score: <span className="text-purple-600 text-xl">{Math.round((score.correct / score.total) * 100)}%</span>
        </div>
      )}

      {activeQuestions.map((question, idx) => {
        const userAnswer = answers[question.exerciseQuestionId];
        const isUserAnswerCorrect = userAnswer?.isCorrect;

        return (
          <div
            key={question.exerciseQuestionId}
            className={`mb-6 rounded-lg shadow-md p-6 border-2 ${showResults ? (isUserAnswerCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'bg-white'}`}
          >
            <div className="font-semibold mb-2">Question {idx + 1}</div>
            <div className="mb-4">{question.questionText}</div>
            <div className="space-y-3">
              {Array.isArray(question.answerQuestions) && question.answerQuestions.map((option) => {
                const selected = userAnswer?.answerText === option.answerText;
                const isCorrectAnswer = option.isCorrect === true;

                let choiceClass = `w-full p-3 rounded-lg text-left transition-colors border flex items-center justify-between`;

                if (showResults) {
                  if (selected && isUserAnswerCorrect) {
                    choiceClass += ' border-green-500 bg-green-100 text-green-700';
                  } else if (selected && isUserAnswerCorrect === false) {
                    choiceClass += ' border-red-500 bg-red-100 text-red-700';
                  } else if (!selected && isCorrectAnswer) {
                    choiceClass += ' border-green-500 bg-green-50 text-green-700';
                  } else {
                    choiceClass += ' border-gray-200 bg-gray-50 text-gray-900';
                  }
                } else {
                  if (selected) {
                    choiceClass += ' border-blue-500 bg-blue-50 text-blue-700';
                  } else {
                    choiceClass += ' border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100';
                  }
                }

                return (
                  <button
                    key={option.exerciseQuestionId}
                    onClick={() => handleAnswer(question.exerciseQuestionId, option.answerText)}
                    className={choiceClass}
                    disabled={showResults}
                  >
                    <span>{option.answerText}</span>
                    {showResults && selected && (
                      isUserAnswerCorrect
                        ? <FiCheck className="ml-2 text-green-500" />
                        : <FiX className="ml-2 text-red-500" />
                    )}
                    {showResults && !selected && isCorrectAnswer && (
                      <FiCheck className="ml-2 text-green-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {!showResults ? (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={handleDoAgain}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ListeningQuiz;
