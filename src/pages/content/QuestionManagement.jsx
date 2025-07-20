import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Check } from 'lucide-react';
import ReactPaginate from 'react-paginate'; import {
  getQuestionByContentListeningId,
  getQuestionEmpty,
  addQuestionToContentListening,
  removeQuestionFromContentListening
} from '../../services/QuestionService';

function QuestionManagement() {
  const { contentListeningId } = useParams();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(6);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [allQuestions, setAllQuestions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchSelectedQuestions();
    fetchAvailableQuestions(1);
  }, [size]);

  const fetchSelectedQuestions = async () => {
    const res = await getQuestionByContentListeningId(contentListeningId);
    if (res && res.data) setSelectedQuestions(res.data);
  };

  const fetchAvailableQuestions = async (page) => {
    const res = await getQuestionEmpty('contentListening');
    console.log("res", res);
    if (res && res.data) {
      const filtered = res.data.content.filter(q => q.questionText.toLowerCase().includes(search.toLowerCase()));
      setPageCount(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements);
      setAllQuestions(res.data.content);
      setCurrentPage(page);
    }
  };

  const handleAdd = async (id) => {
    await addQuestionToContentListening(contentListeningId, id);
    fetchSelectedQuestions();
    fetchAvailableQuestions(currentPage);
  };

  const handleRemove = async (id) => {
    await removeQuestionFromContentListening(id);
    fetchSelectedQuestions();
    fetchAvailableQuestions(currentPage);
  };

  const handleChangeSize = (value) => setSize(+value);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    fetchAvailableQuestions(selectedPage);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/admin/content_listening" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Listening Content
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
        <p className="text-gray-500 mt-1">Manage questions for this listening content</p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Questions</h2>
        {selectedQuestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedQuestions.map((q, i) => (
              <div key={q.exerciseQuestionId} className="bg-white border rounded p-3 shadow-sm relative">
                <button
                  onClick={() => handleRemove(q.exerciseQuestionId)}
                  className="absolute top-1 right-1 text-error-500 hover:text-error-700"
                >
                  <Trash2 size={14} />
                </button>

                {/* Question */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">{q.questionText}</p>
                </div>

                {/* Answer list */}
                <div className="space-y-2">
                  {q.answerQuestions.map((answer, i) => (
                    <div
                      key={i}
                      className={`
                  flex items-center space-x-2 text-sm px-3 py-2 rounded-md border
                  ${answer.correct
                          ? 'bg-green-50 text-green-800 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'}
                `}
                    >
                      <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold bg-white">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{answer.answerText}</span>
                      {answer.correct && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No questions selected</p>
        )}
      </div>

      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-1/5">
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-2"
              value={size}
              onChange={(e) => handleChangeSize(e.target.value)}
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="60">60</option>
              <option value={totalElements}>All</option>
            </select>
          </div>
          <div className="relative w-2/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAvailableQuestions(1)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Questions</h2>
        </div>

        {allQuestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {allQuestions.map((q, i) => {
              return (
                <div key={q.exerciseQuestionId} className="bg-white border rounded p-3 shadow-sm relative">
                  <button
                    onClick={() => handleAdd(q.exerciseQuestionId)}
                    className="absolute top-1 right-1 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Plus size={12} className="inline-block mr-1" />
                    Add
                  </button>

                  {/* Question */}
                  <div className="flex items-center justify-between mb-3 mt-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {q.questionText}
                    </p>
                  </div>

                  {/* Answer list */}
                  <div className="space-y-2">
                    {q.answerQuestions.map((answer, i) => (
                      <div
                        key={i}
                        className={`
                    flex items-center space-x-2 text-sm px-3 py-2 rounded-md border
                    ${answer.correct
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'}
                  `}
                      >
                        <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold bg-white">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{answer.answerText}</span>
                        {answer.correct && <Check className="h-4 w-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No available questions</p>
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

export default QuestionManagement;