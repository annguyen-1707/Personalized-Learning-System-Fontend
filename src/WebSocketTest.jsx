import { useEffect, useState } from 'react';
import webSocketService from './services/websocket';

function WebSocketTest() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    webSocketService.connect().then(() => {
      webSocketService.subscribe("/topic/greetings", (msg) => {
        setMessage(msg);
      });

      webSocketService.send("/app/hello", "Client đã gửi yêu cầu");
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Test Page</h2>
      <p>Tin nhắn từ server: {message}</p>
    </div>
  );
}

export default WebSocketTest;
