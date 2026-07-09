// Employee list + search + click-to-select + review history +
// button feedback.
// ============================================================

let EMPLOYEES = [];
let selectedEmployeeId = null;



const DUMMY_REVIEWS = {
  1: [
    { period: "Q2 2026", date: "2026-06-30", rating: 4.5, strengths: "Strong on communication and delivery", growthArea: "Delegation" },
    { period: "Q1 2026", date: "2026-03-31", rating: 4.0, strengths: "Solid technical execution", growthArea: "Mentoring juniors" },
  ],
  2: [
    { period: "Q2 2026", date: "2026-06-28", rating: 4.8, strengths: "Excellent people management and conflict resolution", growthArea: "Delegating admin tasks" },
  ],
  3: [
    { period: "Q1 2026", date: "2026-03-25", rating: 3.5, strengths: "Thorough, catches edge cases others miss", growthArea: "Speeding up test cycles" },
  ],
  4: [],
  5: [
    { period: "Q2 2026", date: "2026-06-20", rating: 4.2, strengths: "Creative campaign ideas, strong brand sense", growthArea: "Data-driven reporting" },
    { period: "Q4 2025", date: "2025-12-15", rating: 3.9, strengths: "Good collaboration with sales", growthArea: "Meeting deadlines" },
  ],
  6: [
    { period: "Q2 2026", date: "2026-06-18", rating: 4.6, strengths: "Excellent UI polish and attention to detail", growthArea: "Documenting design decisions" },
  ],
  7: [
    { period: "Q1 2026", date: "2026-03-30", rating: 4.3, strengths: "Reliable infrastructure, fast incident response", growthArea: "Cross-team communication" },
  ],
  8: [],
  9: [
    { period: "Q2 2026", date: "2026-06-10", rating: 3.8, strengths: "Accurate, detail-oriented reporting", growthArea: "Process automation" },
  ],
  10: [
    { period: "Q2 2026", date: "2026-06-05", rating: 4.1, strengths: "Great customer rapport, calm under pressure", growthArea: "Ticket triage speed" },
  ],
};

const REVIEWER_NAME = "Sarah Johnson";

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=128`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function loadEmployees() {
  try {
    const res = await fetch("../M1 Project Module - Employee Dummy JSON Data/employee_info.json");
    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    const data = await res.json();
    EMPLOYEES = data.employeeInformation;
  } catch (err) {
    console.error("Could not load employee_info.json:", err);
    console.error("Check that: 1) you're running via 'python -m http.server' (not opening the file directly), and 2) the 'data' folder is in the right place relative to this HTML file.");
    EMPLOYEES = [];
  }
}

function renderEmployeeList(filter = "") {
  const container = document.getElementById("employeeList");
  if (!container) {
    console.error(`Could not find an element with id="employeeList" - check your HTML.`);
    return;
  }
  container.innerHTML = "";

  const term = filter.trim().toLowerCase();
  const filtered = EMPLOYEES.filter((emp) => emp.name.toLowerCase().includes(term));

  if (filtered.length === 0) {
    container.innerHTML = `<p class="employee-meta">No employees found.</p>`;
    return;
  }

  filtered.forEach((emp) => {
    const item = document.createElement("div");
    item.className = "employee-item" + (emp.employeeId === selectedEmployeeId ? " active" : "");
    item.dataset.id = emp.employeeId;

    item.innerHTML = `
      <img class="avatar" src="${avatarUrl(emp.name)}" alt="${emp.name}" />
      <div class="employee-info">
        <p class="employee-name">${emp.name}</p>
        <p class="employee-meta">${emp.position}</p>
      </div>
    `;

    item.addEventListener("click", () => selectEmployee(emp.employeeId));
    container.appendChild(item);
  });
}

function renderHistory(id) {
  const container = document.getElementById("reviewHistory");
  if (!container) {
    console.error(`Could not find an element with id="reviewHistory" - check your HTML.`);
    return;
  }
  container.innerHTML = "";

  const reviews = DUMMY_REVIEWS[id] || [];

  if (reviews.length === 0) {
    container.innerHTML = `<p class="timeline-summary">No reviews yet.</p>`;
    return;
  }

  reviews.forEach((r) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <span class="timeline-dot"></span>
      <div class="timeline-content">
        <div class="timeline-row">
          <p class="timeline-title">${r.period} - ${formatDate(r.date)}</p>
          <span class="timeline-reviewer">${REVIEWER_NAME}</span>
        </div>
        <p class="timeline-summary">Rating ${r.rating}/5 - ${r.strengths} - Growth area: ${r.growthArea}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

function selectEmployee(id) {
  selectedEmployeeId = id;

  const searchInput = document.getElementById("searchInput");
  renderEmployeeList(searchInput ? searchInput.value : ""); // re-render so the clicked item gets the "active" highlight

  const emp = EMPLOYEES.find((e) => e.employeeId === id);
  if (!emp) return;

  document.getElementById("selectedName").textContent = emp.name;
  document.getElementById("selectedMeta").textContent = `${emp.position} - ${emp.department}`;
  document.getElementById("selectedAvatar").src = avatarUrl(emp.name);

  renderHistory(id);

  // Scroll to the review form so clicking an employee "takes you" to it
  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    console.error(`Could not find an element with id="searchInput" - check your HTML input tag has this exact id.`);
    return;
  }
  searchInput.addEventListener("input", (e) => {
    renderEmployeeList(e.target.value);
  });
}

function setupNewReviewButton() {
  document.getElementById("newReviewBtn").addEventListener("click", () => {
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
  });
}

function setupReviewForm() {
  const form = document.getElementById("reviewForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      alert("Please select an employee first.");
      return;
    }

    const period = document.getElementById("reviewPeriod").value;
    if (!period) {
      alert("Please select a review period.");
      return;
    }

    const technical = parseFloat(document.getElementById("technicalSkill").value);
    const collaboration = parseFloat(document.getElementById("collaboration").value);
    const communication = parseFloat(document.getElementById("communication").value);
    const avgRating = Math.round(((technical + collaboration + communication) / 3) * 10) / 10;

    const strengths = document.getElementById("strengths").value.trim() || "N/A";
    const growthArea = document.getElementById("areasToGrow").value.trim() || "N/A";

    const newReview = {
      period: period.replace("-", " "),
      date: new Date().toISOString().split("T")[0],
      rating: avgRating,
      strengths,
      growthArea,
    };

    if (!DUMMY_REVIEWS[selectedEmployeeId]) DUMMY_REVIEWS[selectedEmployeeId] = [];
    DUMMY_REVIEWS[selectedEmployeeId].unshift(newReview);

    renderHistory(selectedEmployeeId);

    const emp = EMPLOYEES.find((emp) => emp.employeeId === selectedEmployeeId);
    alert(`Review submitted for ${emp.name}.`);
    form.reset();
  });

  document.getElementById("saveDraftBtn").addEventListener("click", () => {
    alert("Draft saved.");
  });
}

async function init() {
  await loadEmployees();

  if (EMPLOYEES.length > 0) {
    selectedEmployeeId = EMPLOYEES[0].employeeId;
  }

  renderEmployeeList();
  if (selectedEmployeeId !== null) {
    selectEmployee(selectedEmployeeId);
  }

  setupSearch();
  setupNewReviewButton();
  setupReviewForm();
}

document.addEventListener("DOMContentLoaded", init);