import { motion } from 'framer-motion'
import { FiClock, FiBookmark } from 'react-icons/fi'
import NewsImg from './NewsImg'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth from your context

function ArticleList({ articles, selectedArticle, onArticleSelect }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  const handleArticleClick = (article) => {
    // Check if user is logged in using the auth context
    console.log("List article:", articles);
    if (!user) {

      // Save the intended destination for after login
      localStorage.setItem("redirectAfterLogin", `/news/detail/${article.id}`);
      
      // Redirect to login page if not authenticated
      navigate('/login', { 
        state: { 
          from: '/news', 
          message: 'Please log in to read articles' 
        } 
      });
    } else {
      // User is logged in, show the article
      onArticleSelect(article);
    }
  };

  return (
    <div className="space-y-4">
      {articles.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No articles found</div>
      ) : (
        articles.map((article, index) => (
          <motion.button
            key={article.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleArticleClick(article)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              selectedArticle?.id === article.id
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start">
              <NewsImg
                image={article.image}
                title={article.title}
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
        ))
      )}
    </div>
  )
}

export default ArticleList