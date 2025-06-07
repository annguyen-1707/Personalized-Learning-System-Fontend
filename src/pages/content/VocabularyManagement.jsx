import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, Filter, Book } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import { useData } from "../../context/DataContext";
import { getPageAllVocabulary, getVocabularyByContentReadingId, handleAddVocabulary, handleRemoveVocabulary } from '../../services/ContentReadingService';

function VocabularyManagement() {
  const { contentReadingId } = useParams();
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(5); // 1trang bn phan tu
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
    getVocabularyByContentId(contentReadingId);
    getListLever();
    getListPartOfSpeech();
  }, [size]);

  const handleAddVocabularyInContentReading = async (vocabularyId) => {
    await handleAddVocabulary(contentReadingId, vocabularyId);
    await getPageVocabularyAvailable(currentPage);
    await getVocabularyByContentId(contentReadingId);
  };

  const handleRemoveVocabularyFromContentReading = async (vocabularyId) => {
    await handleRemoveVocabulary(contentReadingId, vocabularyId);
    await getPageVocabularyAvailable(currentPage);
    await getVocabularyByContentId(contentReadingId);
  };

  const getPageVocabularyAvailable = async (page) => {
    console.log(" Before", page, size);
    let res = await getPageAllVocabulary(page, size);
    if (res && res.data && res.data.content) {
      setPageCount(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements);
      setAllVocabulary(res.data.content);
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

  const getVocabularyByContentId = async (contentId) => {
    let res = await getVocabularyByContentReadingId(contentId);
    if (res && res.data) {
      setSelectedVocabulary(res.data);
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
      <div className="mb-6">
        <Link to="/admin/content_reading" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Reading Content
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Vocabulary Management</h1>
        <p className="text-gray-500 mt-1">Manage vocabulary items for this content</p>
      </div>

      {/* Selected Vocabulary List */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Vocabulary</h2>
        {selectedVocabulary.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {selectedVocabulary.map((vocab) => (
              <div key={vocab.vocabularyId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vocab.kanji}
                    </h3>
                    <span
                      className={`ml-2 badge ${jlptLevelClassMap[vocab.jlptLevel] ||
                        "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {vocab.jlptLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Kana:</strong> {vocab.kana} |{" "}
                    <strong>Romaji:</strong> {vocab.romaji}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Meaning:</strong> {vocab.meaning}
                  </p>

                  {vocab.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Description:</strong> {vocab.description}
                    </p>
                  )}

                  {vocab.example && (
                    <p className="text-sm text-gray-700 italic mt-2">
                      <strong>Example:</strong> “{vocab.example}”
                    </p>
                  )}

                  <div className="text-xs text-gray-400 mt-2 flex justify-between vocabs-center">
                    <span>
                      <strong>Part of speech:</strong> {vocab.partOfSpeech}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveVocabularyFromContentReading(vocab.vocabularyId)}
                  className="text-error-500 hover:text-error-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No vocabulary items selected</p>
        )}
      </div>

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
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
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
        <div className="divide-y divide-gray-200">
          {filteredVocabulary.map((vocab) => (
            <div key={vocab.vocabularyId} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vocab.kanji}
                    </h3>
                    <span
                      className={`ml-2 badge ${jlptLevelClassMap[vocab.jlptLevel] ||
                        "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {vocab.jlptLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Kana:</strong> {vocab.kana} |{" "}
                    <strong>Romaji:</strong> {vocab.romaji}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Meaning:</strong> {vocab.meaning}
                  </p>

                  {vocab.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Description:</strong> {vocab.description}
                    </p>
                  )}

                  {vocab.example && (
                    <p className="text-sm text-gray-700 italic mt-2">
                      <strong>Example:</strong> “{vocab.example}”
                    </p>
                  )}

                  <div className="text-xs text-gray-400 mt-2 flex justify-between vocabs-center">
                    <span>
                      <strong>Part of speech:</strong> {vocab.partOfSpeech}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddVocabularyInContentReading(vocab.vocabularyId)}
                  disabled={selectedVocabulary.some(v => v.vocabularyId === vocab.vocabularyId)}
                  className={`btn-outline py-1 px-2 ${selectedVocabulary.some(v => v.vocabularyId === vocab.vocabularyId)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                    }`}
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
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