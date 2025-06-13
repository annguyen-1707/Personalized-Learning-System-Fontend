import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'

function ListeningQuiz({ questions, currentTime }) {
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  
  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    })
  }
  
  const handleSubmit = () => {
    setShowResults(true)
  }
  
  const getCorrectAnswers = () => {
    return questions.filter(q => answers[q.id] === q.correctAnswer).length
  }
  
  // Filter questions based on current audio time
  const activeQuestions = questions.filter(q => 
    currentTime >= q.startTime && currentTime <= q.endTime
  )

  return (
    <div className="space-y-8">
      {showResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {getCorrectAnswers()}/{questions.length}
            </div>
            <div className="text-gray-600">
              {getCorrectAnswers() === questions.length
                ? "Perfect! You've mastered this listening exercise."
                : "Keep practicing to improve your listening skills!"}
            </div>
          </div>
          
          <div className="space-y-6">
            {questions.map((question) => {
              const isCorrect = answers[question.id] === question.correctAnswer
              
              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg overflow-hidden ${
                    isCorrect ? 'border-success-500' : 'border-error-500'
                  }`}
                >
                  <div className={`p-4 ${
                    isCorrect ? 'bg-success-50' : 'bg-error-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Question {question.id}</h3>
                      <div className={`flex items-center ${
                        isCorrect ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {isCorrect ? (
                          <>
                            <FiCheck className="mr-1" />
                            <span>Correct</span>
                          </>
                        ) : (
                          <>
                            <FiX className="mr-1" />
                            <span>Incorrect</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-800 mb-4">{question.text}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option}
                          className={`p-3 rounded-lg ${
                            option === question.correctAnswer
                              ? 'bg-success-100 border border-success-500'
                              : option === answers[question.id]
                                ? 'bg-error-100 border border-error-500'
                                : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    {!isCorrect && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <div className="font-medium">Explanation:</div>
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowResults(false)}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {activeQuestions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Question {question.id}
              </h3>
              
              <p className="text-gray-800 mb-6">{question.text}</p>
              
              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      answers[question.id] === option
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          
          {Object.keys(answers).length === questions.length && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Submit Answers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ListeningQuiz