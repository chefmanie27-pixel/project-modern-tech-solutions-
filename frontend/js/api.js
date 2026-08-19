// js/api.js — shared fetch wrapper for all pages.
// Load this on every page that talks to the backend, after auth-guard.js:
//   <script src="js/api.js"></script>
//
// Usage:
//   const employees = await apiRequest("/employees");
//   const emp = await apiRequest("/employees", { method: "POST", body: {...} });

const API_BASE = "http://localhost:3000/api/v1"; // swap for prod URL later
const TOKEN_KEY = "moderntech_token";

async function apiRequest(endpoint, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // Backend unreachable (not running, CORS, wrong host, etc.)
    throw new Error(
      "Could not reach the server. Is the backend running at " + API_BASE + "?"
    );
  }

  if (res.status === 401) {
    // Token missing/expired — bounce to login, mirrors auth-guard.js behavior.
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("moderntech_user");
    window.location.replace(resolveLoginPath());
    return;
  }

  if (res.status === 204) return null; // no content (e.g. DELETE)

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }

  return data;
}

// Works out the path back to index.html (login) relative to wherever the
// current page lives, same trick auth-guard.js uses, so this also works
// for pages in subfolders like "Modern Tech/attendance.html".
function resolveLoginPath() {
  const scriptEl = document.currentScript || document.querySelector('script[src*="api.js"]');
  if (scriptEl && scriptEl.src) {
    // api.js normally lives in js/api.js, so go up one level from there.
    const base = scriptEl.src.replace(/js\/api\.js.*$/, "");
    return base + "index.html";
  }
  return "index.html";
}
