import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiBookmark, FiShare2, FiExternalLink } from 'react-icons/fi'
import NewsImg from './NewsImg';

function ArticleViewer({ article }) {
  const [showTranslation, setShowTranslation] = useState(false)
  const [showVocab, setShowVocab] = useState(false)
  const [showGrammar, setShowGrammar] = useState(false)

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
      <NewsImg
        image={article.image}
        title={article.title}
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

      <div className="flex flex-wrap gap-2 justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            className="btn btn-primary flex items-center"
            onClick={() => setShowTranslation(v => !v)}
          >
            {showTranslation ? 'Hide Translation' : 'View Translation'}
            <FiExternalLink className="ml-2" />
          </button>
          <button
            className="btn btn-primary flex items-center"
            onClick={() => setShowVocab(v => !v)}
          >
            {showVocab ? 'Hide Vocabulary' : 'View Vocabulary'}
            <FiExternalLink className="ml-2" />
          </button>
          <button
            className="btn btn-primary flex items-center"
            onClick={() => setShowGrammar(v => !v)}
          >
            {showGrammar ? 'Hide Grammar' : 'View Grammar'}
            <FiExternalLink className="ml-2" />
          </button>
        </div>
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

      {showVocab && article.vocabulary && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Vocabulary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.vocabulary.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="text-lg font-medium text-primary-600">{item.word}</div>
                <div className="text-sm text-gray-500">{item.reading}</div>
                <div className="text-gray-700 mt-1">{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showGrammar && article.grammar && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grammar Points</h3>
          <div className="space-y-4">
            {article.grammar.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
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
      )}
    </motion.div>
  )
}

export default ArticleViewer