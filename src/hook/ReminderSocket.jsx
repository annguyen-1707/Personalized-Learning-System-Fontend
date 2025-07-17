// useReminderSocket.js
import { useEffect } from "react";
import websocket from "../services/websocket"; // đường dẫn tùy dự án
import { toast } from "react-toastify";

const useReminderSocket = (userId, onReceiveReminder) => {
    useEffect(() => {
        if (!userId) return;

        websocket.connect()
            .then(() => {
                websocket.subscribe(`/topic/reminders/${userId}`, (msg) => {
                    const reminder = JSON.parse(msg);
                    console.log("📨 Reminder received:", reminder);
                    onReceiveReminder(reminder); // gửi về React component
                });
            })
            .catch((err) => {
                console.error("❌ WebSocket error:", err);
            });

        return () => {
            websocket.disconnect();
        };
    }, [userId, onReceiveReminder]);
};

export default useReminderSocket;