// js/performance-reviews.js - Updated to use backend API
let employeeInfo = [];
let selectedEmployeeId = 1;

async function loadEmployeeData() {
  try {
    const data = await api.get("/employees");
    employeeInfo = data || [];
  } catch (error) {
    console.error("Error loading employees:", error);
    // Fallback to JSON file
    const res = await fetch("data/employee_info.json");
    if (!res.ok) throw new Error("Failed to load employee data.");
    const json = await res.json();
    employeeInfo = json.employeeInformation;
  }
}

async function loadPerformanceReviews(employeeId) {
  try {
    const reviews = await api.get(`/performance/${employeeId}`);
    return reviews || [];
  } catch (error) {
    console.error("Error loading performance reviews:", error);
    // Fallback to dummy data
    return DUMMY_REVIEWS[employeeId] || [];
  }
}

// ... rest of your code updated to use async/await with API calls