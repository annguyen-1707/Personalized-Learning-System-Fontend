import { useEffect, useState, useMemo } from 'react';
import axios from '../services/customixe-axios';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function QuizPage() {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);
  const [quizDatas, setQuizDatas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();
  const listId = 1;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz/vocabulary-list?id=${listId}`);
        setQuizDatas(response);
        console.log('Quiz data fetched:', response);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);
  const tips = [
    "🧠 Tip: Learning through examples improves memorization!",
    "💡 Hint: Practice speaking along with vocabulary for better retention!",
    "📌 Reminder: Don’t forget to review both Kana and Kanji!",
  ];


  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const currentQuiz = useMemo(() => {
    const validQuestions = (quizDatas || []).filter((q) => !!q.meaning);

    return {
      title: 'Vocabulary Quiz',
      questions: validQuestions.map((item) => {
        const otherMeanings = validQuestions
          .filter((v) => v.vocabularyId !== item.vocabularyId)
          .map((v) => v.kana + " (" + v.kanji + " )");

        const wrongChoices = shuffle(otherMeanings).slice(0, 3);
        const allChoices = shuffle([item.kana + "( " + item.kanji + " )", ...wrongChoices]);

        return {
          ...item,
          questionId: item.vocabularyId,
          questionText: item.quizQuestion || item.word,
          correctAnswer: item.kana + "( " + item.kanji + " )",
          allChoices,
        };
      }),
    };
  }, [quizDatas]);

  const currentQuestion = currentQuiz.questions[currentIndex];
  const selectedAnswer = answers[currentQuestion?.questionId];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const letters = ['A', 'B', 'C', 'D'];

  const getGridColsClass = (num) => {
    if (num === 2) return 'grid-cols-2';
    if (num === 3) return 'grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2'; // mặc định 4 đáp án → 2 cột
  };
  const handleAnswer = (questionId, selectedChoice) => {
    const alreadyCorrect = answers[questionId] === currentQuestion.correctAnswer;
    if (alreadyCorrect) return;

    setAnswers((prev) => ({ ...prev, [questionId]: selectedChoice }));

    if (selectedChoice === currentQuestion.correctAnswer) {
      setTimeout(() => {
        if (currentIndex + 1 < currentQuiz.questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setQuizFinished(true);
        }
      }, 1000);
    } else {
      setForceRerender((prev) => !prev);
    }
  };

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

  if (currentQuiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 rounded">
        Không có đủ dữ liệu để tạo câu hỏi (cần ít nhất 2 từ vựng).
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex justify-center items-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentQuiz.title}</h1>
          <p className="text-base text-gray-600">
            Question: {currentIndex + 1}/{currentQuiz.questions.length}
          </p>
        </div>
      </div>

      {quizFinished ? (
        <div className="text-center space-y-6">
          <p className="text-xl font-semibold text-green-600">🎉 Bạn đã hoàn thành bài quiz!</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => {
                setAnswers({});
                setCurrentIndex(0);
                setQuizFinished(false);
              }}
              className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600"
            >
              Làm lại từ đầu
            </button>
            <button
              onClick={() => navigate('/flashcard')}
              className="px-6 py-3 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600"
            >
              Quay lại Flashcard
            </button>
          </div>
        </div>
      ) : (
        currentQuestion && (
          <div
            className={`bg-white p-6 rounded-2xl shadow-lg space-y-6 text-lg transition-transform duration-150 ${selectedAnswer && !isCorrect ? 'animate-shake' : ''
              }`}
          >
            <h2 className="text-3xl font-bold mb-10 text-gray-900 min-h-[100px]">
              {currentIndex + 1}. {currentQuestion.questionText}
            </h2>

            <div className={`grid gap-5 ${getGridColsClass(currentQuestion.allChoices.length)}`}>

              {currentQuestion.allChoices.map((choice, i) => {
                const wasSelected = selectedAnswer === choice;
                const isAnswerCorrect = choice === currentQuestion.correctAnswer;

                let choiceClass =
                  'border-2 rounded-xl px-6 py-6 text-lg min-h-[90px] cursor-pointer flex items-center justify-between transition-all duration-200 shadow-sm';


                if (selectedAnswer) {
                  if (wasSelected) {
                    choiceClass += isAnswerCorrect
                      ? ' bg-green-100 border-green-500 text-green-700'
                      : ' bg-red-100 border-red-500 text-red-700';
                  } else if (isAnswerCorrect) {
                    choiceClass += ' bg-green-100 border-green-500 text-green-700';
                  } else {
                    choiceClass += ' bg-white border-gray-300 text-gray-800';
                  }
                } else {
                  choiceClass += ' hover:bg-gray-100 border-gray-300 text-gray-800';
                }

                return (
                  <div
                    key={i}
                    className={choiceClass}
                    onClick={() => handleAnswer(currentQuestion.questionId, choice)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold">{letters[i]}.</span>
                      {choice}
                    </span>
                    {selectedAnswer && isAnswerCorrect && <FiCheckCircle className="text-green-600 text-xl" />}
                    {selectedAnswer && wasSelected && !isAnswerCorrect && <FiXCircle className="text-red-600 text-xl" />}
                  </div>
                );
              })}
            </div>

            {!isCorrect && selectedAnswer && (
              <>
                <p className="text-red-600 font-medium mt-4">
                  Wrong answer! Please pick the correct one to proceed.
                </p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-gray-800">
                  <p><strong>Romaji:</strong> {currentQuestion.romaji}</p>
                  <p><strong>Meaning:</strong> {currentQuestion.meaning}</p>
                  <p><strong>Description:</strong> {currentQuestion.description}</p>
                  <p><strong>Example:</strong> {currentQuestion.example}</p>
                  <p><strong>Part of Speech:</strong> {currentQuestion.partOfSpeech}</p>
                </div>
              </>
            )}
          </div>
        )
      )}

      <style>
        {`
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
          }
        `}
      </style>

      <div
        className="fixed left-[calc(50%+120px)] bottom-36 transform -translate-x-1/2 w-[95%] sm:w-[800px] 
             bg-white border border-gray-300 rounded-2xl shadow-lg px-8 py-6 
             text-gray-800 text-lg z-50"
      >        <ul className="space-y-1 text-center">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuizPage;
