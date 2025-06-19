import { motion } from 'framer-motion'
import { FiClock, FiBookmark } from 'react-icons/fi'

function ArticleList({ articles, selectedArticle, onArticleSelect }) {
  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <motion.button
          key={article.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onArticleSelect(article)}
          className={`w-full text-left p-4 rounded-lg transition-all ${
            selectedArticle?.id === article.id
              ? 'bg-primary-50 border-2 border-primary-500'
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start">
            <img
              src={article.image}
              alt={article.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className={`font-medium ${
                selectedArticle?.id === article.id
                  ? 'text-primary-900'
                  : 'text-gray-900'
              }`}>
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiClock className="mr-1" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{article.category}</span>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default ArticleList