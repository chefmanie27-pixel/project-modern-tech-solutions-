// js/config.js
// Single place to control which backend URL the whole frontend talks to.
// Load this script BEFORE auth-guard.js and api.js on every page.
//
// Local development: automatically uses your local backend.
// Deployed (Netlify): automatically uses your deployed Railway backend.
//
// 👉 After you deploy the backend to Railway, replace the URL below with
//    your real Railway URL (e.g. "https://moderntech-backend-production.up.railway.app/api/v1").
(function () {
  const LOCAL_API_BASE = "http://localhost:3000/api/v1";
  const PRODUCTION_API_BASE = "https://project-modern-tech-solutions-production.up.railway.app/api/v1";

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  window.API_BASE = isLocal ? LOCAL_API_BASE : PRODUCTION_API_BASE;
})();
