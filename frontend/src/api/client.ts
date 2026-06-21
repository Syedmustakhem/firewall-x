import axios from "axios";

// WHY: We create ONE axios instance for the whole app.
// This means every request automatically gets the auth token
// and errors are handled in one place — industry standard pattern.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
// WHY: Before every request, we grab the JWT token from localStorage
// and attach it to the Authorization header automatically.
// You never have to manually add the token in any page/component.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// WHY: If the server returns 401 (unauthorized/token expired),
// we automatically log the user out and redirect to login.
// This is how real production apps handle session expiry.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;