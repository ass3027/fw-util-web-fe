import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const AS_IS_WS_API_URL = import.meta.env.VITE_AS_IS_WS_API_URL;
const AS_IS_API_URL = import.meta.env.VITE_AS_IS_API_URL;

const API = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" }
});

const AS_IS_API = axios.create({
    baseURL: AS_IS_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" }
});

export {API, AS_IS_API, API_URL, AS_IS_API_URL, AS_IS_WS_API_URL};