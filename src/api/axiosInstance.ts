import axios from "axios";


const BASE_URL = import.meta.env.VITE_BASEURL_BACKEND;

export const api = axios.create({
    baseURL: BASE_URL,
});

export const apiAuth = (token?: string) => {
    const instance = axios.create({
        baseURL: BASE_URL,
    });

    instance.interceptors.request.use(config => {
        const accessToken = token || localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        res => res,
        async error => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (!refreshToken) throw new Error("No refresh token");

                    const res = await api.post("/auth/public/refresh", {
                        refreshToken
                    });

                    const { accessToken, refreshToken: newRefresh } = res.data;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefresh);

                    originalRequest.headers.Authorization =
                        `Bearer ${accessToken}`;

                    return instance(originalRequest);
                } catch (e) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/";
                    console.error("REFRESH FAILED", e);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};
