import axios from "axios";

const BASE = "http://20.244.56.144/evaluation-service";


const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});


const logApi = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  if (!config.url.includes("/logs")) {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const postLog = async (payload) => {
  try {
    await logApi.post("/logs", payload);
  } catch (err) {
    console.error("Log failed:", err.message);
  }
};


export const register = (payload) =>
  api.post("/register", payload,  {headers: { "Content-Type": "application/json" }});

export const authToken = (payload) =>
  api.post("/auth", payload ,  {headers: { "Content-Type": "application/json" }});

export const shorten = (payload) => api.post("/shorten", payload,  {headers: { "Content-Type": "application/json" }});

export const myUrls = () => api.get("/my-urls");

export const logEvent = (payload) => postLog(payload,  {headers: { "Content-Type": "application/json" }});

export default api;
