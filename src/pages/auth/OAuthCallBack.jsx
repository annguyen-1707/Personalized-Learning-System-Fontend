import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function OAuthCallBack() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const exist = params.get("exist") === "true";


      try {
        localStorage.setItem("email", email);
        let provider = localStorage.getItem("provider").toUpperCase();
        if (exist) {
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
        } else {
          navigate("/register2", { state: { provider: "provider" } });
        }
      } catch (err) {
        console.error("Lỗi khi xử lý OAuth:", err);
        alert("Đã xảy ra lỗi trong quá trình đăng nhập OAuth");
      }
    };

    handleOAuthCallback();
  }, []);

  return <div className="text-center mt-10 text-lg">🔄 Đang xử lý đăng nhập...</div>;
}

export default OAuthCallBack;
