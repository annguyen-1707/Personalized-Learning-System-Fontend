import { motion } from 'framer-motion'
import { FiClock, FiBookmark, FiShare2, FiExternalLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function ArticleViewer({ article }) {
  const [showTranslation, setShowTranslation] = useState(false)
  if (!article) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select an article to read
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <FiClock className="mr-1" />
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{article.category}</span>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100">
            <FiBookmark className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100">
            <FiShare2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
        <h2 className="text-lg text-primary-600 mt-2">{article.titleJapanese}</h2>
      </div>
      
      <div className="prose max-w-none">
        {article.content.map((section, index) => (
          <div key={index} className="mb-6">
            <p className="text-gray-900 mb-2">{section.japanese}</p>
            {!showTranslation && <p className="text-gray-600 text-sm">Click 'View Translation' to see translation.</p>}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          className="btn btn-primary flex items-center"
          onClick={() => setShowTranslation(v => !v)}
        >
          {showTranslation ? 'Hide Translation' : 'View Translation'}
          <FiExternalLink className="ml-2" />
        </button>
        
        <div className="flex items-center text-sm text-gray-500">
          <span>Reading time: {article.readingTime} min</span>
        </div>
      </div>
      
      {showTranslation && (
        <div className="mt-6 space-y-6">
          {article.content.map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="text-lg text-primary-900 mb-2 font-bold">{section.japanese}</div>
              <div className="text-gray-900 mb-1">{section.japanese}</div>
              <div className="text-gray-700">{section.english}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ArticleViewer