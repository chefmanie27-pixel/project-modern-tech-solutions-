// ---- Auth guard ----
// Include this as early as possible in <head> on every protected page:
//   <script src="auth-guard.js"></script>          (pages at site root)
//   <script src="../auth-guard.js"></script>        (pages in a subfolder)
//
// It works out the correct path to login.html automatically from wherever
// this script itself was loaded from, so the same file can be shared by
// both root-level pages and subfolder pages like "Modern Tech/attendance.html".
(function () {
  var AUTH_KEY = "moderntech_auth";

  if (localStorage.getItem(AUTH_KEY) === "true") return;

  var scriptEl = document.currentScript;
  var base = scriptEl.src.replace(/auth-guard\.js.*$/, "");

  window.location.replace(base + "login.html");
})();