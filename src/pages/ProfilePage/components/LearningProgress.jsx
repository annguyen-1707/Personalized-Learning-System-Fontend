import { motion } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function LearningProgress({ progress }) {
  console.log('LearningProgress component rendered with progress:', progress)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-lg font-medium text-gray-900 mb-6">Learning Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <CircularProgressbar
              value={(progress?.totalVocabularyLearn / progress?.totalVocabularyAllSubject) * 100}
              text={`${(progress?.totalVocabularyLearn / progress?.totalVocabularyAllSubject) * 100}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: '#3E64FF',
                textColor: '#3E64FF',
                trailColor: '#E0E7FF',
              })}
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900">Vocabulary</h3>
          <p className="text-sm text-gray-500">{progress?.totalVocabularyLearn} / {progress?.totalVocabularyAllSubject} words learned</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <CircularProgressbar
              value={progress}
              text={`${(progress?.totalGrammarLearn / progress?.totalGrammarAllSubject) * 100}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: '#FF9F43',
                textColor: '#FF9F43',
                trailColor: '#FFF1E0',
              })}
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900">Grammar</h3>
          <p className="text-sm text-gray-500">{progress?.totalGrammarLearn} / {progress?.totalGrammarAllSubject} points mastered</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <CircularProgressbar
              value={progress}
              text={`${(progress?.exerciseCompleted / progress?.exerciseAllSubject) * 100}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: '#38A169',
                textColor: '#38A169',
                trailColor: '#C6F6D5',
              })}
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900">Exercises</h3>
          <p className="text-sm text-gray-500">{progress?.exerciseCompleted} / {progress?.exerciseAllSubject} quizzes completed</p>
        </div>
      </div>
    </motion.div>
  )
}

export default LearningProgress