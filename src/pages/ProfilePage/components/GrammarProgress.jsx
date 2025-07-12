import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import { FiBook, FiCheckCircle, FiChevronDown, FiClock } from 'react-icons/fi'
import { getProgressGrammarFromAPI } from '../../../services/ProfileService';

function GrammarProgress({ progress }) {
  // Example grammar progress data - in a real app, this would come from your backend
  const [grammarProgresses, setGrammarProgress] = useState({});
  const [displayLimit, setDisplayLimit] = useState(3); // Mặc định hiển thị 3 từ

  useEffect(() => {
    getGrammarProgress();
  }, []);

  const getGrammarProgress = async () => {
    var res = await getProgressGrammarFromAPI();
    if (res && res.data) {
      setGrammarProgress(res.data);
    }
  }

  const toggleDisplayLimit = () => {
    // Nếu đang hiển thị 3 từ, chuyển sang hiển thị tất cả; nếu không, quay lại 3 từ
    setDisplayLimit(displayLimit === 3 ? grammarProgresses.recentlyLearnGrammarResponses.length : 3);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };


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

          <span>{progress?.totalGrammarLearn} grammar learned</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Progress by Subject</h3>
          <div className="space-y-4">
            {Array.isArray(grammarProgresses.countLearnBySubjectResponses) &&
              grammarProgresses.countLearnBySubjectResponses.length > 0 ? (
              grammarProgresses.countLearnBySubjectResponses.map(({ subject, countLearn, countAll, subjectId }) => {
                return (
                  <div key={subjectId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Subject {subject}</span>
                      <span className="text-sm text-gray-600">
                        {countLearn}/{countAll} words                    </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-accent-500"
                        style={{ width: `${Math.floor((countLearn / countAll) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">No progress data available</p>
            )}
          </div>
        </div>

        {/* Recently Learned Words */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recently Learned Words</h3>
          <div className="space-y-3">
            {Array.isArray(grammarProgresses.recentlyLearnGrammarResponses) && grammarProgresses.recentlyLearnGrammarResponses.length > 0 ? (
              <>
                {grammarProgresses.recentlyLearnGrammarResponses.slice(0, displayLimit).map(({ grammar, progressStatus, reviewedAt }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-gray-900">{grammar.titleJp}</span>
                        <span className="ml-2 text-sm text-gray-600">{grammar.structure}</span>
                      </div>

                      <div className="text-sm text-gray-600">{grammar.meaning}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      <span>{new Date(reviewedAt).toLocaleTimeString()}</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(progressStatus)}`}
                      >
                        {progressStatus}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {grammarProgresses.recentlyLearnGrammarResponses.length > 3 && (
                  <button
                    onClick={toggleDisplayLimit}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                  >
                    <FiChevronDown
                      className={`mr-1 transition-transform ${displayLimit !== 3 ? 'rotate-180' : ''}`}
                    />
                    {displayLimit === 3 ? 'Show all' : 'Show less'}
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center">No recently learned grammar</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          {/* <button className="btn btn-primary flex items-center">
            <FiBook className="mr-2" />
            Review Grammar
          </button> */}
          {/* <button className="btn btn-secondary flex items-center">
            <FiCheckCircle className="mr-2" />
            Take Grammar Quiz
          </button> */}
        </div>
      </div>
    </motion.div >
  )
}

export default GrammarProgress