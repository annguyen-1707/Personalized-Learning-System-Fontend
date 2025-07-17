import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import websocket from '../../services/websocket';
function AwaitEmailConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  useEffect(() => {
    websocket.connect().then(() => {
      const topic = `/topic/confirm.${encodeURIComponent(email)}`;
      websocket.subscribe(topic, (msg) => {
        const data = JSON.parse(msg);
        if (data.email === email && data.status === "Registered") {
          console.log("✅ Email xác nhận thành công");
          localStorage.setItem("email", email);
          navigate('/register2');

        }
      });
    });
    return () => websocket.disconnect();

  }, [email, navigate]);

  const handleResendEmail = async () => {
    try {
      const response = await fetch(`http://localhost:8080/auth/mailAgain?emailAgain=${email}`, {
        method: 'GET',
      });
      if (response.ok) {
        alert('Confirmation email has been resent. Please check your inbox!');
      } else {
        alert('Failed to resend the confirmation email. Please try again later!');
      }
    } catch (error) {
      console.error('Lỗi gửi lại email:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h2 className="text-2xl font-semibold mb-4">Please check your email to confirm your account</h2>
      <p className="mb-4">
        We have sent a confirmation email to <strong>{email}</strong>. After confirming, you will be automatically redirected.
      </p>

      <div className="spinner mb-4" />

      <p>
        If you didn't receive the email, please check your spam folder or{' '}
        <button
          onClick={handleResendEmail}
          className="text-blue-600 underline"
        >
          resend the confirmation email
        </button>.
      </p>

      <style>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #3498db;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default AwaitEmailConfirmation;
