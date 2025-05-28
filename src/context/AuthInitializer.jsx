import { useEffect } from "react";
import { useAuth } from './AuthContext'

function AuthInitializer() {
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

  return null;
}
export default AuthInitializer;