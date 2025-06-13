import axios from "axios";
const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
});

// Add a response interceptor
//Gắn interceptor cho đúng instance
// Gắn token vào request trước khi gửi
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Trả về response.data
instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default instance