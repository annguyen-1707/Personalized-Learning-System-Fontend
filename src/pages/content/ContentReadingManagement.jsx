import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Check, X, Image, Clock, Book, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPageContentReading, handleUpdateContent, fetchAllContentCategoryReading, handleCreateContent, handleDeleteContent } from '../../services/ContentReadingService';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { data } from 'autoprefixer';

function ReadingContentManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [listContentReadings, setListContentReadings] = useState([]);
  const [listContentCategory, setlistContentCategory] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(5); // 1trang bn phan tu
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    scriptJp: '',
    scriptVn: '',
    audioFile: '',
    timeNew: '',
    contentType: 'reading',
  });
  useEffect(() => {
    getContentPage(1);
    getContentCategorys();

  }, [size])

  const getContentPage = async (page) => {
    let res = await getPageContentReading(page, size);
    console.log("data", res)
    if (res && res.data && res.data.content) {
      setListContentReadings(res.data.content)
      setPageCount(res.data.page.totalPages)
      setTotalElements(res.data.page.totalElements)
    }
  }

  const getContentCategorys = async () => {
    let res = await fetchAllContentCategoryReading();
    if (res && res.data) {
      setlistContentCategory(res.data)
    }
  }

  const handleDelete = async (id) => {
    await handleDeleteContent(id);
    await getContentPage(1);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      try {
        await handleCreateContent(formData);
        await getContentPage(currentPage);
        // Reset form
        setFormData({
          title: '',
          image: '',
          category: '',
          scriptJp: '',
          scriptVn: '',
          audioFile: '',
          timeNew: '',
          contentType: 'reading',
        });
        setIsAdding(false);
        setErrorMessage("");
        toast.success("Tạo content thành công!");
      } catch (error) {
        toast.error("Tạo content thất bại!");
        setErrorMessage(error.message || "Failed to add content Reading.");
      }
    } else if (isEditing) {
      try {
        await handleUpdateContent(isEditing, formData);
        await getContentPage(currentPage);
        // Reset form
        setFormData({
          title: '',
          image: '',
          category: '',
          scriptJp: '',
          scriptVn: '',
          audioFile: '',
          timeNew: '',
          contentType: 'reading',
        });
        setIsEditing(null);
        setErrorMessage("");
        toast.success("Cập nhật content thành công!");
      } catch (error) {
        console.error("Error updating content:", error);
        setErrorMessage(error.message || "Failed to update content Reading.");
        toast.error("Cập nhật content thất bại!");
      }
    }

  };

  const handleChangeSize = async (newSize) => {
    setSize(newSize)
  }

  const filteredContents = listContentReadings.filter((content) => {
    // Search filter (case insensitive)
    const searchMatch =
      search === "" ||
      content.title?.toLowerCase().includes(search.toLowerCase()) ||
      content.category?.toLowerCase().includes(search.toLowerCase()) ||
      content.scriptJp?.toLowerCase().includes(search.toLowerCase()) ||
      content.scriptVn?.toLowerCase().includes(search.toLowerCase()) ||
      content.category?.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = filter === "all" || content.category === filter;
    return searchMatch && categoryMatch;
  });

  const startUpdate = (content) => {
    console.log("before update:", content)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData(content);
    setIsEditing(content.contentReadingId);
    setIsAdding(false);
    setErrorMessage("");
  }

  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setCurrentPage(selectedPage);
    getContentPage(selectedPage);
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Reading Content Management</h1>
        <button
          onClick={() => { setIsAdding(true); setIsEditing(null); }}
          className="btn-primary flex items-center"
          disabled={isAdding || isEditing}
        >
          <Plus size={16} className="mr-1" />
          Add Reading Content
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* split search and filter */}
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
          <div className="relative w-3/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reading content..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='w-1/5' >
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Category</option>
              {listContentCategory.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? 'Add New Reading Content' : 'Edit Reading Content'}
          </h2>
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm flex items-center justify-between">
              <p className="mb-2">{errorMessage}</p>
              <button className="text-red-700 hover:text-red-900" onClick={() => setErrorMessage("")}>X</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                ></input>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audio File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    setFormData({ ...formData, audioFile: e.target.files[0] })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Japanese Content
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.scriptJp}
                  onChange={(e) => setFormData({ ...formData, scriptJp: e.target.value })}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vietnamese Content
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.scriptVn}
                  onChange={(e) => setFormData({ ...formData, scriptVn: e.target.value })}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full"
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {listContentCategory?.length > 0 && listContentCategory.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time new
                </label>
                <input
                  type="date"
                  value={formData.timeNew || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, timeNew: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]} // Giới hạn chọn đến hôm nay
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {isAdding ? 'Add Content' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content List */}
      <div className="card">
        <div className="divide-y divide-gray-200">
          {filteredContents?.length > 0 ? (
            filteredContents.map((content) => (
              <div key={content.contentReadingId} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{content.title}</h3>
                      <span className="ml-2 badge bg-primary-50 text-primary-700">
                        {content.contentType}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="truncate">
                            <img
                              src={`http://localhost:8080/images/content_reading/${content.image}`}
                              alt="Thumbnail"
                              className="w-20 h-20 mr-2"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='mt-2'>
                      {content.audioFile && (
                        <div className="mb-4">
                          <audio controls>
                            <source src={`http://localhost:8080/audio/content_reading/${content.audioFile}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium mb-1">Japanese Content:</p>
                        <p className="text-gray-600">{content.scriptJp}</p>
                      </div>
                      <div className="text-sm mt-2">
                        <p className="text-gray-900 font-medium mb-1">Vietnamese Content:</p>
                        <p className="text-gray-600">{content.scriptVn}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium mb-1">Category: {content.category}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium mb-1">Time new: {new Date(content.timeNew).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium mb-1">Create at: {new Date(content.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm mt-2">
                        <p className="text-gray-900 font-medium mb-1">
                          Update at: {
                            content.updatedAt
                              ? new Date(content.updatedAt).toLocaleDateString()
                              : "Never update"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center">
                    {showDeleteConfirm === content.contentReadingId ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Delete?</span>
                        <button onClick={() => {
                          handleDelete(content.contentReadingId);
                          setShowDeleteConfirm(null)
                        }}
                          className="text-error-500 hover:text-error-700">
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(content.contentReadingId)
                            setShowDeleteConfirm(null)
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => startUpdate(content)}
                          className="text-primary-600 hover:text-primary-800 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(content.contentReadingId)}
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
              No reading content found.{search && 'Try a different search term.'}
            </div>
          )}
        </div>
      </div>
      {/* Phan Trang */}
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
    </div >
  );
}

export default ReadingContentManagement;