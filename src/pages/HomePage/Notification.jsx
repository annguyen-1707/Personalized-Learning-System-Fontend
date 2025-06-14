import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"

import axios from "../../services/customixe-axios";

function NotificationSlider({ open, setOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
    if (open) {
      console.log("ccAAA")
      getNotification();

    }
  }, [open]);

  const getNotification = async () => {
    const res = await axios.get(`/api/api/notifications/${user.userId}/notificationUser`)
    console.log("Notification API response:", res);  // <- thêm dòng này
    if (res === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    setNotifications(res)
  }
  const handleAction = async (notificationId, action) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn ${action === 'confirm' ? 'xác nhận' : 'từ chối'} thông báo này không?`);

    if (!confirmed) return;
  const status = action === 'confirm';

    try {
      const res = await axios.get(`/api/api/notifications/${notificationId}/${status}/sendNotification`);
      alert(`${action === 'confirm' ? 'Đã xác nhận' : 'Đã từ chối'} thành công!`);
      // Sau khi xử lý xong, reload lại danh sách thông báo
      getNotification();
    } catch (error) {
      console.error("Error handling action:", error);
      alert("Có lỗi xảy ra khi xử lý thông báo.");
    }
  };

  return (
    <div

      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-[9999] transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="p-4 border-b font-bold text-lg flex justify-between items-center">
        Notifications
        <button onClick={() => setOpen(false)} className="text-gray-500">✕</button>
      </div>
      <div className="p-4">
        {loading && <div>Loading...</div>}
        {!loading && notifications.length === 0 && (
          <div className="mb-3 p-3 bg-blue-50 rounded">No notifications.</div>
        )}
        {!loading && notifications.map((n) => (
          <div key={n.notificationId} className={`mb-3 p-4 rounded shadow-sm border-l-4 ${n.status ? 'bg-white border-gray-300' : 'bg-blue-50 border-blue-500'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800 truncate max-w-[220px]" title={n.title}>
                  {n.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                  {n.content}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>

               {n.statusSend === true ? (
  <div className="mt-3 text-sm text-gray-500 italic">Đã xem</div>
) : (
  (n.type === "PAYMENT" || n.type === "ACCEPT_STUDENT") && (
    <div className="mt-3 flex gap-2">
      <button
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => handleAction(n.notificationId, 'confirm')}
      >
        Confirm
      </button>
      <button
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => handleAction(n.notificationId, 'reject')}
      >
        Reject
      </button>
    </div>
  )
)}
              </div>
              {!n.status && (
                <span className="ml-2 mt-1 inline-block w-2 h-2 bg-blue-600 rounded-full" title="Chưa đọc" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationSlider;