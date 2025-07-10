import axios from "axios";
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


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
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang có 1 request đang refresh thì chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.get('/api/auth/check-login', { withCredentials: true });
        console.log("Response", res);

        const newAccessToken = res.data.data.accessToken;
        console.log("New Access Token:", newAccessToken);

        // Lưu lại vào localStorage
        localStorage.setItem('accessToken', newAccessToken);

        // Cập nhật header mặc định
        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Gắn lại vào request cũ
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    // if (error.response?.status === 500) {
    //   window.location.href = "/error";
    // }
    return Promise.reject(error);
  }
);

export default instance