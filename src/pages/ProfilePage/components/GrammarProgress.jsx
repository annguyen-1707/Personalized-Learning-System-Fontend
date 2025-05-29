import { motion } from 'framer-motion'
import { FiBook, FiCheckCircle, FiClock } from 'react-icons/fi'

function GrammarProgress() {
  // Example grammar progress data - in a real app, this would come from your backend
  const grammarProgress = {
    totalPoints: 64,
    byLevel: {
      N5: { total: 50, learned: 35 },
      N4: { total: 75, learned: 29 },
      N3: { total: 100, learned: 0 },
      N2: { total: 150, learned: 0 },
      N1: { total: 200, learned: 0 },
    },
    recentlyLearned: [
      {
        pattern: '〜てください',
        meaning: 'Please do ~',
        example: '本を読んでください。',
        timestamp: '2024-03-15T11:30:00Z',
      },
      {
        pattern: '〜たいです',
        meaning: 'Want to ~',
        example: '日本に行きたいです。',
        timestamp: '2024-03-15T11:25:00Z',
      },
      {
        pattern: '〜ています',
        meaning: 'Is doing ~',
        example: '今、勉強しています。',
        timestamp: '2024-03-15T11:20:00Z',
      },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Grammar Progress</h2>
        <div className="flex items-center text-sm text-primary-600">
          <FiBook className="mr-1" />
          <span>{grammarProgress.totalPoints} points mastered</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress by JLPT Level */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Progress by JLPT Level</h3>
          <div className="space-y-4">
            {Object.entries(grammarProgress.byLevel).map(([level, data]) => {
              const percentage = (data.learned / data.total) * 100
              
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">JLPT {level}</span>
                    <span className="text-sm text-gray-600">
                      {data.learned}/{data.total} points
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-accent-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recently Learned Grammar */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recently Learned Grammar</h3>
          <div className="space-y-3">
            {grammarProgress.recentlyLearned.map((grammar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium text-gray-900">{grammar.pattern}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" />
                    <span>{new Date(grammar.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{grammar.meaning}</div>
                <div className="text-sm text-primary-600">{grammar.example}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <button className="btn btn-primary flex items-center">
            <FiBook className="mr-2" />
            Review Grammar
          </button>
          <button className="btn btn-secondary flex items-center">
            <FiCheckCircle className="mr-2" />
            Take Grammar Quiz
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default GrammarProgress