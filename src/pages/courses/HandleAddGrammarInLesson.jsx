import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, Filter, Book } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import { useData } from "../../context/DataContext";
import { getPageAllGrammar, handleAddGrammarInLesson } from '../../services/ContentBankService';

function GrammarManagement({ lessonId, onSuccess }) {
  const [selectedGrammar, setSelectedGrammar] = useState([]);
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(6); // 1trang bn phan tu
  const [pageCount, setPageCount] = useState(0); // so luong trang page
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [currentPage, setCurrentPage] = useState(0); // trang page hien tai
  const [allGrammar, setAllGrammar] = useState([]); // To store all grammar items
  const [levers, setLevers] = useState([]); // To store unique courses
  const jlptLevelClassMap = {
    N5: "bg-success-50 text-success-700",
    N4: "bg-primary-50 text-primary-700",
    N3: "bg-warning-50 text-warning-700",
    N2: "bg-orange-50 text-orange-700",
    N1: "bg-error-50 text-error-700",
  };
  const {
    fetchLevels
  } = useData();
  const [filters, setFilters] = useState({
    lever: '',
  });

  useEffect(() => {
    getPageGrammarAvailable();
    getListLever();
  }, [size, currentPage, lessonId]);

  const handleAddGrammarInContentReading = async (grammarId) => {
    await handleAddGrammarInLesson(lessonId, grammarId);
    if (onSuccess) onSuccess();
    await getPageGrammarAvailable();
  };

  const getPageGrammarAvailable = async () => {
    let res = await getPageAllGrammar(lessonId, currentPage, size);
    if (res && res.content) {
      setPageCount(res?.page?.totalPages);
      setTotalElements(res?.page?.totalElements);
      setAllGrammar(res?.content);
      setCurrentPage(currentPage);
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
  }
  // Get unique courses and lessons for filters


  // Filter grammar based on search and filters
  const filteredGrammar = allGrammar.filter(grammar => {
    const searchMatch =
      (grammar.structure?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (grammar.meaning?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (grammar.titleJp?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (grammar.example?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (grammar.usage?.toLowerCase() ?? '').includes(search.toLowerCase());

    const leverMatch = !filters.lever || grammar.jlptLevel === filters.lever;

    return searchMatch && leverMatch;
  });

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
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
          <div className="relative w-3/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search grammar..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSize(totalElements);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="relative w-1/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Book size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 rounded-md border border-gray-300 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.lever}
              onChange={(e) => {setFilters({ ...filters, lever: e.target.value })
                setSize(totalElements);
              }}
            >
              <option value="">All lever</option>
              {levers.map(lever => (
                <option key={lever} value={lever}>{lever}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Available Grammar List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Grammar</h2>
        </div>

        {filteredGrammar.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 p-4">
            {filteredGrammar.map((grammar) => {
              const isSelected = selectedGrammar.some(
                (v) => v.grammarId === grammar.grammarId
              );

              return (
                <div
                  key={grammar.grammarId}
                  className="bg-white border rounded p-3 shadow-sm relative"
                >
                  <button
                    onClick={() => handleAddGrammarInContentReading(grammar.grammarId)}
                    disabled={isSelected}
                    className={`absolute top-1 right-1 text-xs px-2 py-0.5 rounded ${isSelected
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                  >
                    <Plus size={12} className="inline-block mr-1" />
                    {isSelected ? "Added" : "Add"}
                  </button>

                  <h3 className="text-sm font-semibold text-gray-900">{grammar.titleJp}</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Structure:</strong> {grammar.structure}
                  </p>

                  <p className="text-xs text-gray-700">
                    <strong>Meaning:</strong> {grammar.meaning}
                  </p>

                  {grammar.example && (
                    <p className="text-xs text-gray-700 italic mt-1">
                      <strong>Ex:</strong> “{grammar.example}”
                    </p>
                  )}

                  <p className="text-[11px] text-gray-400 mt-1">
                    <strong>Usage:</strong> {grammar.usage}
                  </p>

                  {grammar.jlptLevel && (
                    <span
                      className={`badge mt-2 text-[10px] ${jlptLevelClassMap[grammar.jlptLevel] || "bg-gray-100 text-gray-500"}`}
                    >
                      {grammar.jlptLevel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No available grammar items</p>
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

export default GrammarManagement;