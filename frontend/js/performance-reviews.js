// js/performance-reviews.js - Updated to use backend API
let employeeInfo = [];
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

async function loadEmployeeData() {
  try {
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
