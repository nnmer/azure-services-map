import axios from "axios";

const api = axios.create({
  baseURL: process.env.APP_BASE_API,
});

api.defaults.headers["X-Requested-With"] = "XMLHttpRequest";

export default api;
