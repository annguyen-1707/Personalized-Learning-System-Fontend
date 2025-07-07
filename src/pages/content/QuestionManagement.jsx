import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, Search, ShieldX } from 'lucide-react';
import { getQuestionPageByContentListeningId, handleDeleteQuestion, acceptQuestion, rejectQuestion, inActiveQuestion } from '../../services/QuestionService';
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";

function QuestionManagement() {
  const { contentListeningId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [pageCount, setPageCount] = useState(0); // so luong trang page
  const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
  const [size, setSize] = useState(6); // 1trang bn phan tu
  const [totalElements, setTotalElements] = useState(); // tong phan tu

  useEffect(() => {
    getQuestionPage(1);
  }, [size]);

  const getQuestionPage = async (page, type) => {
    let res = await getQuestionPageByContentListeningId(page, contentListeningId, size, type);
    console.log("Data page", res)
    if (res && res.data && res.data.content) {
      setQuestions(res.data.content);
      setPageCount(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements)
    } else {
      console.error("Failed to fetch questions");
    }
  }

  const handleDelete = async (id) => {
    await handleDeleteQuestion(id);
    await getQuestionPage(currentPage);
  };

  const filteredQuestions = questions.filter((question) => {
    // Search filter(case insensitive)
    const searchText = search.toLowerCase();
    const matchQuestionText = question.questionText?.toLowerCase().includes(searchText);
    const matchAnyAnswer = question.answerQuestions?.some(answer =>
      answer.answerText?.toLowerCase().includes(searchText)
    );
    return searchText === '' || matchQuestionText || matchAnyAnswer;
  });

  const handleChangeSize = async (newSize) => {
    setSize(newSize)
  }

  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setCurrentPage(selectedPage);
    getQuestionPage(selectedPage);
  }

  const handleAccept = async (id) => {
    await acceptQuestion(id);
    await getQuestionPage(currentPage);

  }

  const handleReject = async (id) => {
    await rejectQuestion(id)
    await getQuestionPage(currentPage);
  }

  const handleInActive = async (id) => {
    await inActiveQuestion(id);
    await getQuestionPage(currentPage);
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/admin/content_listening" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Content Listening
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
            <p className="text-gray-500 mt-1">Manage questions for this question</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1/5">
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
          <div className="relative w-4/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search speaking question..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="card">
        {filteredQuestions?.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.exerciseQuestionId}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col space-y-3">
                  {/* Question text + status */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {question.questionText}
                    </p>
                    <span
                      className={`
                  text-xs font-semibold px-2 py-1 rounded-full
                  ${question.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-700'
                          : question.status === 'REJECT'
                            ? 'bg-red-100 text-red-700'
                            : question.status === 'PUBLIC'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-500'}
                `}
                    >
                      {question.status}
                    </span>
                  </div>

                  {/* Answer list */}
                  <div className="space-y-2">
                    {question.answerQuestions.map((answer, aIndex) => (
                      <div
                        key={aIndex}
                        className={`
                    flex items-center space-x-2 text-sm px-3 py-2 rounded-md border
                    ${answer.correct
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'}
                  `}
                      >
                        <span className="flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold bg-white">
                          {String.fromCharCode(65 + aIndex)}
                        </span>
                        <span className="flex-1">{answer.answerText}</span>
                        {answer.correct && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end pt-2 space-x-2">
                    {(question.status === 'PUBLIC') && (
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => handleInActive(question.exerciseQuestionId)}
                          className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-1 py-1 rounded"
                        >
                          <ShieldX size={16} className="mr-1" />
                          In Active
                        </button>
                      </div>
                    )}
                    {(question.status === 'DRAFT') && (
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => handleAccept(question.exerciseQuestionId)}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-1 py-1 rounded"
                        >
                          <Check size={16} className="mr-1" />
                          Accept
                        </button>

                        <button
                          onClick={() => handleReject(question.exerciseQuestionId)}
                          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-1 py-1 rounded"
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                    {showDeleteConfirm === question.exerciseQuestionId ? (
                        <>
                          <button
                            onClick={() => {
                              handleDelete(question.exerciseQuestionId);
                              setShowDeleteConfirm(null);
                            }}
                            className="text-error-500 hover:text-error-700"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(question.exerciseQuestionId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No question found. Please add a new question.</p>
          </div>
        )}
      </div>

      {/* Phan trang */}
      <div className="mt-4">
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
    </div >
  );
}

export default QuestionManagement;