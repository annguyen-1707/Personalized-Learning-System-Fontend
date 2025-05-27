import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Check, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleUpdateContent, fetchAllContentCategorySpeaking, fetchAllContentSpeaking, handleCreateContent, handleDeleteConrent } from '../../services/ContentSpeakingService';


function SpeakingContentManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [listContentSpeakings, setListContentSpeakings] = useState([]);
  const [listContentCategory, setlistContentCategory] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    contentType: 'speaking'
  });
  useEffect(() => {
    getContents();
    getContentCategorys();
  }, [])

  const getContents = async () => {
    let res = await fetchAllContentSpeaking();
    if (res && res.data) {
      setListContentSpeakings(res.data)
    }
  }

  const getContentCategorys = async () => {
    let res = await fetchAllContentCategorySpeaking();
    if (res && res.data) {
      setlistContentCategory(res.data)
    }
  }

  const handeDelete = async (id) => {
    await handleDeleteConrent(id);
    await getContents();                  // Lấy lại danh sách mới
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      try {
        await handleCreateContent(formData);  // Đợi upload và tạo content xong
        await getContents();                  // Lấy lại danh sách mới
        setIsAdding(false);
        setIsEditing(null);
      } catch (error) {
        console.error("Error creating content:", error);
      }
    } else if (isEditing) {
      try {
        await handleUpdateContent(isEditing, formData); // Đợi upload và cập nhật content xong
        await getContents();                  // Lấy lại danh sách mới
        setIsAdding(false);
        setIsEditing(null);
      } catch (error) {
        console.error("Error updating content:", error);
      }
    }
  };

  const filteredContents = listContentSpeakings.filter((content) => {
    // Search filter (case insensitive)
    const searchMatch =
      search === "" ||
      content.title?.toLowerCase().includes(search.toLowerCase()) ||
      content.category?.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = filter === "all" || content.category === filter;
    return searchMatch && categoryMatch;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Speaking Content Management</h1>
        <button
          onClick={() => { setIsAdding(true); setIsEditing(null); }}
          className="btn-primary flex items-center"
          disabled={isAdding || isEditing}
        >
          <Plus size={16} className="mr-1" />
          Add
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search speaking content..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
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
            {isAdding ? 'Add New Speaking Content' : 'Edit Speaking Content'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" required>
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
                  Content category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full"
                >
                  <option value="" disabled selected hidden>Select a category</option>
                  {listContentCategory?.length > 0 && listContentCategory.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
            filteredContents.map((contentSpeaking) => (
              <div key={contentSpeaking.contentSpeakingId} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{contentSpeaking.title}</h3>
                      <span className="ml-2 badge bg-primary-50 text-primary-700">
                        {contentSpeaking.content.contentType}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          {/* <Image size={16} className="mr-2" /> */}
                          <span className="truncate">
                            <img
                              src={`http://localhost:8080/images/content_speaking/${contentSpeaking.image}`}
                              alt="Thumbnail"
                              className="w-20 h-20 mr-2"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link to={`/admin/content_speaking/${contentSpeaking.contentSpeakingId}/dialogue`}>
                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare size={16} className="mr-2" />
                            <span className="mr-3">Conversation Practice</span>
                            <Edit size={16} color='blue' />
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium mb-1">Category: {contentSpeaking.category}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium mb-1">Create at: {new Date(contentSpeaking.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm mt-2">
                        <p className="text-gray-900 font-medium mb-1">Update at: {new Date(contentSpeaking.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center">
                    {showDeleteConfirm === contentSpeaking.contentSpeakingId ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Delete?</span>
                        <button
                          onClick={() => {
                            handeDelete(contentSpeaking.contentSpeakingId);
                            setShowDeleteConfirm(null);
                          }}
                          className="text-error-500 hover:text-error-700">
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(null);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setFormData(contentSpeaking);
                            console.log("contentSpeaking", contentSpeaking);
                            console.log("formData", formData);
                            setIsEditing(contentSpeaking.contentSpeakingId);
                            setIsAdding(false);
                          }}
                          className="text-primary-600 hover:text-primary-800 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(contentSpeaking.contentSpeakingId)}
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
              No speaking content found.{search && 'Try a different search term.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeakingContentManagement;