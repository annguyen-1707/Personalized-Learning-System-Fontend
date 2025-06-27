import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, Filter, Book } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import { useData } from "../../context/DataContext";
import { addVocabularyInLesson, getAllVocabWithoutLesson } from '../../services/ContentBankService';
import { a } from 'framer-motion/client';

function VocabularyManagement({lessonId, onSuccess}) {
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(6); // 1trang bn phan tu
  const [pageCount, setPageCount] = useState(0); // so luong trang page
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
  const [allVocabulary, setAllVocabulary] = useState([]); // To store all vocabulary items
  const [levers, setLevers] = useState([]); // To store unique courses
  const jlptLevelClassMap = {
    N5: "bg-success-50 text-success-700",
    N4: "bg-primary-50 text-primary-700",
    N3: "bg-warning-50 text-warning-700",
    N2: "bg-orange-50 text-orange-700",
    N1: "bg-error-50 text-error-700",
  };
  const [partOfSpeechs, setPartOfSpeechs] = useState([]);
  const {
    fetchPartOfSpeech,
    fetchLevels
  } = useData();
  const [filters, setFilters] = useState({
    lever: '',
    partOfSpeech: ''
  });

  useEffect(() => {
    getPageVocabularyAvailable(1);
    getListLever();
    getListPartOfSpeech();
  }, [size]);

  const handleAddVocabularyInContentReading = async (vocabularyId) => {
    console.log("Adding vocabulary:", vocabularyId, "to lesson:", lessonId);
    await addVocabularyInLesson(lessonId, vocabularyId);
     if (onSuccess) onSuccess();
    await getPageVocabularyAvailable(currentPage);
  };

  const getPageVocabularyAvailable = async (page) => {
    let res = await getAllVocabWithoutLesson(page, size);
    console.log("getPageVocabularyAvailable res", res);
    if (res && res.content) {
      setPageCount(res?.page?.totalPages);
      setTotalElements(res?.page?.totalElements);
      setAllVocabulary(res?.content);
      setCurrentPage(page);
    }
  }

  const handleChangeSize = async (newSize) => {
    setSize(newSize);
  }

  const getListLever = async () => {
    let res = await fetchLevels();
    if (res) {
      setLevers(res);
    }
    console.log("res", res);
  }

  const getListPartOfSpeech = async () => {
    let res = await fetchPartOfSpeech();
    if (res) {
      setPartOfSpeechs(res);
    }
  }

  // Get unique courses and lessons for filters


  // Filter vocabulary based on search and filters
  const filteredVocabulary = allVocabulary.filter(vocab => {
    const searchMatch =
      vocab.kanji.toLowerCase().includes(search.toLowerCase()) ||
      vocab.kana.toLowerCase().includes(search.toLowerCase()) ||
      vocab.meaning.toLowerCase().includes(search.toLowerCase()) ||
      vocab.description.toLowerCase().includes(search.toLowerCase()) ||
      vocab.example.toLowerCase().includes(search.toLowerCase()) ||
      vocab.romaji.toLowerCase().includes(search.toLowerCase());

    const leverMatch = !filters.lever || vocab.jlptLevel === filters.lever;
    const partOfSpeechMatch = !filters.partOfSpeech || vocab.partOfSpeech === filters.partOfSpeech;

    return searchMatch && leverMatch && partOfSpeechMatch;
  });

  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setCurrentPage(selectedPage);
    getPageVocabularyAvailable(selectedPage);
  }

  return (
    <div className="animate-fade-in">
      {/* Search and Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-1/5">
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-2"
              value={size}
              onChange={(e) => handleChangeSize(e.target.value)
              }
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="60">60</option>
              <option value={totalElements} >All </option>
            </select>
          </div>
          <div className="relative w-2/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vocabulary..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-1/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Book size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 rounded-md border border-gray-300 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.lever}
              onChange={(e) => setFilters({ ...filters, lever: e.target.value })}
            >
              <option value="">All lever</option>
              {levers.map(lever => (
                <option key={lever} value={lever}>{lever}</option>
              ))}
            </select>
          </div>
          <div className="relative w-1/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Book size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 rounded-md border border-gray-300 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.partOfSpeech}
              onChange={(e) => setFilters({ ...filters, partOfSpeech: e.target.value })}
            >
              <option value="">All part of speech</option>
              {partOfSpeechs.map(partOfSpeech => (
                <option key={partOfSpeech} value={partOfSpeech}>{partOfSpeech}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Available Vocabulary List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Vocabulary</h2>
        </div>

        {filteredVocabulary.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 p-4">
            {filteredVocabulary.map((vocab) => {
              const isSelected = selectedVocabulary.some(
                (v) => v.vocabularyId === vocab.vocabularyId
              );

              return (
                <div
                  key={vocab.vocabularyId}
                  className="bg-white border rounded p-3 shadow-sm relative"
                >
                  <button
                    onClick={() => handleAddVocabularyInContentReading(vocab.vocabularyId)}
                    disabled={isSelected}
                    className={`absolute top-1 right-1 text-xs px-2 py-0.5 rounded ${isSelected
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                  >
                    <Plus size={12} className="inline-block mr-1" />
                    {isSelected ? "Added" : "Add"}
                  </button>

                  <h3 className="text-base font-semibold text-gray-900">{vocab.kanji}</h3>
                  <p className="text-xs text-gray-500">
                    <strong>Kana:</strong> {vocab.kana}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Romaji:</strong> {vocab.romaji}
                  </p>
                  <p className="text-xs text-gray-700">
                    <strong>Meaning:</strong> {vocab.meaning}
                  </p>

                  {vocab.jlptLevel && (
                    <span
                      className={`badge mt-1 text-xs ${jlptLevelClassMap[vocab.jlptLevel] || "bg-gray-100 text-gray-500"}`}
                    >
                      {vocab.jlptLevel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No available vocabulary</p>
        )}
      </div>


      {/* Phan trang */}
      <div className='mt-4'>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3} // giới hạn trang bên trái 1 2 3 .... 99 100
          marginPagesDisplayed={2} // giới hạn trang bên phải 1 2 3 .... 99 100
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}

export default VocabularyManagement;