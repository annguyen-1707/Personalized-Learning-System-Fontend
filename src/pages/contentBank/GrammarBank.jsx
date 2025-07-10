import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { Plus, Edit, Trash2, Check, X, BookOpen, Search } from "lucide-react";
import { fetchGrammar } from "../../services/ContentBankService";
export default function GrammarBank() {
  const { fetchLevels, addGrammar, updateGrammar, deleteGrammar } = useData();
  const [grammars, setGrammars] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // filter by JLPT level
  const [size, setSize] = useState(6); // 1trang bn phan tu
  const [totalPages, setTotalPages] = useState(0); // so luong trang page
  const [totalElements, setTotalElements] = useState(0); // tong phan tu
  const [currentPage, setCurrentPage] = useState(0); // trang page hien tai
  const [levels, setLevels] = useState([]); // To store unique levels
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const jlptLevelClassMap = {
    N5: "bg-success-50 text-success-700",
    N4: "bg-primary-50 text-primary-700",
    N3: "bg-warning-50 text-warning-700",
    N2: "bg-orange-50 text-orange-700",
    N1: "bg-error-50 text-error-700",
  };
  const [formData, setFormData] = useState({
    titleJp: "",
    structure: "",
    meaning: "",
    usage: "",
    example: "",
    jlptLevel: "",
  });

  function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  // Fetch all grammar items
  const getGrammars = async () => {
    try {
      const grammar = await fetchGrammar(currentPage, size);
      if (grammar) {
        setGrammars(grammar?.content);
        setTotalPages(grammar?.page?.totalPages);
        setTotalElements(grammar?.page?.totalElements);
      }
    } catch (error) {
      console.error("Error in getGrammar:", error);
    }
  };

  useEffect(() => {
    getGrammars();
    getLevels();
  }, [currentPage, size]);

  const getLevels = async () => {
    try {
      const levels = await fetchLevels();
      if (levels) {
        setLevels(levels);
      }
    } catch (error) {
      console.error("Error in getLevels:", error);
    }
  };

  const handleChangeSize = async (newSize) => {
    setSize(newSize);
  };

  // Add new grammar
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    let response;
    response = await addGrammar({
      ...formData,
    });
    if (response.status === "error") {
      if (!Array.isArray(response.data)) {
        setErrorMessages(response.message);
        return;
      }
      const errorMap = {};
      response.data.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      if (Object.keys(errorMap).length > 1) {
        setErrors(errorMap);
        return;
      }
    }
    toast.success("Grammar added successfully!");
    setIsAdding(false);
    resetForm();
    setErrors({});
    setErrorMessages("");
    setIsEditing(null);
    resetForm();
    setShowDeleteConfirm(null);
    getGrammars();
    return;
  };

  // Edit grammar
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await updateGrammar(isEditing, { ...formData });
    getGrammars();
    if (res.status === "error") {
      const errorMap = {};
      if (Array.isArray(res.data)) {
        res.data.forEach((err) => {
          errorMap[err.field] = err.message;
        });
      } else {
        setErrorMessages(res.message);
      }
      setErrors(errorMap);
      return;
    }
    toast.success("Grammar updated successfully!");
    setIsEditing(null);
    resetForm();
    setErrors({});
    setIsEditing(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    const res = await deleteGrammar(id);
    getGrammars();
    if (res.status === "error") {
      toast.error("Failed to delete grammar");
      return;
    }
    toast.success("Grammar deleted successfully!");
    setShowDeleteConfirm(null);
  };

  // Start editing
  const startEdit = (item) => {
    let editData;
    editData = {
      titleJp: item.titleJp,
      structure: item.structure,
      meaning: item.meaning,
      usage: item.usage,
      example: item.example,
      jlptLevel: item.jlptLevel,
    };

    setFormData(editData);
    setIsEditing(item.grammarId);
    setIsAdding(false);
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const resetForm = () => {
    setFormData({
      titleJp: "",
      structure: "",
      meaning: "",
      usage: "",
      examples: "",
      jlptLevel: "",
    });
  };

  // Cancel add/edit
  const cancelAction = () => {
    setIsAdding(false);
    setIsEditing(null);
    resetForm();
    setErrors({});
    setErrorMessages("");
  };

  // Filtered list
  const filteredGrammars = grammars.filter((grammar) => {
    const searchMatch =
      search === "" ||
      grammar.titleJp?.toLowerCase().includes(search.toLowerCase()) ||
      grammar.example?.toLowerCase().includes(search.toLowerCase()) ||
      grammar.meaning?.toLowerCase().includes(search.toLowerCase()) ||
      grammar.structure?.toLowerCase().includes(search.toLowerCase()) ||
      grammar.usage?.toLowerCase().includes(search.toLowerCase());

    const levelMatch = filter === "all" || grammar.jlptLevel === filter;

    return searchMatch && levelMatch;
  });

  const renderForm = () => {
    return (
      <div className="card p-6 mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {errorMessages && (
            <div className="col-span-2">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setErrorMessages("")}
                    className="flex-shrink-0 text-red-400 hover:text-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error occurred
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errorMessages}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grammar Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grammar Title <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="title"
                label="Grammar Title (Japanese)"
                required
                value={formData.titleJp}
                onChange={(e) =>
                  setFormData({ ...formData, titleJp: e.target.value })
                }
                className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.titleJp
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : ""
                }`}
                placeholder="例: 〜ながら"
              />
            </div>
          </div>

          {/* Structure */}
          <div>
            <label
              htmlFor="structure"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Structure <span className="text-red-500">*</span>
            </label>
            <div className="text-xs text-gray-500 mb-1">
              <textarea
                id="structure"
                rows={1}
                value={formData.structure}
                onChange={(e) =>
                  setFormData({ ...formData, structure: e.target.value })
                }
                className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.structure
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : ""
                }`}
                placeholder="例: 動詞＋ながら"
              />
            </div>
          </div>

          {/* Meaning */}
          <div>
            <label
              htmlFor="meaning"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Meaning <span className="text-red-500">*</span>
            </label>
            <textarea
              id="meaning"
              rows={2}
              value={formData.meaning}
              onChange={(e) =>
                setFormData({ ...formData, meaning: e.target.value })
              }
              className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.meaning
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : ""
              }`}
              placeholder="While doing something..."
            />
          </div>

          {/* Example */}
          <div>
            <label
              htmlFor="example"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Example <span className="text-red-500">*</span>
            </label>
            <textarea
              id="example"
              label="Example"
              rows={2}
              value={formData.example}
              onChange={(e) =>
                setFormData({ ...formData, example: e.target.value })
              }
              className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.example
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : ""
              }`}
              placeholder="例えば、音楽を聞きながら勉強します。"
            />
          </div>

          {/* Usage */}
          <div>
            <label
              htmlFor="usage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usage <span className="text-red-500">*</span>
            </label>
            <textarea
              id="usage"
              label="Usage"
              rows={1}
              value={formData.usage}
              onChange={(e) =>
                setFormData({ ...formData, usage: e.target.value })
              }
              className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.usage
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : ""
              }`}
              placeholder="Dùng khi hai hành động xảy ra đồng thời"
            />
          </div>

          {/* JLPT Level */}
          <div>
            <label
              htmlFor="jlptLevel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              JLPT Level <span className="text-red-500">*</span>
            </label>
            <select
              id="jlptLevel"
              value={formData.jlptLevel}
              onChange={(e) =>
                setFormData({ ...formData, jlptLevel: e.target.value })
              }
              className={`block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.jlptLevel
                  ? "border-red-500 bg-red-50 focus:border-red-500"
                  : ""
              }`}
            >
              <option value="">Select JLPT level...</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.jlptLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.jlptLevel}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        {filteredGrammars.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Structure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meaning
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Example
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  JLPT
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 animate-fade-in">
              {filteredGrammars.map((item) => {
                const formattedDate = formatDate(item.updatedAt);
                return (
                  <tr key={item.grammarId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold text-gray-800">
                      {item.titleJp}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {item.structure}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {item.meaning}
                    </td>
                    <td className="px-4 py-2 text-sm italic text-gray-600">
                      {item.example || (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {item.usage}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          jlptLevelClassMap[item.jlptLevel] ||
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.jlptLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-400">
                      {formattedDate}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {showDeleteConfirm === item.grammarId ? (
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleDelete(item.grammarId)}
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
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="text-primary-600 hover:text-primary-800"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(item.grammarId)}
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <BookOpen className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No grammar has been added to this lesson yet.</p>
            <button
              onClick={() => {
                setIsAdding(true);
                setIsEditing(null);
              }}
              className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
              disabled={isAdding || isEditing}
            >
              Add your first grammar item
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grammar Bank</h1>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setIsEditing(null);
            }}
            className="btn-primary flex items-center"
            disabled={isAdding || isEditing}
          >
            <Plus size={16} className="mr-1" />
            Add Grammar
          </button>
        </div>
      </div>

      {/* filter */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Select size */}
          <div className="w-32">
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

          {/* Search box */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder=".     Search content..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter select */}
          <div className="w-40">
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {levels.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Management Tabs */}
      <div className="card overflow-hidden">
        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-medium mb-4">
              {isAdding ? "Add New Grammar" : "Edit Grammar"}
            </h2>
            <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}>
              {renderForm()}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelAction}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {isAdding ? "Add" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content List */}
        <div>{renderContent()}</div>
      </div>

      <ReactPaginate
        className="pagination mt-6 justify-center"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3} // giới hạn trang bên trái 1 2 3 .... 99 100
        marginPagesDisplayed={2} // giới hạn trang bên phải 1 2 3 .... 99 100
        pageCount={totalPages}
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
  );
}
