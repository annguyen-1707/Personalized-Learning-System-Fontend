import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, Search, Dumbbell, Headphones, ShieldX } from 'lucide-react';
import {
  getQuestionPageFromAPI, handleCreateQuestion, handleDeleteQuestion, handleUpdateQuestion,
  getLessonBySubjectIdFromAPI,
  getListAllSubjectFromAPI,
  getExerciseByLessonIdFromAPI,
  getContentListeningByLeverFromAPI
} from '../../services/QuestionService';
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import { getJlptLevel, getStatus } from '../../services/ContentListeningService';
import { a } from 'framer-motion/client';
import { useAuth } from '../../context/AuthContext';

function QuestionManagement() {
  const { lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [pageCount, setPageCount] = useState(0); // so luong trang page
  const [currentPage, setCurrentPage] = useState(1); // trang page hien tai
  const [size, setSize] = useState(6); // 1trang bn phan tu
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [errorMessage, setErrorMessage] = useState("");
  const [formChoose, setFormChoose] = useState({
    type: '',
    subjectId: '',
    lessonId: '',
    exerciseId: '',
    jlptLevel: '',
    contentListeningId: ''
  })
  const [listLever, setListLever] = useState([]);
  const [listContentListening, setListContentListening] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [listSubject, setListSubject] = useState([]);
  const [listLesson, setListLesson] = useState([]);
  const [listExercise, setListExercise] = useState([]);
  const [activeType, setActiveType] = useState("exercise");
  const TypeTabs = ({ activeType, setActiveType }) => {
    const types = [
      {
        key: "exercise",
        label: "Exercise",
        icon: <Dumbbell className="mr-2" size={16} />,
      },
      {
        key: "contentListening",
        label: "Content Listening",
        icon: <Headphones className="mr-2" size={16} />,
      },
    ];

    return (
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex">
          {types.map((type) => (
            <button
              key={type.key}
              onClick={() => {
                setActiveType(type.key)
                getQuestionPage(1, type.key);
                setCurrentPage(1);
              }}
              className={`
              flex items-center px-4 py-3 text-sm font-medium border-b-2 transition
              ${activeType === type.key
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
            `}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    answerQuestions: [{ answerText: '', correct: false }],
    contentListeningId: '',
    exerciseId: '',
    type: ''
  });
  const { user } = useAuth();
  const isStaff =
    user &&
    Array.isArray(user.role) &&
    user.role.some(role =>
      ["STAFF"].includes(role)
    );
  const isContentManagerment =
    user &&
    Array.isArray(user.role) &&
    user.role.some(role =>
      ["CONTENT_MANAGER"].includes(role)
    );

  useEffect(() => {
    getQuestionPage(1);
    setCurrentPage(1);
    getListStatus();
  }, [size]);

  const filteredQuestions = questions.filter((question) => {
    // Search filter(case insensitive)
    const searchText = search.toLowerCase();
    const matchQuestionText = question.questionText?.toLowerCase().includes(searchText);
    const matchAnyAnswer = question.answerQuestions?.some(answer =>
      answer.answerText?.toLowerCase().includes(searchText)
    );
    return searchText === '' || matchQuestionText || matchAnyAnswer;
  });

  const getQuestionPage = async (page, type) => {
    let res = await getQuestionPageFromAPI(page, size, type || activeType);
    console.log("getQuestionPage", res.data.content);
    if (res && res.data && res.data.content) {
      setQuestions(res.data.content);
      setPageCount(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements)
    } else {
      console.error("Failed to fetch questions");
    }
  }

  const getListLever = async () => {
    let res = await getJlptLevel();
    if (res && res.data) {
      setListLever(res.data)
    }
  }

  const getListSubject = async () => {
    const res = await getListAllSubjectFromAPI();
    if (res && res.data) {
      setListSubject(res.data)
    }
  }

  const getListStatus = async () => {
    let res = await getStatus();
    if (res && res.data) {
      setListStatus(res.data)
    }
  }

  const getListContentListening = async (newLever) => {
    let res = await getContentListeningByLeverFromAPI(newLever);
    if (res && res.data) {
      setListContentListening(res.data)
    }
  }

  const getLessonBySubjet = async (newSubject) => {
    let res = await getLessonBySubjectIdFromAPI(newSubject);
    if (res && res.data.content) {
      setListLesson(res.data.content);
    }
  }

  const getExerciseByLesson = async (newLesson) => {
    let res = await getExerciseByLessonIdFromAPI(newLesson);
    if (res && res.data.content) {
      setListExercise(res.data.content);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      contentListeningId: formChoose.contentListeningId,
      exerciseId: formChoose.exerciseId,
      type: formChoose.type,
    };
    if (isAdding) {
      setFormData(updatedFormData);
      try {
        await handleCreateQuestion(updatedFormData);
        await getQuestionPage(currentPage);
        // Reset form
        handleSetNullAll();
        setIsAdding(false);
        toast.success("Tạo question thành công!");
      } catch (error) {
        toast.error("Tạo question thất bại!");
        setErrorMessage(error.message || "Failed to add question Speaking.");
      }
    } else if (isEditing) {
      try {
        await handleUpdateQuestion(isEditing, updatedFormData);
        await getQuestionPage(currentPage);
        // Reset form
        handleSetNullAll();
        setIsEditing(null);
        toast.success("Cập nhật question thành công!");
      } catch (error) {
        console.error("Error updating question:", error);
        setErrorMessage(error.message || "Failed to update question Speaking.");
        toast.error("Cập nhật question thất bại!");
      }
    }
  };

  const startUpdate = (question) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData(question);
    setIsEditing(question.exerciseQuestionId);
    setIsAdding(false);
    setErrorMessage("");
  }

  const handleChangeSize = async (newSize) => {
    setSize(newSize)
  }

  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setCurrentPage(selectedPage);
    getQuestionPage(selectedPage);
  }

  const handleSetNullAll = () => {
    setFormChoose({
      type: '',
      subjectId: '',
      lessonId: '',
      exerciseId: '',
      jlptLevel: '',
      conetntListening: ''
    });
    setFormData({
      questionText: '',
      answerQuestions: [{ answerText: '', correct: false }],
      content_listening_id: '',
      exercise_id: ''
    })
    setErrorMessage("");
  }

  const handleWhenChooseType = async (newType) => {
    setFormChoose({
      type: newType,
      contentListeningId: '',
      jlptLevel: '',
      exerciseId: '',
      subjectId: '',
      lessonId: ''
    });

    if (newType === 'contentListening') {
      await getListLever();     // ví dụ lấy danh sách level JLPT
    } else if (newType === 'exercise') {
      await getListSubject();   // ví dụ lấy danh sách môn học
    }
  }

  const handleWhenChooseLever = async (newLever) => {
    setFormChoose(prev => ({
      ...prev,
      contentListeningId: '',
      jlptLevel: newLever,
      exerciseId: '',
      subjectId: '',
      lessonId: ''
    }));
    await getListContentListening(newLever);
  }

  const handleWhenChooseContentListening = async (newContent) => {
    setFormChoose(prev => ({
      ...prev,
      contentListeningId: newContent,
      exerciseId: '',
      subjectId: '',
      lessonId: ''
    }));
  }

  const handleWhenChooseSubject = async (newSubject) => {
    setFormChoose(prev => ({
      ...prev,
      contentListeningId: '',
      jlptLevel: '',
      exerciseId: '',
      subjectId: newSubject,
      lessonId: ''
    }));
    await getLessonBySubjet(newSubject);
  }

  const handleWhenChooseLesson = async (newLesson) => {
    setFormChoose(prev => ({
      ...prev,
      contentListeningId: '',
      jlptLevel: '',
      exerciseId: '',
      lessonId: newLesson
    }));
    await getExerciseByLesson(newLesson);
  }

  const handleWhenChooseExercise = async (newExercise) => {
    setFormChoose(prev => ({
      ...prev,
      contentListeningId: '',
      jlptLevel: '',
      exerciseId: newExercise,
    }));
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
            <p className="text-gray-500 mt-1">Manage questions for this question</p>
          </div>
          {(isStaff &&
            <button
              onClick={() => { setIsAdding(true); setIsEditing(null); }}
              className="btn-primary flex items-center"
              disabled={isAdding || isEditing}
            >
              <Plus size={16} className="mr-1" />
              Add Question
            </button>
          )}
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
            <div className="space-y-4">

              {/* Chọn Type */}
              <div>
                <label>Type:</label>
                <select
                  value={formChoose.type}
                  onChange={(e) => handleWhenChooseType(e.target.value)}
                  className="border p-2 ml-2"
                >
                  <option value="">-- Select Type --</option>
                  <option value="contentListening">Content Listening</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>

              {/* Nếu type = contentListening => chọn JLPT Level */}
              {formChoose.type === 'contentListening' && (
                <>
                  <div>
                    <label>JLPT Level:</label>
                    <select
                      value={formChoose.jlptLevel}
                      onChange={(e) => handleWhenChooseLever(e.target.value)}
                      className="border p-2 ml-2"
                    >
                      <option value="">-- Select Level --</option>
                      {listLever.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nếu đã chọn level thì hiển thị chọn contentListening */}
                  {formChoose.jlptLevel && (
                    <div>
                      <label>Content Listening:</label>
                      <select
                        value={formChoose.contentListeningId}
                        onChange={(e) => handleWhenChooseContentListening(e.target.value)}
                        className="border p-2 ml-2"
                      >
                        <option value="">-- Select Content --</option>
                        {listContentListening.map((content) => (
                          <option key={content.contentListeningId} value={content.contentListeningId}>{content.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Nếu type = exercise => chọn Subject, Lesson, Exercise */}
              {formChoose.type === 'exercise' && (
                <>
                  <div>
                    <label>Subject:</label>
                    <select
                      value={formChoose.subjectId}
                      onChange={(e) => handleWhenChooseSubject(e.target.value)}
                      className="border p-2 ml-2"
                    >
                      <option value="">-- Select Subject --</option>
                      {listSubject.map((sub) => (
                        <option key={sub.subjectId} value={sub.subjectId}>{sub.subjectName}</option>
                      ))}
                    </select>
                  </div>

                  {formChoose.subjectId && (
                    <div>
                      <label>Lesson:</label>
                      <select
                        value={formChoose.lessonId}
                        onChange={(e) => handleWhenChooseLesson(e.target.value)}
                        className="border p-2 ml-2"
                      >
                        <option value="">-- Select Lesson --</option>
                        {listLesson.map((lesson) => (
                          <option key={lesson.lessonId} value={lesson.lessonId}>{lesson.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formChoose.lessonId && (
                    <div>
                      <label>Exercise:</label>
                      <select
                        value={formChoose.exerciseId}
                        onChange={(e) => handleWhenChooseExercise(e.target.value)}
                        className="border p-2 ml-2"
                      >
                        <option value="">-- Select Exercise --</option>
                        {listExercise.map((ex) => (
                          <option key={ex.exerciseId} value={ex.id}>{ex.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  handleSetNullAll();
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
      <TypeTabs activeType={activeType} setActiveType={setActiveType} />
      <div className="card">
        {filteredQuestions?.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.exerciseQuestionId}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {/* Title + Audio ngang hàng */}
                {question?.contentListening && (
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-800">
                      Content Listening: {question.contentListening.title}
                    </p>
                    {question.contentListening.audioFile && (
                      <audio controls className="w-300 ml-10">
                        <source
                          src={`http://localhost:8080/audio/content_listening/${question.contentListening.audioFile}`}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}

                {/* Question */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {question.questionText}
                  </p>
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
                      <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold bg-white">
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
                <div className="flex justify-end pt-4 space-x-2">
                
                    <button
                      onClick={() => startUpdate(question)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
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
    </div>
  );
}

export default QuestionManagement;