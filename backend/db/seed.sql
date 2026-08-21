SET SQL_SAFE_UPDATES = 0;
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
  (1, '2025-07-01', '2025-07-31', 144, 63000.00, 0.00, 11340.00, 51660.00, 'processed'),
  (2, '2025-07-01', '2025-07-31', 144, 72000.00, 0.00, 12960.00, 59040.00, 'processed'),
  (3, '2025-07-01', '2025-07-31', 168, 57750.00, 0.00, 10395.00, 47355.00, 'processed'),
  (4, '2025-07-01', '2025-07-31', 152, 57000.00, 0.00, 10260.00, 46740.00, 'processed'),
  (5, '2025-07-01', '2025-07-31', 168, 60900.00, 3138.37, 10397.09, 47364.54, 'processed'),
  (6, '2025-07-01', '2025-07-31', 172, 69875.00, 0.00, 12577.50, 57297.50, 'processed'),
  (7, '2025-07-01', '2025-07-31', 156, 70200.00, 0.00, 12636.00, 57564.00, 'processed'),
  (8, '2025-07-01', '2025-07-31', 156, 54600.00, 0.00, 9828.00, 44772.00, 'processed'),
  (9, '2025-07-01', '2025-07-31', 160, 62000.00, 0.00, 11160.00, 50840.00, 'processed'),
  (10, '2025-07-01', '2025-07-31', 160, 58000.00, 0.00, 10440.00, 47560.00, 'processed'),
  -- June 2025 (for payroll trend)
  (1, '2025-06-01', '2025-06-30', 144, 63000.00, 0.00, 11340.00, 51660.00, 'paid'),
  (2, '2025-06-01', '2025-06-30', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3, '2025-06-01', '2025-06-30', 168, 57750.00, 0.00, 10395.00, 47355.00, 'paid'),
  (4, '2025-06-01', '2025-06-30', 152, 57000.00, 0.00, 10260.00, 46740.00, 'paid'),
  (5, '2025-06-01', '2025-06-30', 152, 55100.00, 0.00, 9918.00, 45182.00, 'paid'),
  (6, '2025-06-01', '2025-06-30', 168, 68250.00, 0.00, 12285.00, 55965.00, 'paid'),
  (7, '2025-06-01', '2025-06-30', 172, 77400.00, 597.38, 13824.47, 62978.15, 'paid'),
  (8, '2025-06-01', '2025-06-30', 160, 56000.00, 0.00, 10080.00, 45920.00, 'paid'),
  (9, '2025-06-01', '2025-06-30', 160, 62000.00, 1704.36, 10853.22, 49442.42, 'paid'),
  (10, '2025-06-01', '2025-06-30', 172, 62350.00, 0.00, 11223.00, 51127.00, 'paid'),
  -- May 2025
  (1, '2025-05-01', '2025-05-31', 160, 70000.00, 0.00, 12600.00, 57400.00, 'paid'),
  (2, '2025-05-01', '2025-05-31', 164, 82000.00, 0.00, 14760.00, 67240.00, 'paid'),
  (3, '2025-05-01', '2025-05-31', 168, 57750.00, 0.00, 10395.00, 47355.00, 'paid'),
  (4, '2025-05-01', '2025-05-31', 136, 51000.00, 0.00, 9180.00, 41820.00, 'paid'),
  (5, '2025-05-01', '2025-05-31', 144, 52200.00, 0.00, 9396.00, 42804.00, 'paid'),
  (6, '2025-05-01', '2025-05-31', 168, 68250.00, 0.00, 12285.00, 55965.00, 'paid'),
  (7, '2025-05-01', '2025-05-31', 160, 72000.00, 2673.83, 12478.71, 56847.46, 'paid'),
  (8, '2025-05-01', '2025-05-31', 164, 57400.00, 4110.46, 9592.12, 43697.42, 'paid'),
  (9, '2025-05-01', '2025-05-31', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-05-01', '2025-05-31', 152, 55100.00, 0.00, 9918.00, 45182.00, 'paid'),
  -- April 2025
  (1, '2025-04-01', '2025-04-30', 160, 70000.00, 2996.16, 12060.69, 54943.15, 'paid'),
  (2, '2025-04-01', '2025-04-30', 164, 82000.00, 1198.15, 14544.33, 66257.52, 'paid'),
  (3, '2025-04-01', '2025-04-30', 168, 57750.00, 0.00, 10395.00, 47355.00, 'paid'),
  (4, '2025-04-01', '2025-04-30', 172, 64500.00, 0.00, 11610.00, 52890.00, 'paid'),
  (5, '2025-04-01', '2025-04-30', 172, 62350.00, 0.00, 11223.00, 51127.00, 'paid'),
  (6, '2025-04-01', '2025-04-30', 156, 63375.00, 0.00, 11407.50, 51967.50, 'paid'),
  (7, '2025-04-01', '2025-04-30', 152, 68400.00, 0.00, 12312.00, 56088.00, 'paid'),
  (8, '2025-04-01', '2025-04-30', 144, 50400.00, 0.00, 9072.00, 41328.00, 'paid'),
  (9, '2025-04-01', '2025-04-30', 144, 55800.00, 1299.91, 9810.02, 44690.07, 'paid'),
  (10, '2025-04-01', '2025-04-30', 160, 58000.00, 0.00, 10440.00, 47560.00, 'paid'),
  -- March 2025
  (1, '2025-03-01', '2025-03-31', 160, 70000.00, 3678.42, 11937.88, 54383.70, 'paid'),
  (2, '2025-03-01', '2025-03-31', 160, 80000.00, 2276.35, 13990.26, 63733.39, 'paid'),
  (3, '2025-03-01', '2025-03-31', 160, 55000.00, 0.00, 9900.00, 45100.00, 'paid'),
  (4, '2025-03-01', '2025-03-31', 144, 54000.00, 0.00, 9720.00, 44280.00, 'paid'),
  (5, '2025-03-01', '2025-03-31', 152, 55100.00, 0.00, 9918.00, 45182.00, 'paid'),
  (6, '2025-03-01', '2025-03-31', 156, 63375.00, 2397.28, 10975.99, 50001.73, 'paid'),
  (7, '2025-03-01', '2025-03-31', 168, 75600.00, 2121.41, 13226.15, 60252.44, 'paid'),
  (8, '2025-03-01', '2025-03-31', 136, 47600.00, 660.50, 8449.11, 38490.39, 'paid'),
  (9, '2025-03-01', '2025-03-31', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-03-01', '2025-03-31', 144, 52200.00, 5214.55, 8457.38, 38528.07, 'paid'),
  -- February 2025
  (1, '2025-02-01', '2025-02-28', 160, 70000.00, 2399.64, 12168.06, 55432.30, 'paid'),
  (2, '2025-02-01', '2025-02-28', 160, 80000.00, 0.00, 14400.00, 65600.00, 'paid'),
  (3, '2025-02-01', '2025-02-28', 172, 59125.00, 717.25, 10513.40, 47894.35, 'paid'),
  (4, '2025-02-01', '2025-02-28', 164, 61500.00, 0.00, 11070.00, 50430.00, 'paid'),
  (5, '2025-02-01', '2025-02-28', 160, 58000.00, 1965.89, 10086.14, 45947.97, 'paid'),
  (6, '2025-02-01', '2025-02-28', 172, 69875.00, 0.00, 12577.50, 57297.50, 'paid'),
  (7, '2025-02-01', '2025-02-28', 160, 72000.00, 0.00, 12960.00, 59040.00, 'paid'),
  (8, '2025-02-01', '2025-02-28', 144, 50400.00, 1639.49, 8776.89, 39983.62, 'paid'),
  (9, '2025-02-01', '2025-02-28', 160, 62000.00, 0.00, 11160.00, 50840.00, 'paid'),
  (10, '2025-02-01', '2025-02-28', 156, 56550.00, 0.00, 10179.00, 46371.00, 'paid'),
  -- January 2025
  (1, '2025-01-01', '2025-01-31', 144, 63000.00, 1875.15, 11002.47, 50122.38, 'paid'),
  (2, '2025-01-01', '2025-01-31', 156, 78000.00, 1012.48, 13857.75, 63129.77, 'paid'),
  (3, '2025-01-01', '2025-01-31', 168, 57750.00, 2609.61, 9925.27, 45215.12, 'paid'),
  (4, '2025-01-01', '2025-01-31', 136, 51000.00, 1663.30, 8880.61, 40456.09, 'paid'),
  (5, '2025-01-01', '2025-01-31', 172, 62350.00, 1494.19, 10954.05, 49901.76, 'paid'),
  (6, '2025-01-01', '2025-01-31', 168, 68250.00, 0.00, 12285.00, 55965.00, 'paid'),
  (7, '2025-01-01', '2025-01-31', 164, 73800.00, 0.00, 13284.00, 60516.00, 'paid'),
  (8, '2025-01-01', '2025-01-31', 136, 47600.00, 0.00, 8568.00, 39032.00, 'paid'),
  (9, '2025-01-01', '2025-01-31', 152, 58900.00, 0.00, 10602.00, 48298.00, 'paid'),
  (10, '2025-01-01', '2025-01-31', 160, 58000.00, 1576.57, 10156.22, 46267.21, 'paid');

-- =====================================================
-- ATTENDANCE RECORDS (Last 10 working days - July 2025)
-- =====================================================
INSERT INTO attendance_records (employee_id, record_date, status, clock_in, clock_out) VALUES
  -- Aug 10-21, 2026 (10 working days)
  -- Employee 1: Sibongile Nkosi
  (1, '2026-08-10', 'Present', '08:00', '17:00'),
  (1, '2026-08-11', 'Present', '08:15', '17:00'),
  (1, '2026-08-12', 'Present', '08:00', '17:00'),
  (1, '2026-08-13', 'Late', '08:45', '17:00'),
  (1, '2026-08-14', 'Absent', NULL, NULL),
  (1, '2026-08-17', 'Present', '08:00', '17:00'),
  (1, '2026-08-18', 'Present', '08:00', '17:00'),
  (1, '2026-08-19', 'Present', '08:00', '17:00'),
  (1, '2026-08-20', 'Present', '08:00', '17:00'),
  (1, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 2: Lungile Moyo
  (2, '2026-08-10', 'Present', '08:00', '17:00'),
  (2, '2026-08-11', 'Present', '08:00', '17:00'),
  (2, '2026-08-12', 'Present', '08:00', '17:00'),
  (2, '2026-08-13', 'Present', '08:00', '17:00'),
  (2, '2026-08-14', 'Present', '08:00', '17:00'),
  (2, '2026-08-17', 'Present', '08:00', '17:00'),
  (2, '2026-08-18', 'Present', '08:00', '17:00'),
  (2, '2026-08-19', 'Present', '08:00', '17:00'),
  (2, '2026-08-20', 'Present', '08:00', '17:00'),
  (2, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 3: Thabo Molefe
  (3, '2026-08-10', 'Present', '08:00', '17:00'),
  (3, '2026-08-11', 'Present', '08:00', '17:00'),
  (3, '2026-08-12', 'Present', '08:00', '17:00'),
  (3, '2026-08-13', 'Present', '08:00', '17:00'),
  (3, '2026-08-14', 'Present', '08:00', '17:00'),
  (3, '2026-08-17', 'Absent', NULL, NULL),
  (3, '2026-08-18', 'Absent', NULL, NULL),
  (3, '2026-08-19', 'Present', '08:00', '17:00'),
  (3, '2026-08-20', 'Present', '08:00', '17:00'),
  (3, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 4: Keshav Naidoo
  (4, '2026-08-10', 'Present', '08:00', '17:00'),
  (4, '2026-08-11', 'Present', '08:00', '17:00'),
  (4, '2026-08-12', 'Present', '08:00', '17:00'),
  (4, '2026-08-13', 'Present', '08:00', '17:00'),
  (4, '2026-08-14', 'Present', '08:00', '17:00'),
  (4, '2026-08-17', 'Present', '08:00', '17:00'),
  (4, '2026-08-18', 'Present', '08:00', '17:00'),
  (4, '2026-08-19', 'Present', '08:00', '17:00'),
  (4, '2026-08-20', 'Present', '08:00', '17:00'),
  (4, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 5: Zanele Khumalo
  (5, '2026-08-10', 'Present', '08:00', '17:00'),
  (5, '2026-08-11', 'Present', '08:00', '17:00'),
  (5, '2026-08-12', 'Present', '08:00', '17:00'),
  (5, '2026-08-13', 'Present', '08:00', '17:00'),
  (5, '2026-08-14', 'Present', '08:00', '17:00'),
  (5, '2026-08-17', 'Present', '08:00', '17:00'),
  (5, '2026-08-18', 'Present', '08:00', '17:00'),
  (5, '2026-08-19', 'Present', '08:00', '17:00'),
  (5, '2026-08-20', 'Present', '08:00', '17:00'),
  (5, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 6: Sipho Zulu
  (6, '2026-08-10', 'Present', '08:00', '17:00'),
  (6, '2026-08-11', 'Present', '08:00', '17:00'),
  (6, '2026-08-12', 'Present', '08:00', '17:00'),
  (6, '2026-08-13', 'Present', '08:00', '17:00'),
  (6, '2026-08-14', 'Present', '08:00', '17:00'),
  (6, '2026-08-17', 'Present', '08:00', '17:00'),
  (6, '2026-08-18', 'Present', '08:00', '17:00'),
  (6, '2026-08-19', 'Present', '08:00', '17:00'),
  (6, '2026-08-20', 'Present', '08:00', '17:00'),
  (6, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 7: Naledi Moeketsi
  (7, '2026-08-10', 'Present', '08:00', '17:00'),
  (7, '2026-08-11', 'Present', '08:00', '17:00'),
  (7, '2026-08-12', 'Present', '08:00', '17:00'),
  (7, '2026-08-13', 'Present', '08:00', '17:00'),
  (7, '2026-08-14', 'Present', '08:00', '17:00'),
  (7, '2026-08-17', 'Present', '08:00', '17:00'),
  (7, '2026-08-18', 'Late', '09:00', '17:00'),
  (7, '2026-08-19', 'Present', '08:00', '17:00'),
  (7, '2026-08-20', 'Present', '08:00', '17:00'),
  (7, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 8: Farai Gumbo
  (8, '2026-08-10', 'Present', '08:00', '17:00'),
  (8, '2026-08-11', 'Present', '08:00', '17:00'),
  (8, '2026-08-12', 'Present', '08:00', '17:00'),
  (8, '2026-08-13', 'Present', '08:00', '17:00'),
  (8, '2026-08-14', 'Present', '08:00', '17:00'),
  (8, '2026-08-17', 'Present', '08:00', '17:00'),
  (8, '2026-08-18', 'Present', '08:00', '17:00'),
  (8, '2026-08-19', 'Present', '08:00', '17:00'),
  (8, '2026-08-20', 'Present', '08:00', '17:00'),
  (8, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 9: Karabo Dlamini
  (9, '2026-08-10', 'Present', '08:00', '17:00'),
  (9, '2026-08-11', 'Present', '08:00', '17:00'),
  (9, '2026-08-12', 'Present', '08:00', '17:00'),
  (9, '2026-08-13', 'Present', '08:00', '17:00'),
  (9, '2026-08-14', 'Present', '08:00', '17:00'),
  (9, '2026-08-17', 'Present', '08:00', '17:00'),
  (9, '2026-08-18', 'Present', '08:00', '17:00'),
  (9, '2026-08-19', 'Present', '08:00', '17:00'),
  (9, '2026-08-20', 'Present', '08:00', '17:00'),
  (9, '2026-08-21', 'Present', '08:00', '17:00'),
  
  -- Employee 10: Fatima Patel
  (10, '2026-08-10', 'Present', '08:00', '17:00'),
  (10, '2026-08-11', 'Present', '08:00', '17:00'),
  (10, '2026-08-12', 'Present', '08:00', '17:00'),
  (10, '2026-08-13', 'Present', '08:00', '17:00'),
  (10, '2026-08-14', 'Present', '08:00', '17:00'),
  (10, '2026-08-17', 'Present', '08:00', '17:00'),
  (10, '2026-08-18', 'Present', '08:00', '17:00'),
  (10, '2026-08-19', 'Present', '08:00', '17:00'),
  (10, '2026-08-20', 'Present', '08:00', '17:00'),
  (10, '2026-08-21', 'Present', '08:00', '17:00');

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