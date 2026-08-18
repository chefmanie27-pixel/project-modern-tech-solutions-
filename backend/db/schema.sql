

CREATE DATABASE IF NOT EXISTS moderntech;
USE moderntech;

-- DEPARTMENTS -------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- EMPLOYEES -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  position VARCHAR(100),
  department_id INT,
  salary DECIMAL(12,2) NOT NULL,
  contact VARCHAR(255) UNIQUE,
  employment_history TEXT,
  hire_date DATE,
  status ENUM('active','on_leave','terminated') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- USERS / AUTH --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','hr','manager','employee') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- PAYROLL ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payroll_runs (
  payroll_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  hours_worked DECIMAL(6,2),
  gross_pay DECIMAL(12,2) NOT NULL,
  leave_deductions DECIMAL(12,2) DEFAULT 0,
  tax_deductions DECIMAL(12,2) DEFAULT 0,
  net_pay DECIMAL(12,2) NOT NULL,
  status ENUM('draft','processed','paid') DEFAULT 'processed',
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_pay_period (employee_id, pay_period_start, pay_period_end),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ATTENDANCE --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_records (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  record_date DATE NOT NULL,
  status ENUM('Present','Absent','Late','Half-Day') NOT NULL,
  clock_in TIME,
  clock_out TIME,
  UNIQUE KEY unique_attendance_day (employee_id, record_date),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- TIME OFF / LEAVE ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
  leave_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status ENUM('Pending','Approved','Denied') DEFAULT 'Pending',
  reviewed_by INT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

-- PERFORMANCE REVIEWS -----------------------------------------------------
CREATE TABLE IF NOT EXISTS performance_reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  reviewer_id INT NULL,
  period VARCHAR(20) NOT NULL,
  review_date DATE NOT NULL,
  technical_skill DECIMAL(3,1),
  collaboration DECIMAL(3,1),
  communication DECIMAL(3,1),
  strengths TEXT,
  areas_to_grow TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(user_id)
);

-- Indexes for frequently-filtered columns
CREATE INDEX idx_attendance_emp_date ON attendance_records(employee_id, record_date);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_payroll_period ON payroll_runs(pay_period_start, pay_period_end);