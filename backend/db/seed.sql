USE moderntech;

-- Clean existing data (in correct order to avoid foreign key conflicts)
DELETE FROM performance_reviews;
DELETE FROM leave_requests;
DELETE FROM attendance_records;
DELETE FROM payroll_runs;
DELETE FROM users WHERE employee_id IS NOT NULL;
DELETE FROM employees;
DELETE FROM departments;

-- Reset auto-increment counters
ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE departments AUTO_INCREMENT = 1;
ALTER TABLE payroll_runs AUTO_INCREMENT = 1;
ALTER TABLE attendance_records AUTO_INCREMENT = 1;
ALTER TABLE leave_requests AUTO_INCREMENT = 1;
ALTER TABLE performance_reviews AUTO_INCREMENT = 1;

-- =====================================================
-- DEPARTMENTS
-- =====================================================
INSERT INTO departments (name) VALUES
  ('Development'),
  ('HR'),
  ('QA'),
  ('Sales'),
  ('Marketing'),
  ('Design'),
  ('IT'),
  ('Finance'),
  ('Support'),
  ('Operations');

-- =====================================================
-- EMPLOYEES
-- =====================================================
INSERT INTO employees (name, position, department_id, salary, contact, employment_history, hire_date, status) VALUES
  ('Sibongile Nkosi', 'Software Engineer', 1, 70000.00, 'sibongile.nkosi@moderntech.com', 'Joined in 2015, promoted to Senior in 2018', '2015-01-01', 'active'),
  ('Lungile Moyo', 'HR Manager', 2, 80000.00, 'lungile.moyo@moderntech.com', 'Joined in 2013, promoted to Manager in 2017', '2013-01-01', 'active'),
  ('Thabo Molefe', 'Quality Analyst', 3, 55000.00, 'thabo.molefe@moderntech.com', 'Joined in 2018', '2018-01-01', 'active'),
  ('Keshav Naidoo', 'Sales Representative', 4, 60000.00, 'keshav.naidoo@moderntech.com', 'Joined in 2020', '2020-01-01', 'active'),
  ('Zanele Khumalo', 'Marketing Specialist', 5, 58000.00, 'zanele.khumalo@moderntech.com', 'Joined in 2019', '2019-01-01', 'active'),
  ('Sipho Zulu', 'UI/UX Designer', 6, 65000.00, 'sipho.zulu@moderntech.com', 'Joined in 2016', '2016-01-01', 'active'),
  ('Naledi Moeketsi', 'DevOps Engineer', 7, 72000.00, 'naledi.moeketsi@moderntech.com', 'Joined in 2017', '2017-01-01', 'active'),
  ('Farai Gumbo', 'Content Strategist', 5, 56000.00, 'farai.gumbo@moderntech.com', 'Joined in 2021', '2021-01-01', 'active'),
  ('Karabo Dlamini', 'Accountant', 8, 62000.00, 'karabo.dlamini@moderntech.com', 'Joined in 2018', '2018-01-01', 'active'),
  ('Fatima Patel', 'Customer Support Lead', 9, 58000.00, 'fatima.patel@moderntech.com', 'Joined in 2016', '2016-01-01', 'active'),
  ('Tendai Moyo', 'Operations Manager', 10, 75000.00, 'tendai.moyo@moderntech.com', 'Joined in 2020, promoted 2023', '2020-06-01', 'active'),
  ('Priya Naicker', 'Junior Developer', 1, 45000.00, 'priya.naicker@moderntech.com', 'Joined in 2024', '2024-01-15', 'active');

