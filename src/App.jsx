import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminList from './pages/admin/AdminList';
import React, { useState } from "react";

import Layout from "./components/layout/Layout";
import LayoutParent from "./components/layout/LayoutParent";
import Login from "./pages/auth/Login";
import RegisterP1 from "./pages/auth/RegisterP1";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SystemLogs from "./pages/admin/SystemLogs";
import UserManagement from "./pages/users/UserManagement";
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
import ContentSpeakingManagement from "./pages/content/ContentSpeakingManagement";
import DialogueManagement from "./pages/content/DialogueManagement";
import OAuthCallBack from "./pages/auth/OAuthCallBack";
import ContentReadingManagement from "./pages/content/ContentReadingManagement";
import ListeningContentManagement from "./pages/content/ContentListeningManagement";
import FavoriteFoldersPage from './pages/FavoriteFoldersPage/FavoriteFoldersPage'
import UpgradePage from "./pages/Upgrade/UpgradePage";
import VnpayReturn from "./pages/Upgrade/VnpayReturn.jsx";
import ParentPage from "./pages/Parent/ParentPage.jsx";
import ViewChildren from "./pages/Parent/ViewChildren.jsx";
import ListeningPage from "./pages/ListeningPage/ListeningPage";
import ListeningDetailPage from "./pages/ListeningPage/ListeningDetailPage";
import ExerciseManagement from "./pages/courses/ExerciseManagement";
import LearningPage from "./pages/LearningPage/LearningPage";
import NotificationSlider from "./pages/HomePage/Notification.jsx";
import CourseContentPage from "./pages/LearningPage/components/CourseContent.jsx";
import LessonPage from "./pages/LearningPage/LessonPage.jsx";
import DoExercise from "./pages/LearningPage/components/DoExercise.jsx";
import FeedbackWidget from "./components/layout/Feedback.jsx";
import NewsPage from './pages/NewsPage/NewsPage';
import AdminRoute from "./context/AdminRoute.jsx";
import DenyAdmin from "././pages/auth/DenyAdmin.jsx"
import QuizPage from "./QuizPage/QuizPage.jsx";

import { QuizProvider } from "./context/QuizContext.jsx";

function App() {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <AuthProvider>
      <DataProvider>
        <QuizProvider> 
        <FeedbackWidget />
        <Routes>
          <Route path="/" element={<Layout onNotificationClick={() => setNotificationOpen(true)} />}>
            {/* Trang chính */}
            <Route index element={<HomePage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="vnpay-return" element={<VnpayReturn />} />

            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="profile/change-password" element={<ChangePasswordPage />} />

            {/* Listening */}
            <Route path="listening" element={<ListeningPage />} />
            <Route path="listening/detail/:contentListeningId" element={<ListeningDetailPage />} />
            <Route path="listening/:id" element={<ListeningDetailPage />} />

            {/* Learning */}
            <Route path="learning" element={<LearningPage />} />
            <Route path="learning/:subjectId" element={<CourseContentPage />} />
            <Route path="learning/:subjectId/lesson/:lessonId" element={<LessonPage />} />

            {/* Favorites */}
            <Route path="favorites" element={<FavoriteFoldersPage />} />

            {/* News */}
            <Route path="news" element={<NewsPage />} />

            
            <Route path="quiz" element={<QuizPage />} />

          </Route>

          {/* Routes cho phụ huynh */}
          <Route path="/" element={<LayoutParent onNotificationClick={() => setNotificationOpen(true)} />}>
            <Route path="parentPage" element={<ParentPage />} />
            <Route path="parentPage/:studentId/view_children" element={<ViewChildren />} />
          </Route>

          {/* Các route độc lập (không dùng Layout) */}
          <Route path="oauth-callback" element={<OAuthCallBack />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register1" element={<RegisterP1 />} />
          <Route path="/register2" element={<RegisterP2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/await-confirmation" element={<AwaitEmailConfirmation />} />

          {/* Làm bài tập */}
          <Route path="/do-exercise/:exerciseId" element={<DoExercise />} />

          <Route path="/admin" element={<MainLayout />}>
            <Route
              path="deny"
              element={<DenyAdmin />}>
            </Route>
            <Route
              path="content_speaking"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <ContentSpeakingManagement />
              </AdminRoute>}
            />
            <Route
              path="content_speaking/:contentSpeakingId/dialogue"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <DialogueManagement />
              </AdminRoute>}
            />
            <Route
              path="content_reading"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <ContentReadingManagement />
              </AdminRoute>}
            />
            <Route
              path="content_reading/:contentReadingId/vocabulary"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <VocabularyManagement />
              </AdminRoute>}
            />
            <Route
              path="content_reading/:contentReadingId/grammar"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <GrammarManagement />
              </AdminRoute>}
            />
            <Route
              path="content_listening"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <ListeningContentManagement />
              </AdminRoute>}
            />
            <Route
              path="courses"
              element={
                <AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                  <CourseManagement />
                </AdminRoute>
              }
            />
            <Route
              path="courses/:subjectId/lessons"
              element={
                <AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                  <LessonManagement />
                </AdminRoute>
              }
            />
            <Route
              path="courses/:subjectId/lessons/:lessonId/content"
              element={
                <AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                  <ContentManagement />
                </AdminRoute>
              }
            />
            <Route
              path="courses/:subjectId/lessons/:lessonId/exercises/:exerciseId"
              element={
                <AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                  <ExerciseManagement />
                </AdminRoute>
              }
            />
            <Route
              path="content/reading/:contentId/vocabulary"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <VocabularyManagement />
              </AdminRoute>}
            />
            <Route
              path="content/reading/:contentId/grammar"
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN"]}>
                <GrammarManagement />
              </AdminRoute>}
            />
            {/* Dashboard & System Admin Pages */}
            <Route
              index
              element={<AdminRoute allowedRoles={["STAFF", "CONTENT_MANAGER", "SUPER_ADMIN", "USER_MANAGER"]}>
                <Dashboard />
              </AdminRoute>}
            />
            <Route
              path="admins"
              element={<AdminRoute allowedRoles={["SUPER_ADMIN"]}>
                <AdminList />
              </AdminRoute>}
            />
            <Route
              path="system-logs"
              element={<AdminRoute allowedRoles={["SUPER_ADMIN"]}>
                <SystemLogs />
              </AdminRoute>}
            />
            <Route
              path="users"
              element={<AdminRoute allowedRoles={["SUPER_ADMIN", "USER_MANAGER"]}>
                <UserManagement />
              </AdminRoute>}
            />
          </Route>
        </Routes>
        <NotificationSlider
          open={notificationOpen}
          setOpen={setNotificationOpen}
        />
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
        </QuizProvider> 
      </DataProvider>
    </AuthProvider >
  );
}

export default App;
