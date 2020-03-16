import axios                from "axios";
import toQueryString        from "src/helpers/toQueryString";
import TelemetryService from "src/services/TelemetryService";

const api = axios.create({
  baseURL: process.env.APP_BASE_API,
});

api.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
api.defaults.paramsSerializer = function(params) {
  return toQueryString(params);
};


api.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  TelemetryService.trackException(error)

  return Promise.reject(error);
})


api.interceptors.response.use(function(response) {
  return response;
}, function(error) {
  TelemetryService.trackException(error)

  switch (error.response.status) {
    case 401:
      break;
    case 403:
      break;
    // case 500:
    // case 404:
    // case 400:
  }

  return Promise.reject(error);
});

export default api;
