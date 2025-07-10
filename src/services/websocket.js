import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const stompClient = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  reconnectDelay: 5000,
  debug: (str) => console.log("[STOMP] " + str)
});

const connect = () => {
  return new Promise((resolve, reject) => {
    stompClient.onConnect = (frame) => {
      console.log("Connected: " + frame);
      resolve();
    };
    stompClient.onStompError = (frame) => {
      console.error("Broker error: ", frame.headers["message"]);
      reject(frame.headers["message"]);
    };
    stompClient.activate();
  });
};

const subscribe = (topic, callback) => {
  stompClient.subscribe(topic, (message) => {
    callback(message.body);
  });
};

const send = (destination, body) => {
  stompClient.publish({ destination, body });
};

const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

export default { connect, subscribe, send, disconnect };
