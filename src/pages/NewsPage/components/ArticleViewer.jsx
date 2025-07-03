import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiBookmark, FiShare2, FiExternalLink, FiCheck } from 'react-icons/fi'
import NewsImg from './NewsImg';
import axios from '../../../services/customixe-axios';
import NewsAudio from './NewsAudio';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';



function ArticleViewer({ article }) {
  // Add user from auth context
  const { user } = useAuth();

  const [showTranslation, setShowTranslation] = useState(false)
  const [showVocab, setShowVocab] = useState(false)
  const [showGrammar, setShowGrammar] = useState(false)
  const [vocabData, setVocabData] = useState([])
  const [grammarData, setGrammarData] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isMarking, setIsMarking] = useState(false)

  useEffect(() => {
    if (article) {
      console.log('Article selected:', article);
      console.log('Article properties:', Object.keys(article));

      // Check and build audio URL
      if (article.audioFile) {
        const fullAudioUrl = `http://localhost:8080/audio/content_reading/${article.audioFile}`;
        console.log('Constructed audio URL:', fullAudioUrl);
        setAudioUrl(fullAudioUrl);
      } else {
        console.log('No audioFile property found in article');
        setAudioUrl(null);
      }
    }
  }, [article]);

  useEffect(() => {
    if (showVocab && article?.id) {
      setVocabData([]); // loading
      axios.get(`/api/content_reading/${article.id}/vocabularies`)
        .then(res => {
          console.log('Vocab response:', res);
          // Display received JSON data for debugging
          setVocabData(res.data || []);
        })
        .catch(err => {
          console.error('Vocab error:', err);
          setVocabData([]);
        });
    }
  }, [showVocab, article?.id]);

  // Grammar when showGrammar is on
  useEffect(() => {
    if (showGrammar && article?.id) {
      setGrammarData([]); // loading
      axios.get(`/api/content_reading/${article.id}/grammars`)
        .then(res => {
          console.log('Grammar response:', res);
          // Display received JSON data for debugging
          setGrammarData(res || []);
        })
        .catch(err => {
          console.error('Grammar error:', err);
          setGrammarData([]);
        });
    }
  }, [showGrammar, article?.id]);

  // Check initial completion status when article changes
  useEffect(() => {
    const userId = user?.id || user?.userId || user?._id;

    if (userId && article?.id) {
      // Fix to call API correctly
      axios.get('/api/progressReading/checkStatus', {
        params: {
          userId: userId,
          contentReadingId: article.id
        }
      })
      .then(res => {
        if (res.data) {
          console.log('Reading progress status:', res);
          setIsDone(true);
        } else {
          console.log('Reading progress status:', res);
          setIsDone(false);
        }
      })
      .catch(err => {
        console.error('Error checking reading progress:', err);
        setIsDone(false);
      });
    }
  }, [article?.id, user]);

  // Updated handleMarkAsDone function to call your API
 const handleMarkAsDone = () => {
  const userId = user?.id || user?.userId || user?._id;

  if (!userId) {
    toast.error('User ID not found. Please log in again.');
    return;
  }

  setIsMarking(true);

  axios.post('/api/progressReading/markAsDone', null, {
    params: {
      userId: userId,
      contentReadingId: article.id
    }
  })
    .then(res => {
      if (res) {
        setIsDone(true);
        toast.success('Progress saved successfully!');
      } else {
        toast.error('Failed to save progress.');
      }
    })
    .catch(err => {
      console.error('Error marking as done:', err);
      toast.error('Failed to save progress. Please try again.');
    })
    .finally(() => {
      setIsMarking(false);
    });
};

  const renderActionButton = () => {
    if (!user) {
      return (
        <button className="btn btn-disabled" disabled>
          Please login
        </button>
      );
    }

    if (isDone) {
      return (
        <button className="btn btn-success flex items-center" disabled>
          <FiCheck className="mr-2" />
          Completed
        </button>
      );
    }

    return (
      <button
        className={`btn btn-primary flex items-center ${isMarking ? 'loading' : ''}`}
        onClick={handleMarkAsDone}
        disabled={isMarking}
      >
        {isMarking ? 'Processing...' : 'Mark as completed'}
      </button>
    );
  };

  useEffect(() => {
    console.log('User auth state:', user);
  }, [user]);
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

      {/* Audio Player Section */}
      {audioUrl ? (
        <div className="mt-4">
          <NewsAudio
            audioUrl={audioUrl}
            onTimeUpdate={(time) => console.log('Current audio time:', time)}
          />
          <div className="text-xs text-gray-500 mt-1">
            {/* Audio file: {article.audioFile} */}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-gray-100 rounded text-center text-gray-500">
          No audio available for this article
          {article.audioFile && (
            <div className="text-xs mt-1">
              (Attempted URL: http://localhost:8080/audio/content_reading/{article.audioFile})
            </div>
          )}
        </div>
      )}

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
        {renderActionButton()}
      </div>

      {/* Translation section */}
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