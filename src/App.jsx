import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";

import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import SpeakingContentManagement from "./pages/content/SpeakingContentManagement";
import DialogueManagement from "./pages/content/DialogueManagement";

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
          <Route path="admin" element={<MainLayout />}>
            <Route path="content_speaking" element={<SpeakingContentManagement />} />
            <Route path="content_speaking/:contentSpeakingId/dialogue" element={<DialogueManagement />} />
          </Route>
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
