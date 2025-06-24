import { createContext, useContext, useState } from "react";
import {
  mockAdmins,
  mockUsers,
  mockSystemLogs,
  mockExercises,
  mockResources,
} from "../data/mockData";
import { uploadFile, uploadVideoToYouTube } from "../services/UploadFileService";
const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [admins, setAdmins] = useState(mockAdmins);
  const [users, setUsers] = useState(mockUsers);
  const [lessons, setLessons] = useState({
    content: [],
    page: { totalPages: 0, number: 0, totalElements: 0 },
  });
  const [logs, setLogs] = useState(mockSystemLogs);
  const [exercises, setExercises] = useState(mockExercises);
  const [resources, setResources] = useState(mockResources);
  const [errorMessage, setErrorMessage] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [grammar, setGrammar] = useState([]);

  // api for fetching days "/api/subjects" and "/api/lessons?subjectId={subjectId}"
  const fetchSubjects = async (page) => {
    const response = await fetch(`/api/subjects?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return data.data;
  };

  // Fetch Lessons - chạy mỗi khi subjectId thay đổi

  const lessonsFetch = async (subjectId, page) => {
    try {
      const response = await fetch(
        `/api/lessons?subjectId=${subjectId}&page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const fetchLessonStatus = async () => {
    try {
      const response = await fetch("/api/lessons/status", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching lesson status:", error);
    }
  };

  // Subject CRUD operations

  const getSubjectById = async (id) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        return data;
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching subject by ID:", error);
      throw error;
    }
  };

  const addSubject = async (subject) => {
    try {
      const imageUrl = await uploadFile(subject.thumbnailFile, "images/content_learning");
      subject.thumbnailUrl = imageUrl;

      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(subject),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "failed to add subject");
        throw new Error(data.message || "failed to add subject");
      }
      await fetchSubjects(0);
      setErrorMessage("");
      return data.data;
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };

  const updateSubject = async (id, subject) => {
    try {
      let thumbnailUrl = subject.thumbnailUrl;
      if (subject.thumbnailFile) {
        thumbnailUrl = await uploadFile(subject.thumbnailFile, "images/content_learning");
      }
      subject.thumbnailUrl = thumbnailUrl;
      const response = await fetch(`/api/subjects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(subject),
      });
      const data = await response.json();
      // Refresh subjects after update
      if (!response.ok) {
        setErrorMessage(data.message || "failed to update lesson");
        throw new Error(data.message || "failed to update lesson");
      }
      await fetchSubjects(0);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const deleteSubject = async (id) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      // Remove subject from state
      await fetchSubjects(0);
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  };

  // api for fetching lessons "/lessons"

  // Lesson CRUD operations

  const getLessonById = async (id) => {
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "failed to fetch lesson");
        throw new Error(data.message || "failed to fetch lesson");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching lesson by ID:", error);
      throw error;
    }
  };

  const addLesson = async (lesson) => {
    try {
      const res = await uploadVideoToYouTube(lesson.videoUrl, lesson.name);
      lesson.videoUrl = res.data;
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "failed to add lesson");
        throw new Error(data.message || "failed to add lesson");
      }
      setLessons((prevLessons) => ({
        ...prevLessons,
        content: [...prevLessons.content, data.data.content],
      }));
      setErrorMessage("");
      return data.data;
    } catch (error) {
      console.error("Error adding lesson:", error);
      throw error;
    }
  };

  const updateLesson = async (id, updatedLesson) => {
    let lessonName = updatedLesson.name;
    if (updatedLesson.videoUrl instanceof File) {
      const res = await uploadVideoToYouTube(updatedLesson.videoUrl, lessonName);
      updatedLesson.videoUrl = res.data;
    }
    const response = await fetch(`/api/lessons/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLesson),
    });
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    setLessons((prevLessons) => ({
      ...prevLessons,
      content: [...prevLessons.content, data.data.content],
    }));
    return data.data;
  };

  const deleteLesson = async (id) => {
    const res = await fetch(`/api/lessons/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      return data;
    }
    return data;
  };

  // Admin CRUD operations
  const addAdmin = (admin) => {
    const newAdmin = {
      ...admin,
      id: Date.now().toString(),
      permissions: {
        manageUsers: true,
        manageCourses: true,
        manageAdmins: false,
        viewLogs: true,
      },
    };
    setAdmins([...admins, newAdmin]);
    return newAdmin;
  };

  const updateAdmin = (id, updatedAdmin) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id ? { ...admin, ...updatedAdmin } : admin
      )
    );
  };

  const deleteAdmin = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const updateAdminPermissions = (id, permissions) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id
          ? { ...admin, permissions: { ...admin.permissions, ...permissions } }
          : admin
      )
    );
  };

  // User CRUD operations
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (id, updatedUser) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
    );
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Content management operations

  const fetchLevels = async () => {
    try {
      const response = await fetch("/api/vocabularies/levels");
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "failed to fetch levels");
        throw new Error(data.message || "failed to fetch levels");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching levels:", error);
      throw error;
    }
  };

  const fetchPartOfSpeech = async () => {
    try {
      const response = await fetch("/api/vocabularies/part-of-speech");
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "failed to fetch part of speech");
        throw new Error(data.message || "failed to fetch part of speech");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching part of speech:", error);
      throw error;
    }
  };

  const fetchVocabulary = async (lessonId, page) => {
    try {
      const response = await fetch(
        `/api/vocabularies?lessonId=${lessonId}&page=${page}`
      );
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "failed to fetch vocabulary");
        throw new Error(data.message || "failed to fetch vocabulary");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      throw error;
    }
  };

  const addVocabulary = async (item) => {
    const response = await fetch("/api/vocabularies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    const newItem = { ...data.data };
    setVocabulary([...vocabulary, newItem]);
    return newItem;
  };

  const updateVocabulary = async (id, updatedItem) => {
    const response = await fetch(`/api/vocabularies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });
    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    setVocabulary(
      vocabulary.map((item) =>
        item.id === id ? { ...item, ...data.data } : item
      )
    );
    return data.data;
  };

  const deleteVocabulary = async (id) => {
    const response = await fetch(`/api/vocabularies/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    return data;
  };


  // Grammar CRUD operations

  const fetchGrammar = async (lessonId, page) => {
    const response = await fetch(`/api/grammars?lessonId=${lessonId}&page=${page}`);
    if (!response.ok) {
      const data = await response.json();
      return data;
    }
    const data = await response.json();
    return data.data;
  };

  const addGrammar = async (item) => {
    const res = await fetch("/api/grammars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) {
      return data;
    }
    const newItem = { ...data.data };
    setGrammar([...grammar, newItem]);
    return newItem;
  };

  const updateGrammar = async (id, updatedItem) => {
    const res = await fetch(`/api/grammars/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });
    const data = await res.json();
    if (!res.ok) {
      return data;
    }
    setGrammar(
      grammar.map((item) =>
        item.id === id ? { ...item, ...data.data } : item
      )
    );
    return data.data;
  };

  const deleteGrammar = async (id) => {
    const res = await fetch(`/api/grammars/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      return data;
    }
    return data;
  };

  // Exercise and Resource CRUD operations

  const getLessonExercisesById = async (lessonId, page = 0) => {
    try {
      const response = await fetch(`/api/exercise-questions?lessonId=${lessonId}&page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || `Failed to fetch exercises for lesson ${lessonId}`);
        throw new Error(data.message || `Failed to fetch exercises for lesson ${lessonId}`);
      }

      const data = await response.json();

      // Ensure we return a properly structured object even if the API response is incomplete
      return {
        content: data.data?.content || [],
        page: {
          totalPages: data.data?.page?.totalPages || 0,
          number: data.data?.page?.number || 0,
          totalElements: data.data?.page?.totalElements || 0
        }
      };
    } catch (error) {
      console.error("Error fetching lesson exercises:", error);
      // Return empty data structure on error to prevent undefined errors
      return {
        content: [],
        page: {
          totalPages: 0,
          number: 0,
          totalElements: 0
        }
      };
    }
  };

  const getExerciseDetailsById = async (exerciseId) => {
    const res = await fetch(`/api/exercise-questions/exercise-details?exerciseId=${exerciseId}`);
    if (!res.ok) {
      const data = await res.json();
      return data;
    }
    const data = await res.json();
    return data.data;
  };

  const addExercise = async (item) => {
    try {
      // Validate item before sending
      if (!item || typeof item !== 'object') {
        throw new Error("Invalid exercise data: data must be an object");
      }

      // Ensure required fields are present
      if (!item.lessonId) {
        throw new Error("lessonId is required for creating an exercise");
      }

      // Create a clean copy of the data and ensure answerQuestionRequests is always included
      const cleanItem = {
        ...Object.fromEntries(
          Object.entries(item).filter(([_, v]) => v !== undefined)
        ),
        // Make sure answerQuestionRequests is always an array (even if empty)
        answerQuestionRequests: item.answerQuestionRequests || []
      };

      console.log("Sending exercise data:", cleanItem); // Debug logging

      const response = await fetch("/api/exercise-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(cleanItem),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to create exercise");
        throw new Error(data.message || "Failed to create exercise");
      }

      // Return the created exercise from the API response
      return data.data;
    } catch (error) {
      console.error("Error adding exercise:", error);
      throw error;
    }
  };

  const updateExercise = async (id, updatedItem) => {
    try {
      const response = await fetch(`/api/exercise-questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(updatedItem),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to update exercise");
        throw new Error(data.message || "Failed to update exercise");
      }

      // Return the updated exercise from the API response
      return data.data;
    } catch (error) {
      console.error("Error updating exercise:", error);
      throw error;
    }
  };

  const deleteExercise = async (id) => {
    try {
      const response = await fetch(`/api/exercise-questions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to delete exercise");
        throw new Error(data.message || "Failed to delete exercise");
      }

      // Return true if deletion was successful
      return true;
    } catch (error) {
      console.error("Error deleting exercise:", error);
      throw error;
    }
  };

  const addResource = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setResources([...resources, newItem]);
    return newItem;
  };

  const updateResource = (id, updatedItem) => {
    setResources(
      resources.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const deleteResource = (id) => {
    setResources(resources.filter((item) => item.id !== id));
  };

  // Log operation
  const addLog = (action, details) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: "Admin User", // In a real app, this would be the current user
    };
    setLogs([newLog, ...logs]);
    return newLog;
  };

  const value = {
    admins,
    users,
    lessons,
    logs,
    exercises,
    errorMessage,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    updateAdminPermissions,
    addUser,
    updateUser,
    deleteUser,
    addSubject,
    updateSubject,
    deleteSubject,
    addLesson,
    updateLesson,
    deleteLesson,
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
    lessonsFetch,
    fetchSubjects,
    fetchLessonStatus,
    getLessonById,
    fetchVocabulary,
    fetchLevels,
    fetchPartOfSpeech,
    getSubjectById,
    fetchGrammar,
    getLessonExercisesById,
    getExerciseDetailsById
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
