import { motion } from 'framer-motion'
import { FiAward, FiStar, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi'

function AchievementsList() {
  const achievements = [
    {
      id: 1,
      title: 'Vocabulary Master',
      description: 'Learn 500 words',
      progress: 487,
      target: 500,
      icon: FiBook,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      id: 2,
      title: 'Grammar Expert',
      description: 'Complete all N5 grammar lessons',
      progress: 18,
      target: 25,
      icon: FiTarget,
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
    },
    {
      id: 3,
      title: 'Perfect Streak',
      description: 'Maintain a 30-day study streak',
      progress: 15,
      target: 30,
      icon: FiZap,
      color: 'text-warning-500',
      bgColor: 'bg-warning-100',
    },
    {
      id: 4,
      title: 'Quiz Champion',
      description: 'Score 100% on 10 quizzes',
      progress: 7,
      target: 10,
      icon: FiStar,
      color: 'text-success-500',
      bgColor: 'bg-success-100',
    },
    {
      id: 5,
      title: 'Conversation Master',
      description: 'Complete 50 AI conversations',
      progress: 32,
      target: 50,
      icon: FiTrendingUp,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Achievements</h2>
        <div className="flex items-center text-sm text-gray-600">
          <FiAward className="mr-2" />
          <span>5/20 Unlocked</span>
        </div>
      </div>

      <div className="space-y-6">
        {achievements.map((achievement) => {
          const progressPercentage = (achievement.progress / achievement.target) * 100
          const Icon = achievement.icon

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className={`flex-shrink-0 w-12 h-12 ${achievement.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${achievement.color}`} />
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900">{achievement.title}</h3>
                  <span className="text-sm text-gray-600">
                    {achievement.progress}/{achievement.target}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      progressPercentage >= 100 ? 'bg-success-500' : achievement.color.replace('text', 'bg')
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default AchievementsList