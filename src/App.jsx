import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import UpgradePage from "./pages/Upgrade/UpgradePage";
import VnpayReturn from "./pages/Upgrade/VnpayReturn.jsx";
import ParentPage from "./pages/Parent/ParentPage.jsx";
import ViewChildren from "./pages/Parent/ViewChildren.jsx";
import ListeningPage from "./pages/ListeningPage/ListeningPage";
import ListeningDetailPage from "./pages/ListeningPage/ListeningDetailPage";
import QuestionManagement from "./pages/content/QuestionManagement";
import ExerciseManagement from "./pages/courses/ExerciseManagement";
import LearningPage from "./pages/LearningPage/LearningPage";
import NotificationSlider from "./pages/HomePage/Notification.jsx";
import CourseContentPage from "./pages/LearningPage/components/CourseContent.jsx";
import LessonPage from "./pages/LearningPage/LessonPage.jsx";

function App() {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout onNotificationClick={() => setNotificationOpen(true)} />
            }
          >
            <Route index element={<HomePage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="vnpay-return" element={<VnpayReturn />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route
              path="profile/change-password"
              element={<ChangePasswordPage />}
            />
            <Route path="listening" element={<ListeningPage />} />
            <Route path="listening/:id" element={<ListeningDetailPage />} />
            <Route path="learning" element={<LearningPage />} />
            {/* Thêm các route con khác nếu cần */}
          </Route>
          {/* <Route path="/parentPage" element={<LayoutParent />}>
           <Route index element={<ParentPage />} />
            <Route path=":studentId/view_children" element={<ViewChildren />} />
          </Route> */}
          <Route path="/" element={<LayoutParent />}>
            <Route path="/parentPage" element={<ParentPage />} />
            <Route
              path="/parentPage/:studentId/view_children"
              element={<ViewChildren />}
            />
          </Route>
          <Route path="oauth-callback" element={<OAuthCallBack />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register1" element={<RegisterP1 />} />
          <Route path="/register2" element={<RegisterP2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/await-confirmation"
            element={<AwaitEmailConfirmation />}
          />
          {/*ProfilePage routes*/}1
          <Route path="/" element={<Layout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route
              path="/profile/change-password"
              element={<ChangePasswordPage />}
            />
          </Route>
          <Route
            path="/await-confirmation"
            element={<AwaitEmailConfirmation />}
          />
          {/* Listening routes */}
          <Route path="/" element={<Layout />}>
            <Route path="/listening" element={<ListeningPage />} />
            <Route path="/listening/:id" element={<ListeningDetailPage />} />
          </Route>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="learning/:subjectId" element={<CourseContentPage />} />
            <Route
              path="learning/:subjectId/lesson/:lessonId"
              element={<LessonPage />}
            />
          </Route>
          <Route path="/admin" element={<MainLayout />}>
            <Route
              path="content_speaking"
              element={<ContentSpeakingManagement />}
            />
            <Route
              path="content_speaking/:contentSpeakingId/dialogue"
              element={<DialogueManagement />}
            />
            <Route
              path="content_reading"
              element={<ContentReadingManagement />}
            />
            <Route
              path="content_reading/:contentReadingId/vocabulary"
              element={<VocabularyManagement />}
            />
            <Route
              path="content_reading/:contentReadingId/grammar"
              element={<GrammarManagement />}
            />
            <Route
              path="content_listening"
              element={<ListeningContentManagement />}
            />
            <Route
              path="content_listening/:contentListeningId/question"
              element={<QuestionManagement />}
            />
            <Route index element={<Dashboard />} />
            <Route path="system-logs" element={<SystemLogs />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route
              path="courses/:subjectId/lessons"
              element={<LessonManagement />}
            />
            <Route
              path="courses/:subjectId/lessons/:lessonId/content"
              element={<ContentManagement />}
            />
            <Route
              path="courses/:subjectId/lessons/:lessonId/exercises/:exerciseId"
              element={<ExerciseManagement />}
            />
            <Route
              path="content/reading/:contentId/vocabulary"
              element={<VocabularyManagement />}
            />
            <Route
              path="content/reading/:contentId/grammar"
              element={<GrammarManagement />}
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
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
