import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import CourseManagement from "./pages/courses/CourseManagement";
import LessonManagement from "./pages/courses/LessonManagement";  
import VocabularyManagement from "./pages/content/VocabularyManagement";
import GrammarManagement from "./pages/content/GrammarManagement";
import ContentManagement from "./pages/courses/ContentManagement";
import Dashboard from "./pages/adminPages/Dashboard";

import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route
              path="/admin/courses/:courseId/lessons"
              element={<LessonManagement />}
            />
            <Route path="/admin/courses/:courseId/lessons/:lessonId/content" element={<ContentManagement />} />
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
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
