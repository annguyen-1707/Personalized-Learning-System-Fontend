import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ thêm dòng này

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // ✅ thêm dòng này

 useEffect(() => {
  if (!isAdmin) {
    const checkLogin = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/check-login", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const accessToken = data.data.accessToken;
          localStorage.setItem("accessToken", accessToken);

          const userRes = await fetch("http://localhost:8080/auth/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const userData = await userRes.json();
          setUser(userData.data); // chỉ set user
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkLogin();
  }
}, []);

useEffect(() => {
  if (user) {
    const role = user.roleName;
    if (location.pathname === "/" || location.pathname === "/login") {
      if (role === "PARENT") {
        navigate("/parentpage");
      } else if (role === "USER") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    }
  }
}, [user]);


  //login
  const login = async (email, password, isAdminLogin) => {
    setIsAdmin(isAdminLogin)
    setLoading(true);
    let api = 'http://localhost:8080/auth/login'
    let apiUser = 'http://localhost:8080/auth/user'
    try {
      if (isAdminLogin) {
        api = 'http://localhost:8080/admin/login'
        apiUser = 'http://localhost:8080/admin/user'
      }
      const res = await fetch(api, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Account or pasword is not right');
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
      const role = userData.data.roleName;
      if (role === "PARENT") {
        navigate("/parentpage");
      } else if (role === "USER") {
        navigate("/");
      } else {
        navigate("/admin");
      }

    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
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
      console.log("✅ Register2 called with email:", email);
      if (email === null || email === undefined) {
        email = localStorage.getItem("email")
      }
      const response = await fetch(`http://localhost:8080/auth/complete-profile?email=${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, gender, dob, address, phone, role }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to complete profile');

      // Optional: update user state if backend returns updated info
      const result = await response.json();
      const updatedUser = result.data;
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
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
    loading,
    isAdmin,
    login,
    loginWithProvider,
    register1,
    register2,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;