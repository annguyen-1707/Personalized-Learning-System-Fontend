import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";
import dayjs from "dayjs";

import {
  ArrowLeft,
  Book,
  FileText,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  BookOpen,
  Pencil,
  Dumbbell,
  Mic,
  BookMarked,
  Headphones,
  Search,
  Filter,
  Layers
} from "lucide-react";
import { a, div, s } from "framer-motion/client";
import ReactPaginate from "react-paginate";

function ContentManagement() {
  const { subjectId, lessonId } = useParams();
  const {
    addVocabulary,
    updateVocabulary,
    deleteVocabulary,
    addGrammar,
    updateGrammar,
    deleteGrammar,
    addExercise,
    updateExercise,
    deleteExercise,
    updateResource,
    addLog,
    fetchVocabulary,
    getLessonById,
    fetchLevels,
    fetchPartOfSpeech,
    getSubjectById,
    fetchGrammar,
    getLessonExercisesById,
  } = useData();

  const [subject, setSubject] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [vocabularies, setVocabularies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [partOfSpeech, setPartOfSpeech] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [grammars, setGrammars] = useState([]);
  const [lessonExercises, setLessonExercises] = useState([]);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const filteredVocabularies = vocabularies.filter((vocabulary) => {
    // Search filter (case insensitive)
    const searchMatch =
      search === "" ||
      vocabulary.kanji?.toLowerCase().includes(search.toLowerCase()) ||
      vocabulary.kana?.toLowerCase().includes(search.toLowerCase()) ||
      vocabulary.romaji?.toLowerCase().includes(search.toLowerCase()) ||
      vocabulary.meaning?.toLowerCase().includes(search.toLowerCase()) ||
      vocabulary.description?.toLowerCase().includes(search.toLowerCase()) ||
      vocabulary.example?.toLowerCase().includes(search.toLowerCase());

    const levelMatch = filter === "all" || vocabulary.jlptLevel === filter;

    return searchMatch && levelMatch;
  });

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

  const filteredExercises = lessonExercises.filter((exercise) => {
    const searchMatch =
      search === "" ||
      exercise.title?.toLowerCase().includes(search.toLowerCase())

    return searchMatch;
  });

  const getSubject = async () => {
    try {
      const subject = await getSubjectById(subjectId);
      if (subject) {
        setSubject(subject);
      }
    } catch (error) {
      console.error("Error in getSubject:", error);
    }
  };

  const getLessons = async () => {
    try {
      const lessons = await getLessonById(lessonId);
      if (lessons) {
        setLesson(lessons);
      }
    } catch (error) {
      console.error("Error in getLessons:", error);
    }
  };

  const getLessonExercises = async () => {
    try {
      const lessonExercises = await getLessonExercisesById(
        lessonId,
        currentPage
      );
      if (lessonExercises) {
        setLessonExercises(lessonExercises.content);
        setTotalPages(lessonExercises.page.totalPages);
        setTotalElements(lessonExercises.page.totalElements);
      }
    } catch (error) {
      console.error("Error in getLessonExercises:", error);
    }
  };

  const jlptLevelClassMap = {
    N5: "bg-success-50 text-success-700",
    N4: "bg-primary-50 text-primary-700",
    N3: "bg-warning-50 text-warning-700",
    N2: "bg-orange-50 text-orange-700",
    N1: "bg-error-50 text-error-700",
  };

  function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  const getVocabulary = async () => {
    try {
      const vocabularies = await fetchVocabulary(lessonId, currentPage);
      if (vocabularies) {
        setVocabularies(vocabularies.content);
        setTotalPages(vocabularies.page.totalPages);
        setTotalElements(vocabularies.page.totalElements);
      }
    } catch (error) {
      console.error("Error in getVocabulary:", error);
    }
  };

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

  const getPartOfSpeech = async () => {
    try {
      const parts = await fetchPartOfSpeech();
      if (parts) {
        setPartOfSpeech(parts);
      }
    } catch (error) {
      console.error("Error in getPartOfSpeech:", error);
    }
  };

  const getGrammar = async () => {
    try {
      const grammar = await fetchGrammar(lessonId, currentPage);
      if (grammar) {
        setGrammars(grammar.content);
        setTotalPages(grammar.page.totalPages);
        setTotalElements(grammar.page.totalElements);
      }
    } catch (error) {
      console.error("Error in getGrammar:", error);
    }
  };

  // Reset form when changing tabs
  useEffect(() => {
    setIsAdding(false);
    setIsEditing(null);
    setShowDeleteConfirm(null);
    getLessons();
    getSubject();
    getVocabulary();
    getLevels();
    getPartOfSpeech();
    getGrammar();
    getLessonExercises();

    // Set default form data based on active tab
    switch (activeTab) {
      case "vocabulary":
        setFormData({
          kanji: "",
          kana: "",
          romaji: "",
          meaning: "",
          description: "",
          example: "",
          partOfSpeech: "",
          jlptLevel: "",
          lessonId: lessonId,
        });
        break;
      case "grammar":
        setFormData({
          titleJp: "",
          structure: "",
          meaning: "",
          usage: "",
          example: "",
          jlptLevel: "",
          lessonId: lessonId,
        });
        break;
      case "exercises":
        setFormData({
          title: "",
          duration: "",
          content: "",
          lessonId: lessonId,
        });
        break;
      default:
        setFormData({});
    }
  }, [activeTab, lessonId, subjectId, currentPage]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    let newItem;
    let logAction;

    let response;

    switch (activeTab) {
      case "vocabulary":
        response = await addVocabulary({ ...formData });
        getVocabulary();
        if (response.status === "error") {
          const errorMap = {};
          if (Array.isArray(response.data)) {
            response.data.forEach((err) => {
              errorMap[err.field] = err.message;
            });
          }
          setErrors(errorMap);
          return;
        }
        toast.success("Vocabulary added successfully!");
        logAction = "Vocabulary Added";
        newItem = response;
        break;

      case "grammar":
        response = await addGrammar({
          ...formData,
        });
        getGrammar();
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
        logAction = "Grammar Added";
        newItem = response;
        break;

      case "exercises":
        response = await addExercise({
          ...formData,
          content: formData.content,
        });
        if (response.status === "error") {
          const errorMap = {};
          response.data.forEach((err) => {
            errorMap[err.field] = err.message;
          });
          setErrorMessages(errorMap);
          return;
        }
        toast.success("Exercise added successfully!");
        logAction = "Exercise Added";
        newItem = response;
        break;

      default:
        return;
    }

    // Xoá lỗi cũ sau khi thành công
    setErrors({});

    addLog(
      logAction,
      `New ${activeTab} content was added to lesson "${lesson.title}"`
    );
    setIsAdding(false);
    resetForm();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    let logAction;

    switch (activeTab) {
      case "vocabulary":
        const result = await updateVocabulary(isEditing, formData);
        getVocabulary();
        if (result.status === "error") {
          const errorMap = {};
          if (Array.isArray(result.data)) {
            result.data.forEach((err) => {
              errorMap[err.field] = err.message;
            });
          } else {
            setErrorMessages(result.message);
          }
          setErrors(errorMap);
          return;
        }
        toast.success("Vocabulary updated successfully!");
        setIsEditing(null);
        resetForm();
        setErrors({});
        break;

      case "grammar":
        const res = await updateGrammar(isEditing, { ...formData });
        getGrammar();
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
        break;
      case "exercises":
        updateExercise(isEditing, formData);
        logAction = "Exercise Updated";
        break;
      case "reading":
      case "listening":
      case "speaking":
        updateResource(isEditing, formData);
        logAction = `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } Resource Updated`;
        break;
      default:
        return;
    }

    addLog(
      logAction,
      `${
        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
      } content was updated in lesson "${lesson.title}"`
    );
    setIsEditing(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    let logAction;

    switch (activeTab) {
      case "vocabulary":
        const result = await deleteVocabulary(id);
        getVocabulary();
        if (result.status === "error") {
          toast.error("Failed to delete vocabulary");
          return;
        }
        toast.success("Vocabulary deleted successfully!");
        break;
      case "grammar":
        const res = await deleteGrammar(id);
        getGrammar();
        if (res.status === "error") {
          toast.error("Failed to delete grammar");
          return;
        }
        toast.success("Grammar deleted successfully!");
        break;
      case "exercises":
        await deleteExercise(id);
        logAction = "Exercise Deleted";
        break;
      default:
        return;
    }

    addLog(
      logAction,
      `${
        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
      } content was deleted from lesson "${lesson.title}"`
    );
    setShowDeleteConfirm(null);
  };

  const startEdit = (item) => {
    let editData;

    switch (activeTab) {
      case "vocabulary":
        editData = {
          kanji: item.kanji,
          kana: item.kana,
          romaji: item.romaji,
          meaning: item.meaning,
          description: item.description,
          example: item.example,
          partOfSpeech: item.partOfSpeech,
          jlptLevel: item.jlptLevel,
          lessonId: lessonId,
        };
        break;
      case "grammar":
        editData = {
          titleJp: item.titleJp,
          structure: item.structure,
          meaning: item.meaning,
          usage: item.usage,
          example: item.example,
          jlptLevel: item.jlptLevel,
          lessonId: lessonId,
        };
        break;
      case "exercises":
        editData = {
          title: item.title,
          duration: item.duration,
          content: item.content,
          lessonId: lessonId,
        };
        break;
      default:
        editData = {};
    }

    setFormData(editData);
    setIsEditing(item.vocabularyId || item.grammarId || item.exerciseId);
    setIsAdding(false);
  };

  const resetForm = () => {
    // Reset form based on active tab
    switch (activeTab) {
      case "vocabulary":
        setFormData({
          kanji: "",
          kana: "",
          romaji: "",
          meaning: "",
          description: "",
          example: "",
          jlptLevel: "",
          partOfSpeech: "",
          lessonId: lessonId,
        });
        break;
      case "grammar":
        setFormData({
          titleJp: "",
          structure: "",
          meaning: "",
          usage: "",
          examples: "",
          jlptLevel: "",
          lessonId: lessonId,
        });
        break;
      case "exercises":
        setFormData({
          title: "",
          duration: "",
          content: "",
          lessonId: lessonId,
        });
        break;
      default:
        setFormData({});
    }
  };

  const cancelAction = () => {
    setIsAdding(false);
    setIsEditing(null);
    resetForm();
    setErrors({});
    setErrorMessages("");
  };

  // Get tab icon
  const getTabIcon = (tab) => {
    switch (tab) {
      case "vocabulary":
        return BookOpen;
      case "grammar":
        return Pencil;
      case "exercises":
        return Dumbbell;
      case "reading":
        return BookMarked;
      case "listening":
        return Headphones;
      case "speaking":
        return Mic;
      default:
        return FileText;
    }
  };

  if (!subject || !lesson) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Render form based on active tab
  const renderForm = () => {
    const DemoItem = ({ label, children }) => (
      <div className="mb-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {children}
      </div>
    );

    switch (activeTab) {
      case "vocabulary":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <p className="text-red-500 text-sm">{errorMessages}</p>
            </div>
            {/* Kanji */}
            <div>
              <label
                htmlFor="kanji"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kanji
              </label>
              <input
                id="kanji"
                type="text"
                required
                value={formData.kanji || ""}
                onChange={(e) =>
                  setFormData({ ...formData, kanji: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.kanji
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.kanji && (
                <p className="text-red-500 text-xs mt-1">{errors.kanji}</p>
              )}
            </div>

            {/* Kana */}
            <div>
              <label
                htmlFor="kana"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kana
              </label>
              <input
                id="kana"
                type="text"
                required
                value={formData.kana || ""}
                onChange={(e) =>
                  setFormData({ ...formData, kana: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.kana
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.kana && (
                <p className="text-red-500 text-xs mt-1">{errors.kana}</p>
              )}
            </div>

            {/* Romaji */}
            <div>
              <label
                htmlFor="romaji"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Romaji
              </label>
              <input
                id="romaji"
                type="text"
                value={formData.romaji || ""}
                onChange={(e) =>
                  setFormData({ ...formData, romaji: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.romaji
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.romaji && (
                <p className="text-red-500 text-xs mt-1">{errors.romaji}</p>
              )}
            </div>

            {/* Meaning */}
            <div>
              <label
                htmlFor="meaning"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meaning
              </label>
              <input
                id="meaning"
                type="text"
                value={formData.meaning || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meaning: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.meaning
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.meaning && (
                <p className="text-red-500 text-xs mt-1">{errors.meaning}</p>
              )}
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
                rows={2}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.description
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Example Sentence */}
            <div className="md:col-span-2">
              <label
                htmlFor="example"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Example Sentence
              </label>
              <input
                id="example"
                type="text"
                value={formData.example || ""}
                onChange={(e) =>
                  setFormData({ ...formData, example: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.example
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.example && (
                <p className="text-red-500 text-xs mt-1">{errors.example}</p>
              )}
            </div>

            {/* Part of Speech */}
            <div>
              <label
                htmlFor="partOfSpeech"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Part of Speech
              </label>
              <select
                id="partOfSpeech"
                value={formData.partOfSpeech}
                onChange={(e) =>
                  setFormData({ ...formData, partOfSpeech: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.partOfSpeech
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              >
                <option value="">Select...</option>
                {partOfSpeech.map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
              {errors.partOfSpeech && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.partOfSpeech}
                </p>
              )}
            </div>

            {/* JLPT Level */}
            <div>
              <label
                htmlFor="jlptLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                JLPT Level
              </label>
              <select
                id="jlptLevel"
                value={formData.jlptLevel}
                onChange={(e) =>
                  setFormData({ ...formData, jlptLevel: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.jlptLevel
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              >
                <option value="">Select...</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.jlptLevel && (
                <p className="text-red-500 text-xs mt-1">{errors.jlptLevel}</p>
              )}
            </div>
          </div>
        );

      case "grammar":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {errorMessages && (
              <div className="col-span-2">
                <p className="text-red-500 text-sm">{errorMessages}</p>
              </div>
            )}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Grammar Title (Japanese)
              </label>
              <input
                id="title"
                type="text"
                value={formData.titleJp || ""}
                onChange={(e) =>
                  setFormData({ ...formData, titleJp: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.titleJp
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.titleJp && (
                <p className="text-red-500 text-xs mt-1">{errors.titleJp}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="structure"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Structure
              </label>
              <textarea
                id="structure"
                rows={1}
                value={formData.structure || ""}
                onChange={(e) =>
                  setFormData({ ...formData, structure: e.target.value })
                }
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 
                focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.structure
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.structure && (
                <p className="text-red-500 text-xs mt-1">{errors.structure}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="meaning"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meaning
              </label>
              <textarea
                id="meaning"
                rows={2}
                value={formData.meaning || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meaning: e.target.value })
                }
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.meaning
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.meaning && (
                <p className="text-red-500 text-xs mt-1">{errors.meaning}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="example"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Example
              </label>
              <textarea
                id="example"
                rows={2}
                value={formData.example || ""}
                onChange={(e) =>
                  setFormData({ ...formData, example: e.target.value })
                }
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.example
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
                placeholder="例えば、これは例文です。"
              />
              {errors.example && (
                <p className="text-red-500 text-xs mt-1">{errors.example}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="usage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usage
              </label>
              <textarea
                id="usage"
                rows={1}
                value={formData.usage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, usage: e.target.value })
                }
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.usage
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.usage && (
                <p className="text-red-500 text-xs mt-1">{errors.usage}</p>
              )}
            </div>

            <div className="">
              <label
                htmlFor="jlptLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                JLPT Level
              </label>
              <select
                id="jlptLevel"
                value={formData.jlptLevel}
                onChange={(e) =>
                  setFormData({ ...formData, jlptLevel: e.target.value })
                }
                className={`input border rounded px-3 py-2 w-full ${
                  errors.jlptLevel
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              >
                <option value="">Select...</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.jlptLevel && (
                <p className="text-red-500 text-xs mt-1">{errors.jlptLevel}</p>
              )}
            </div>
          </div>
        );

      case "exercises":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exercise Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="">
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Set Time
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem label={'"minutes" and "seconds"'}>
                  <MultiSectionDigitalClock
                    views={["minutes", "seconds"]}
                    value={
                      formData.duration
                        ? dayjs(formData.duration, "mm:ss")
                        : null
                    }
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        duration: value?.format?.("mm:ss"),
                      })
                    }
                  />
                </DemoItem>
              </LocalizationProvider>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exercise Content (JSON format)
              </label>
              <textarea
                id="content"
                rows={6}
                required
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                placeholder={`[{"questionText": "Thủ đô của Thái Lan là gì?","answerQuestionRequests": [{"answerText": "Hà Nội","isCorrect": true},{"answerText": "Hồ Chí Minh","isCorrect": false},{"answerText": "Đà Nẵng","isCorrect": false},{"answerText": "Huế","isCorrect": false}]}]`}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render content list based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "vocabulary":
        return (
          <div className="divide-y divide-gray-200">
            {filteredVocabularies.length > 0 ? (
              filteredVocabularies.map((item) => (
                <div
                  key={item.vocabularyId}
                  className="p-4 hover:bg-gray-50 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.kanji}
                        </h3>
                        <span
                          className={`ml-2 badge ${
                            jlptLevelClassMap[item.jlptLevel] ||
                            "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.jlptLevel}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        <strong>Kana:</strong> {item.kana} |{" "}
                        <strong>Romaji:</strong> {item.romaji}
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Meaning:</strong> {item.meaning}
                      </p>

                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Description:</strong> {item.description}
                        </p>
                      )}

                      {item.example && (
                        <p className="text-sm text-gray-700 italic mt-2">
                          <strong>Example:</strong> “{item.example}”
                        </p>
                      )}

                      <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                        <span>
                          <strong>Part of speech:</strong> {item.partOfSpeech}
                        </span>
                        <span>
                          <strong>Updated:</strong>{" "}
                          {new Date(item.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center ml-4">
                      {showDeleteConfirm === item.vocabularyId ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Delete?</span>
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
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="text-primary-600 hover:text-primary-800 mr-2"
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
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
        );

      case "grammar":
        return (
          <div className="divide-y divide-gray-200">
            {filteredGrammars.length > 0 ? (
              filteredGrammars.map((item) => {
                const formattedDate = formatDate(item.updatedAt);

                return (
                  <div
                    key={item.grammarId}
                    className="p-4 hover:bg-gray-50 animate-fade-in"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.titleJp}
                          </h3>
                          <span
                            className={`ml-2 text-xs font-medium px-2 py-1 rounded ${
                              jlptLevelClassMap[item.jlptLevel]
                            }`}
                          >
                            {item.jlptLevel}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Structure:</strong> {item.structure}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Meaning:</strong> {item.meaning}
                        </p>

                        {item.example && (
                          <p className="text-sm text-gray-700 italic mt-2">
                            <strong>Example:</strong> “{item.example}”
                          </p>
                        )}

                        <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                          <span>
                            <strong>usage:</strong> {item.usage}
                          </span>
                          {formattedDate && (
                            <span>
                              <strong>Updated:</strong> {formattedDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center ml-4">
                        {showDeleteConfirm === item.grammarId ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              Delete?
                            </span>
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
                          <>
                            <button
                              onClick={() => startEdit(item)}
                              className="text-primary-600 hover:text-primary-800 mr-2"
                              disabled={isAdding || isEditing}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setShowDeleteConfirm(item.grammarId)
                              }
                              className="text-error-500 hover:text-error-700"
                              disabled={isAdding || isEditing}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
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

      case "exercises":
        return (
          <div className="divide-y divide-gray-200">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ⏱ {item.duration} minutes
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.content?.length || 0} questions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {showDeleteConfirm === item.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button
                            onClick={() => handleDelete(item.id)}
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
                       <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/courses/${subject.subjectId}/lessons/${lessonId}/exercises/${item.id}`}
                            className="text-secondary-600 hover:text-secondary-800"
                            title="Manage Lessons"
                          >
                            <Layers size={16} />
                          </Link>
                          <button
                            onClick={() => startEdit(item)}
                            className="text-primary-600 hover:text-primary-800 mr-2"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Dumbbell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No exercises have been added to this lesson yet.</p>
                <button
                  onClick={() => {
                    setIsAdding(true);
                    setIsEditing(null);
                  }}
                  className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                  disabled={isAdding || isEditing}
                >
                  Add your first exercise
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link
          to={`/admin/courses/${subjectId}/lessons`}
          className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Lessons
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lesson.name} - Content
            </h1>
            <p className="text-gray-500 mt-1">
              Manage learning content for this lesson
            </p>
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
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </div>
      </div>

      {/* Course and Lesson Details Card */}
      <div className="card p-4 mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
            <Book className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium">{subject.subjectName}</p>
          </div>
          <div className="mx-4 text-gray-300">|</div>
          <div className="h-10 w-10 rounded-md bg-secondary-100 flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lesson {lessonId}</p>
            <p className="font-medium">{lesson.name}</p>
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search content..."
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
        <div className="border-b border-gray-200">
          <nav className="flex">
            {["vocabulary", "grammar", "exercises"].map((tab) => {
              const TabIcon = getTabIcon(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === tab
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <TabIcon size={16} className="mr-2" />
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-medium mb-4">
              {isAdding
                ? `Add New ${
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                  }`
                : `Edit ${
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                  }`}
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

export default ContentManagement;
