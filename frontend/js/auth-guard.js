// ---- Auth guard ----
// Include this as early as possible in <head> on every protected page:
//   <script src="js/auth-guard.js"></script>          (pages at site root)
//   <script src="../js/auth-guard.js"></script>       (pages in a subfolder)
//
// Real flow: check a token exists locally (fast bounce if not), then
// confirm it's still valid by calling GET /auth/me. Redirects to login on
// any failure. Hides <html> until the check resolves so a stale/expired
// session doesn't flash protected content before bouncing.
(function () {
  var TOKEN_KEY = "moderntech_token";
  var API_BASE = "http://localhost:3000/api/v1";

  var scriptEl = document.currentScript;
  var base = scriptEl.src.replace(/js\/auth-guard\.js.*$/, "");
  var loginUrl = base + "index.html";

  var token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.replace(loginUrl);
    return;
  }

  // Hide content until we've confirmed the token is still good.
  document.documentElement.style.visibility = "hidden";

  fetch(API_BASE + "/auth/me", {
    headers: { Authorization: "Bearer " + token },
  })
    .then(function (res) {
      if (!res.ok) throw new Error("unauthorized");
      document.documentElement.style.visibility = "";
    })
    .catch(function () {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("moderntech_user");
      window.location.replace(loginUrl);
    });
})();
