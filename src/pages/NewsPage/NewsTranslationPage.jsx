import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiBookmark, FiShare2 } from 'react-icons/fi'

function NewsTranslationPage() {
  const { id } = useParams()
  const location = useLocation()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    if (location.state && location.state.article) {
      setArticle(location.state.article)
    } else {
      // fallback: fetch by id if needed
      setArticle(null)
    }
  }, [id, location.state])

  if (!article) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link to="/news" className="text-primary-600 hover:text-primary-700 flex items-center">
          <FiArrowLeft className="mr-2" />
          Back to News
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {new Date(article.date).toLocaleDateString()} • {article.category}
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
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h1>
          <h2 className="text-xl text-primary-600 mb-6">{article.titleJapanese}</h2>
          
          <div className="space-y-8">
            {/* Article content with translations */}
            <div className="space-y-6">
              {article.content.map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg text-primary-900 mb-2 font-bold">{section.japanese}</div>
                  <div className="text-gray-700">{section.english}</div>
                </div>
              ))}
            </div>
            
            {/* Vocabulary section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Vocabulary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.vocabulary.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-lg font-medium text-primary-600">{item.word}</div>
                    <div className="text-sm text-gray-500">{item.reading}</div>
                    <div className="text-gray-700 mt-1">{item.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Grammar section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Grammar Points</h3>
              <div className="space-y-4">
                {article.grammar.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-lg font-medium text-primary-600 mb-2">
                      {item.pattern}
                    </div>
                    <div className="text-gray-700 mb-2">{item.usage}</div>
                    <div className="bg-white rounded p-3">
                      <div className="text-primary-600">{item.example.japanese}</div>
                      <div className="text-gray-600 text-sm">{item.example.english}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NewsTranslationPage