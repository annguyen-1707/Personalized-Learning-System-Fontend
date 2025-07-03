import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FiSearch, FiFilter, FiVolume2, FiStar, FiEdit2, FiTrash2, FiBookOpen, FiHelpCircle } from 'react-icons/fi'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function FavoriteFolderDetailsPage() {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('vocabulary')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTrigger, setSearchTrigger] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const [vocabularyItems, setVocabularyItems] = useState([])
  const [grammarItems, setGrammarItems] = useState([])
  const [stats, setStats] = useState({ total: 0, mastered: 0, inProgress: 0, notLearned: 0 })
  const [savedVocabWords, setSavedVocabWords] = useState([]);
  const [savedGrammarItems, setSavedGrammarItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [totalPages, setTotalPages] = useState(1)

  const [levels, setLevels] = useState([{ id: 'all', name: 'All Levels' }])
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Categories' }])
  const goToFlashcards = () => {
    navigate(`/flashcards?type=${activeTab}&favoriteListId=${folderId}`)
  }

  const goToQuiz = () => {
    navigate(`/quiz?type=${activeTab}&favoriteListId=${folderId}`)
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/flashcards/status', {
        params: {
          favoriteListId: folderId,
          type: activeTab
        }
      });
      const { countMastered, countInProgress, countNotLearned, flashcardMasteredIds } = res.data.data;
      const total = countMastered + countInProgress + countNotLearned;

      setStats({
        total,
        mastered: countMastered,
        inProgress: countInProgress,
        notLearned: countNotLearned
      });

      if (activeTab === 'vocabulary') {
        setSavedVocabWords((flashcardMasteredIds || []).map(Number));
      } else {
        setSavedGrammarItems((flashcardMasteredIds || []).map(Number));
      }
    } catch (err) {
      console.error('Fetch stats failed', err);
    }
  };
  useEffect(() => {
    if (folderId) {
      fetchStats();
    }
  }, [folderId, activeTab]);
  const handleStatusToggle = async (id) => {
    const numId = Number(id);
    const isMastered = activeTab === 'vocabulary'
      ? savedVocabWords.includes(numId)
      : savedGrammarItems.includes(numId);
    const newStatus = isMastered ? 'IN_PROGRESS' : 'MASTERED';

    if (activeTab === 'vocabulary') {
      setSavedVocabWords(prev =>
        isMastered ? prev.filter(wordId => wordId !== numId) : [...prev, numId]
      );
    } else {
      setSavedGrammarItems(prev =>
        isMastered ? prev.filter(wordId => wordId !== numId) : [...prev, numId]
      );
    }

    try {
      await axios.patch('http://localhost:8080/flashcards/status', null, {
        params: {
          type: activeTab,
          favoriteListId: folderId,
          flashcardId: numId,
          status: newStatus
        }
      });

      fetchStats();
    } catch (err) {
      console.error('Update status failed', err);

      if (activeTab === 'vocabulary') {
        setSavedVocabWords(prev =>
          isMastered ? [...prev, numId] : prev.filter(wordId => wordId !== numId)
        );
      } else {
        setSavedGrammarItems(prev =>
          isMastered ? [...prev, numId] : prev.filter(wordId => wordId !== numId)
        );
      }
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [jlptRes, posRes] = await Promise.all([
          axios.get('http://localhost:8080/options/jlpt-levels'),
          axios.get('http://localhost:8080/options/part-of-speech')
        ])
        const jlptData = Array.isArray(jlptRes.data) ? jlptRes.data : []
        const posData = Array.isArray(posRes.data) ? posRes.data : []

        setLevels([
          { id: 'all', name: 'All Levels' },
          ...jlptData.map(l => ({ id: l.toLowerCase(), name: `JLPT ${l.toUpperCase()}` }))
        ])

        setCategories([
          { id: 'all', name: 'All Categories' },
          ...posData.map(p => ({ id: p.toLowerCase(), name: p }))
        ])
      } catch (err) {
        console.error('Fetch options failed', err)
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])
  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP' // tiếng Nhật
    window.speechSynthesis.speak(utterance)
  }
  useEffect(() => {
    if (!folderId) return

    const fetchAllData = async () => {
      try {
        const params = {
          type: activeTab,
          category: selectedCategory !== 'all' ? selectedCategory.toUpperCase() : null,
          jlptLevel: selectedLevel !== 'all' ? selectedLevel.toUpperCase() : null,
          currentPage: currentPage - 1,
          pageSize: itemsPerPage,
          searchName: searchTrigger || null
        }

        // Gọi đồng thời cả 2 API
        const [itemsRes, statusRes] = await Promise.all([
          axios.get(`http://localhost:8080/favorites/${folderId}`, { params }),
          axios.get('http://localhost:8080/flashcards/status', {
            params: {
              favoriteListId: folderId,
              type: activeTab
            }
          })
        ])

        const data = itemsRes.data.data
        const { countMastered, countInProgress, countNotLearned, flashcardMasteredIds } = statusRes.data.data
        const total = countMastered + countInProgress + countNotLearned

        setStats({ total, mastered: countMastered, inProgress: countInProgress, notLearned: countNotLearned })

        if (activeTab === 'vocabulary') {
          const list = data.vocabularyList
          setVocabularyItems(list.content.map(item => ({
            id: item.vocabularyId,
            japanese: item.kanji,
            furigana: item.kana,
            romaji: item.romaji,
            english: item.meaning,
            example: { japanese: item.example, english: '' },
            notes: item.description,
            category: item.partOfSpeech?.toLowerCase() || '',
            level: item.jlptLevel?.toLowerCase() || ''
          })))
          setSavedVocabWords((flashcardMasteredIds || []).map(Number));
          setTotalPages(list.page.totalPages)
        } else {
          const list = data.grammarList
          setGrammarItems(list.content.map(item => ({
            id: item.grammarId,
            japanese: item.titleJp,
            structure: item.structure,
            english: item.meaning,
            example: { japanese: item.example || '', english: '' },
            usage: item.usage || '',
            notes: item.description || '',
            level: item.jlptLevel?.toLowerCase() || ''
          })))
          setSavedGrammarItems((flashcardMasteredIds || []).map(Number));
          setTotalPages(list.page.totalPages)
        }

      } catch (err) {
        console.error('Fetch items/status failed', err)
      }
    }

    fetchAllData()
  }, [folderId, activeTab, currentPage, selectedCategory, selectedLevel, searchTrigger])

  const items = activeTab === 'vocabulary' ? vocabularyItems : grammarItems

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center space-x-4 mt-6">
        <button onClick={() => setActiveTab('vocabulary')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'vocabulary' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          Vocabulary
        </button>
        <button onClick={() => setActiveTab('grammar')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'grammar' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          Grammar
        </button>
        <button
          onClick={goToFlashcards}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-accent-500 text-white hover:bg-accent-600 transition-colors flex items-center"
        >
          <FiBookOpen className="mr-2" /> Flashcards
        </button>
        <button
          onClick={goToQuiz}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center"
        >
          <FiHelpCircle className="mr-2" /> Quizzes
        </button>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6 flex flex-col lg:flex-row items-center gap-8">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0}
            text={`${Math.round(stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0)}%`}
            styles={buildStyles({ textSize: '16px', pathColor: '#22c55e', textColor: '#22c55e', trailColor: '#e5e7eb' })}
          />
        </div>
        <div className="flex gap-8 text-center">
          <div><div className="text-2xl font-bold text-green-500">{stats.mastered}</div><div>Mastered</div></div>
          <div><div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div><div>In Progress</div></div>
          <div><div className="text-2xl font-bold text-red-500">{stats.notLearned}</div><div>Not Learned</div></div>
          <div><div className="text-2xl font-bold text-gray-800">{stats.total}</div><div>Total</div></div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap lg:flex-nowrap gap-4">
        <div className="relative flex-1">
          <input type="text" placeholder="Search..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button onClick={() => setSearchTrigger(searchTerm)} className="px-4 py-2 bg-primary-500 text-white rounded-lg">Search</button>
        <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-gray-200 rounded-lg flex items-center">
          <FiFilter className="mr-2" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          {activeTab === 'vocabulary' && (
            <div>
              <div className="font-medium mb-1">Category</div>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <div className="font-medium mb-1">JLPT Level</div>
            <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-lg">
              {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {items.length === 0
          ? <div className="text-center text-gray-600 py-12 bg-white rounded-lg shadow">No items found.</div>
          : items.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-bold">{item.japanese}</h3>
                  {item.furigana && <div className="text-sm text-gray-500">{item.furigana}</div>}
                  {item.romaji && <div className="text-sm text-gray-500">{item.romaji}</div>}
                  {item.structure && <div className="mt-1 text-sm text-gray-500"><strong>Structure:</strong> {item.structure}</div>}
                  {item.usage && <div className="mt-1 text-sm text-gray-500"><strong>Usage:</strong> {item.usage}</div>}
                  {item.level && <div className="mt-1 text-sm text-gray-500"><strong>JLPT:</strong> {item.level.toUpperCase()}</div>}
                  <div className="mt-2 text-lg">{item.english}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => playAudio(item.japanese)}><FiVolume2 /></button>
                  <button onClick={() => handleStatusToggle(item.id)}>
                    <FiStar
                      className={
                        activeTab === 'vocabulary'
                          ? savedVocabWords.includes(Number(item.id)) ? 'text-yellow-500' : 'text-gray-400'
                          : savedGrammarItems.includes(Number(item.id)) ? 'text-yellow-500' : 'text-gray-400'
                      }
                    />
                  </button>
                  <button><FiEdit2 /></button>
                  <button><FiTrash2 /></button>
                </div>
              </div>
              {item.example.japanese && <div className="mt-2 text-sm bg-gray-100 p-2 rounded">{item.example.japanese}</div>}
              {item.notes && <div className="mt-2 text-sm text-gray-600"><strong>Notes:</strong> {item.notes}</div>}
            </motion.div>
          ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-800'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoriteFolderDetailsPage
