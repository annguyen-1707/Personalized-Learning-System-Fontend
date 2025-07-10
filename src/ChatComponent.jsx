import  { useEffect, useState } from 'react';

import websocket from "./services/websocket"; // Assuming you have a websocket service

const ChatComponent = () => {
   const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Kết nối khi component mount
    websocket.connect()
      .then(() => {
        websocket.subscribe("/topic/messages", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      })
      .catch((err) => {
        console.error("Lỗi kết nối WebSocket:", err);
      });

    // Ngắt kết nối khi unmount
    return () => {
      websocket.disconnect();
    };
  }, []);

  
  const handleSend = () => {
    if (input.trim() !== "") {
      websocket.send("/app/chat", input);
      setInput("");
    }
  };


   return (
    <div>
      <h1>Chat Page</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 200, overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
      <button onClick={handleSend}>Gửi</button>
    </div>
  );
}

export default ChatComponent;
