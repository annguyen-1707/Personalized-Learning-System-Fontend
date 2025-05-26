import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EditProfilePage from "./pages/ProfilePage/EditProfilePage";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ChangePasswordPage from "./pages/ProfilePage/ChangePasswordPage";
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
           {/*ProfilePage routes*/}
          <Route path="/" element={<Layout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />}/>
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          </Route>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<MainLayout />}>
          </Route>
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
