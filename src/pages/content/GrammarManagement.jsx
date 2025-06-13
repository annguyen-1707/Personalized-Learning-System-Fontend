import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, Filter, Book } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import { useData } from "../../context/DataContext";
import { getPageAllGrammar, getGrammarByContentReadingId, handleAddGrammar, handleRemoveGrammar } from '../../services/ContentReadingService';

function GrammarManagement() {
  const { contentReadingId } = useParams();
  const [selectedGrammar, setSelectedGrammar] = useState([]);
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(5); // 1trang bn phan tu
  const [pageCount, setPageCount] = useState(0); // so luong trang page
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
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
    getPageGrammarAvailable(1);
    getGrammarByContentId(contentReadingId);
    getListLever();
  }, [size]);

  const handleAddGrammarInContentReading = async (grammarId) => {
    await handleAddGrammar(contentReadingId, grammarId);
    await getPageGrammarAvailable(currentPage);
    await getGrammarByContentId(contentReadingId);
  };

  const handleRemoveGrammarFromContentReading = async (grammarId) => {
    await handleRemoveGrammar(contentReadingId, grammarId);
    await getPageGrammarAvailable(currentPage);
    await getGrammarByContentId(contentReadingId);
  };

  const getPageGrammarAvailable = async (page) => {
    console.log(" Before", page, size);
    let res = await getPageAllGrammar(page, size);
    if (res && res.data && res.data.content) {
      setPageCount(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements);
      setAllGrammar(res.data.content);
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

  const getGrammarByContentId = async (contentId) => {
    let res = await getGrammarByContentReadingId(contentId);
    if (res && res.data) {
      setSelectedGrammar(res.data);
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
    const selectedPage = +event.selected + 1;
    setCurrentPage(selectedPage);
    getPageGrammarAvailable(selectedPage);
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/admin/content_reading" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Reading Content
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Grammar Management</h1>
        <p className="text-gray-500 mt-1">Manage grammar items for this content</p>
      </div>

      {/* Selected Grammar List */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Grammar</h2>
        {selectedGrammar.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {selectedGrammar.map((grammar) => (
              <div key={grammar.grammarId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {grammar.titleJp}
                    </h3>
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded ${jlptLevelClassMap[grammar.jlptLevel]}`}
                    >
                      {grammar.jlptLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Structure:</strong> {grammar.structure}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Meaning:</strong> {grammar.meaning}
                  </p>

                  {grammar.example && (
                    <p className="text-sm text-gray-700 italic mt-2">
                      <strong>Example:</strong> “{grammar.example}”
                    </p>
                  )}

                  <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                    <span>
                      <strong>usage:</strong> {grammar.usage}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveGrammarFromContentReading(grammar.grammarId)}
                  className="text-error-500 hover:text-error-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No grammar items selected</p>
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
          <div className="relative w-3/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search grammar..."
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
        </div>
      </div>

      {/* Available Grammar List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Grammar</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredGrammar.map((grammar) => (
            <div key={grammar.grammarId} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {grammar.titleJp}
                    </h3>
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded ${jlptLevelClassMap[grammar.jlptLevel]}`}
                    >
                      {grammar.jlptLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Structure:</strong> {grammar.structure}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Meaning:</strong> {grammar.meaning}
                  </p>

                  {grammar.example && (
                    <p className="text-sm text-gray-700 italic mt-2">
                      <strong>Example:</strong> “{grammar.example}”
                    </p>
                  )}

                  <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                    <span>
                      <strong>usage:</strong> {grammar.usage}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddGrammarInContentReading(grammar.grammarId)}
                  disabled={selectedGrammar.some(v => v.grammarId === grammar.grammarId)}
                  className={`btn-outline py-1 px-2 ${selectedGrammar.some(v => v.grammarId === grammar.grammarId)
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

export default GrammarManagement;