import { createContext, useContext, useState, useEffect } from "react";
import {
  mockAdmins,
  mockUsers,
  mockSystemLogs,
  mockVocabulary,
  mockGrammar,
  mockExercises,
  mockResources,
} from "../data/mockData";
import { data } from "autoprefixer";
import { s } from "framer-motion/client";

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
  const [vocabulary, setVocabulary] = useState(mockVocabulary);
  const [grammar, setGrammar] = useState(mockGrammar);
  const [exercises, setExercises] = useState(mockExercises);
  const [resources, setResources] = useState(mockResources);
  const [subjects, setSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [errors, setErrors] = useState({});
  const [lessonStatus, setLessonStatus] = useState([]);

  // api for fetching days "/api/subjects" and "/api/lessons?subjectId={subjectId}"
  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSubjects(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Fetch Lessons - chạy mỗi khi subjectId thay đổi

  const lessonsFetch = async (subjectId, page) => {
    try {
      const response = await fetch(
        `/api/lessons?subjectId=${subjectId}&page=${page}`
      );
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
      const response = await fetch("/api/lessons/status");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching lesson status:", error);
    }
  };

  // Subject CRUD operations
  const addSubject = async (subject) => {
    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "failed to add subject");
        throw new Error(data.message || "failed to add subject");
      }
      setSubjects([...subjects, data.data]); // Update state with new subject
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };

  const updateSubject = async (id, subject) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
      });
      const data = await response.json();
      // Refresh subjects after update
      if (!response.ok) {
        setErrorMessage(data.message || "failed to update lesson");
        throw new Error(data.message || "failed to update lesson");
      }
      setSubjects(
        subjects.map((subject) =>
          subject.subjectId === id ? data.data : subject
        )
      );
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const deleteSubject = async (id) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      // Remove subject from state
      setSubjects(subjects.filter((subject) => subject.subjectId !== id));
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
      const response = await fetch(`/api/lessons/${id}`);
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
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLesson),
      });
      const data = await response.json();
      // Refresh lessons after update
      if (!response.ok) {
        setErrorMessage(data.message || "failed to update lesson");
        throw new Error(data.message || "failed to update lesson");
      }
      setLessons((prevLessons) => ({
        ...prevLessons,
        content: prevLessons.content.map((lesson) =>
          lesson.lessonId === id ? data.data.content : lesson
        ),
      }));
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  };

  const deleteLesson = (id) => {
    setLessons(lessons.filter((lesson) => lesson.lessonId !== id));
    // Also delete related content
    setVocabulary(vocabulary.filter((item) => item.lessonId !== id));
    setGrammar(grammar.filter((item) => item.lessonId !== id));
    setExercises(exercises.filter((item) => item.lessonId !== id));
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

  const addGrammar = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setGrammar([...grammar, newItem]);
    return newItem;
  };

  const updateGrammar = (id, updatedItem) => {
    setGrammar(
      grammar.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const deleteGrammar = (id) => {
    setGrammar(grammar.filter((item) => item.id !== id));
  };

  const addExercise = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setExercises([...exercises, newItem]);
    return newItem;
  };

  const updateExercise = (id, updatedItem) => {
    setExercises(
      exercises.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter((item) => item.id !== id));
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
    vocabulary,
    exercises,
    resources,
    subjects,
    errorMessage,
    lessonStatus,
    errors,
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
