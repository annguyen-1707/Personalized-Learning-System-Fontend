import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketTest = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const clientRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const socketFactory = () => new SockJS('http://localhost:8080/ws');
    
    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('[STOMP] ' + str),
      connectionTimeout: 10000,
      
      onConnect: () => {
        console.log('Successfully connected to WebSocket');
        setConnectionStatus('CONNECTED');
        setRetryCount(0);
        
        client.subscribe('/topic/messages', (message) => {
          setMessages(prev => [...prev, message.body]);
        });
      },
      
      onDisconnect: () => {
        setConnectionStatus('DISCONNECTED');
        console.warn('Disconnected from WebSocket');
      },
      
      onStompError: (frame) => {
        console.error('STOMP protocol error:', frame.headers.message);
      },
      
      onWebSocketError: (error) => {
        console.error('WebSocket connection error:', error);
        setRetryCount(prev => prev + 1);
        if (retryCount >= 3) {
          console.error('Max retry attempts reached');
          client.deactivate();
        }
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [retryCount]);

  const sendMessage = () => {
    if (!clientRef.current?.connected) {
      console.error('Cannot send message - not connected');
      return;
    }

    try {
      clientRef.current.publish({
        destination: '/app/chat',
        body: inputMessage
      });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h2>WebSocket Test</h2>
      <p>Status: {connectionStatus} {retryCount > 0 && `(Retry ${retryCount}/3)`}</p>
      
      <div style={{ margin: '10px 0' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={connectionStatus !== 'CONNECTED'}
        />
        <button 
          onClick={sendMessage} 
          disabled={connectionStatus !== 'CONNECTED'}
        >
          Send
        </button>
      </div>
      
      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default WebSocketTest;