-- =====================================================
-- USERS (Auth)
-- =====================================================
-- Password for all test users is: Password123!
-- admin@moderntech.com uses the same hash
INSERT INTO users (employee_id, email, password_hash, role) VALUES
  (NULL, 'admin@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'admin'),
  (1, 'sibongile.nkosi@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (2, 'lungile.moyo@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'hr'),
  (3, 'thabo.molefe@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (4, 'keshav.naidoo@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (5, 'zanele.khumalo@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (6, 'sipho.zulu@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (7, 'naledi.moeketsi@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (8, 'farai.gumbo@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (9, 'karabo.dlamini@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee'),
  (10, 'fatima.patel@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'employee');

-- =====================================================
-- PAYROLL RUNS (Current and historical)
-- =====================================================
INSERT INTO payroll_runs (employee_id, pay_period_start, pay_period_end, hours_worked, gross_pay, leave_deductions, tax_deductions, net_pay, status) VALUES
  -- July 2025 (current month)
  (1,  '2025-07-01', '2025-07-31', 160, 70000.00, 3500.00, 11970.00, 54530.00, 'processed'),
  (2,  '2025-07-01', '2025-07-31', 150, 75000.00, 5000.00, 12600.00, 57400.00, 'processed'),
  (3,  '2025-07-01', '2025-07-31', 170, 58437.50, 1375.00, 10271.25, 46791.25, 'processed'),
  (4,  '2025-07-01', '2025-07-31', 165, 61875.00, 2250.00, 10732.50, 48892.50, 'processed'),
  (5,  '2025-07-01', '2025-07-31', 158, 57275.00, 1812.50, 9983.25, 45479.25, 'processed'),
  (6,  '2025-07-01', '2025-07-31', 168, 68250.00, 812.50, 12138.75, 55298.75, 'processed'),
  (7,  '2025-07-01', '2025-07-31', 175, 78750.00, 1350.00, 13932.00, 63468.00, 'processed'),
  (8,  '2025-07-01', '2025-07-31', 160, 56000.00, 0.00, 10080.00, 45920.00, 'processed'),
  (9,  '2025-07-01', '2025-07-31', 155, 60062.50, 1937.50, 10462.50, 47662.50, 'processed'),
  (10, '2025-07-01', '2025-07-31', 162, 58725.00, 1450.00, 10309.50, 46965.50, 'processed'),
  
  -- June 2025 (for payroll trend)
  (1,  '2025-06-01', '2025-06-30', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2,  '2025-06-01', '2025-06-30', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3,  '2025-06-01', '2025-06-30', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4,  '2025-06-01', '2025-06-30', 160, 60000.00, 0.00, 10800.00, 49200.00, 'paid'),
  (5,  '2025-06-01', '2025-06-30', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  (6,  '2025-06-01', '2025-06-30', 160, 65000.00, 0.00, 11700.00, 53300.00, 'paid'),
  (7,  '2025-06-01', '2025-06-30', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8,  '2025-06-01', '2025-06-30', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9,  '2025-06-01', '2025-06-30', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-06-01', '2025-06-30', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),

  -- May 2025
  (1,  '2025-05-01', '2025-05-31', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2,  '2025-05-01', '2025-05-31', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3,  '2025-05-01', '2025-05-31', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4,  '2025-05-01', '2025-05-31', 160, 60000.00, 0.00, 10800.00, 49200.00, 'paid'),
  (5,  '2025-05-01', '2025-05-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  (6,  '2025-05-01', '2025-05-31', 160, 65000.00, 0.00, 11700.00, 53300.00, 'paid'),
  (7,  '2025-05-01', '2025-05-31', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8,  '2025-05-01', '2025-05-31', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9,  '2025-05-01', '2025-05-31', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-05-01', '2025-05-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),

  -- April 2025
  (1,  '2025-04-01', '2025-04-30', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2,  '2025-04-01', '2025-04-30', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3,  '2025-04-01', '2025-04-30', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4,  '2025-04-01', '2025-04-30', 160, 60000.00, 0.00, 10800.00, 49200.00, 'paid'),
  (5,  '2025-04-01', '2025-04-30', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  (6,  '2025-04-01', '2025-04-30', 160, 65000.00, 0.00, 11700.00, 53300.00, 'paid'),
  (7,  '2025-04-01', '2025-04-30', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8,  '2025-04-01', '2025-04-30', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9,  '2025-04-01', '2025-04-30', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-04-01', '2025-04-30', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),

  -- March 2025
  (1,  '2025-03-01', '2025-03-31', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2,  '2025-03-01', '2025-03-31', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3,  '2025-03-01', '2025-03-31', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4,  '2025-03-01', '2025-03-31', 160, 60000.00, 0.00, 10800.00, 49200.00, 'paid'),
  (5,  '2025-03-01', '2025-03-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  (6,  '2025-03-01', '2025-03-31', 160, 65000.00, 0.00, 11700.00, 53300.00, 'paid'),
  (7,  '2025-03-01', '2025-03-31', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8,  '2025-03-01', '2025-03-31', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9,  '2025-03-01', '2025-03-31', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-03-01', '2025-03-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),

  -- February 2025
  (1,  '2025-02-01', '2025-02-28', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2,  '2025-02-01', '2025-02-28', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3,  '2025-02-01', '2025-02-28', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4,  '2025-02-01', '2025-02-28', 160, 60000.00, 0.00, 10800.00, 49200.00, 'paid'),
  (5,  '2025-02-01', '2025-02-28', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  (6,  '2025-02-01', '2025-02-28', 160, 65000.00, 0.00, 11700.00, 53300.00, 'paid'),
  (7,  '2025-02-01', '2025-02-28', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8,  '2025-02-01', '2025-02-28', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9,  '2025-02-01', '2025-02-28', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-02-01', '2025-02-28', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),

  -- January 2025
  (1,  '2025-01-01', '2025-01-31', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2,  '2025-01-01', '2025-01-31', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3,  '2025-01-01', '2025-01-31', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4,  '2025-01-01', '2025-01-31', 160, 60000.00, 0.00, 10800.00, 49200.00, 'paid'),
  (5,  '2025-01-01', '2025-01-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  (6,  '2025-01-01', '2025-01-31', 160, 65000.00, 0.00, 11700.00, 53300.00, 'paid'),
  (7,  '2025-01-01', '2025-01-31', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8,  '2025-01-01', '2025-01-31', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9,  '2025-01-01', '2025-01-31', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-01-01', '2025-01-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid');

-- =====================================================
-- ATTENDANCE RECORDS (Last 10 working days - July 2025)
-- =====================================================
INSERT INTO attendance_records (employee_id, record_date, status, clock_in, clock_out) VALUES
  -- July 14-25, 2025 (10 working days)
  -- Employee 1: Sibongile Nkosi
  (1, '2025-07-14', 'Present', '08:00', '17:00'),
  (1, '2025-07-15', 'Present', '08:15', '17:00'),
  (1, '2025-07-16', 'Present', '08:00', '17:00'),
  (1, '2025-07-17', 'Late', '08:45', '17:00'),
  (1, '2025-07-18', 'Absent', NULL, NULL),
  (1, '2025-07-21', 'Present', '08:00', '17:00'),
  (1, '2025-07-22', 'Present', '08:00', '17:00'),
  (1, '2025-07-23', 'Present', '08:00', '17:00'),
  (1, '2025-07-24', 'Present', '08:00', '17:00'),
  (1, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 2: Lungile Moyo
  (2, '2025-07-14', 'Present', '08:00', '17:00'),
  (2, '2025-07-15', 'Present', '08:00', '17:00'),
  (2, '2025-07-16', 'Present', '08:00', '17:00'),
  (2, '2025-07-17', 'Present', '08:00', '17:00'),
  (2, '2025-07-18', 'Present', '08:00', '17:00'),
  (2, '2025-07-21', 'Present', '08:00', '17:00'),
  (2, '2025-07-22', 'Present', '08:00', '17:00'),
  (2, '2025-07-23', 'Present', '08:00', '17:00'),
  (2, '2025-07-24', 'Present', '08:00', '17:00'),
  (2, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 3: Thabo Molefe
  (3, '2025-07-14', 'Present', '08:00', '17:00'),
  (3, '2025-07-15', 'Present', '08:00', '17:00'),
  (3, '2025-07-16', 'Present', '08:00', '17:00'),
  (3, '2025-07-17', 'Present', '08:00', '17:00'),
  (3, '2025-07-18', 'Present', '08:00', '17:00'),
  (3, '2025-07-21', 'Absent', NULL, NULL),
  (3, '2025-07-22', 'Absent', NULL, NULL),
  (3, '2025-07-23', 'Present', '08:00', '17:00'),
  (3, '2025-07-24', 'Present', '08:00', '17:00'),
  (3, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 4: Keshav Naidoo
  (4, '2025-07-14', 'Present', '08:00', '17:00'),
  (4, '2025-07-15', 'Present', '08:00', '17:00'),
  (4, '2025-07-16', 'Present', '08:00', '17:00'),
  (4, '2025-07-17', 'Present', '08:00', '17:00'),
  (4, '2025-07-18', 'Present', '08:00', '17:00'),
  (4, '2025-07-21', 'Present', '08:00', '17:00'),
  (4, '2025-07-22', 'Present', '08:00', '17:00'),
  (4, '2025-07-23', 'Present', '08:00', '17:00'),
  (4, '2025-07-24', 'Present', '08:00', '17:00'),
  (4, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 5: Zanele Khumalo
  (5, '2025-07-14', 'Present', '08:00', '17:00'),
  (5, '2025-07-15', 'Present', '08:00', '17:00'),
  (5, '2025-07-16', 'Present', '08:00', '17:00'),
  (5, '2025-07-17', 'Present', '08:00', '17:00'),
  (5, '2025-07-18', 'Present', '08:00', '17:00'),
  (5, '2025-07-21', 'Present', '08:00', '17:00'),
  (5, '2025-07-22', 'Present', '08:00', '17:00'),
  (5, '2025-07-23', 'Present', '08:00', '17:00'),
  (5, '2025-07-24', 'Present', '08:00', '17:00'),
  (5, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 6: Sipho Zulu
  (6, '2025-07-14', 'Present', '08:00', '17:00'),
  (6, '2025-07-15', 'Present', '08:00', '17:00'),
  (6, '2025-07-16', 'Present', '08:00', '17:00'),
  (6, '2025-07-17', 'Present', '08:00', '17:00'),
  (6, '2025-07-18', 'Present', '08:00', '17:00'),
  (6, '2025-07-21', 'Present', '08:00', '17:00'),
  (6, '2025-07-22', 'Present', '08:00', '17:00'),
  (6, '2025-07-23', 'Present', '08:00', '17:00'),
  (6, '2025-07-24', 'Present', '08:00', '17:00'),
  (6, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 7: Naledi Moeketsi
  (7, '2025-07-14', 'Present', '08:00', '17:00'),
  (7, '2025-07-15', 'Present', '08:00', '17:00'),
  (7, '2025-07-16', 'Present', '08:00', '17:00'),
  (7, '2025-07-17', 'Present', '08:00', '17:00'),
  (7, '2025-07-18', 'Present', '08:00', '17:00'),
  (7, '2025-07-21', 'Present', '08:00', '17:00'),
  (7, '2025-07-22', 'Late', '09:00', '17:00'),
  (7, '2025-07-23', 'Present', '08:00', '17:00'),
  (7, '2025-07-24', 'Present', '08:00', '17:00'),
  (7, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 8: Farai Gumbo
  (8, '2025-07-14', 'Present', '08:00', '17:00'),
  (8, '2025-07-15', 'Present', '08:00', '17:00'),
  (8, '2025-07-16', 'Present', '08:00', '17:00'),
  (8, '2025-07-17', 'Present', '08:00', '17:00'),
  (8, '2025-07-18', 'Present', '08:00', '17:00'),
  (8, '2025-07-21', 'Present', '08:00', '17:00'),
  (8, '2025-07-22', 'Present', '08:00', '17:00'),
  (8, '2025-07-23', 'Present', '08:00', '17:00'),
  (8, '2025-07-24', 'Present', '08:00', '17:00'),
  (8, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 9: Karabo Dlamini
  (9, '2025-07-14', 'Present', '08:00', '17:00'),
  (9, '2025-07-15', 'Present', '08:00', '17:00'),
  (9, '2025-07-16', 'Present', '08:00', '17:00'),
  (9, '2025-07-17', 'Present', '08:00', '17:00'),
  (9, '2025-07-18', 'Present', '08:00', '17:00'),
  (9, '2025-07-21', 'Present', '08:00', '17:00'),
  (9, '2025-07-22', 'Present', '08:00', '17:00'),
  (9, '2025-07-23', 'Present', '08:00', '17:00'),
  (9, '2025-07-24', 'Present', '08:00', '17:00'),
  (9, '2025-07-25', 'Present', '08:00', '17:00'),
  
  -- Employee 10: Fatima Patel
  (10, '2025-07-14', 'Present', '08:00', '17:00'),
  (10, '2025-07-15', 'Present', '08:00', '17:00'),
  (10, '2025-07-16', 'Present', '08:00', '17:00'),
  (10, '2025-07-17', 'Present', '08:00', '17:00'),
  (10, '2025-07-18', 'Present', '08:00', '17:00'),
  (10, '2025-07-21', 'Present', '08:00', '17:00'),
  (10, '2025-07-22', 'Present', '08:00', '17:00'),
  (10, '2025-07-23', 'Present', '08:00', '17:00'),
  (10, '2025-07-24', 'Present', '08:00', '17:00'),
  (10, '2025-07-25', 'Present', '08:00', '17:00');

-- =====================================================
-- LEAVE REQUESTS
-- =====================================================
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status, reviewed_by, requested_at, reviewed_at) VALUES
  -- Approved leave
  (1, 'Sick Leave', '2025-07-22', '2025-07-23', 'Not feeling well', 'Approved', 2, '2025-07-20 09:00:00', '2025-07-21 14:30:00'),
  (4, 'Annual Leave', '2025-07-20', '2025-07-24', 'Bereavement', 'Approved', 2, '2025-07-18 10:00:00', '2025-07-19 16:00:00'),
  (6, 'Sick Leave', '2025-07-18', '2025-07-20', 'Not feeling well', 'Approved', 2, '2025-07-17 08:00:00', '2025-07-18 09:00:00'),
  (3, 'Sick Leave', '2025-07-10', '2025-07-10', 'Medical appointment', 'Approved', 2, '2025-07-09 11:00:00', '2025-07-09 15:00:00'),
  (8, 'Sick Leave', '2024-12-02', '2024-12-02', 'Medical appointment', 'Approved', 2, '2024-12-01 09:00:00', '2024-12-01 14:00:00'),
  (2, 'Annual Leave', '2024-12-02', '2024-12-09', 'Vacation', 'Approved', 1, '2024-12-01 08:00:00', '2024-12-01 16:00:00'),
  (6, 'Sick Leave', '2024-11-25', '2024-11-27', 'Flu', 'Approved', 2, '2024-11-24 10:00:00', '2024-11-25 09:00:00'),
  
  -- Pending leave
  (7, 'Annual Leave', '2025-07-22', '2025-08-05', 'Family vacation', 'Pending', NULL, '2025-07-20 15:00:00', NULL),
  (3, 'Unpaid Leave', '2024-12-05', '2024-12-06', 'Personal matters', 'Pending', NULL, '2024-12-03 14:00:00', NULL),
  (10, 'Annual Leave', '2024-12-03', '2024-12-12', 'Vacation', 'Pending', NULL, '2024-12-01 11:00:00', NULL),
  (5, 'Family Responsibility Leave', '2024-12-01', '2024-12-05', 'Childcare', 'Pending', NULL, '2024-11-28 09:00:00', NULL),
  (1, 'Unpaid Leave', '2024-12-01', '2024-12-02', 'Family vacation', 'Pending', NULL, '2024-11-29 16:00:00', NULL),
  (4, 'Annual Leave', '2024-11-15', '2024-11-19', 'Personal trip', 'Pending', NULL, '2024-11-10 08:00:00', NULL),
  
  -- Denied leave
  (9, 'Annual Leave', '2025-07-19', '2025-07-21', 'Vacation', 'Denied', 2, '2025-07-15 09:00:00', '2025-07-18 10:00:00'),
  (2, 'Family Responsibility Leave', '2025-07-15', '2025-07-16', 'Family matters', 'Denied', 1, '2025-07-12 08:00:00', '2025-07-14 16:00:00'),
  (5, 'Annual Leave', '2024-11-20', '2024-11-22', 'Short vacation', 'Denied', 2, '2024-11-18 10:00:00', '2024-11-19 14:00:00'),
  (3, 'Annual Leave', '2024-10-10', '2024-10-12', 'Long weekend', 'Denied', 2, '2024-10-05 09:00:00', '2024-10-08 11:00:00');

-- =====================================================
-- PERFORMANCE REVIEWS
-- =====================================================
INSERT INTO performance_reviews (employee_id, reviewer_id, period, review_date, technical_skill, collaboration, communication, strengths, areas_to_grow) VALUES
  (1, 2, 'Q3 2025', '2025-07-15', 4.5, 4.0, 4.0, 'Strong technical skills, great problem solver, reliable team player', 'Could improve on documentation and mentoring junior developers'),
  (2, 1, 'Q3 2025', '2025-07-14', 3.5, 5.0, 5.0, 'Excellent leadership, great with people, handles conflict well', 'Could benefit from more technical understanding of HR systems'),
  (3, 2, 'Q2 2025', '2025-06-20', 4.0, 3.5, 3.5, 'Thorough testing approach, catches edge cases well', 'Could be more proactive in test planning and documentation'),
  (4, 2, 'Q2 2025', '2025-06-18', 3.0, 4.5, 4.0, 'Great client relationship skills, excellent sales numbers', 'Could improve product knowledge and follow-up processes'),
  (5, 2, 'Q2 2025', '2025-06-15', 3.5, 4.0, 4.5, 'Creative campaigns, excellent content creation', 'Could improve data analysis skills and ROI tracking'),
  (6, 2, 'Q2 2025', '2025-06-12', 4.5, 4.0, 3.5, 'Excellent design skills, user-centered approach', 'Could improve presentation skills and developer handoff documentation'),
  (7, 2, 'Q2 2025', '2025-06-10', 4.5, 4.0, 3.5, 'Strong infrastructure knowledge, good automation skills', 'Could improve documentation and knowledge sharing'),
  (8, 2, 'Q1 2025', '2025-03-20', 3.0, 4.0, 4.5, 'Great writer, understands brand voice well', 'Could be more strategic in content planning'),
  (9, 2, 'Q1 2025', '2025-03-15', 4.5, 3.5, 3.5, 'Excellent financial acumen, detail-oriented', 'Could improve stakeholder communication and reporting'),
  (10, 2, 'Q1 2025', '2025-03-10', 3.5, 4.5, 4.5, 'Great with customers, resolves issues effectively', 'Could improve product knowledge and escalation handling'),
  (11, 2, 'Q1 2025', '2025-03-05', 4.0, 4.0, 3.5, 'Great operational mindset, good team management', 'Could improve strategic thinking and delegation'),
  (12, 1, 'Q2 2025', '2025-06-25', 3.5, 3.5, 3.5, 'Good progress in first 6 months, shows potential', 'Needs to improve code quality and independent problem solving');