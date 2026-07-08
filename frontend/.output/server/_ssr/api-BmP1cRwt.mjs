import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BmP1cRwt.js
var api = axios.create({
	baseURL: "http://127.0.0.1:8000",
	headers: { "Content-Type": "application/json" }
});
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
api.interceptors.response.use((response) => response, (error) => {
	const url = error.config?.url ?? "";
	const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/me");
	if (error.response?.status === 401 && !isAuthEndpoint) {
		localStorage.removeItem("access_token");
		localStorage.removeItem("user");
		window.location.href = "/login/hr";
	}
	return Promise.reject(error);
});
//#endregion
export { api as t };
