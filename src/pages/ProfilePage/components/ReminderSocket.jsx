// import { useEffect, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import { over } from 'stompjs';
// import { toast } from 'react-toastify';

// const useReminderSocket = (userId) => {
//     const clientRef = useRef(null);

//     useEffect(() => {
//         if (!userId) return;

//         console.log("🧪 Initializing WebSocket connection...");

//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = over(socket);
//         clientRef.current = stompClient;

//         // Lấy JWT token từ localStorage hoặc cookie
//         const token = localStorage.getItem('accessToken'); // Hoặc từ cookie nếu bạn dùng cookie
//         console.log("studentid", userId)
//         console.log("token", token)
//         stompClient.connect(
//             { Authorization: `Bearer ${token}` }, // gửi token qua header
//             () => {
//                 console.log(`✅ Connected to WebSocket as user ${userId}`);

//                 // Đăng ký lắng nghe nhắc nhở riêng của user
//                 stompClient.subscribe(`/topic/reminders/${userId}`, (message) => {
//                     const reminder = JSON.parse(message.body);
//                     console.log("📨 New reminder:", reminder);
//                     toast.info(`⏰ Đến giờ học rồi! Ghi chú: ${reminder.note}`);
//                 });
//             },
//             (error) => {
//                 console.error("❌ STOMP connection error:", error);
//             }
//         );

//         return () => {
//             if (clientRef.current) {
//                 clientRef.current.disconnect(() => {
//                     console.log("🛑 Disconnected from WebSocket");
//                 });
//             }
//         };
//     }, [userId]);
// };

// export default useReminderSocket;
