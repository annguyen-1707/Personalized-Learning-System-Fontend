import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function OAuthCallBack() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const calledRef = useRef(false); 
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const exist = params.get("exist") === "true";

        const provider = localStorage.getItem("provider")?.toUpperCase();

        if (exist) {
           navigate("/register2", { state: { email } });
        }  
         const loginRes = await fetch("http://localhost:8080/auth/getOAuthToken", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, provider }),
            credentials: "include",
          });

          const loginData = await loginRes.json();
          const token = loginData.data.accessToken;
          localStorage.setItem("accessToken", token);
          localStorage.setItem("email", email);

          const userRes = await fetch("http://localhost:8080/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await userRes.json();

          setUser(userData.data);
          navigate("/");
      
    };

    handleOAuthCallback();
  }, []);
}

export default OAuthCallBack;
