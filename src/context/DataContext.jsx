import { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockAdmins, 
  mockUsers, 
  mockCourses, 
  mockLessons, 
  mockSystemLogs,
  mockVocabulary,
  mockGrammar,
  mockExercises,
  mockResources
} from '../data/mockData';
import { data } from 'autoprefixer';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [admins, setAdmins] = useState(mockAdmins);
  const [users, setUsers] = useState(mockUsers);
  const [lessons, setLessons] = useState(mockLessons);
  const [logs, setLogs] = useState(mockSystemLogs);
  const [vocabulary, setVocabulary] = useState(mockVocabulary);
  const [grammar, setGrammar] = useState(mockGrammar);
  const [exercises, setExercises] = useState(mockExercises);
  const [resources, setResources] = useState(mockResources);
  const [subjects, setSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // api for fetching subjects "/subjects"
    useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubjects(data.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  // Subject CRUD operations
  const  addSubject = async(subject) => {
    try{
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subject)
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "failed to add subject");
        throw new Error(data.message || "failed to add subject");
      }
      setSubjects([...subjects, data.data]); // Update state with new subject
      setErrorMessage('');
      return data.data;
    } catch (error) {
      console.error('Error adding subject:', error);
       throw error;
    }
  };

  const updateSubject = async (id, subject) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subject)
      });
      const data = await response.json();
      if (!response.ok) {
         setErrorMessage(data.message);
        throw new Error(data.message || "failed to update subject.");
      }
      // Refresh subjects after update
      setSubjects(subjects.map(subject => subject.subjectId === id ? data.data : subject));
    } catch (error) {
      console.error('Error updating subject:', error);
       throw error;
    }
  };

  const deleteSubject = async (id) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        throw new Error(data.message ||`HTTP error! status: ${response.status}`);
      }
      // Remove subject from state
      setSubjects(subjects.filter(subject => subject.subjectId !== id));
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
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
        viewLogs: true
      }
    };
    setAdmins([...admins, newAdmin]);
    return newAdmin;
  };

  const updateAdmin = (id, updatedAdmin) => {
    setAdmins(admins.map(admin => admin.id === id ? { ...admin, ...updatedAdmin } : admin));
  };

  const deleteAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const updateAdminPermissions = (id, permissions) => {
    setAdmins(admins.map(admin => 
      admin.id === id ? { ...admin, permissions: { ...admin.permissions, ...permissions } } : admin
    ));
  };

  // User CRUD operations
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (id, updatedUser) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...updatedUser } : user));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Lesson CRUD operations
  const addLesson = (lesson) => {
    const newLesson = { ...lesson, id: Date.now().toString() };
    setLessons([...lessons, newLesson]);
    return newLesson;
  };

  const updateLesson = (id, updatedLesson) => {
    setLessons(lessons.map(lesson => lesson.id === id ? { ...lesson, ...updatedLesson } : lesson));
  };

  const deleteLesson = (id) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
    // Also delete related content
    setVocabulary(vocabulary.filter(item => item.lessonId !== id));
    setGrammar(grammar.filter(item => item.lessonId !== id));
    setExercises(exercises.filter(item => item.lessonId !== id));
  };

  // Content management operations
  const addVocabulary = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setVocabulary([...vocabulary, newItem]);
    return newItem;
  };

  const updateVocabulary = (id, updatedItem) => {
    setVocabulary(vocabulary.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteVocabulary = (id) => {
    setVocabulary(vocabulary.filter(item => item.id !== id));
  };

  const addGrammar = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setGrammar([...grammar, newItem]);
    return newItem;
  };

  const updateGrammar = (id, updatedItem) => {
    setGrammar(grammar.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteGrammar = (id) => {
    setGrammar(grammar.filter(item => item.id !== id));
  };

  const addExercise = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setExercises([...exercises, newItem]);
    return newItem;
  };

  const updateExercise = (id, updatedItem) => {
    setExercises(exercises.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter(item => item.id !== id));
  };

  const addResource = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setResources([...resources, newItem]);
    return newItem;
  };

  const updateResource = (id, updatedItem) => {
    setResources(resources.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteResource = (id) => {
    setResources(resources.filter(item => item.id !== id));
  };

  // Log operation
  const addLog = (action, details) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Admin User' // In a real app, this would be the current user
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
    addLog
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}