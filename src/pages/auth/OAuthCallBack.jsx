import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function OAuthCallBack() {
  const navigate = useNavigate();
  const { setUser} = useAuth();
  const calledRef = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const exist = params.get("exist") === "true";
      const provider = localStorage.getItem("provider")?.toUpperCase();

      console.log("exist:", exist);

      if (!exist) {
        console.log("Đi tới trang đăng ký");
        navigate("/register2", { state: { email } });
        return;
      }

      console.log("Người dùng đã tồn tại, tiến hành lấy token...");

      try {
        const loginRes = await fetch("http://localhost:8080/auth/getOAuthToken", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, provider }),
          credentials: "include",
        });

        if (!loginRes.ok) {
          const errText = await loginRes.text();
          throw new Error(`Lỗi khi gọi getOAuthToken: ${errText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData?.data?.accessToken;
        if (!token) throw new Error("Token không tồn tại trong phản hồi");

        localStorage.setItem("accessToken", token);
        localStorage.setItem("email", email);
        console.log("Access Token:", token);

        const userRes = await fetch("http://localhost:8080/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await userRes.json();
        setUser(userData.data);
        navigate("/");
      } catch (error) {
        console.error("Lỗi callback OAuth:", error);
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser]);

  return <div>Đang xử lý đăng nhập OAuth...</div>;
}

export default OAuthCallBack;
