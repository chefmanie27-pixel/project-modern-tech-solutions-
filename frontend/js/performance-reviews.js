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
<<<<<<< HEAD
let selectedEmployeeId = null;
let reviewsCache = {};

const employeeListEl = document.getElementById("employeeList");
const searchInput = document.getElementById("searchInput");
const selectedNameEl = document.getElementById("selectedName");
const selectedMetaEl = document.getElementById("selectedMeta");
const avatarEl = document.querySelector(".detail-header .avatar-lg");
const reviewHistoryEl = document.getElementById("reviewHistory");
const reviewForm = document.getElementById("reviewForm");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const reviewerEl = document.getElementById("reviewer");

// The reviewer is whoever is currently logged in, not a free-text/dropdown
// value. auth-guard.js stores this after login as `moderntech_user`.
const currentUser = JSON.parse(localStorage.getItem("moderntech_user") || "null");

function initReviewerField() {
  if (!reviewerEl) return;
  if (currentUser) {
    reviewerEl.value = currentUser.email || `User #${currentUser.userId}`;
  } else {
    reviewerEl.value = "Unknown reviewer";
  }
}

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?background=0b2e59&color=fff&name=${encodeURIComponent(name || "?")}`;
}
=======
let allReviews = [];
let selectedEmployeeId = 1;
>>>>>>> e92d8640bd856cbd370bc3f406fa95cf233ba23a

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
  const newReview = {
    employee_id: selectedEmployeeId,
    reviewer_id: null,
    period: period.replace("-", " "),
    review_date: new Date().toISOString().slice(0, 10),
    technical_skill: parseFloat(document.getElementById("technicalSkill").value),
    collaboration: parseFloat(document.getElementById("collaboration").value),
    communication: parseFloat(document.getElementById("communication").value),
    strengths: document.getElementById("strengths").value || "N/A",
    areas_to_grow: document.getElementById("areasToGrow").value || "N/A",
  };
  try {
<<<<<<< HEAD
    const data = await api.get("/employees");
    employeeInfo = data || [];
  } catch (error) {
    console.error("Error loading employees:", error);
    // Fallback to JSON file
    try {
      const res = await fetch("data/employee_info.json");
      if (!res.ok) throw new Error("Failed to load employee data.");
      const json = await res.json();
      employeeInfo = json.employeeInformation || [];
    } catch (fallbackError) {
      console.error("Fallback employee load failed:", fallbackError);
      employeeInfo = [];
    }
  }
}

async function loadPerformanceReviews(employeeId) {
  if (reviewsCache[employeeId]) return reviewsCache[employeeId];
  try {
    const reviews = await api.get(`/performance/${employeeId}`);
    reviewsCache[employeeId] = reviews || [];
    return reviewsCache[employeeId];
  } catch (error) {
    console.error("Error loading performance reviews:", error);
    return [];
  }
}

function renderEmployeeList(filterText) {
  const filter = (filterText || "").trim().toLowerCase();
  const filtered = employeeInfo.filter((emp) =>
    (emp.name || "").toLowerCase().includes(filter),
  );

  if (filtered.length === 0) {
    employeeListEl.innerHTML = `<p class="employee-meta">No employees found.</p>`;
    return;
  }

  employeeListEl.innerHTML = filtered
    .map(
      (emp) => `
        <div class="employee-item${emp.employee_id === selectedEmployeeId ? " active" : ""}" data-id="${emp.employee_id}">
          <img class="avatar" src="${avatarUrl(emp.name)}" alt="${emp.name}" />
          <div>
            <p class="employee-name">${emp.name}</p>
            <p class="employee-meta">${emp.position || ""}</p>
          </div>
        </div>
      `,
    )
    .join("");

  employeeListEl.querySelectorAll(".employee-item").forEach((item) => {
    item.addEventListener("click", () => {
      selectEmployee(Number(item.getAttribute("data-id")));
    });
  });
}

function renderReviewHistory(reviews) {
  if (!reviews || reviews.length === 0) {
    reviewHistoryEl.innerHTML = `<p class="employee-meta">No reviews on record yet.</p>`;
    return;
  }

  reviewHistoryEl.innerHTML = reviews
    .map((review) => {
      const date = review.review_date
        ? new Date(review.review_date).toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        : "";
      return `
        <div class="timeline-item">
          <p class="timeline-title">${review.period || "Review"} — ${date}</p>
          <p class="timeline-summary">
            Technical: ${review.technical_skill ?? "—"} · Collaboration: ${review.collaboration ?? "—"} · Communication: ${review.communication ?? "—"}
          </p>
          ${review.strengths ? `<p class="timeline-summary"><strong>Strengths:</strong> ${review.strengths}</p>` : ""}
          ${review.areas_to_grow ? `<p class="timeline-summary"><strong>Areas to grow:</strong> ${review.areas_to_grow}</p>` : ""}
        </div>
      `;
    })
    .join("");
}

async function selectEmployee(employeeId) {
  selectedEmployeeId = employeeId;
  const emp = employeeInfo.find((e) => e.employee_id === employeeId);
  if (!emp) return;

  selectedNameEl.textContent = emp.name;
  selectedMetaEl.textContent = `${emp.position || ""}${emp.department_name ? " · " + emp.department_name : ""}`;
  if (avatarEl) {
    avatarEl.src = avatarUrl(emp.name);
    avatarEl.alt = emp.name;
  }

  renderEmployeeList(searchInput.value);

  reviewHistoryEl.innerHTML = `<p class="employee-meta">Loading review history...</p>`;
  const reviews = await loadPerformanceReviews(employeeId);
  if (selectedEmployeeId === employeeId) {
    renderReviewHistory(reviews);
  }
}

searchInput.addEventListener("input", () => {
  renderEmployeeList(searchInput.value);
});

function resetForm() {
  reviewForm.reset();
}

async function submitReview(status) {
  if (!selectedEmployeeId) {
    alert("Select an employee first.");
    return;
  }

  const period = document.getElementById("reviewPeriod").value;

  if (status !== "draft" && !period) {
    alert("Please choose a review period.");
    return;
  }

  if (!currentUser || !currentUser.userId) {
    alert("Could not identify the logged-in reviewer. Please sign in again.");
    return;
  }

  const payload = {
    employee_id: selectedEmployeeId,
    reviewer_id: currentUser.userId,
    period: period || "Draft",
    review_date: new Date().toISOString().slice(0, 10),
    technical_skill: Number(document.getElementById("technicalSkill").value),
    collaboration: Number(document.getElementById("collaboration").value),
    communication: Number(document.getElementById("communication").value),
    strengths: document.getElementById("strengths").value,
    areas_to_grow: document.getElementById("areasToGrow").value,
  };

  try {
    await api.post("/performance", payload);
    delete reviewsCache[selectedEmployeeId];
    const reviews = await loadPerformanceReviews(selectedEmployeeId);
    renderReviewHistory(reviews);
    resetForm();
    alert(status === "draft" ? "Draft saved." : "Review submitted.");
  } catch (err) {
    alert("Could not save review: " + err.message);
  }
}

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitReview("submitted");
});

saveDraftBtn.addEventListener("click", () => {
  submitReview("draft");
});

(async function init() {
  initReviewerField();
  await loadEmployeeData();
  renderEmployeeList("");
  if (employeeInfo.length > 0) {
    await selectEmployee(employeeInfo[0].employee_id);
  } else {
    selectedNameEl.textContent = "No employees found";
    reviewHistoryEl.innerHTML = "";
  }
})();
=======
    await apiRequest("/performance", { method: "POST", body: JSON.stringify(newReview) });
    await loadReviews();
    renderReviewHistory();
    renderEmployeeList(document.getElementById("searchInput").value);
    document.getElementById("reviewForm").reset();
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
>>>>>>> e92d8640bd856cbd370bc3f406fa95cf233ba23a
