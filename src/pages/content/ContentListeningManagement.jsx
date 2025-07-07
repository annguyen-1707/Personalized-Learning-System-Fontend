import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Check, X, MessageCircleQuestion, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getPageContentListening, handleUpdateContent, fetchAllContentCategoryListening, handleCreateContent,
  handleDeleteContent, getJlptLevel, getStatus, acceptContent, rejectContent, inActiveContent
} from '../../services/ContentListeningService';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { useAuth } from '../../context/AuthContext';

function ListeningContentManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [listContentListenings, setListContentListenings] = useState([]);
  const [listContentCategory, setlistContentCategory] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(6); // 1trang bn phan tuf
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAudio, setPreviewAudio] = useState(null);
  const [listStatus, setListStatus] = useState([]);
  const [listLever, setListLever] = useState([]);
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
  const [filters, setFilters] = useState({
    status: '',
    jlptLevel: '',
    category: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    scriptJp: '',
    scriptVn: '',
    audioFile: '',
    contentType: 'listening',
    status: '',
    jlptLevel: ''
  });
  useEffect(() => {
    getContentPage(1);
    getContentCategorys();
    getListLever();
    getListStatus();
  }, [size])

  const getContentPage = async (page) => {
    let res = await getPageContentListening(page, size);
    if (res && res.data && res.data.content) {
      setListContentListenings(res.data.content)
      setPageCount(res.data.page.totalPages)
      setTotalElements(res.data.page.totalElements)
    }
  }

  const getContentCategorys = async () => {
    let res = await fetchAllContentCategoryListening();
    if (res && res.data) {
      setlistContentCategory(res.data)
    }
  }

  const getListLever = async () => {
    let res = await getJlptLevel();
    if (res && res.data) {
      setListLever(res.data)
    }
  }

  const getListStatus = async () => {
    let res = await getStatus();
    if (res && res.data) {
      setListStatus(res.data)
    }
  }

  const setNullAllAttribute = () => {
    setFormData({
      title: '',
      image: '',
      category: '',
      scriptJp: '',
      scriptVn: '',
      audioFile: '',
      contentType: 'listening',
      status: '',
      jlptLevel: ''
    });
    setPreviewAudio(null)
    setPreviewImage(null)
    setErrorMessage("");
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
        setNullAllAttribute();
        setIsAdding(false);
        toast.success("Tạo content thành công!");
      } catch (error) {
        toast.error("Tạo content thất bại!");
        setErrorMessage(error.message || "Failed to add content Listening.");
      }
    } else if (isEditing) {
      try {
        await handleUpdateContent(isEditing, formData);
        await getContentPage(currentPage);
        // Reset form
        setNullAllAttribute();
        setIsEditing(null);
        toast.success("Cập nhật content thành công!");
      } catch (error) {
        console.error("Error updating content:", error);
        setErrorMessage(error.message || "Failed to update content Listening.");
        toast.error("Cập nhật content thất bại!");
      }
    }
  };

  const handleChangeSize = async (newSize) => {
    setSize(newSize)
  }

  const filteredContents = listContentListenings.filter((content) => {
    // Search filter (case insensitive)
    const searchMatch =
      search === "" ||
      content.title?.toLowerCase().includes(search.toLowerCase()) ||
      content.category?.toLowerCase().includes(search.toLowerCase()) ||
      content.scriptJp?.toLowerCase().includes(search.toLowerCase()) ||
      content.scriptVn?.toLowerCase().includes(search.toLowerCase()) ||
      content.category?.toLowerCase().includes(search.toLowerCase());
    const leverMatch = !filters.jlptLevel || content.jlptLevel === filters.jlptLevel;
    const categoryMatch = !filters.category || content.category === filters.category;
    const statusMatch = !filters.status || content.status === filters.status;
    return searchMatch && categoryMatch && statusMatch && leverMatch;
  });

  const startUpdate = (content) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData(content);
    if (content.image && typeof content.image === "string") {
      setPreviewImage(`http://localhost:8080/images/content_listening/` + content.image);
      console.log("Check previewImage" + previewImage)
    }
    // Hiển thị preview audio nếu đang edit và có URL audio
    if (content.audioFile && typeof content.audioFile === "string") {
      setPreviewAudio(`http://localhost:8080/audio/content_listening/` + content.audioFile);
      console.log("Check previewImage" + previewAudio)
    }
    setIsEditing(content.contentListeningId);
    setIsAdding(false);
    setErrorMessage("");
  }

  const handlePageClick = (event) => {
    const selectedPage = +event.selected + 1;
    setCurrentPage(selectedPage);
    getContentPage(selectedPage);
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, audioFile: file });
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewAudio(previewURL);
    } else {
      setPreviewAudio(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    } else {
      setPreviewImage(null);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setNullAllAttribute();
  }

  const handleAccept = async (id) => {
    await acceptContent(id);
    await getContentPage(currentPage);
  }

  const handleReject = async (id) => {
    await rejectContent(id);
    await getContentPage(currentPage);
  }

  const handleInActive = async (id) => {
    await inActiveContent(id);
    await getContentPage(currentPage);
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Listening Content Management</h1>
        {isStaff && (
          <button
            onClick={() => { setIsAdding(true); setIsEditing(null); }}
            className="btn-primary flex items-center"
            disabled={isAdding || isEditing}
          >
            <Plus size={16} className="mr-1" />
            Add Listening Content
          </button>
        )}
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
              placeholder="Search listening content..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSize(totalElements);
              }}
            />
          </div>
          <div className='w-1/5' >
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.category}
              onChange={(e) => {
                setFilters({ ...filters, category: e.target.value })
                setSize(totalElements);
              }}
            >
              <option value="">All Category</option>
              {listContentCategory.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className='w-1/5' >
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setSize(totalElements);
              }}
            >
              <option value="">All Status</option>
              {listStatus.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className='w-1/5' >
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.jlptLevel}
              onChange={(e) => {
                setFilters({ ...filters, jlptLevel: e.target.value });
                setSize(totalElements);
              }}
            >
              <option value="">All Lever</option>
              {listLever.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? 'Add New Listening Content' : 'Edit Listening Content'}
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
                  onChange={handleImageChange}
                ></input>
                {previewImage && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={previewImage}
                      alt="PreviewImage"
                      style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audio File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                />
                {previewAudio && (
                  <div style={{ marginTop: "10px" }}>
                    <audio key={previewAudio} controls>
                      <source src={previewAudio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Japanese Content
                </label>
                <textarea
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
                  rows={5}
                  value={formData.scriptVn}
                  onChange={(e) => setFormData({ ...formData, scriptVn: e.target.value })}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* JLPT Level */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">JLPT Level</label>
                  <select
                    value={formData.jlptLevel}
                    onChange={(e) => setFormData({ ...formData, jlptLevel: e.target.value })}
                    className="w-full border rounded p-2"
                  >
                    <option disabled value="">-- Chọn JLPT --</option>
                    {listLever.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Chủ đề</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded p-2"
                  >
                    <option disabled value="">-- Chọn chủ đề --</option>
                    {listContentCategory?.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
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
        </div >
      )
      }

      {/* Content List */}
      <div className="card">
        <div className="overflow-x-auto">
          {filteredContents?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 min-w-[120px]">Title</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Image</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Audio</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 min-w-[120px]">JP Script</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 min-w-[120px]">VN Script</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">JLPT Level</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Created At</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContents.map((content) => (
                  <tr key={content.contentListeningId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{content.title}</td>
                    <td className="px-4 py-2">
                      <img
                        src={`http://localhost:8080/images/content_listening/${content.image}`}
                        alt="Thumbnail"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {content.audioFile && (
                        <audio controls className="w-32">
                          <source
                            src={`http://localhost:8080/audio/content_listening/${content.audioFile}`}
                            type="audio/mpeg"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-900">{content.scriptJp}</td>
                    <td className="px-4 py-2 text-gray-700">{content.scriptVn}</td>
                    <td className="px-4 py-2">{content.category}</td>

                    {/* JLPT Level */}
                    <td className="px-4 py-2">{content.jlptLevel || "N/A"}</td>

                    {/* Status */}
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${content.status === "PUBLIC"
                          ? "bg-green-100 text-green-700"
                          : content.status === "REJECT"
                            ? "bg-red-100 text-red-700"
                            : content.status === "IN_ACTIVE"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {content.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-y-1">
                      {isContentManagerment && (
                        <Link
                          to={`/admin/content_listening/${content.contentListeningId}/question`}
                          className="flex items-center text-blue-600 hover:underline mb-1"
                        >
                          <MessageCircleQuestion size={14} className="mr-1" />
                          Question
                        </Link>
                      )}
                      <div className="flex space-x-2">
                        {isStaff && content.status != 'PUBLIC' && (
                          <button
                            onClick={() => startUpdate(content)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {showDeleteConfirm === content.contentListeningId ? (
                          <>
                            <button
                              onClick={() => {
                                handleDelete(content.contentListeningId);
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
                        ) : isContentManagerment && (
                          <button
                            onClick={() => setShowDeleteConfirm(content.contentListeningId)}
                            className="text-error-500 hover:text-error-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      {isContentManagerment && content.status === "DRAFT" && (
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => handleAccept(content.contentListeningId)}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-1 py-1 rounded"
                          >
                            <Check size={16} className="mr-1" />
                            Accept
                          </button>

                          <button
                            onClick={() => handleReject(content.contentListeningId)}
                            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-1 py-1 rounded"
                          >
                            <X size={16} className="mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {isContentManagerment && content.status === "PUBLIC" && (
                        <div className="flex gap-4 mt-2">
                          <button
                            onClick={() => handleInActive(content.contentListeningId)}
                            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-1 py-1 rounded"
                          >
                            <ShieldX size={16} className="mr-1" />
                            In Active
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {content.updatedAt
                        ? new Date(content.updatedAt).toLocaleDateString()
                        : "Never update"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No listening content found.{search && " Try a different search term."}
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

export default ListeningContentManagement;