// controllers/employees.controller.js
// Request-handling logic for /api/v1/employees.
// Field names match employees.html's form fields (newName, newPosition, etc.)
// mapped to their snake_case DB equivalents.

const Employee = require("../models/Employee");

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

async function createEmployee(req, res, next) {
  try {
    const { name, position, department_id, salary, contact, employment_history, hire_date } = req.body;

    if (!name || !salary) {
      return res.status(400).json({ message: "name and salary are required" });
    }

    const employee = await Employee.create({
      name,
      position,
      department_id,
      salary,
      contact,
      employment_history,
      hire_date,
    });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const employee = await Employee.update(req.params.id, req.body);
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

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
