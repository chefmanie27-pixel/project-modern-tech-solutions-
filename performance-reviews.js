/* ==========================================================================
   DATA
   employeeInfo is loaded from employee_info.json (instructor-provided,
   not modified). DUMMY_REVIEWS is fully hardcoded since performance
   review data doesn't exist in any JSON file. Single reviewer persona
   (Sarah Johnson, HR Manager) since there's no manager hierarchy in
   the dummy data and no employee-facing login.
   ========================================================================== */

let employeeInfo = [];

const REVIEWER = "Sarah Johnson"; // HR Manager persona, sole reviewer

const DUMMY_REVIEWS = {
  1: [
    { period: "Q2 2026", date: "2026-06-30", technicalSkill: 4.5, collaboration: 4.0, communication: 4.0, strengths: "Strong on delivery and code quality.", areasToGrow: "Could delegate more to juniors." },
    { period: "Q1 2026", date: "2026-03-31", technicalSkill: 4.0, collaboration: 3.5, communication: 4.0, strengths: "Solid technical execution.", areasToGrow: "Mentoring juniors." }
  ],
  2: [
    { period: "Q2 2026", date: "2026-06-28", technicalSkill: 4.0, collaboration: 4.5, communication: 5.0, strengths: "Excellent people management.", areasToGrow: "Delegate more day-to-day admin tasks." }
  ],
  3: [],
  4: [
    { period: "Q1 2026", date: "2026-03-15", technicalSkill: 3.5, collaboration: 4.0, communication: 4.5, strengths: "Consistently hits sales targets.", areasToGrow: "Improve CRM record-keeping." }
  ],
  5: [],
  6: [
    { period: "Q2 2026", date: "2026-06-20", technicalSkill: 4.5, collaboration: 4.0, communication: 3.5, strengths: "Great eye for detail in UI work.", areasToGrow: "Speak up more in design reviews." }
  ],
  7: [],
  8: [],
  9: [
    { period: "Q1 2026", date: "2026-03-10", technicalSkill: 4.0, collaboration: 3.5, communication: 3.5, strengths: "Accurate, dependable reporting.", areasToGrow: "Proactive communication with other teams." }
  ],
  10: []
};

let selectedEmployeeId = 1;

/* ==========================================================================
   DATA LOADING
   ========================================================================== */

async function loadEmployeeData() {
  const res = await fetch("data/employee_info.json");
  if (!res.ok) throw new Error("Failed to load employee data.");
  const json = await res.json();
  employeeInfo = json.employeeInformation;
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

function avatarPath(name) {
  return `images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
}

function averageRating(review) {
  return ((review.technicalSkill + review.collaboration + review.communication) / 3).toFixed(1);
}

function getLastReviewLabel(employeeId) {
  const reviews = DUMMY_REVIEWS[employeeId] || [];
  if (reviews.length === 0) return "No reviews yet";
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  const monthLabel = new Date(sorted[0].date).toLocaleString("en-US", { month: "short" });
  return `Last review ${monthLabel}`;
}

/* ==========================================================================
   RENDER: EMPLOYEE LIST (left panel)
   ========================================================================== */

function renderEmployeeList(filter = "") {
  const container = document.getElementById("employeeList");
  container.innerHTML = "";

  const filtered = employeeInfo.filter(emp =>
    emp.name.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(emp => {
    const item = document.createElement("div");
    item.className = "employee-item" + (emp.employeeId === selectedEmployeeId ? " active" : "");
    item.dataset.id = emp.employeeId;
    item.innerHTML = `
      <img class="avatar" src="${avatarPath(emp.name)}" alt="${emp.name}" />
      <div>
        <p class="employee-name">${emp.name}</p>
        <p class="employee-meta">${emp.position} - ${getLastReviewLabel(emp.employeeId)}</p>
      </div>
    `;
    item.addEventListener("click", () => {
      selectedEmployeeId = emp.employeeId;
      renderEmployeeList(document.getElementById("searchInput").value);
      renderDetailHeader();
      renderReviewHistory();
    });
    container.appendChild(item);
  });
}

/* ==========================================================================
   RENDER: DETAIL HEADER (right panel top)
   ========================================================================== */

function renderDetailHeader() {
  const employee = employeeInfo.find(e => e.employeeId === selectedEmployeeId);

  document.querySelector(".detail-header .avatar-lg").src = avatarPath(employee.name);
  document.querySelector(".detail-header .avatar-lg").alt = employee.name;
  document.getElementById("selectedName").textContent = employee.name;
  document.getElementById("selectedMeta").textContent = `${employee.position} - ${employee.department}`;
}

/* ==========================================================================
   RENDER: REVIEW HISTORY (timeline)
   ========================================================================== */

function renderReviewHistory() {
  const container = document.getElementById("reviewHistory");
  container.innerHTML = "";

  const reviews = (DUMMY_REVIEWS[selectedEmployeeId] || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (reviews.length === 0) {
    container.innerHTML = `<p class="timeline-summary">No reviews yet.</p>`;
    return;
  }

  reviews.forEach(review => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <p class="timeline-title">${review.period} - ${review.date} - ${REVIEWER}</p>
      <p class="timeline-summary">
        Rating ${averageRating(review)}/5 - ${review.strengths} Growth area: ${review.areasToGrow}
      </p>
    `;
    container.appendChild(item);
  });
}

/* ==========================================================================
   NEW REVIEW FORM
   ========================================================================== */

function handleReviewSubmit(e) {
  e.preventDefault();

  const period = document.getElementById("reviewPeriod").value;
  if (!period) {
    alert("Please select a review period.");
    return;
  }

  const newReview = {
    period: period.replace("-", " "),
    date: new Date().toISOString().slice(0, 10),
    technicalSkill: parseFloat(document.getElementById("technicalSkill").value),
    collaboration: parseFloat(document.getElementById("collaboration").value),
    communication: parseFloat(document.getElementById("communication").value),
    strengths: document.getElementById("strengths").value || "N/A",
    areasToGrow: document.getElementById("areasToGrow").value || "N/A"
  };

  if (!DUMMY_REVIEWS[selectedEmployeeId]) {
    DUMMY_REVIEWS[selectedEmployeeId] = [];
  }
  DUMMY_REVIEWS[selectedEmployeeId].push(newReview);

  renderReviewHistory();
  renderEmployeeList(document.getElementById("searchInput").value);
  document.getElementById("reviewForm").reset();
}

function handleSaveDraft() {
  // Placeholder - no backend/storage to persist a draft to yet.
  alert("Draft saved (not yet persisted - placeholder for now).");
}

/* ==========================================================================
   INIT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadEmployeeData();
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
      `<p style="color:#e5484d;">Couldn't load employee data. Make sure you're running this via a local server (e.g. <code>python -m http.server</code>), not opening the file directly.</p>`;
  }
});