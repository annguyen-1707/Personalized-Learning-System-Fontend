import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiSettings, FiDownload, FiTrendingUp } from 'react-icons/fi'
import LearningProgress from './components/LearningProgress'
import AchievementsList from './components/AchievementsList'
import StudyStreak from './components/StudyStreak'
import VocabularyProgress from './components/VocabularyProgress'
import GrammarProgress from './components/GrammarProgress'
import StudyReminders from './components/StudyReminders'
import MyList from './components/MyList'
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate();
  // Example user data - in a real app, this would come from your backend
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    level: 'Intermediate',
    joinDate: '2024-01-15',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    progress: {
      vocabulary: 65,
      grammar: 45,
      exercises: 78,
    },
    streak: {
      current: 15,
      longest: 30,
      lastStudied: '2024-03-15',
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
      >
        <div className="bg-primary-500 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="-mt-16 relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-primary-500">
                <FiEdit2 className="h-5 w-5" />
              </button>
            </div>
                <div className="mt-6 sm:mt-0 sm:ml-auto">
              <button
                className="btn btn-secondary flex items-center"
                onClick={() => navigate("/profile/edit")}
              >
                <FiSettings className="mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'progress'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achievements'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('mylist')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mylist'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My List
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <LearningProgress progress={user.progress} />
              <StudyStreak streak={user.streak} />
              <StudyReminders />
            </div>
          )}
          
          {activeTab === 'progress' && (
            <div className="space-y-8">
              <VocabularyProgress />
              <GrammarProgress />
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <AchievementsList />
          )}
          
          {activeTab === 'mylist' && (
            <MyList />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words Learned</span>
                <span className="font-medium text-gray-900">487</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grammar Points</span>
                <span className="font-medium text-gray-900">64</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quizzes Completed</span>
                <span className="font-medium text-gray-900">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Study Hours</span>
                <span className="font-medium text-gray-900">45.5</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <FiTrendingUp className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Completed N5 Grammar Lesson</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                    <FiDownload className="h-4 w-4 text-success-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Added 20 new vocabulary words</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage