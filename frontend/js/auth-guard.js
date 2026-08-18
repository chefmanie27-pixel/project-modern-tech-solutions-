// ---- Auth guard ----
// Include this as early as possible in <head> on every protected page:
//   <script src="auth-guard.js"></script>          (pages at site root)
//   <script src="../auth-guard.js"></script>        (pages in a subfolder)
//
// It works out the correct path to login.html automatically from wherever
// this script itself was loaded from, so the same file can be shared by
// both root-level pages and subfolder pages like "Modern Tech/attendance.html".
(function () {
  const scriptEl = document.currentScript;
  const base = scriptEl.src.replace(/auth-guard\.js.*$/, "");

  const token = localStorage.getItem("moderntech_token");

  // No JWT means the user is not logged in.
  if (!token) {
    window.location.replace(base + "index.html");
    return;
  }

  fetch("http://localhost:3000/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      if (response.status === 401) {
        localStorage.removeItem("moderntech_token");
        window.location.replace(base + "index.html");
        return null;
      }

      if (!response.ok) {
        throw new Error("Authentication check failed");
      }

      return response.json();
    })
    .then((data) => {
      if (data) {
        console.log("Authenticated user:", data.user);
      }
    })
    .catch((error) => {
      console.error("Auth check failed:", error);
      localStorage.removeItem("moderntech_token");
      window.location.replace(base + "index.html");
    });
})();
