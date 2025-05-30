import { useState, useEffect, useLocation } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { toast } from "react-toastify";
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
    addResource,
    updateResource,
    deleteResource,
    addLog,
    fetchSubjects,
    fetchVocabulary,
    getLessonById,
    fetchLevels,
    fetchPartOfSpeech,
  } = useData();

    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const subjectPage = parseInt(queryParams.get("subjectPage") || "0", 10);

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

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const getSubject = async () => {
    try {
      const subjects = await fetchSubjects(0); // can fix later dont hardcode this
      const found = subjects?.content.find((subj) => subj.subjectId == subjectId);
      console.log('subject:', found);
      if (found) {
        setSubject(found);
      }else{
        const subjects = await fetchSubjects(1);
        const found = subjects?.content.find((subj) => subj.subjectId == subjectId);
        console.log('subject:', found);
        if (found) {
          setSubject(found);
        } else {
          console.error("Subject not found");
          toast.error("Subject not found");
        }
      }
    } catch (error) {
      console.error("Error in getSubject:", error);
    }
  };

  const getLessons = async () => {
    try {
      console.log("Fetching lesson with ID:", lessonId);

      const lessons = await getLessonById(lessonId);
      console.log("Fetched lesson:", lessons);
      if (lessons) {
        setLesson(lessons);
      }
    } catch (error) {
      console.error("Error in getLessons:", error);
    }
  };

  const jlptLevelClassMap = {
    N5: "bg-success-50 text-success-700",
    N4: "bg-teal-50 text-teal-700",
    N3: "bg-warning-50 text-warning-700",
    N2: "bg-orange-50 text-orange-700",
    N1: "bg-error-50 text-error-700",
  };

  const getVocabulary = async () => {
    try {
      console.log('lessonid', lessonId, 'currentPage', currentPage);
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

  const getLevles = async () => {
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
  // Filter lesson-specific content
  // const lessonGrammar = grammar.filter(item => item.lessonId === lessonId);
  // const lessonExercises = exercises.filter(item => item.lessonId === lessonId);

  // Get resources for the three skill types
  // const readingResources = resources.filter(resource => resource.type === 'reading');
  // const listeningResources = resources.filter(resource => resource.type === 'listening');
  // const speakingResources = resources.filter(resource => resource.type === 'speaking');

  // Reset form when changing tabs
  useEffect(() => {
    setIsAdding(false);
    setIsEditing(null);
    setShowDeleteConfirm(null);
    getLessons();
    getSubject();
    getVocabulary();
    getLevles();
    getPartOfSpeech();
    console.log("Fetching vocabulary for lessonId:", lessonId);
    console.log("Current page:", currentPage);
    console.log("Total elements:", totalElements);

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
          title: "",
          explanation: "",
          examples: "",
          notes: "",
        });
        break;
      case "exercises":
        setFormData({
          title: "",
          type: "multiple-choice",
          instructions: "",
          content: "",
          difficulty: "easy",
        });
        break;
      case "reading":
      case "listening":
      case "speaking":
        setFormData({
          title: "",
          description: "",
          url: "",
          level: "beginner",
        });
        break;
      default:
        setFormData({});
    }
  }, [activeTab, lessonId, subjectId, currentPage, totalElements]);

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
            examples: formData.examples.split("\n"),
          });
          if (response.status === "error") {
            const errorMap = {};
            response.data.forEach((err) => {
              errorMap[err.field] = err.message;
            });
            setErrors(errorMap);
            return;
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
            setErrorMessages(result.message)
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
        updateGrammar(isEditing, {
          ...formData,
          examples:
            typeof formData.examples === "string"
              ? formData.examples.split("\n")
              : formData.examples,
        });
        logAction = "Grammar Updated";
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
        await deleteGrammar(id);
        logAction = "Grammar Deleted";
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
          title: item.title,
          explanation: item.explanation,
          examples: Array.isArray(item.examples)
            ? item.examples.join("\n")
            : item.examples,
          notes: item.notes,
        };
        break;
      case "exercises":
        editData = {
          title: item.title,
          type: item.type,
          instructions: item.instructions,
          content: item.content,
          difficulty: item.difficulty,
        };
        break;
      default:
        editData = {};
    }

    setFormData(editData);
    setIsEditing(item.vocabularyId);
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
          title: "",
          explanation: "",
          examples: "",
          notes: "",
        });
        break;
      case "exercises":
        setFormData({
          title: "",
          type: "multiple-choice",
          instructions: "",
          content: "",
          difficulty: "easy",
        });
        break;
      case "reading":
      case "listening":
      case "speaking":
        setFormData({
          title: "",
          description: "",
          url: "",
          level: "beginner",
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
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Grammar Point Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="explanation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Explanation
              </label>
              <textarea
                id="explanation"
                rows={3}
                required
                value={formData.explanation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, explanation: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="examples"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Examples (one per line)
              </label>
              <textarea
                id="examples"
                rows={3}
                required
                value={
                  typeof formData.examples === "string"
                    ? formData.examples
                    : Array.isArray(formData.examples)
                    ? formData.examples.join("\n")
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, examples: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="I play tennis every Sunday.&#10;She works in a bank.&#10;They don't like coffee."
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={2}
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        );

      case "exercises":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exercise Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exercise Type
              </label>
              <select
                id="type"
                value={formData.type || "multiple-choice"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="fill-in-the-blank">Fill in the Blank</option>
                <option value="sentence-building">Sentence Building</option>
                <option value="writing">Writing</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty || "easy"}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instructions
              </label>
              <textarea
                id="instructions"
                rows={2}
                required
                value={formData.instructions || ""}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
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
                placeholder={`{"questions":[{"question":"What is the capital of France?","options":["Paris","London","Berlin","Madrid"],"answer":"Paris"}]}`}
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
            {vocabularies.length > 0 ? (
              vocabularies.map((item) => (
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
          <div>Grammar</div>
          // <div className="divide-y divide-gray-200">
          //   {lessonGrammar.length > 0 ? (
          //     lessonGrammar.map((item) => (
          //       <div
          //         key={item.id}
          //         className="p-4 hover:bg-gray-50 animate-fade-in"
          //       >
          //         <div className="flex justify-between items-start">
          //           <div className="w-full pr-8">
          //             <h3 className="text-lg font-medium text-gray-900">
          //               {item.title}
          //             </h3>
          //             <p className="text-sm text-gray-700 mt-2">
          //               {item.explanation}
          //             </p>

          //             {item.examples.length > 0 && (
          //               <div className="mt-3">
          //                 <p className="text-xs font-medium text-gray-500 uppercase">
          //                   Examples:
          //                 </p>
          //                 <ul className="mt-1 space-y-1">
          //                   {item.examples.map((example, index) => (
          //                     <li
          //                       key={index}
          //                       className="text-sm text-gray-700 pl-3 border-l-2 border-primary-200"
          //                     >
          //                       {example}
          //                     </li>
          //                   ))}
          //                 </ul>
          //               </div>
          //             )}

          //             {item.notes && (
          //               <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">
          //                 <span className="font-medium">Note:</span>{" "}
          //                 {item.notes}
          //               </div>
          //             )}
          //           </div>
          //           <div className="flex items-center flex-shrink-0">
          //             {showDeleteConfirm === item.id ? (
          //               <div className="flex items-center space-x-2">
          //                 <span className="text-xs text-gray-500">Delete?</span>
          //                 <button
          //                   onClick={() => handleDelete(item.id)}
          //                   className="text-error-500 hover:text-error-700"
          //                 >
          //                   <Check size={16} />
          //                 </button>
          //                 <button
          //                   onClick={() => setShowDeleteConfirm(null)}
          //                   className="text-gray-500 hover:text-gray-700"
          //                 >
          //                   <X size={16} />
          //                 </button>
          //               </div>
          //             ) : (
          //               <>
          //                 <button
          //                   onClick={() => startEdit(item)}
          //                   className="text-primary-600 hover:text-primary-800 mr-2"
          //                   disabled={isAdding || isEditing}
          //                 >
          //                   <Edit size={16} />
          //                 </button>
          //                 <button
          //                   onClick={() => setShowDeleteConfirm(item.id)}
          //                   className="text-error-500 hover:text-error-700"
          //                   disabled={isAdding || isEditing}
          //                 >
          //                   <Trash2 size={16} />
          //                 </button>
          //               </>
          //             )}
          //           </div>
          //         </div>
          //       </div>
          //     ))
          //   ) : (
          //     <div className="p-6 text-center text-gray-500">
          //       <Pencil className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          //       <p>No grammar points have been added to this lesson yet.</p>
          //       <button
          //         onClick={() => {
          //           setIsAdding(true);
          //           setIsEditing(null);
          //         }}
          //         className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
          //         disabled={isAdding || isEditing}
          //       >
          //         Add your first grammar point
          //       </button>
          //     </div>
          //   )}
          // </div>
        );

      case "exercises":
        return (
          <div>Exercises</div>
          // <div className="divide-y divide-gray-200">
          //   {lessonExercises.length > 0 ? (
          //     lessonExercises.map((item) => (
          //       <div
          //         key={item.id}
          //         className="p-4 hover:bg-gray-50 animate-fade-in"
          //       >
          //         <div className="flex justify-between items-start">
          //           <div>
          //             <div className="flex items-center">
          //               <h3 className="text-lg font-medium text-gray-900">
          //                 {item.title}
          //               </h3>
          //               <span
          //                 className={`ml-2 badge ${
          //                   item.difficulty === "easy"
          //                     ? "bg-success-50 text-success-700"
          //                     : item.difficulty === "medium"
          //                     ? "bg-warning-50 text-warning-700"
          //                     : "bg-error-50 text-error-700"
          //                 }`}
          //               >
          //                 {item.difficulty}
          //               </span>
          //               <span className="ml-2 badge bg-primary-50 text-primary-700">
          //                 {item.type
          //                   .split("-")
          //                   .map(
          //                     (word) =>
          //                       word.charAt(0).toUpperCase() + word.slice(1)
          //                   )
          //                   .join(" ")}
          //               </span>
          //             </div>
          //             <p className="text-sm text-gray-700 mt-1">
          //               {item.instructions}
          //             </p>
          //             <div className="mt-2 text-xs text-gray-500">
          //               <span className="font-medium">Content preview:</span>
          //               <span className="font-mono bg-gray-50 p-1 rounded ml-1">
          //                 {item.content.length > 50
          //                   ? item.content.substring(0, 50) + "..."
          //                   : item.content}
          //               </span>
          //             </div>
          //           </div>
          //           <div className="flex items-center">
          //             {showDeleteConfirm === item.id ? (
          //               <div className="flex items-center space-x-2">
          //                 <span className="text-xs text-gray-500">Delete?</span>
          //                 <button
          //                   onClick={() => handleDelete(item.id)}
          //                   className="text-error-500 hover:text-error-700"
          //                 >
          //                   <Check size={16} />
          //                 </button>
          //                 <button
          //                   onClick={() => setShowDeleteConfirm(null)}
          //                   className="text-gray-500 hover:text-gray-700"
          //                 >
          //                   <X size={16} />
          //                 </button>
          //               </div>
          //             ) : (
          //               <>
          //                 <button
          //                   onClick={() => startEdit(item)}
          //                   className="text-primary-600 hover:text-primary-800 mr-2"
          //                   disabled={isAdding || isEditing}
          //                 >
          //                   <Edit size={16} />
          //                 </button>
          //                 <button
          //                   onClick={() => setShowDeleteConfirm(item.id)}
          //                   className="text-error-500 hover:text-error-700"
          //                   disabled={isAdding || isEditing}
          //                 >
          //                   <Trash2 size={16} />
          //                 </button>
          //               </>
          //             )}
          //           </div>
          //         </div>
          //       </div>
          //     ))
          //   ) : (
          //     <div className="p-6 text-center text-gray-500">
          //       <Dumbbell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          //       <p>No exercises have been added to this lesson yet.</p>
          //       <button
          //         onClick={() => {
          //           setIsAdding(true);
          //           setIsEditing(null);
          //         }}
          //         className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
          //         disabled={isAdding || isEditing}
          //       >
          //         Add your first exercise
          //       </button>
          //     </div>
          //   )}
          // </div>
        );

      // case "reading":
      // case "listening":
      // case "speaking": {
      //   const resources =
      //     activeTab === "reading"
      //       ? readingResources
      //       : activeTab === "listening"
      //       ? listeningResources
      //       : speakingResources;

      //   const TabIcon = getTabIcon(activeTab);

      //   return (
      //     <div className="divide-y divide-gray-200">
      //       {resources.length > 0 ? (
      //         resources.map((item) => (
      //           <div
      //             key={item.id}
      //             className="p-4 hover:bg-gray-50 animate-fade-in"
      //           >
      //             <div className="flex justify-between items-start">
      //               <div>
      //                 <div className="flex items-center">
      //                   <h3 className="text-lg font-medium text-gray-900">
      //                     {item.title}
      //                   </h3>
      //                   <span className="ml-2 badge bg-primary-50 text-primary-700">
      //                     {item.level === "all-levels"
      //                       ? "All Levels"
      //                       : item.level.charAt(0).toUpperCase() +
      //                         item.level.slice(1)}
      //                   </span>
      //                 </div>
      //                 <p className="text-sm text-gray-700 mt-1">
      //                   {item.description}
      //                 </p>
      //                 <a
      //                   href={item.url}
      //                   target="_blank"
      //                   rel="noopener noreferrer"
      //                   className="mt-2 text-sm text-primary-600 hover:text-primary-800 flex items-center"
      //                 >
      //                   View Resource
      //                   <ExternalLink size={12} className="ml-1" />
      //                 </a>
      //               </div>
      //               <div className="flex items-center">
      //                 {showDeleteConfirm === item.id ? (
      //                   <div className="flex items-center space-x-2">
      //                     <span className="text-xs text-gray-500">Delete?</span>
      //                     <button
      //                       onClick={() => handleDelete(item.id)}
      //                       className="text-error-500 hover:text-error-700"
      //                     >
      //                       <Check size={16} />
      //                     </button>
      //                     <button
      //                       onClick={() => setShowDeleteConfirm(null)}
      //                       className="text-gray-500 hover:text-gray-700"
      //                     >
      //                       <X size={16} />
      //                     </button>
      //                   </div>
      //                 ) : (
      //                   <>
      //                     <button
      //                       onClick={() => startEdit(item)}
      //                       className="text-primary-600 hover:text-primary-800 mr-2"
      //                       disabled={isAdding || isEditing}
      //                     >
      //                       <Edit size={16} />
      //                     </button>
      //                     <button
      //                       onClick={() => setShowDeleteConfirm(item.id)}
      //                       className="text-error-500 hover:text-error-700"
      //                       disabled={isAdding || isEditing}
      //                     >
      //                       <Trash2 size={16} />
      //                     </button>
      //                   </>
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //         ))
      //       ) : (
      //         <div className="p-6 text-center text-gray-500">
      //           <TabIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
      //           <p>No {activeTab} resources have been added yet.</p>
      //           <button
      //             onClick={() => {
      //               setIsAdding(true);
      //               setIsEditing(null);
      //             }}
      //             className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
      //             disabled={isAdding || isEditing}
      //           >
      //             Add your first {activeTab} resource
      //           </button>
      //         </div>
      //       )}
      //     </div>
      //   );
      // }

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
