import axios from "axios";

const BASE_URL =
  "https://inventory-system-backend-50043520954.development.catalystappsail.in";

console.log("🚀 API Base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("==================================");
    console.log("➡️ API REQUEST");
    console.log("Method      :", config.method?.toUpperCase());
    console.log("Base URL    :", config.baseURL);
    console.log("Endpoint    :", config.url);
    console.log("Full URL    :", `${config.baseURL}${config.url}`);
    console.log("Payload     :", config.data);
    console.log("==================================");

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log("==================================");
    console.log("✅ API RESPONSE");
    console.log("Status       :", response.status);
    console.log("URL          :", response.config.baseURL + response.config.url);
    console.log("Response     :", response.data);
    console.log("==================================");

    return response;
  },
  (error) => {
    console.log("==================================");
    console.error("❌ API ERROR");

    if (error.response) {
      console.log("Status       :", error.response.status);
      console.log(
        "URL          :",
        error.config.baseURL + error.config.url
      );
      console.log("Response     :", error.response.data);
    } else if (error.request) {
      console.log("No response received.");
      console.log("Request URL  :", error.config.baseURL + error.config.url);
    } else {
      console.log("Error        :", error.message);
    }

    console.log("==================================");

    return Promise.reject(error);
  }
);

export default api;