const welcomeScreen = document.getElementById("welcome-screen");
const loginScreen = document.getElementById("login-screen");

const accessBtn = document.getElementById("accessBtn");

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginBtn = document.querySelector(".login-btn");

accessBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
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
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Incorrect email or password.");
      loginBtn.innerHTML = "Sign In";
      loginBtn.disabled = false;
      return;
    }

    // Store the real JWT returned by the backend.
    localStorage.setItem("moderntech_token", data.token);

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error);

    showError("Unable to connect to the server. Please try again.");

    loginBtn.innerHTML = "Sign In";
    loginBtn.disabled = false;
  }
});
