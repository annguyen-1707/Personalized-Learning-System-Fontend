import { motion } from 'framer-motion'
import { FiActivity, FiCheckCircle, FiClock } from 'react-icons/fi'

function ExerciseProgress() {
    // Fake exercise data
    const exerciseProgress = {
        totalCompleted: 58,
        byLevel: {
            N5: { total: 100, completed: 40 },
            N4: { total: 80, completed: 18 },
            N3: { total: 150, completed: 0 },
            N2: { total: 200, completed: 0 },
            N1: { total: 200, completed: 0 },
        },
        recentlyCompleted: [
            { title: 'Grammar Practice - N5', timestamp: '2024-03-15T10:30:00Z' },
            { title: 'Vocabulary Quiz - N4', timestamp: '2024-03-15T10:25:00Z' },
            { title: 'Listening Drill - N5', timestamp: '2024-03-15T10:20:00Z' },
        ],
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Exercise Progress</h2>
                <div className="flex items-center text-sm text-primary-600">
                    <FiActivity className="mr-1" />
                    <span>{exerciseProgress.totalCompleted} exercises completed</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Progress by JLPT Level */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Progress by JLPT Level</h3>
                    <div className="space-y-4">
                        {Object.entries(exerciseProgress.byLevel).map(([level, data]) => {
                            const percentage = (data.completed / data.total) * 100

                            return (
                                <div key={level}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">JLPT {level}</span>
                                        <span className="text-sm text-gray-600">
                                            {data.completed}/{data.total} exercises
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-green-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Recently Completed Exercises */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Recently Completed Exercises</h3>
                    <div className="space-y-3">
                        {exerciseProgress.recentlyCompleted.map((ex, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <div className="text-md font-medium text-gray-900">{ex.title}</div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiClock className="mr-1" />
                                    <span>{new Date(ex.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                    <button className="btn btn-primary flex items-center">
                        <FiActivity className="mr-2" />
                        Practice More
                    </button>
                    <button className="btn btn-secondary flex items-center">
                        <FiCheckCircle className="mr-2" />
                        Take Exercise Quiz
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default ExerciseProgress
