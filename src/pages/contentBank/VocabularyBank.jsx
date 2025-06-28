import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Book,
  BookOpen,
  Plus,
} from "lucide-react";
import ReactPaginate from "react-paginate";
import { useData } from "../../context/DataContext";
import {
  getPageAllVocabulary,
  editVocabulary,
  addVocabulary,
  deleteVocabulary,
} from "../../services/ContentBankService";

export default function VocabularyBank() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [size, setSize] = useState(6); // 1trang bn phan tu
  const [pageCount, setPageCount] = useState(0); // so luong trang page
  const [totalElements, setTotalElements] = useState(); // tong phan tu
  const [currentPage, setCurrentPage] = useState(0); // trang page hien tai
  const [allVocabulary, setAllVocabulary] = useState([]); // To store all vocabulary items
  const [levers, setLevers] = useState([]); // To store unique levels
  const [partOfSpeech, setPartOfSpeech] = useState([]); // To store unique part of speech
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
    kanji: "",
    kana: "",
    romaji: "",
    meaning: "",
    description: "",
    example: "",
    partOfSpeech: "",
    jlptLevel: "",
  });
  const { fetchPartOfSpeech, fetchLevels } = useData();
  const [filters, setFilters] = useState({
    lever: "",
    partOfSpeech: "",
  });

  const startEdit = (item) => {
    let editData;
    editData = {
      kanji: item.kanji,
      kana: item.kana,
      romaji: item.romaji,
      meaning: item.meaning,
      description: item.description,
      example: item.example,
      partOfSpeech: item.partOfSpeech,
      jlptLevel: item.jlptLevel,
    };
    setFormData(editData);
    setIsEditing(item.vocabularyId);
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      kanji: "",
      kana: "",
      romaji: "",
      meaning: "",
      description: "",
      example: "",
      jlptLevel: "",
      partOfSpeech: "",
    });
  };

  const cancelAction = () => {
    setIsAdding(false);
    setIsEditing(null);
    resetForm();
    setErrors({});
    setErrorMessages("");
  };

  useEffect(() => {
    getPageVocabularyAvailable(currentPage, size);
    getListLever();
    getListPartOfSpeech();
  }, [size, currentPage, totalElements]);

  const getPageVocabularyAvailable = async (page, size) => {
    let res = await getPageAllVocabulary(page, size);
    console.log("res", res);
    if (res && res.content && res.content.length > 0) {
      setPageCount(res.page.totalPages);
      setTotalElements(res.page.totalElements);
      setAllVocabulary(res.content);
      setCurrentPage(page);
    }
  };

  const handleChangeSize = async (newSize) => {
    setSize(newSize);
  };

  const getListLever = async () => {
    let res = await fetchLevels();
    if (res) {
      setLevers(res);
    }
  };

  const getListPartOfSpeech = async () => {
    let res = await fetchPartOfSpeech();
    if (res) {
      setPartOfSpeech(res);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVocabulary({ ...formData });
      await getPageVocabularyAvailable(currentPage, size);
      toast.success("Vocabulary added successfully");
      cancelAction();
    } catch (error) {
      debugger;
      const responseData = error.response?.data;

      if (!Array.isArray(responseData?.data)) {
        setErrorMessages(
          responseData?.message || "An unexpected error occurred"
        );
        return;
      }
      const errorMap = {};
      responseData.data.forEach((err) => {
        errorMap[err.field] = err.message;
      });

      if (Object.keys(errorMap).length > 0) {
        setErrors(errorMap);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editVocabulary(isEditing, formData);
      await getPageVocabularyAvailable(currentPage, size);
      toast.success("Vocabulary updated successfully");
      resetForm();
      setIsEditing(null);
    } catch (error) {
      const responseData = error.response?.data;

      if (!Array.isArray(responseData?.data)) {
        // Lỗi không phải danh sách field -> chỉ hiển thị message chung
        setErrorMessages(
          responseData?.message || "An unexpected error occurred"
        );
        return;
      }

      // Xử lý lỗi theo từng trường
      const errorMap = {};
      responseData.data.forEach((err) => {
        errorMap[err.field] = err.message;
      });

      if (Object.keys(errorMap).length > 0) {
        setErrors(errorMap);
      }
    }
  };

  const handleDelete = async (vocabularyId) => {
    try {
      await deleteVocabulary(vocabularyId);
      await getPageVocabularyAvailable(currentPage, size);
      setShowDeleteConfirm(null);
      toast.success("Vocabulary deleted successfully");
    } catch (error) {
      const responseData = error.response?.data;

      if (!Array.isArray(responseData?.data)) {
        setErrorMessages(
          responseData?.message || "An unexpected error occurred"
        );
        return;
      }

      const errorMap = {};
      responseData.data.forEach((err) => {
        errorMap[err.field] = err.message;
      });

      if (Object.keys(errorMap).length > 0) {
        setErrors(errorMap);
      }
    }
  };

  // Filter vocabulary based on search and filters
  const filteredVocabulary = allVocabulary.filter((vocab) => {
    const searchMatch =
      vocab.kanji.toLowerCase().includes(search.toLowerCase()) ||
      vocab.kana.toLowerCase().includes(search.toLowerCase()) ||
      vocab.meaning.toLowerCase().includes(search.toLowerCase()) ||
      vocab.description.toLowerCase().includes(search.toLowerCase()) ||
      vocab.example.toLowerCase().includes(search.toLowerCase()) ||
      vocab.romaji.toLowerCase().includes(search.toLowerCase());

    const leverMatch = !filters.lever || vocab.jlptLevel === filters.lever;
    const partOfSpeechMatch =
      !filters.partOfSpeech || vocab.partOfSpeech === filters.partOfSpeech;
    return searchMatch && leverMatch && partOfSpeechMatch;
  });

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Subject Vocabulary
        </h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
          }}
          className="btn-primary flex items-center"
          disabled={isAdding || isEditing}
        >
          <Plus size={16} className="mr-1" />
          Add Vocabulary
        </button>
      </div>
      {/* Search and Filters */}
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
              <option value={totalElements}>All </option>
            </select>
          </div>
          <div className="relative w-2/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vocabulary..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                handleChangeSize(totalElements);
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
              onChange={(e) => {
                handleChangeSize(totalElements);
                setFilters({ ...filters, lever: e.target.value });
              }}
            >
              <option value="">All lever</option>
              {levers.map((lever) => (
                <option key={lever} value={lever}>
                  {lever}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-1/5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Book size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 rounded-md border border-gray-300 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              value={filters.partOfSpeech}
              onChange={(e) => {
                handleChangeSize(totalElements);
                setFilters({ ...filters, partOfSpeech: e.target.value });
              }}
            >
              <option value="">All part of speech</option>
              {partOfSpeech.map((partOfSpeech) => (
                <option key={partOfSpeech} value={partOfSpeech}>
                  {partOfSpeech}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdding ? "Add New Subject" : "Edit Subject"}
            </h2>
            <button
              onClick={cancelAction}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-2">
                {errorMessages && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
                    <div className="flex">
                      <button
                        className="flex-shrink-0"
                        onClick={() => setErrorMessages("")}
                      >
                        <X className="h-5 w-5 text-red-400" />
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
                )}
              </div>

              {/* Kanji */}
              <div>
                <label
                  htmlFor="kanji"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kanji <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="kanji"
                    type="text"
                    value={formData.kanji || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, kanji: e.target.value })
                    }
                    className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.kanji
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : ""
                    }`}
                    placeholder="Enter kanji characters"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.kanji && (
                  <p className="mt-1 text-sm text-red-600">{errors.kanji}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Japanese kanji characters
                </p>
              </div>

              {/* Kana */}
              <div>
                <label
                  htmlFor="kana"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kana <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="kana"
                    type="text"
                    value={formData.kana || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, kana: e.target.value })
                    }
                    className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.kana
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : ""
                    }`}
                    placeholder="Enter kana characters"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.kana && (
                  <p className="mt-1 text-sm text-red-600">{errors.kana}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Japanese kana characters
                </p>
              </div>

              {/* Romaji */}
              <div>
                <label
                  htmlFor="romaji"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Romaji
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="romaji"
                    type="text"
                    value={formData.romaji || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, romaji: e.target.value })
                    }
                    className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.romaji
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : ""
                    }`}
                    placeholder="Enter romaji"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.romaji && (
                  <p className="mt-1 text-sm text-red-600">{errors.romaji}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Romanized Japanese text
                </p>
              </div>

              {/* Meaning */}
              <div>
                <label
                  htmlFor="meaning"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meaning <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="meaning"
                    type="text"
                    value={formData.meaning || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, meaning: e.target.value })
                    }
                    className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.meaning
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : ""
                    }`}
                    placeholder="Enter meaning in English"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.meaning && (
                  <p className="mt-1 text-sm text-red-600">{errors.meaning}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  English translation
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.description
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : ""
                  }`}
                  placeholder="Provide additional context or explanation"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Additional context or explanation
                </p>
              </div>

              {/* Example Sentence */}
              <div className="md:col-span-2">
                <label
                  htmlFor="example"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Example Sentence
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="example"
                    type="text"
                    value={formData.example || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, example: e.target.value })
                    }
                    className={`block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                      errors.example
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : ""
                    }`}
                    placeholder="Enter example sentence"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Book className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.example && (
                  <p className="mt-1 text-sm text-red-600">{errors.example}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Example usage in a sentence
                </p>
              </div>

              {/* Part of Speech */}
              <div>
                <label
                  htmlFor="partOfSpeech"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Part of Speech <span className="text-red-500">*</span>
                </label>
                <select
                  id="partOfSpeech"
                  required
                  value={formData.partOfSpeech}
                  onChange={(e) =>
                    setFormData({ ...formData, partOfSpeech: e.target.value })
                  }
                  className={`block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.partOfSpeech
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <option value="">Select part of speech...</option>
                  {partOfSpeech.map((part) => (
                    <option key={part} value={part}>
                      {part}
                    </option>
                  ))}
                </select>
                {errors.partOfSpeech && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.partOfSpeech}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Grammatical category
                </p>
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
                  required
                  value={formData.jlptLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, jlptLevel: e.target.value })
                  }
                  className={`block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.jlptLevel
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <option value="">Select JLPT level...</option>
                  {levers.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.jlptLevel && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jlptLevel}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Japanese Language Proficiency Test level
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={cancelAction}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isAdding ? "Create Vocabulary" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Available Vocabulary List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Available Vocabulary
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          {filteredVocabulary.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kanji
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kana / Romaji
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meaning
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part of Speech
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    JLPT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Example
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
                {filteredVocabulary.map((item) => (
                  <tr key={item.vocabularyId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold text-gray-800">
                      {item.kanji}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <div>
                        <strong>Kana:</strong> {item.kana}
                      </div>
                      <div>
                        <strong>Romaji:</strong> {item.romaji}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {item.meaning}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {item.partOfSpeech}
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
                    <td className="px-4 py-2 text-sm italic text-gray-600">
                      {item.example || (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-400">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {showDeleteConfirm === item.vocabularyId ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleDelete(item.vocabularyId)}
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
                            onClick={() =>
                              setShowDeleteConfirm(item.vocabularyId)
                            }
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No vocabulary has been added to this lesson yet.</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(null);
                }}
                className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                disabled={isAdding || isEditing}
              >
                Add your first vocabulary item
              </button>
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
