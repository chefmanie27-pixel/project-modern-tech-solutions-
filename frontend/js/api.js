// js/api.js - Updated to work with your auth system
// API_BASE comes from js/config.js, which must be loaded before this file.
const API_BASE = window.API_BASE;
const TOKEN_KEY = "moderntech_token";

// Global API object
const api = {
  token: localStorage.getItem(TOKEN_KEY),

  setToken(token) {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return this.token || localStorage.getItem(TOKEN_KEY);
  },

  clearToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("moderntech_user");
  },

  getHeaders() {
    const headers = { "Content-Type": "application/json" };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    // Don't stringify body if it's FormData or already a string
    if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearToken();
        const loginUrl = window.location.pathname.includes("/vue-app/") 
          ? "../index.html" 
          : "index.html";
        window.location.href = loginUrl;
        return null;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: "POST", body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: "PUT", body });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: "PATCH", body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};

// Make api globally available
window.api = api;