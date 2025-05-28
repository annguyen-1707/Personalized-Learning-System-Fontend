import { motion } from 'framer-motion'
import { FiBook, FiCheckCircle, FiClock } from 'react-icons/fi'

function VocabularyProgress() {
  // Example vocabulary progress data - in a real app, this would come from your backend
  const vocabularyProgress = {
    totalWords: 487,
    byLevel: {
      N5: { total: 800, learned: 350 },
      N4: { total: 700, learned: 137 },
      N3: { total: 1500, learned: 0 },
      N2: { total: 2000, learned: 0 },
      N1: { total: 2000, learned: 0 },
    },
    recentlyLearned: [
      { word: '食べる', reading: 'たべる', meaning: 'to eat', timestamp: '2024-03-15T10:30:00Z' },
      { word: '飲む', reading: 'のむ', meaning: 'to drink', timestamp: '2024-03-15T10:25:00Z' },
      { word: '行く', reading: 'いく', meaning: 'to go', timestamp: '2024-03-15T10:20:00Z' },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Vocabulary Progress</h2>
        <div className="flex items-center text-sm text-primary-600">
          <FiBook className="mr-1" />
          <span>{vocabularyProgress.totalWords} words learned</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress by JLPT Level */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Progress by JLPT Level</h3>
          <div className="space-y-4">
            {Object.entries(vocabularyProgress.byLevel).map(([level, data]) => {
              const percentage = (data.learned / data.total) * 100
              
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">JLPT {level}</span>
                    <span className="text-sm text-gray-600">
                      {data.learned}/{data.total} words
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recently Learned Words */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recently Learned Words</h3>
          <div className="space-y-3">
            {vocabularyProgress.recentlyLearned.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-900">{word.word}</span>
                    <span className="ml-2 text-sm text-gray-600">{word.reading}</span>
                  </div>
                  <div className="text-sm text-gray-600">{word.meaning}</div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-1" />
                  <span>{new Date(word.timestamp).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <button className="btn btn-primary flex items-center">
            <FiBook className="mr-2" />
            Review Vocabulary
          </button>
          <button className="btn btn-secondary flex items-center">
            <FiCheckCircle className="mr-2" />
            Take Vocabulary Quiz
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default VocabularyProgress