import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.24:5000/api", // ✅ Η IP του backend σου!
});

export default api;
