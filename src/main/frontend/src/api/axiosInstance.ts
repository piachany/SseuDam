import axios from "axios";

const api = axios.create({
    baseURL: "http://http://54.180.242.43/api",  // ▶ wifi 변경 시 바꾸어 줄 것
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;