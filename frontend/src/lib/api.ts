import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired token — but skip auth endpoints so their own
// error handlers can display proper messages to the user.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/me");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      let isHr = window.location.pathname.includes("/hr");
      try {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          isHr = user?.role === "hr";
        }
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");
      window.location.href = isHr ? "/login/hr" : "/login/candidate";
    }

    return Promise.reject(error);
  }
);

export default api;