import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  //login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method : 'Post',
        header : {'Content-Type' : 'application/json'},
        body : JSON.stringify({email, password}),
        credentials: 'include'
    });

    const data = await res.json()
    if(!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem("accessToken", data.accessToken);

    const userRes = await fetch('http://localhost:8080/auth/user', {
      headers: { Authorization : `Bearer ${data.accessToken}` }
    });
    const userData = await userRes.json();
    if(!userRes.ok) {
      throw new Error(userData.message || 'Failed to fetch user data');
    }
    setUser(userData);
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed');
  }finally
    {
      setLoading(false);
    }
}

  const loginWithProvider = async (provider) => {
  try {
    const response = await fetch(`http://localhost:8080/auth/social-login?login_type=${provider}`);
    const data = await response.json();

    if (data.url) {
      // Chuyển hướng trình duyệt đến Google/Facebook/Github login page
      window.location.href = data.url; 
    } else {
      console.error("No URL returned from backend");
    }
  } catch (error) {
    console.error("OAuth2 login failed", error);
  }
};


const register2 = async (fullName, dob, address, gender, phone) => {
  setLoading(true);
  try {
    const email = localStorage.getItem("email");
    const response = await fetch(`http://localhost:8080/auth/complete-profile?email=${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, dob, address, gender, phone }),
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
  try {
    const response = await fetch('http://localhost:8080/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
  credentials: 'include', // nếu dùng allowCredentials(true)
});

    if (!response.ok) {
      throw new Error('Failed to register');
    }

  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Registration failed');
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
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
    loading,
    login,
    loginWithProvider,
    register1,
    register2,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}