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

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = password.value.trim();

  if (email === "" || pass === "") {
    showError("Please fill in all fields.");
    return;
  }

  clearError();

  loginBtn.innerHTML = "Signing In...";
  loginBtn.disabled = true;

  try {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      auth: false, // no token to send yet — we're getting one
      body: { email, password: pass },
    });

    localStorage.setItem("moderntech_token", result.token);
    localStorage.setItem("moderntech_user", JSON.stringify(result.user));

    window.location.href = "dashboard.html";
  } catch (err) {
    showError(err.message || "Incorrect email or password.");
    loginBtn.innerHTML = "Sign In";
    loginBtn.disabled = false;
  }
});