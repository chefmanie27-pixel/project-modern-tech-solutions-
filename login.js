const welcomeScreen = document.getElementById("welcome-screen");
const loginScreen = document.getElementById("login-screen");

const accessBtn = document.getElementById("accessBtn");

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const loginForm = document.getElementById("loginForm");

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

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = password.value.trim();

  if (email === "" || pass === "") {
    alert("Please fill in all fields.");

    return;
  }

  // Loading effect
  const button = document.querySelector(".login-btn");

  button.innerHTML = "Signing In...";

  button.disabled = true;

  // Simulate login
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500);
});
