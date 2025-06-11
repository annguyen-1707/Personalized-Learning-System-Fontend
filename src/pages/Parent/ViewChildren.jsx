import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiSettings, FiDownload, FiTrendingUp } from 'react-icons/fi'
import LearningProgress from './components/LearningProgress'
import VocabularyProgress from './components/VocabularyProgress'
import GrammarProgress from './components/GrammarProgress'
import StudentInformation from './components/StudentInformation'
import { useNavigate, useParams } from "react-router-dom";
import { getLearningProgressFromAPI, getStudentInfoFromAPI } from '../../services/ParentService'
import ExerciseProgress from './components/ExerciseProgress'

function ViewChildren() {
    const studentId = 1;
    const [activeTab, setActiveTab] = useState('overview')
    const [learningProgress, setLearningProgress] = useState();
    const [studentInfo, setStudentInfo] = useState(null); // State to hold student information
    // Example user data - in a real app, this would come from your backend

    useEffect(() => {
        // Fetch learning progress data when the component mounts
        getLearningProgress();
        getStudentInformation();
    }, []);

    const getLearningProgress = async () => {
        var res = await getLearningProgressFromAPI(studentId);
        console.log("data", res);
        if (res && res.data) {
            setLearningProgress(res.data);
        }
    }

    const getStudentInformation = async () => {
        const res = await getStudentInfoFromAPI(studentId)
        if (res && res.data) {
            setStudentInfo(res.data)
            console.log("Student Info:", res.data)
        }
    }

    const statusColors = {
        NORMAL: "gray",
        ONE_MONTH: "deepskyblue",
        SIX_MONTHS: "gold",
        ONE_YEAR: "mediumorchid" // hoặc "diamond" nếu bạn có custom CSS
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
                        <div className="-mt-16 relative">
                            <img
                                src={
                                    studentInfo?.avatar
                                        ? `http://localhost:8080/images/avatar/${studentInfo.avatar}`
                                        : 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                                }
                                alt="Profile Avatar"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        </div>

                        <div className="mt-6 sm:mt-0 sm:ml-auto text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-gray-600 mb-1">{studentInfo?.fullName}</h2>
                            <span
                                className="inline-block px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm mb-3"
                                style={{ backgroundColor: statusColors[studentInfo?.status] || "gray" }}
                            >
                                {studentInfo?.status}
                            </span>
                            <br />
                            <button
                                onClick={() => handleUpdateAccount(studentInfo?.userId)}
                                className="mt-2 inline-block bg-warning-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded-lg shadow transition duration-200"
                            >
                                Update Account
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
                        </div>
                    )}

                    {activeTab === 'progress' && (
                        <div className="space-y-8">
                            <VocabularyProgress progress={learningProgress} studentId={studentId} />
                            <GrammarProgress progress={learningProgress} studentId={studentId} />
                            <ExerciseProgress progress={learningProgress} studentId={studentId} />
                        </div>
                    )}
                    {activeTab === 'information' && (
                        <div className="space-y-8">
                            <StudentInformation studentId={studentId} />
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

export default ViewChildren