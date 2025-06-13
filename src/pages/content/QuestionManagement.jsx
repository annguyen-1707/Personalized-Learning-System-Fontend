import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, Search } from 'lucide-react';
import { getQuestionPageByContentListeningId, handleCreateQuestion, handleDeleteQuestion, handleUpdateQuestion } from '../../services/QuestionService';
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
  const [size, setSize] = useState(5); // 1trang bn phan tu
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    questionText: '',
    answerQuestions: [{ answerText: '', correct: false }],
    content_listening_id: contentListeningId
  });

  useEffect(() => {
    getQuestionPage(1);
  }, [size]);

  const getQuestionPage = async (page) => {
    let res = await getQuestionPageByContentListeningId(page, contentListeningId, size);
    console.log("Data page", res)
    if (res && res.data && res.data.content) {
      setQuestions(res.data.content);
      setPageCount(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements)
    } else {
      console.error("Failed to fetch questions");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      try {
        await handleCreateQuestion(formData);
        await getQuestionPage(currentPage);
        // Reset form
        setFormData({
          questionText: '',
          answerQuestions: [{ answerText: '', correct: false }],
          content_listening_id: contentListeningId
        });
        setIsAdding(false);
        setErrorMessage("");
        toast.success("Tạo question thành công!");
      } catch (error) {
        toast.error("Tạo question thất bại!");
        setErrorMessage(error.message || "Failed to add question Speaking.");
      }
    } else if (isEditing) {
      try {
        await handleUpdateQuestion(isEditing, formData);
        await getQuestionPage(currentPage);
        // Reset form
        setFormData({
          questionText: '',
          answerQuestions: [{ answerText: '', correct: false }],
          content_listening_id: contentListeningId
        });
        setIsEditing(null);
        setErrorMessage("");
        toast.success("Cập nhật question thành công!");
      } catch (error) {
        console.error("Error updating question:", error);
        setErrorMessage(error.message || "Failed to update question Speaking.");
        toast.error("Cập nhật question thất bại!");
      }
    }

  };

  const handleDelete = async (id) => {
    await handleDeleteQuestion(id);
    await getQuestionPage(currentPage);
  };

  const startUpdate = (question) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData(question);
    setIsEditing(question.exerciseQuestionId);
    setIsAdding(false);
    setErrorMessage("");
  }

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
          <button
            onClick={() => { setIsAdding(true); setIsEditing(null); }}
            className="btn-primary flex items-center"
            disabled={isAdding || isEditing}
          >
            <Plus size={16} className="mr-1" />
            Add Question
          </button>
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
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
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
      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? 'Add New Question' : 'Edit Question'}
          </h2>
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm flex items-center justify-between">
              <p className="mb-2">{errorMessage}</p>
              <button className="text-red-700 hover:text-red-900" onClick={() => setErrorMessage("")}>X</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer Questions:
                </label>
                <div className="space-y-2">
                  {formData.answerQuestions.map((answerQuestions, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answerQuestions.answerText}
                        onChange={(e) => {
                          const updated = [...formData.answerQuestions];
                          updated[index].answerText = e.target.value;
                          setFormData({ ...formData, answerQuestions: updated });
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="flex-20 "
                      />
                      {/* Radio để chọn đúng */}
                      <label className="text-sm text-gray-500">Correct</label>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={answerQuestions.correct === true}
                        onChange={() => {
                          const updated = formData.answerQuestions.map((ans, i) => ({
                            ...ans,
                            correct: i === index
                          }));
                          setFormData({ ...formData, answerQuestions: updated });
                        }}
                      />
                      <span className="text-sm text-gray-500">
                        Delete </span>
                      {formData.answerQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.answerQuestions.filter((_, i) => i !== index);
                            setFormData({ ...formData, answerQuestions: updated });
                          }}
                          className="text-error-500 hover:text-error-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        answerQuestions: [
                          ...formData.answerQuestions,
                          { answerText: '', correct: false }
                        ]
                      });
                    }}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setFormData({
                    questionText: '',
                    answerQuestions: [{ answerText: '', correct: false }],
                    content_listening_id: contentListeningId
                  });
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {isAdding ? 'Add Question' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="card">
        <div className="divide-y divide-gray-200">
          {filteredQuestions?.length > 0 ? (
            filteredQuestions.map((question) => (
              <div key={question.exerciseQuestionId} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{question.questionText}</p>
                    <ul className="mt-2 space-y-1">
                      {question.answerQuestions.map((answer, index) => (
                        <li
                          key={index}
                          className={`text-sm ${answer.correct
                            ? 'text-success-600 font-medium'
                            : 'text-gray-600'
                            }`}
                        >
                          {answer.answerText}
                          {answer.correct && ' ✓'}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="ml-4 flex items-center">
                    {showDeleteConfirm === question.exerciseQuestionId ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(question.exerciseQuestionId)}
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
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => startUpdate(question)}
                          className="text-primary-600 hover:text-primary-800 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(question.exerciseQuestionId)}
                          className="text-error-500 hover:text-error-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))) : (
            <div className="p-6 text-center text-gray-500">
              <p>No question found. Please add a new question.</p>
            </div>
          )}
        </div>
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
    </div>
  );
}

export default QuestionManagement;