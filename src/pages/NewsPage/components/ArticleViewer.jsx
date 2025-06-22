import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiBookmark, FiShare2, FiExternalLink } from 'react-icons/fi'
import NewsImg from './NewsImg';
import axios from 'axios';

// Tạo instance axios
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

function ArticleViewer({ article }) {
  const [showTranslation, setShowTranslation] = useState(false)
  const [showVocab, setShowVocab] = useState(false)
  const [showGrammar, setShowGrammar] = useState(false)
  const [vocabData, setVocabData] = useState([])
  const [grammarData, setGrammarData] = useState([])
  //vocabulary khi showVocab bật
    useEffect(() => {
    console.log('Article selected:', article);
  }, [article]);

  useEffect(() => {
    if (showVocab && article?.id) {
      setVocabData([]); // loading
      api.get(`/content_reading/${article.id}/vocabularies`) 
        .then(res => {
          console.log('Vocab response:', res.data);
          // Hiển thị dữ liệu JSON nhận về để debug
          setVocabData(res.data.data || []);
        })
        .catch(err => {
          console.error('Vocab error:', err);
          setVocabData([]);
        });
    }
  }, [showVocab, article?.id]);

  //grammar khi showGrammar bật
  useEffect(() => {
    if (showGrammar && article?.id) {
      setGrammarData([]); // loading
      api.get(`/content_reading/${article.id}/grammars`) 
        .then(res => {
          console.log('Grammar response:', res.data);
          // Hiển thị dữ liệu JSON nhận về để debug
          setGrammarData(res.data.data || []);
        })
        .catch(err => {
          console.error('Grammar error:', err);
          setGrammarData([]);
        });
    }
  }, [showGrammar, article?.id]);

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

      {/* Translation vẫn giữ nguyên */}
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

      {/* Vocabulary modal */}
      {showVocab && (
        <div className="mt-6 space-y-6">
          {vocabData.length === 0 ? (
            <div>Loading vocabulary...</div>
          ) : vocabData.length > 0 ? (
            vocabData.map((item) => (
              <div key={item.vocabularyId} className="bg-gray-50 rounded-lg p-4">
                <div className="text-lg text-primary-900 mb-2 font-bold">
                  {item.kanji || item.kana || "N/A"}
                </div>
                <div className="text-gray-900 mb-1">
                  Kana: {item.kana || "N/A"}
                </div>
                <div className="text-gray-900 mb-1">
                  Romaji: {item.romaji || "N/A"}
                </div>
                <div className="text-gray-700">
                  Meaning: {item.meaning || "N/A"}
                </div>
                {item.description && (
                  <div className="text-gray-700 mt-1">
                    Description: {item.description}
                  </div>
                )}
                <div className="text-gray-600 mt-2 pt-2 border-t border-gray-200">
                  Example: {item.example || "N/A"}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.jlptLevel && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {item.jlptLevel}
                    </span>
                  )}
                  {item.partOfSpeech && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {item.partOfSpeech.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>No vocabulary found for this article. Add vocabulary in Content Reading Management.</div>
          )}
        </div>
      )}

      {/* Grammar modal */}
      {showGrammar && (
        <div className="mt-6 space-y-6">
          {grammarData.length === 0 ? (
            <div>Loading grammar...</div>
          ) : grammarData.length > 0 ? (
            grammarData.map((item) => (
              <div key={item.grammarId} className="bg-gray-50 rounded-lg p-4">
                <div className="text-lg text-primary-900 mb-2 font-bold">
                  {item.titleJp || "N/A"}
                </div>
                <div className="text-gray-900 mb-1">
                  Structure: {item.structure || "N/A"}
                </div>
                <div className="text-gray-700">
                  Meaning: {item.meaning || "N/A"}
                </div>
                <div className="text-gray-700 mt-1">
                  Usage: {item.usage || "N/A"}
                </div>
                <div className="text-gray-600 mt-2 pt-2 border-t border-gray-200">
                  Example: {item.example || "N/A"}
                </div>
                {item.jlptLevel && (
                  <div className="mt-2 text-sm">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {item.jlptLevel}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No grammar found for this article. Add grammar in Content Reading Management.</div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ArticleViewer