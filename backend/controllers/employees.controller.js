// controllers/employees.controller.js
// Request-handling logic for /api/v1/employees.
// Field names match employees.html's form fields (newName, newPosition, etc.)
// mapped to their snake_case DB equivalents.

import * as Employee from "../models/Employee.js";

async function listEmployees(req, res, next) {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (err) {
    next(err);
  }
}

async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.getById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
}

// Accepts either the DB shape (department_id, employment_history) or the
// shape employees.html's form actually produces (department name string,
// employmentHistory camelCase) and normalizes to what Employee.create/update
// expect.
async function resolveEmployeePayload(body) {
  const {
    name,
    position,
    department_id,
    department, // free-text department name from the form
    salary,
    contact,
    employment_history,
    employmentHistory,
    hire_date,
  } = body;

  const resolvedDepartmentId = department_id
    ? department_id
    : await Employee.findOrCreateDepartmentId(department);

  return {
    name,
    position,
    department_id: resolvedDepartmentId,
    salary,
    contact,
    employment_history: employment_history !== undefined ? employment_history : employmentHistory,
    hire_date,
  };
}

async function createEmployee(req, res, next) {
  try {
    const { name, salary } = req.body;

    if (!name || !salary) {
      return res.status(400).json({ message: "name and salary are required" });
    }

    const payload = await resolveEmployeePayload(req.body);
    const employee = await Employee.create(payload);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const payload = await resolveEmployeePayload(req.body);
    // Drop undefined keys so partial updates don't null out unspecified columns.
    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

    const employee = await Employee.update(req.params.id, payload);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const deleted = await Employee.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
