import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ thêm dòng này

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdmin") === "true"; // hoặc false nếu không có
  });
  const navigate = useNavigate(); // ✅ thêm dòng này

  useEffect(() => {
    console.log("AuthProvider mounted", localStorage.getItem("accessToken") + user);
    if (!localStorage.getItem("accessToken")) {
      localStorage.removeItem("isAdmin");
    }
    setLoading(true);
    if (!isAdmin) {
      const checkLogin = async () => {
        try {
          const response = await fetch("http://localhost:8080/auth/check-login", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            const accessToken = data?.data?.accessToken;
            if (!accessToken) {
              console.warn("Không tìm thấy accessToken trong phản hồi", data);
              return;
            }
            localStorage.setItem("accessToken", accessToken);

            const userRes = await fetch("http://localhost:8080/auth/user", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            const userData = await userRes.json();
            setUser(userData.data);
          }

          else {
            console.warn("Phản hồi check-login không ok:", response.status);
          }

        } catch (err) {
          console.error(err);
        }
        finally {
          setLoading(false);
        }
      };
      checkLogin();
    }
    else {
      const checkLogin = async () => {
        try {
          const response = await fetch("http://localhost:8080/admin/check-login", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            const accessToken = data?.data?.accessToken;
            if (!accessToken) {
              console.warn("Không tìm thấy accessToken trong phản hồi", data);
              return;
            }

            localStorage.setItem("accessToken", accessToken);

            const userRes = await fetch("http://localhost:8080/admin/user", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            const userData = await userRes.json();
            setUser(userData.data);

          }
          else {
            console.warn("Phản hồi check-login không ok:", response.status);
          }

        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      checkLogin();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("accessToken");
      navigate("/"); // ✅ điều hướng về login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (user !== null && !isAdmin) {
      const role = user.roleName;
      if (location.pathname === "/") {
        if (role === "PARENT") {
          navigate("/parentpage");
        } else if (role === "USER") {
          navigate("/");
        }
        else {
          navigate("/admin");
        }
      }
    }
    if (isAdmin && location.pathname === "/admin") {
      navigate("/admin");
    }
  }, [user]);

  //login
  const login = async (email, password, isAdminLogin) => {
    setLoading(true);
    let api = 'http://localhost:8080/auth/login'
    let apiUser = 'http://localhost:8080/auth/user'
    localStorage.setItem("isAdmin", "false");
    try {
      if (isAdminLogin) {
        api = 'http://localhost:8080/admin/login'
        apiUser = 'http://localhost:8080/admin/user'
        localStorage.setItem("isAdmin", "true");
      }
      const res = await fetch(api, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("accessToken", data.data.accessToken);

      const userRes = await fetch(apiUser, {
        headers: { Authorization: `Bearer ${data.data.accessToken}` }
      });
      const userData = await userRes.json();
      if (!userRes.status === "OK") {
        throw new Error(userData.message || 'Failed to fetch user data');
      }
      setUser(userData.data);
      console.log("User data:", user);
      const role = userData.data.roleName;
      if (role === "PARENT") {
        navigate("/parentpage");
      } else if (role === "USER") {
        navigate("/");
      }
      else {
        navigate("/admin");
      }

    } catch (error) {
      console.error('Login failed:', error);
      throw error;

    } finally {
      setLoading(false);
    }
  }

  const loginWithProvider = async (provider) => {
    try {
      console.log(`Logging in with ${provider}...`);
      const response = await fetch(`http://localhost:8080/auth/social-login?login_type=${provider}`);
      const data = await response.json();

      if (data.authUrl) {
        localStorage.setItem("provider", provider);
        window.location.href = data.authUrl;
      } else {
        console.error("No URL returned from backend");
      }
    } catch (error) {
      console.error("OAuth2 login failed", error);
    }
  };
  const register2 = async (email, fullName, dob, address, gender, phone, role) => {
    setLoading(true);
    try {
      if (!email) {
        email = localStorage.getItem("email");
      }

      const response = await fetch(`http://localhost:8080/auth/complete-profile?email=${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, gender, dob, address, phone, role }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.status === "error" && result.data) {
          const errorMap = {};
          result.data.forEach(err => {
            errorMap[err.field] = err.message;
          });

          console.error("🛑 Field validation errors:", errorMap);
          return errorMap; // ✅ QUAN TRỌNG: return lỗi thay vì throw
        }

        return { general: result.message || "Unknown error" }; // return lỗi chung
      }

      // Thành công, không lỗi
      return null;
    } catch (error) {
      console.error('Registration failed:', error);
      return { general: error.message || "Unexpected error" };
    } finally {
      setLoading(false);
    }
  };



  const register1 = async (email, password) => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` })
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // nếu dùng allowCredentials(true)
      });

      localStorage.setItem("email", email);
      const responseData = await response.json();
      if (!response.ok || responseData.status === "FAIL") {
        alert(responseData.message || "Something went wrong");
        return;
      }
      navigate(`/await-confirmation?email=${encodeURIComponent(email)}`);


    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Password reset email sent
    } catch (error) {
      throw new Error('Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    errors,
    setErrors,
    loading,
    isAdmin,
    setIsAdmin,
    login,
    loginWithProvider,
    register1,
    register2,
    forgotPassword,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;