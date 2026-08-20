// js/auth-guard.js - Updated
(function () {
  const TOKEN_KEY = "moderntech_token";
  const API_BASE = "http://localhost:3000/api/v1";

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