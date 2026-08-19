USE moderntech;

DELETE FROM payroll_runs;
DELETE FROM users WHERE employee_id IS NOT NULL;
DELETE FROM employees;
DELETE FROM departments;

ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE departments AUTO_INCREMENT = 1;
ALTER TABLE payroll_runs AUTO_INCREMENT = 1;

INSERT INTO departments (name) VALUES
  ('Development'),  -- 1
  ('HR'),           -- 2
  ('QA'),           -- 3
  ('Sales'),        -- 4
  ('Marketing'),    -- 5
  ('Design'),       -- 6
  ('IT'),           -- 7
  ('Finance'),      -- 8
  ('Support');      -- 9

INSERT INTO employees (name, position, department_id, salary, contact, employment_history, hire_date, status) VALUES
  ('Sibongile Nkosi', 'Software Engineer',       1, 70000.00, 'sibongile.nkosi@moderntech.com', 'Joined in 2015, promoted to Senior in 2018', '2015-01-01', 'active'),
  ('Lungile Moyo',    'HR Manager',              2, 80000.00, 'lungile.moyo@moderntech.com',    'Joined in 2013, promoted to Manager in 2017', '2013-01-01', 'active'),
  ('Thabo Molefe',    'Quality Analyst',         3, 55000.00, 'thabo.molefe@moderntech.com',    'Joined in 2018', '2018-01-01', 'active'),
  ('Keshav Naidoo',   'Sales Representative',    4, 60000.00, 'keshav.naidoo@moderntech.com',   'Joined in 2020', '2020-01-01', 'active'),
  ('Zanele Khumalo',  'Marketing Specialist',    5, 58000.00, 'zanele.khumalo@moderntech.com',  'Joined in 2019', '2019-01-01', 'active'),
  ('Sipho Zulu',      'UI/UX Designer',          6, 65000.00, 'sipho.zulu@moderntech.com',      'Joined in 2016', '2016-01-01', 'active'),
  ('Naledi Moeketsi', 'DevOps Engineer',         7, 72000.00, 'naledi.moeketsi@moderntech.com', 'Joined in 2017', '2017-01-01', 'active'),
  ('Farai Gumbo',     'Content Strategist',      5, 56000.00, 'farai.gumbo@moderntech.com',     'Joined in 2021', '2021-01-01', 'active'),
  ('Karabo Dlamini',  'Accountant',              8, 62000.00, 'karabo.dlamini@moderntech.com',  'Joined in 2018', '2018-01-01', 'active'),
  ('Fatima Patel',    'Customer Support Lead',   9, 58000.00, 'fatima.patel@moderntech.com',    'Joined in 2016', '2016-01-01', 'active');

INSERT INTO users (employee_id, email, password_hash, role) VALUES
  (NULL, 'admin@moderntech.com', '$2b$10$FOWX3kxm8iKX5/FHTK3qvOsG6R7RCTPCwKSkxERoqDRu0w.89K0hq', 'admin');

INSERT INTO payroll_runs (employee_id, pay_period_start, pay_period_end, hours_worked, gross_pay, leave_deductions, tax_deductions, net_pay, status) VALUES
  (1,  '2025-07-01', '2025-07-31', 160, 70000.00, 3500.00, 11970.00, 54530.00, 'processed'),
  (2,  '2025-07-01', '2025-07-31', 150, 75000.00, 5000.00, 12600.00, 57400.00, 'processed'),
  (3,  '2025-07-01', '2025-07-31', 170, 58437.50, 1375.00, 10271.25, 46791.25, 'processed'),
  (4,  '2025-07-01', '2025-07-31', 165, 61875.00, 2250.00, 10732.50, 48892.50, 'processed'),
  (5,  '2025-07-01', '2025-07-31', 158, 57275.00, 1812.50,  9983.25, 45479.25, 'processed'),
  (6,  '2025-07-01', '2025-07-31', 168, 68250.00,  812.50, 12138.75, 55298.75, 'processed'),
  (7,  '2025-07-01', '2025-07-31', 175, 78750.00, 1350.00, 13932.00, 63468.00, 'processed'),
  (8,  '2025-07-01', '2025-07-31', 160, 56000.00,    0.00, 10080.00, 45920.00, 'processed'),
  (9,  '2025-07-01', '2025-07-31', 155, 60062.50, 1937.50, 10462.50, 47662.50, 'processed'),
  (10, '2025-07-01', '2025-07-31', 162, 58725.00, 1450.00, 10309.50, 46965.50, 'processed');
