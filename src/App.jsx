import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import RegisterP1 from "./pages/auth/RegisterP1";
import ForgotPassword from "./pages/auth/ForgotPassword";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import { useAuth } from './context/AuthContext'; 
import { useEffect } from 'react';


import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import RegisterP2 from "./pages/auth/RegisterP2";
import AwaitEmailConfirmation from "./pages/auth/AwaitEmailConfirmation";

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
          <Route path="/await-confirmation" element={<AwaitEmailConfirmation />} />

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
