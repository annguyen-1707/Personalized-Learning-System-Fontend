import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import RegisterP1 from "./pages/auth/RegisterP1";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EditProfilePage from "./pages/ProfilePage/EditProfilePage";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ChangePasswordPage from "./pages/ProfilePage/ChangePasswordPage";
import RegisterP2 from "./pages/auth/RegisterP2";
import AwaitEmailConfirmation from "./pages/auth/AwaitEmailConfirmation";
import CourseManagement from "./pages/courses/CourseManagement";
import LessonManagement from "./pages/courses/LessonManagement";
import VocabularyManagement from "./pages/content/VocabularyManagement";
import GrammarManagement from "./pages/content/GrammarManagement";
import ContentManagement from "./pages/courses/ContentManagement";
import Dashboard from "./pages/adminPages/Dashboard";


import SpeakingContentManagement from "./pages/content/SpeakingContentManagement";
import DialogueManagement from "./pages/content/DialogueManagement";
import AuthInitializer from "./context/AuthInitializer";

function App() {

  return (
    <AuthProvider>
      <DataProvider>
        <AuthInitializer />
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register1" element={<RegisterP1 />} />
          <Route path="/register2" element={<RegisterP2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
           {/*ProfilePage routes*/}
          <Route path="/" element={<Layout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />}/>
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          </Route>
          <Route path="/await-confirmation" element={<AwaitEmailConfirmation />} />

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
