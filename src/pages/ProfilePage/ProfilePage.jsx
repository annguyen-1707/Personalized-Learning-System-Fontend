import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiSettings, FiDownload, FiTrendingUp } from 'react-icons/fi'
import LearningProgress from './components/LearningProgress'
import VocabularyProgress from './components/VocabularyProgress'
import GrammarProgress from './components/GrammarProgress'
import StudentInformation from './components/StudentInformation'
import { useNavigate } from "react-router-dom";
import { getLearningProgressFromAPI, getStudentInfoFromAPI, handleAvatarUploadFromAPI } from '../../services/ProfileService'
import ExerciseProgress from './components/ExerciseProgress'
import StudyReminders from './components/StudyReminders'

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate();
  const [learningProgress, setLearningProgress] = useState();
  const [studentInfo, setStudentInfo] = useState({}); // State to hold student information
  // Example user data - in a real app, this would come from your backend

  useEffect(() => {
    // Fetch learning progress data when the component mounts
    getLearningProgress();
    getStudentInformation();
  }, []);

  const getLearningProgress = async () => {
    var res = await getLearningProgressFromAPI();
    console.log("data", res);
    if (res && res.data) {
      setLearningProgress(res.data);
    }
  }

  const getStudentInformation = async () => {
    var res = await getStudentInfoFromAPI();
    console.log("Student Info:", res);
    if (res && res.data) {
      setStudentInfo(res.data);
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await handleAvatarUploadFromAPI(file); // cần await
      const newAvatarUrl = response?.data;

      if (newAvatarUrl) {
        setStudentInfo((prev) => ({ ...prev, avatar: newAvatarUrl }));
      } else {
        alert("Không nhận được URL ảnh mới.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Lỗi khi upload ảnh.");
    }
  };

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
            <div className="-mt-16 relative group">
              <img
                src={
                  studentInfo?.avatar
                    ? `http://localhost:8080/images/avatar/${studentInfo.avatar}`
                    : 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                }
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
                onClick={() => document.getElementById('avatarUpload').click()}
              />
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-primary-500"
                onClick={() => document.getElementById('avatarUpload').click()}
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
            </div>
             <div className="mt-10 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{studentInfo.fullName}</h1>
              <p className="text-gray-600">Level: {studentInfo.membershipLevel}  </p>
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
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('information')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'information'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Information
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <LearningProgress progress={learningProgress} />
              <StudyReminders />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              <VocabularyProgress progress={learningProgress} />
              <GrammarProgress progress={learningProgress} />
              <ExerciseProgress progress={learningProgress} />
            </div>
          )}
          {activeTab === 'information' && (
            <div className="space-y-8">
              <StudentInformation />
            </div>
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
                <span className="font-medium text-gray-900">{learningProgress?.totalVocabularyLearn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grammar Points</span>
                <span className="font-medium text-gray-900">{learningProgress?.totalGrammarLearn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quizzes Completed</span>
                <span className="font-medium text-gray-900">{learningProgress?.exerciseCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Percentage Complete</span>
                <span className="font-medium text-gray-900">{Math.floor((learningProgress?.totalVocabularyLearn + learningProgress?.totalGrammarLearn + learningProgress?.exerciseCompleted)
                  / (learningProgress?.totalVocabularyAllSubject + learningProgress?.totalGrammarAllSubject + learningProgress?.exerciseAllSubject) * 100)}% </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage