// ---- Single admin credentials (demo only) ----
const ADMIN_EMAIL = "admin@moderntech.com";
const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "moderntech_auth";

const welcomeScreen = document.getElementById("welcome-screen");
const loginScreen = document.getElementById("login-screen");

const accessBtn = document.getElementById("accessBtn");

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginBtn = document.querySelector(".login-btn");

accessBtn.addEventListener("click", () => {
  // Hide Welcome Screen
  welcomeScreen.classList.add("hidden");

  // Show Login Screen
  loginScreen.classList.remove("hidden");
});

togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";

    togglePassword.classList.remove("fa-eye");
    togglePassword.classList.add("fa-eye-slash");
  } else {
    password.type = "password";

    togglePassword.classList.remove("fa-eye-slash");
    togglePassword.classList.add("fa-eye");
  }
});

function showError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
}

function clearError() {
  loginError.textContent = "";
  loginError.style.display = "none";
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = password.value.trim();

  if (email === "" || pass === "") {
    showError("Please fill in all fields.");
    return;
  }

  if (
    email.toLowerCase() !== ADMIN_EMAIL ||
    pass !== ADMIN_PASSWORD
  ) {
    showError("Incorrect email or password.");
    return;
  }

  clearError();

  // Loading effect
  loginBtn.innerHTML = "Signing In...";
  loginBtn.disabled = true;

  // Mark the session as authenticated so other pages' auth-guard.js
  // will let the user through instead of bouncing back here.
  localStorage.setItem(AUTH_KEY, "true");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 800);
});