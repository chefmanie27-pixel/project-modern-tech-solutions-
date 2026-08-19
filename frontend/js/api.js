// api.js — shared fetch wrapper for all pages.
// Mirrors the real routes mounted in backend/server.js: /api/auth/*, /api/timeoff/*, etc.
const API_BASE = "http://localhost:3000/api";

async function apiRequest(endpoint, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("moderntech_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // Token missing/expired — bounce to login, mirrors auth-guard.js behavior.
    localStorage.removeItem("moderntech_token");
    window.location.replace("index.html");
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}
