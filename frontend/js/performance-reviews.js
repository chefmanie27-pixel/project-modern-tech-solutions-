/* ==========================================================================
   API HELPER (temporary — swap for Azhar's shared api.js once it exists)
   ========================================================================== */
const API_BASE = "http://localhost:3000/api/v1";
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("moderntech_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(`Request failed: ${endpoint} (${res.status})`);
  return res.json();
}

/* ==========================================================================
   STATE
   ========================================================================== */
let employeeInfo = [];
let allReviews = [];
let selectedEmployeeId = 1;

// The reviewer is whoever is currently logged in, not a free-text/dropdown
// value. auth-guard.js stores this after login as `moderntech_user`.
const currentUser = JSON.parse(localStorage.getItem("moderntech_user") || "null");

async function loadEmployeeData() {
  employeeInfo = await apiRequest("/employees");
}
async function loadReviews() {
  allReviews = await apiRequest("/performance");
}
function reviewsForEmployee(employeeId) {
  return allReviews.filter(r => r.employee_id === employeeId);
}

/* ==========================================================================
   HELPERS
   ========================================================================== */
function avatarPath(name) {
  return `images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
}
function handleAvatarError(imgEl, name) {
  imgEl.onerror = null;
  const initials = name.split(" ").map(part => part[0]).join("").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <rect width="100%" height="100%" fill="#0B2E59"/>
    <text x="50%" y="50%" fill="#ffffff" font-family="Poppins, sans-serif"
          font-size="30" font-weight="600" text-anchor="middle" dy=".35em">${initials}</text>
  </svg>`;
  imgEl.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function averageRating(review) {
  return ((Number(review.technical_skill) + Number(review.collaboration) + Number(review.communication)) / 3).toFixed(1);
}
function getLastReviewLabel(employeeId) {
  const reviews = reviewsForEmployee(employeeId);
  if (reviews.length === 0) return "No reviews yet";
  const sorted = [...reviews].sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
  const monthLabel = new Date(sorted[0].review_date).toLocaleString("en-US", { month: "short" });
  return `Last review ${monthLabel}`;
}

// Fills in a read-only "Reviewer" field with the logged-in user, if the
// page has one (id="reviewer"). Safe no-op if the markup doesn't have it.
function initReviewerField() {
  const reviewerEl = document.getElementById("reviewer");
  if (!reviewerEl) return;
  if (currentUser) {
    reviewerEl.value = currentUser.email || `User #${currentUser.userId}`;
  } else {
    reviewerEl.value = "Unknown reviewer";
  }
}

/* ==========================================================================
   RENDER: EMPLOYEE LIST
   ========================================================================== */
function renderEmployeeList(filter = "") {
  const container = document.getElementById("employeeList");
  container.innerHTML = "";
  const filtered = employeeInfo.filter(emp =>
    emp.name.toLowerCase().includes(filter.toLowerCase())
  );
  if (filtered.length === 0) {
    container.innerHTML = `<p class="employee-meta">No employees match "${filter}".</p>`;
    return;
  }
  filtered.forEach(emp => {
    const item = document.createElement("div");
    item.className = "employee-item" + (emp.employee_id === selectedEmployeeId ? " active" : "");
    item.dataset.id = emp.employee_id;
    item.innerHTML = `
      <img class="avatar" src="${avatarPath(emp.name)}" alt="${emp.name}" />
      <div>
        <p class="employee-name">${emp.name}</p>
        <p class="employee-meta">${emp.position} - ${getLastReviewLabel(emp.employee_id)}</p>
      </div>
    `;
    item.querySelector("img").addEventListener("error", function () {
      handleAvatarError(this, emp.name);
    });
    item.addEventListener("click", () => {
      selectedEmployeeId = emp.employee_id;
      renderEmployeeList(document.getElementById("searchInput").value);
      renderDetailHeader();
      renderReviewHistory();
    });
    container.appendChild(item);
  });
}

/* ==========================================================================
   RENDER: DETAIL HEADER
   ========================================================================== */
function renderDetailHeader() {
  const employee = employeeInfo.find(e => e.employee_id === selectedEmployeeId);
  if (!employee) return;
  const headerAvatar = document.querySelector(".detail-header .avatar-lg");
  headerAvatar.src = avatarPath(employee.name);
  headerAvatar.alt = employee.name;
  headerAvatar.onerror = () => handleAvatarError(headerAvatar, employee.name);
  document.getElementById("selectedName").textContent = employee.name;
  document.getElementById("selectedMeta").textContent =
    `${employee.position}${employee.department ? " - " + employee.department : ""}`;
}

/* ==========================================================================
   RENDER: REVIEW HISTORY
   ========================================================================== */
function renderReviewHistory() {
  const container = document.getElementById("reviewHistory");
  container.innerHTML = "";
  const reviews = reviewsForEmployee(selectedEmployeeId)
    .slice()
    .sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
  if (reviews.length === 0) {
    container.innerHTML = `<p class="timeline-summary">No reviews yet.</p>`;
    return;
  }
  reviews.forEach(review => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <p class="timeline-title">${review.period} - ${review.review_date.slice(0, 10)}</p>
      <p class="timeline-summary">
        Rating ${averageRating(review)}/5 - ${review.strengths} Growth area: ${review.areas_to_grow}
      </p>
    `;
    container.appendChild(item);
  });
}

/* ==========================================================================
   NEW REVIEW FORM
   ========================================================================== */
async function handleReviewSubmit(e) {
  e.preventDefault();
  const period = document.getElementById("reviewPeriod").value;
  if (!period) {
    alert("Please select a review period.");
    return;
  }
  if (!currentUser || !currentUser.userId) {
    alert("Could not identify the logged-in reviewer. Please sign in again.");
    return;
  }
  const newReview = {
    employee_id: selectedEmployeeId,
    reviewer_id: currentUser.userId,
    period: period.replace("-", " "),
    review_date: new Date().toISOString().slice(0, 10),
    technical_skill: parseFloat(document.getElementById("technicalSkill").value),
    collaboration: parseFloat(document.getElementById("collaboration").value),
    communication: parseFloat(document.getElementById("communication").value),
    strengths: document.getElementById("strengths").value || "N/A",
    areas_to_grow: document.getElementById("areasToGrow").value || "N/A",
  };
  try {
    await apiRequest("/performance", { method: "POST", body: JSON.stringify(newReview) });
    await loadReviews();
    renderReviewHistory();
    renderEmployeeList(document.getElementById("searchInput").value);
    document.getElementById("reviewForm").reset();
    initReviewerField();
  } catch (err) {
    alert("Couldn't save the review. Please try again.");
  }
}
function handleSaveDraft() {
  alert("Draft saved (not yet persisted - placeholder for now).");
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    initReviewerField();
    await loadEmployeeData();
    await loadReviews();
    renderEmployeeList();
    renderDetailHeader();
    renderReviewHistory();
    document.getElementById("searchInput").addEventListener("input", (e) => {
      renderEmployeeList(e.target.value);
    });
    document.getElementById("reviewForm").addEventListener("submit", handleReviewSubmit);
    document.getElementById("saveDraftBtn").addEventListener("click", handleSaveDraft);
  } catch (err) {
    console.error(err);
    document.querySelector(".reviews-container").innerHTML =
      `<p style="color:#e5484d;">Couldn't load data. Make sure the server is running and you're logged in.</p>`;
  }
});