import React, { useEffect, useState } from "react";
import axios from "axios";

function NotificationSlider({ open, setOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios.get("/api/notifications")
        .then(res => setNotifications(res.data))
        .catch(() => setNotifications([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-[9999] transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
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
          <div key={n.id} className="mb-3 p-3 bg-blue-50 rounded">
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationSlider;