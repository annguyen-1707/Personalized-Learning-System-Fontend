import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  FiSearch,
  FiFilter,
  FiVolume2,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiBookOpen,
  FiPlus,
} from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast } from 'react-toastify'; // Import toast for notifications

function FavoriteFolderDetailsPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  // Tabs, filters, pagination for MAIN display
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [searchTerm, setSearchTerm] = useState(''); // For main list search input
  const [searchTrigger, setSearchTrigger] = useState(''); // To trigger main list search fetch
  const [selectedCategory, setSelectedCategory] = useState('all'); // For main list filter
  const [selectedLevel, setSelectedLevel] = useState('all'); // For main list filter
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  // State for Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [addMode, setAddMode] = useState('new');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // State for "Add Existing" modal's search and filters
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSearchTrigger, setModalSearchTrigger] = useState('');
  const [modalSelectedCategory, setModalSelectedCategory] = useState('all');
  const [modalSelectedLevel, setModalSelectedLevel] = useState('all');
  const [existingItems, setExistingItems] = useState([]);
  const [existingItemsCurrentPage, setExistingItemsCurrentPage] = useState(1); // Pagination for existing items
  const [existingItemsTotalPages, setExistingItemsTotalPages] = useState(1);

  // State for Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Data & stats
  const [vocabularyItems, setVocabularyItems] = useState([]);
  const [grammarItems, setGrammarItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    mastered: 0,
    inProgress: 0,
    notLearned: 0,
  });
  const [savedVocabWords, setSavedVocabWords] = useState([]);
  const [savedGrammarItems, setSavedGrammarItems] = useState([]);

  // Options for filters
  const [levels, setLevels] = useState([{ id: 'all', name: 'All Levels' }]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Categories' }]);
  const { user } = useAuth(); // Get user info from AuthContext
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);


  // Color map
  const jlptColorMap = {
    n1: 'bg-red-100 text-red-800',
    n2: 'bg-orange-100 text-orange-800',
    n3: 'bg-yellow-100 text-yellow-800',
    n4: 'bg-green-100 text-green-800',
    n5: 'bg-blue-100 text-blue-800',
  };

  // Navigate to flashcards
  const goToFlashcards = () => {
    if (user?.membershipLevel === 'NORMAL') {
      setShowUpgradeModal(true);
    } else {
      navigate(`/flashcards?type=${activeTab}&favoriteListId=${folderId}`);
    }
  };

  const goToQuiz = () => {
    if (user?.membershipLevel === 'NORMAL') {
      setShowUpgradeModal(true);
    } else {
      navigate(`/quiz?type=${activeTab}&favoriteListId=${folderId}`);
    }
  };

  // Fetch filter options for JLPT & POS
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [jlptRes, posRes] = await Promise.all([
          axios.get('http://localhost:8080/options/jlpt-levels'),
          axios.get('http://localhost:8080/options/part-of-speech'),
        ]);
        const jlptData = Array.isArray(jlptRes.data) ? jlptRes.data : [];
        const posData = Array.isArray(posRes.data) ? posRes.data : [];
        setLevels([
          { id: 'all', name: 'All Levels' },
          ...jlptData.map((l) => ({ id: l.toLowerCase(), name: `JLPT ${l}` })),
        ]);
        setCategories([
          { id: 'all', name: 'All Categories' },
          ...posData.map((p) => ({ id: p.toLowerCase(), name: p })),
        ]);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
        toast.error('Failed to load filter options.');
      }
    }
    fetchOptions();
  }, []);

  // Fetch stats (re-usable)
  const fetchStats = async () => {
    try {
      // Corrected API endpoint based on your backend structure
      const res = await axios.get(`http://localhost:8080/flashcards/status`, {
        params: { favoriteListId: folderId, type: activeTab.toUpperCase() }, // Ensure type is uppercase
      });
      // Assuming res.data.data contains the stats object
      const { countMastered, countInProgress, countNotLearned, flashcardMasteredIds } =
        res.data.data;
      const total = countMastered + countInProgress + countNotLearned;
      setStats({ total, mastered: countMastered, inProgress: countInProgress, notLearned: countNotLearned });
      if (activeTab === 'vocabulary') setSavedVocabWords(flashcardMasteredIds.map(Number));
      else setSavedGrammarItems(flashcardMasteredIds.map(Number));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // toast.error('Failed to load learning statistics.'); // Optional: avoid too many toasts
    }
  };

  useEffect(() => {
    if (folderId) fetchStats();
  }, [folderId, activeTab]);

  // Fetch all data for MAIN display (re-usable)
  const fetchMainData = async () => {
    if (!folderId) return;
    try {
      const params = {
        type: activeTab.toUpperCase(), // Ensure type is uppercase for backend
        category: selectedCategory !== 'all' ? selectedCategory.toUpperCase() : null,
        jlptLevel: selectedLevel !== 'all' ? selectedLevel.toUpperCase() : null,
        currentPage: currentPage - 1,
        pageSize: itemsPerPage,
        searchName: searchTrigger || null,
      };

      // Only fetch items for the current folder
      const itemsRes = await axios.get(`http://localhost:8080/favorites/${folderId}`, { params });

      const data = itemsRes.data.data;

      if (activeTab === 'vocabulary') {
        const list = data.vocabularyList;
        setVocabularyItems(list.content.map(item => ({
          id: item.vocabularyId,
          japanese: item.kanji,
          furigana: item.kana,
          romaji: item.romaji,
          english: item.meaning,
          example: item.example,
          notes: item.description,
          category: item.partOfSpeech?.toLowerCase() || '',
          level: item.jlptLevel?.toLowerCase() || ''
        })));
        setTotalPages(list.page.totalPages);
      } else {
        const list = data.grammarList;
        setGrammarItems(list.content.map(item => ({
          id: item.grammarId,
          japanese: item.titleJp,
          structure: item.structure,
          english: item.meaning,
          example: item.example,
          usage: item.usage,
          notes: item.description,
          level: item.jlptLevel?.toLowerCase() || ''
        })));
        setTotalPages(list.page.totalPages);
      }

    } catch (err) {
      console.error('Fetch main data failed', err);
      toast.error('Failed to load items. Please try again.');
    }
  };

  useEffect(() => {
    if (folderId) fetchMainData();
  }, [folderId, activeTab, currentPage, selectedCategory, selectedLevel, searchTrigger]);


  // Fetch data for "Add Existing" modal
  useEffect(() => {
    async function fetchExistingItems() {
      if (showModal && addMode === 'existing' && folderId) {
        try {
          const params = {
            type: activeTab.toUpperCase(), // Ensure type is uppercase
            searchName: modalSearchTrigger || null,
            jlptLevel: modalSelectedLevel !== 'all' ? modalSelectedLevel.toUpperCase() : null,
            category: activeTab === 'vocabulary' && modalSelectedCategory !== 'all' ? modalSelectedCategory.toUpperCase() : null,
            currentPage: existingItemsCurrentPage - 1,
            pageSize: itemsPerPage,
          };

          // Use the /addable endpoint
          const res = await axios.get(`http://localhost:8080/favorites/${folderId}/addable`, { params });

          const data = res.data.data;
          if (activeTab === 'vocabulary') {
            const page = data.vocabularyList;
            setExistingItems(page.content.map(item => ({
              id: item.vocabularyId,
              japanese: item.kanji,
              meaning: item.meaning,
              level: item.jlptLevel?.toLowerCase(),
              category: item.partOfSpeech?.toLowerCase(),
              furigana: item.kana, // Added for consistency in addExisting payload
              romaji: item.romaji, // Added for consistency in addExisting payload
              example: item.example, // Added for consistency in addExisting payload
              description: item.description // Added for consistency in addExisting payload
            })));
            setExistingItemsTotalPages(page.page.totalPages);
          } else {
            const page = data.grammarList;
            setExistingItems(page.content.map(item => ({
              id: item.grammarId,
              japanese: item.titleJp,
              structure: item.structure,
              meaning: item.meaning,
              level: item.jlptLevel?.toLowerCase(),
              example: item.example, // Added for consistency in addExisting payload
              usage: item.usage, // Added for consistency in addExisting payload
              description: item.description // Added for consistency in addExisting payload
            })));
            setExistingItemsTotalPages(page.page.totalPages);
          }
        } catch (err) {
          console.error('Fetch existing items failed', err);
          setExistingItems([]);
          toast.error('Failed to load existing items. Please try again.');
          setExistingItemsTotalPages(1);
        }
      } else {
        setExistingItems([]);
        setExistingItemsCurrentPage(1);
        setExistingItemsTotalPages(1);
      }
    }
    fetchExistingItems();
  }, [showModal, addMode, folderId, activeTab, modalSearchTrigger, modalSelectedCategory, modalSelectedLevel, existingItemsCurrentPage]);

  // Handlers
  const handleStatusToggle = async (id) => {
    // Determine the current status based on which list the item's ID is found in
    const isMastered = (activeTab === 'vocabulary'
      ? savedVocabWords.includes(id)
      : savedGrammarItems.includes(id));

    // Toggle the status: if mastered, set to IN_PROGRESS; otherwise, set to MASTERED
    const newStatus = isMastered ? 'IN_PROGRESS' : 'MASTERED';

    try {
      // Backend API for updating flashcard status
      // Ensure type is uppercase for the backend
      await axios.patch(`http://localhost:8080/flashcards/status`, null, {
        params: { type: activeTab.toUpperCase(), favoriteListId: folderId, flashcardId: id, status: newStatus },
      });
      // Re-fetch stats to update the UI
      fetchStats();
      toast.success('Flashcard status updated!');
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({});
    setAddMode('new');
    setModalSearchTerm('');
    setModalSearchTrigger('');
    setModalSelectedCategory('all');
    setModalSelectedLevel('all');
    setExistingItemsCurrentPage(1);
    setShowModal(true);
  };

  const addExisting = async (itemToAdd) => {
    try {
      const payload = {
        itemId: itemToAdd.id, // Corrected to itemId based on common backend patterns
        type: activeTab.toUpperCase(), // Ensure type matches backend enum names (VOCABULARY/GRAMMAR)
      };
      // Send favoriteListId as part of path
      await axios.post(`http://localhost:8080/favorites/${folderId}/items`, payload);

      // After successful addition, update the main list by re-fetching data
      // This is the most reliable way to ensure UI is in sync with backend
      await fetchMainData();
      await fetchStats(); // Also refresh stats

      // Remove the added item from the "existingItems" list to prevent re-adding
      setExistingItems(prev => prev.filter(i => i.id !== itemToAdd.id));
      toast.success('Item added to favorites successfully!');
    } catch (error) {
      console.error('Error adding existing item:', error);
      // More specific error message if available from backend
      const errorMessage = error.response?.data?.message || 'Could not add this item. It might already exist or an error occurred.';
      toast.error(errorMessage);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    // Reset addMode to 'new' when opening for edit
    setAddMode('new');
    if (activeTab === 'vocabulary') {
      setFormData({
        kanji: item.japanese,
        kana: item.furigana,
        romaji: item.romaji,
        meaning: item.english,
        description: item.notes,
        example: item.example,
        partOfSpeech: item.category?.toUpperCase() || '',
        jlptLevel: item.level?.toUpperCase() || '',
      });
    } else {
      setFormData({
        titleJp: item.japanese,
        structure: item.structure,
        meaning: item.english,
        usage: item.usage,
        example: item.example,
        jlptLevel: item.level?.toUpperCase() || '',
      });
    }
    setShowModal(true);
  };

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async () => {
    // If in "existing" mode, the "Done" button just closes the modal
    if (addMode === 'existing') {
      setShowModal(false);
      return;
    }

    const base = activeTab === 'vocabulary' ? 'vocabularies' : 'grammars';
    try {
      let res;
      let createdOrUpdatedItemId;

      if (editingItem) {
        // Update existing item
        res = await axios.put(`http://localhost:8080/${base}/${editingItem.id}`, formData);
        createdOrUpdatedItemId = editingItem.id; // Item ID remains the same
        toast.success('Item updated successfully!');
      } else {
        // Create new item
        res = await axios.post(`http://localhost:8080/${base}`, formData);
        createdOrUpdatedItemId = activeTab === 'vocabulary' ? res.data.data.vocabularyId : res.data.data.grammarId;
        toast.success('Item created successfully!');

        // --- NEW: Add the newly created item to the favorite folder ---
        try {
          const payload = {
            itemId: createdOrUpdatedItemId,
            type: activeTab.toUpperCase(),
          };
          await axios.post(`http://localhost:8080/favorites/${folderId}/items`, payload);
          toast.success('New item added to favorites!');
        } catch (addError) {
          console.error('Error adding new item to favorites:', addError);
          toast.warn('New item created but failed to add to favorites. It might already exist.');
        }
        // --- END NEW ---
      }

      // Re-fetch all data to ensure the list is up-to-date with new/edited item
      await fetchMainData();
      await fetchStats(); // Also refresh stats

      setShowModal(false);
      setFormData({});
    } catch (error) {
      console.error('Error saving item:', error);
      const errorMessage = error.response?.data?.message || 'Could not save this item. Please check your input and try again.';
      toast.error(errorMessage);
    }
  };

  // Function to open confirmation modal
  const handleOpenConfirmModal = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  // Actual deletion logic
  const confirmDelete = async () => {
    setShowConfirmModal(false); // Close the confirmation modal
    if (!itemToDelete) return;

    const id = itemToDelete;
    // NOTE: This part assumes you want to *delete* the vocabulary/grammar from the main database
    // If you meant to *remove from favorite list*, you'd need a different API endpoint
    // (e.g., DELETE /favorites/{favoriteListId}/items/{itemId}) and then re-fetch.
    // Based on your instruction "còn xóa thì cứ chạy phần cũ", I'm keeping the deletion of the base item.
    const base = activeTab === 'vocabulary' ? 'vocabularies' : 'grammars';

    try {
      await axios.delete(`http://localhost:8080/${base}/${id}`);

      // Re-fetch data and stats after deletion
      await fetchMainData();
      await fetchStats();

      toast.success('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      const errorMessage = error.response?.data?.message || 'Could not delete this item. An error occurred.';
      toast.error(errorMessage);
    } finally {
      setItemToDelete(null); // Clear item to delete
    }
  };

  const playAudio = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    window.speechSynthesis.speak(u);
  };

  const items = activeTab === 'vocabulary' ? vocabularyItems : grammarItems;

  return (
    <>
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowUpgradeModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-center text-red-600 mb-3">
              VIP Feature
            </h2>
            <p className="text-gray-700 text-center mb-5">
              This feature is only available for Premium users. Please upgrade your membership to unlock it.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  navigate('/upgrade');
                }}
                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex mb-4 space-x-2">
              <button
                className={`px-3 py-1 rounded ${addMode === 'new' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setAddMode('new');
                  setEditingItem(null); // Clear editing item when switching to "New"
                  setFormData({}); // Clear form data
                }}
              >New</button>
              <button
                className={`px-3 py-1 rounded ${addMode === 'existing' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setAddMode('existing');
                  // Reset modal search/filters when switching to existing
                  setModalSearchTerm('');
                  setModalSearchTrigger('');
                  setModalSelectedCategory('all');
                  setModalSelectedLevel('all');
                  setExistingItemsCurrentPage(1);
                }}
              >Existing</button>
            </div>

            {/* New entry form */}
            {addMode === 'new' ? (
              <div className="space-y-3">
                {activeTab === 'vocabulary' ? (
                  <>
                    <input name="kanji" placeholder="Kanji" value={formData.kanji || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <input name="kana" placeholder="Kana (Furigana)" value={formData.kana || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <input name="romaji" placeholder="Romaji" value={formData.romaji || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <input name="meaning" placeholder="Meaning (English)" value={formData.meaning || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <textarea name="description" placeholder="Description / Notes" value={formData.description || ''} onChange={handleFormChange} className="w-full border p-2 rounded" rows="3" />
                    <textarea name="example" placeholder="Example sentence (Japanese)" value={formData.example || ''} onChange={handleFormChange} className="w-full border p-2 rounded" rows="2" />
                    <select name="partOfSpeech" value={formData.partOfSpeech || ''} onChange={handleFormChange} className="w-full border p-2 rounded">
                      <option value="">Select Part of Speech</option>
                      {categories.slice(1).map(c => <option key={c.id} value={c.id.toUpperCase()}>{c.name}</option>)}
                    </select>
                    <select name="jlptLevel" value={formData.jlptLevel || ''} onChange={handleFormChange} className="w-full border p-2 rounded">
                      <option value="">Select JLPT Level</option>
                      {levels.slice(1).map(l => <option key={l.id} value={l.id.toUpperCase()}>{l.name}</option>)}
                    </select>
                  </>
                ) : (
                  <>
                    <input name="titleJp" placeholder="Title (Japanese)" value={formData.titleJp || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <input name="structure" placeholder="Structure" value={formData.structure || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <input name="meaning" placeholder="Meaning (English)" value={formData.meaning || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
                    <textarea name="usage" placeholder="Usage" value={formData.usage || ''} onChange={handleFormChange} className="w-full border p-2 rounded" rows="3" />
                    <textarea name="example" placeholder="Example sentence (Japanese)" value={formData.example || ''} onChange={handleFormChange} className="w-full border p-2 rounded" rows="2" />
                    <select name="jlptLevel" value={formData.jlptLevel || ''} onChange={handleFormChange} className="w-full border p-2 rounded">
                      <option value="">Select JLPT Level</option>
                      {levels.slice(1).map(l => <option key={l.id} value={l.id.toUpperCase()}>{l.name}</option>)}
                    </select>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* search + filter for EXISTING items */}
                <div className="space-y-2 mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search existing..."
                      value={modalSearchTerm}
                      onChange={e => setModalSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setModalSearchTrigger(modalSearchTerm);
                        }
                      }}
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      onClick={() => setModalSearchTrigger(modalSearchTerm)}
                      className="px-4 py-2 rounded bg-primary-500 text-white"
                    >Search</button>
                  </div>
                  <div className="flex space-x-2">
                    {activeTab === 'vocabulary' && (
                      <select
                        value={modalSelectedCategory}
                        onChange={e => {
                          setModalSelectedCategory(e.target.value);
                          setExistingItemsCurrentPage(1);
                        }}
                        className="border p-2 rounded flex-1"
                      >
                        <option value="all">All Categories</option>
                        {categories.slice(1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    )}
                    <select
                      value={modalSelectedLevel}
                      onChange={e => {
                        setModalSelectedLevel(e.target.value);
                        setExistingItemsCurrentPage(1);
                      }}
                      className="border p-2 rounded flex-1"
                    >
                      <option value="all">All Levels</option>
                      {levels.slice(1).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
                {/* list existing */}
                <div className="space-y-2 max-h-64 overflow-auto border p-2 rounded">
                  {!existingItems.length && modalSearchTrigger === '' && modalSelectedCategory === 'all' && modalSelectedLevel === 'all' ? (
                    <div className="text-center text-gray-500 py-4">No items to add. Try searching or adjusting filters.</div>
                  ) : !existingItems.length ? (
                    <div className="text-center text-gray-500 py-4">No matching items found.</div>
                  ) : (
                    existingItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center border p-2 rounded bg-gray-50 hover:bg-gray-100">
                        <div>
                          <div className="font-semibold">
                            {activeTab === 'vocabulary' ? item.japanese : item.japanese}
                            {activeTab === 'grammar' && item.structure && (
                              <span className="ml-2 text-sm text-gray-600">({item.structure})</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activeTab === 'vocabulary' ? item.meaning : item.meaning}
                          </div>
                          <span
                            className={`px-1 py-0.5 text-xs font-semibold rounded-full ${jlptColorMap[item.level] || 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {item.level?.toUpperCase()}
                          </span>
                        </div>
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          onClick={() => addExisting(item)}
                        >Add</button>
                      </div>
                    ))
                  )}
                </div>
                {/* Pagination for existing items */}
                {existingItemsTotalPages > 1 && (
                  <div className="mt-4 flex justify-center space-x-2">
                    {Array.from({ length: existingItemsTotalPages }).map((_, i) => (
                      <button
                        key={`existing-page-${i}`}
                        onClick={() => setExistingItemsCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${existingItemsCurrentPage === i + 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors">Cancel</button>
              <button onClick={handleFormSubmit} className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                {addMode === 'new' ? (editingItem ? 'Update' : 'Create') : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Header & Controls */}
      <div className="flex justify-between items-center mt-6 space-x-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-4 py-2 rounded ${activeTab === 'vocabulary' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-4 py-2 rounded ${activeTab === 'grammar' ? 'bg-primary-500 text-white' : 'bg-gray-200'
              }`}
          >
            Grammar
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded bg-green-500 text-white flex items-center hover:bg-green-600 transition-colors"
          >
            <FiPlus className="mr-1" /> Add
          </button>
          <button
            onClick={goToQuiz}
            className="px-4 py-2 rounded bg-red-500 text-white flex items-center hover:bg-red-600 transition-colors"
          >
            <FiBookOpen className="mr-1" /> AI Quiz
          </button>
          <button
            onClick={goToFlashcards}
            className="px-4 py-2 rounded bg-accent-500 text-white flex items-center hover:bg-accent-600 transition-colors"
          >
            <FiBookOpen className="mr-1" /> Flashcards
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 flex flex-col lg:flex-row items-center bg-white p-6 rounded-2xl shadow">
        <div className="w-24 h-24 mb-6 lg:mb-0 lg:mr-8">
          <CircularProgressbar
            value={stats.total ? (stats.mastered / stats.total) * 100 : 0}
            text={`${Math.round(stats.total ? (stats.mastered / stats.total) * 100 : 0)}%`}
            styles={buildStyles({
              textSize: '14px',
              pathColor: '#4CAF50',
              textColor: '#4CAF50',
              trailColor: '#d6d6d6',
            })}
          />
        </div>

        <div className="flex flex-1 justify-between items-center w-full max-w-xl">
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-green-600">{stats.mastered}</div>
            <div className="text-sm text-gray-600">Mastered</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-red-600">{stats.notLearned}</div>
            <div className="text-sm text-gray-600">Not Learned</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>



      {/* Search & Filters for Main List */}
      <div className="mt-6 flex flex-wrap lg:flex-nowrap items-center space-x-2">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchTrigger(searchTerm);
                setCurrentPage(1);
              }
            }}
            className="w-full border pl-8 pr-4 py-2 rounded focus:ring-primary-500 focus:border-primary-500"
          />
          <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={() => { setSearchTrigger(searchTerm); setCurrentPage(1); }}
          className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          Search
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded bg-gray-200 flex items-center hover:bg-gray-300 transition-colors"
        >
          <FiFilter className="mr-1" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-4 bg-white p-4 rounded shadow">
          {activeTab === 'vocabulary' && (
            <div>
              <label htmlFor="main-category-filter" className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select
                id="main-category-filter"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="border p-2 rounded focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="main-level-filter" className="block mb-1 text-sm font-medium text-gray-700">JLPT Level</label>
            <select
              id="main-level-filter"
              value={selectedLevel}
              onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
              className="border p-2 rounded focus:ring-primary-500 focus:border-primary-500"
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Item Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded shadow">
            No items found. Adjust your search or filters.
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white p-4 rounded shadow flex flex-col justify-between border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${jlptColorMap[item.level] || 'bg-gray-100 text-gray-800'
                  }`}
              >
                {item.level?.toUpperCase()}
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{item.japanese}</h3>
                {item.furigana && <div className="text-sm text-gray-500">[{item.furigana}]</div>}
                {item.romaji && <div className="text-sm text-gray-500">({item.romaji})</div>}
                <div className="mt-2 font-medium text-blue-700">{item.english}</div>
                {item.example && (
                  <div className="mt-2 text-sm bg-gray-50 p-2 rounded italic text-gray-700">"{item.example}"</div>
                )}
                {item.notes && (
                  <div className="mt-1 text-sm text-gray-600">
                    <strong>Notes:</strong> {item.notes}
                  </div>
                )}
                {activeTab === 'grammar' && item.structure && (
                  <div className="mt-1 text-sm text-gray-600">
                    <strong>Structure:</strong> {item.structure}
                  </div>
                )}
                {activeTab === 'grammar' && item.usage && (
                  <div className="mt-1 text-sm text-gray-600">
                    <strong>Usage:</strong> {item.usage}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-3 items-center text-gray-500">
                <button
                  onClick={() => playAudio(item.japanese)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={`Play audio for ${item.japanese}`}
                >
                  <FiVolume2 size={20} />
                </button>
                <button
                  onClick={() => handleStatusToggle(item.id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Toggle mastered status"
                >
                  <FiStar
                    size={20}
                    className={
                      activeTab === 'vocabulary'
                        ? savedVocabWords.includes(item.id)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                        : savedGrammarItems.includes(item.id)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                    }
                  />
                </button>
                {/* <button
                  onClick={() => openEditModal(item)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Edit item"
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  onClick={() => handleOpenConfirmModal(item.id)}
                  className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                  aria-label="Delete item"
                >
                  <FiTrash2 size={20} />
                </button> */}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination for Main List */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={`main-page-${i}`}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default FavoriteFolderDetailsPage;