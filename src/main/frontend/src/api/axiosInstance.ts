import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.90.17:8080/api",  // ▶ wifi 변경 시 바꾸어 줄 것
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;