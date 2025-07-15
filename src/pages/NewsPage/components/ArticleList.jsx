import { motion } from "framer-motion";
import { FiCheck, FiClock } from "react-icons/fi";
import NewsImg from "./NewsImg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Import useAuth from your context

function ArticleList({
  articles,
  selectedArticle,
  onArticleSelect,
  completedArticles,
}) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  const handleArticleClick = (article) => {
    // Check if user is logged in using the auth context
    if (!user) {
      // Save the intended destination for after login
      localStorage.setItem("redirectAfterLogin", `/news/detail/${article.id}`);

      // Redirect to login page if not authenticated
      navigate("/login", {
        state: {
          from: "/news",
          message: "Please log in to read articles",
        },
      });
    } else {
      // User is logged in, show the article
      onArticleSelect(article);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No articles found. Try changing your search or filter criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => {
        const isCompleted = completedArticles?.includes(article.contentId);
        return (
          <motion.button
            key={article.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleArticleClick(article)}
            className={`relative w-full text-left p-4 rounded-xl border transition-all shadow-sm ${
              isCompleted
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-white hover:shadow-md"
            }`}
          >
            {/* Huy hiệu "Completed" */}
            {isCompleted && (
              <div className="absolute top-1 right-1 flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm animate-fade-in z-10">
                <FiCheck className="text-green-600 w-4 h-4" />
                <span>Completed</span>
              </div>
            )}

            <div className="flex items-start mt-1">
              {/* Ảnh bài viết */}
              <NewsImg image={article.image} title={article.title} />

              {/* Nội dung bài viết */}
              <div className="ml-4 flex-1 pr-10">
                <h3
                  className={`font-semibold ${
                    isCompleted ? "text-green-700" : "text-gray-900"
                  } ${selectedArticle?.id === article.id ? "underline" : ""}`}
                >
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
        );
      })}
    </div>
  );
}

export default ArticleList;
