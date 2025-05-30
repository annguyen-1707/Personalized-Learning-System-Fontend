import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi'

function StudyStreak({ streak }) {
  // Generate last 7 days of study data
  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  // Example study data - in a real app, this would come from your backend
  const studyData = {
    '2024-03-15': 45, // minutes
    '2024-03-14': 30,
    '2024-03-13': 60,
    '2024-03-12': 25,
    '2024-03-11': 40,
    '2024-03-10': 0, // missed day
    '2024-03-09': 35,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Study Streak</h2>
        <div className="flex items-center text-sm text-primary-600">
          <FiTrendingUp className="mr-1" />
          <span>{streak.current} days</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{streak.current}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-500">{streak.longest}</div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-success-500">
            {Object.values(studyData).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Minutes</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Last 7 Days</span>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>Minutes studied</span>
          </div>
        </div>

        <div className="space-y-2">
          {last7Days.map((date) => {
            const minutes = studyData[date] || 0
            const percentage = Math.min((minutes / 60) * 100, 100) // Max 100%
            
            return (
              <div key={date} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        minutes > 0 ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-gray-600">
                  {minutes}m
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <FiCalendar className="mr-1" />
            <span>Last studied: {new Date(streak.lastStudied).toLocaleDateString()}</span>
          </div>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View Full History
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default StudyStreak