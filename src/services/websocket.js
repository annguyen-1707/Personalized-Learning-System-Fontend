import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map(); // Sử dụng Map để lưu trữ subscriptions
    }

    connect(url = 'http://localhost:8080/ws') {
        return new Promise((resolve, reject) => {
            const socket = new SockJS(url);
            this.stompClient = Stomp.over(socket);
            
            this.stompClient.connect({}, () => {
                console.log("✅ WebSocket connected");
                resolve();
            }, (error) => {
                console.error("❌ WebSocket connect error", error);
                reject(error);
            });
        });
    }

    subscribe(topic, callback) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ Connect first!");
            return null;
        }
        
        const subscription = this.stompClient.subscribe(topic, (message) => {
            try {
                callback(JSON.parse(message.body));
            } catch {
                callback(message.body);
            }
        });
        
        this.subscriptions.set(topic, subscription);
        return subscription;
    }

    unsubscribe(topic) {
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic).unsubscribe();
            this.subscriptions.delete(topic);
            console.log(`❎ Unsubscribed from ${topic}`);
        }
    }

    send(destination, data) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ Connect first!");
            return;
        }
        
        this.stompClient.send(destination, {}, JSON.stringify(data));
    }

    disconnect() {
        if (this.stompClient) {
            // Hủy tất cả subscriptions trước khi ngắt kết nối
            this.subscriptions.forEach((sub, topic) => {
                this.unsubscribe(topic);
            });
            
            this.stompClient.disconnect();
            this.stompClient = null;
            console.log("🔌 Disconnected");
        }
    }
}

export default new WebSocketService();