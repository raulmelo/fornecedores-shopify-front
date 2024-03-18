import { BASE_API_URL } from "../constants/baseUrl.ts";
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig
} from "axios";
import Cookie from "../utilities/Cookie.ts";

// Configure request params
const config: AxiosRequestConfig = {
    baseURL: BASE_API_URL,
    timeout: 30000,
};
const service: AxiosInstance = axios.create(config);

// Intercept request
service.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
        config.headers = config.headers ?? {};
        const accessToken = Cookie.getCookie("tokenmy_project" || "");

        // Check the access token
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },

    (error) => {
        Promise.reject(error).then(error =>console.log(error));
    }
);

export default service;
