import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import RegisterP1 from "./pages/auth/RegisterP1";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
<<<<<<< HEAD
import { useAuth } from './context/AuthContext'; 
import { useEffect } from 'react';


import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import RegisterP2 from "./pages/auth/RegisterP2";
import AwaitEmailConfirmation from "./pages/auth/AwaitEmailConfirmation";
=======
import CourseManagement from "./pages/courses/CourseManagement";
import LessonManagement from "./pages/courses/LessonManagement";  
import VocabularyManagement from "./pages/content/VocabularyManagement";
import GrammarManagement from "./pages/content/GrammarManagement";
import ContentManagement from "./pages/courses/ContentManagement";
import Dashboard from "./pages/adminPages/Dashboard";

import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import SpeakingContentManagement from "./pages/content/SpeakingContentManagement";
import DialogueManagement from "./pages/content/DialogueManagement";
>>>>>>> 007d0319ab1a1f2f899ea6b596fa733169791b09

function App() {
  const { setUser } = useAuth();
  useEffect(() => { 
    const checkLogin = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/check-login", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem("accessToken", userData.accessToken);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setUser(null);
      }
    };
    checkLogin();
  }, [setUser]);
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register1" element={<RegisterP1 />} />
          <Route path="/register2" element={<RegisterP2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<<<<<<< HEAD
          <Route path="/await-confirmation" element={<AwaitEmailConfirmation />} />
=======
>>>>>>> 007d0319ab1a1f2f899ea6b596fa733169791b09

          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Admin routes */}
          {/* <Route path="admin" element={<MainLayout />}>
             */}
          
          <Route element={<MainLayout />}>
          <Route path="/admin/content_speaking" element={<SpeakingContentManagement />} />
            <Route path="/admin/content_speaking/:contentSpeakingId/dialogue" element={<DialogueManagement />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route
              path="/admin/courses/:subjectId/lessons"
              element={<LessonManagement />}
            />
            <Route path="/admin/courses/:subjectId/lessons/:lessonId/content" element={<ContentManagement />} />
            <Route
              path="/admin/content/reading/:contentId/vocabulary"
              element={<VocabularyManagement />}
            />
            <Route
              path="/admin/content/reading/:contentId/grammar"
              element={<GrammarManagement />}
            />
          </Route>
        </Routes>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
