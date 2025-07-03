import { useEffect, useState, useMemo } from 'react';
import axios from '../services/customixe-axios';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TypingEffect from './TypeEffec';

function QuizPage() {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);
  const [quizDatas, setQuizDatas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "vocabulary";
  const favoriteListId = searchParams.get("favoriteListId");

  const listId = 3;

  useEffect(() => {
    setLoading(true);
    const fetchQuiz = async () => {
      const api = "vocabulary" === type ? '/api/quiz/vocabulary-list' : '/api/quiz/grammar-list';
      try {
        const response = await axios.get(`${api}?id=${listId}`);
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
    if (!quizDatas) return { title: '', questions: [] };

    // Nếu là VOCABULARY
    if (type === 'vocabulary') {
      const validQuestions = quizDatas.filter((q) => !!q.meaning);

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
    }

    // Nếu là GRAMMAR
    if (type === 'grammar') {
      const validQuestions = quizDatas.filter((q) => !!q.meaning);

      return {
        title: 'Grammar Quiz',
        questions: validQuestions.map((item) => {
          const otherStructures = validQuestions
            .filter((v) => v.grammarId !== item.grammarId)
            .map((v) => v.structure);

          const wrongChoices = shuffle(otherStructures).slice(0, 3);
          const allChoices = shuffle([item.structure, ...wrongChoices]);

          return {
            ...item,
            questionId: item.grammarId,
            questionText: item.quizQuestion || item.titleJp,
            correctAnswer: item.structure,
            allChoices,
          };
        }),
      };
    }

    return { title: '', questions: [] };
  }, [quizDatas, type]);

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

 if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <h2 className="text-2xl font-semibold text-indigo-600">Generating AI-Powered Quiz...</h2>
      <TypingEffect text="🧠 Thinking... Finding best questions for your practice..." />
    </div>
  );
}

  if (currentQuiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 rounded">
        Not enough data to generate questions (at least 2 vocabulary items are required).
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex justify-center items-center text-center">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">{currentQuiz.title}</h1>
          <p className="text-base text-gray-600">
            Question: {currentIndex + 1}/{currentQuiz.questions.length}
          </p>
        </div>
      </div>

      {quizFinished ? (
        <div className="text-center space-y-6">
          <p className="text-xl font-semibold text-green-600">🎉 You have finished quizes!!!</p>
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
              onClick={() => navigate('/favorites/' + favoriteListId)}
              className="px-6 py-3 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600"
            >
              Go back 
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
                  choiceClass += ' hover:scale-105 hover:shadow-md transition-transform duration-300 ease-in-out';
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
                  {type === 'vocabulary' ? (
                    <>
                      <p><strong>Romaji:</strong> {currentQuestion.romaji}</p>
                      <p><strong>Meaning:</strong> {currentQuestion.meaning}</p>
                      <p><strong>Description:</strong> {currentQuestion.description}</p>
                      <p><strong>Example:</strong> {currentQuestion.example}</p>
                      <p><strong>Part of Speech:</strong> {currentQuestion.partOfSpeech}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Structure:</strong> {currentQuestion.structure}</p>
                      <p><strong>Meaning:</strong> {currentQuestion.meaning}</p>
                      <p><strong>Usage:</strong> {currentQuestion.usage}</p>
                      <p><strong>Example:</strong> {currentQuestion.example}</p>
                      <p><strong>JLPT Level:</strong> {currentQuestion.jlptLevel}</p>
                    </>
                  )}
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
        className="mt-10 mx-auto w-[95%] sm:w-[800px]
             bg-white border border-gray-300 rounded-2xl shadow-lg px-8 py-6 
             text-gray-800 text-lg text-center"
      >
        <ul className="space-y-1">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuizPage;
