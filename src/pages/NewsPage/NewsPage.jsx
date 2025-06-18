import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiRss } from 'react-icons/fi'
import { getPageContentReading } from '../../services/ContentReadingService'
import ArticleList from './components/ArticleList'
import ArticleViewer from './components/ArticleViewer'
import axios from 'axios'

function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      setError(null)
      try {
        const res = await getPageContentReading(1, 20)
        const mapped = res.data.content.map(item => ({
          id: item.id,
          title: item.title,
          titleJapanese: item.scriptJp,
          excerpt: item.scriptVn?.slice(0, 60) + '...',
          image: item.image,
          date: item.timeNew || item.createdAt,
          category: item.category ,
          readingTime: 5, // You can calculate or get from backend
          content: [
            {
              japanese: item.scriptJp,
              english: item.scriptVn
            }
          ]
        }))
        setArticles(mapped)
      } catch (err) {
        setError('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'science', name: 'Science' },
    { id: 'health', name: 'Health' },
    { id: 'education', name: 'Education' },
    { id: 'business', name: 'Business' },
    { id: 'environment', name: 'Environment' },
    { id: 'politics', name: 'Politics' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'travel', name: 'Travel' }
  ]
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.titleJapanese.includes(searchTerm)
    const matchesCategory = selectedCategory === 'all' || 
      article.category.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Japanese News</h1>
          <p className="mt-1 text-gray-600">
            Practice reading with current news articles
          </p>
        </motion.div>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading articles...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <ArticleList
            articles={filteredArticles}
            selectedArticle={selectedArticle}
            onArticleSelect={setSelectedArticle}
          />
        </div>
        {/* Article viewer */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ArticleViewer article={selectedArticle} />
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default NewsPage