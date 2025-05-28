import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AwaitEmailConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8080/auth?email=${encodeURIComponent(email)}`, {
           method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (response.ok) {
          localStorage.setItem("email", email);
          const data = await response.json();
          if (data.data === 'Registered') {
            clearInterval(interval);
            navigate('/register2');
          }
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra xác nhận email:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h2 className="text-2xl font-semibold mb-4">Vui lòng kiểm tra email để xác nhận tài khoản</h2>
      <p className="mb-4">
        Chúng tôi đã gửi email xác nhận đến <strong>{email}</strong>. Sau khi xác nhận, bạn sẽ được tự động chuyển hướng.
      </p>

      <div className="spinner mb-4" />

      <p>
        Nếu không nhận được email, hãy kiểm tra thư rác hoặc{' '}
        <a
          href={`http://localhost:9999/news/registerServlet?emailAgain=${email}`}
          className="text-blue-600 underline"
        >
          gửi lại email xác nhận
        </a>.
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
