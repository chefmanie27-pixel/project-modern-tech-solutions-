// js/auth-guard.js - Updated
(function () {
  const TOKEN_KEY = "moderntech_token";
  // API_BASE comes from js/config.js, which must be loaded before this file.
  const API_BASE = window.API_BASE;

  const scriptEl = document.currentScript;
  const base = scriptEl.src.replace(/js\/auth-guard\.js.*$/, "");
  const loginUrl = base + "index.html";

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.replace(loginUrl);
    return;
  }

  document.documentElement.style.visibility = "hidden";

  fetch(API_BASE + "/auth/me", {
    headers: { Authorization: "Bearer " + token },
  })
    .then(function (res) {
      if (!res.ok) throw new Error("unauthorized");
      // Store user data
      return res.json();
    })
    .then(function (data) {
      localStorage.setItem("moderntech_user", JSON.stringify(data.user));
      document.documentElement.style.visibility = "";
    })
    .catch(function () {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("moderntech_user");
      window.location.replace(loginUrl);
    });
})();