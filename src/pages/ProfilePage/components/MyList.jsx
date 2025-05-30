import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiVolume2, FiStar, FiTrash2 } from 'react-icons/fi'

function MyList() {
  const [activeTab, setActiveTab] = useState('vocabulary')
  
  // Example saved items - in a real app, this would come from your backend
  const savedItems = {
    vocabulary: [
      {
        id: 1,
        japanese: '食べる',
        reading: 'たべる',
        meaning: 'to eat',
        type: 'verb',
        example: {
          japanese: '私は寿司を食べます。',
          english: 'I eat sushi.',
        },
        dateAdded: '2024-03-15T10:30:00Z',
      },
      {
        id: 2,
        japanese: '学校',
        reading: 'がっこう',
        meaning: 'school',
        type: 'noun',
        example: {
          japanese: '私は学校に行きます。',
          english: 'I go to school.',
        },
        dateAdded: '2024-03-14T15:45:00Z',
      },
    ],
    grammar: [
      {
        id: 1,
        pattern: '〜てください',
        meaning: 'Please do ~',
        level: 'N5',
        example: {
          japanese: '本を読んでください。',
          english: 'Please read the book.',
        },
        dateAdded: '2024-03-15T11:30:00Z',
      },
      {
        id: 2,
        pattern: '〜たいです',
        meaning: 'Want to ~',
        level: 'N5',
        example: {
          japanese: '日本に行きたいです。',
          english: 'I want to go to Japan.',
        },
        dateAdded: '2024-03-14T16:20:00Z',
      },
    ],
  }

  const removeItem = (id, type) => {
    // Implement remove functionality
    console.log(`Removing ${type} item with id: ${id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'vocabulary'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'grammar'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Grammar
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'vocabulary' && (
          <div className="space-y-4">
            {savedItems.vocabulary.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-xl font-medium text-gray-900">
                        {item.japanese}
                      </span>
                      <button className="ml-2 p-1 text-gray-400 hover:text-primary-500">
                        <FiVolume2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">{item.reading}</div>
                    <div className="text-gray-700 mt-1">{item.meaning}</div>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id, 'vocabulary')}
                    className="p-1 text-gray-400 hover:text-error-500"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                
                {item.example && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <div className="text-primary-600">{item.example.japanese}</div>
                    <div className="text-gray-600">{item.example.english}</div>
                  </div>
                )}
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Added {new Date(item.dateAdded).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {item.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="space-y-4">
            {savedItems.grammar.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl font-medium text-gray-900">
                      {item.pattern}
                    </div>
                    <div className="text-gray-700 mt-1">{item.meaning}</div>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id, 'grammar')}
                    className="p-1 text-gray-400 hover:text-error-500"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                
                {item.example && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <div className="text-primary-600">{item.example.japanese}</div>
                    <div className="text-gray-600">{item.example.english}</div>
                  </div>
                )}
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Added {new Date(item.dateAdded).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded-full">
                    {item.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {((activeTab === 'vocabulary' && savedItems.vocabulary.length === 0) ||
          (activeTab === 'grammar' && savedItems.grammar.length === 0)) && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No saved {activeTab} items. Add some items to your list!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MyList