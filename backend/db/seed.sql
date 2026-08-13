-- seed.sql
-- Optional sample data so the app isn't empty during development.
-- Run after schema.sql: mysql -u root -p moderntech < db/seed.sql

USE moderntech;

INSERT INTO departments (name) VALUES
  ('Human Resources'), ('Engineering'), ('Sales'), ('Finance');

INSERT INTO employees (name, position, department_id, salary, contact, hire_date) VALUES
  ('Thandiwe Nkosi', 'HR Officer', 1, 28000.00, 'thandiwe@moderntech.com', '2023-02-01'),
  ('Sipho Dlamini', 'Software Engineer', 2, 45000.00, 'sipho@moderntech.com', '2022-11-15'),
  ('Aisha Patel', 'Sales Executive', 3, 32000.00, 'aisha@moderntech.com', '2024-01-10');

-- Password for this seed user is "admin123" — replace before real use.
-- Hash generated with bcrypt, 10 salt rounds (see scripts/hash-password.js).
INSERT INTO users (employee_id, email, password_hash, role) VALUES
  (NULL, 'admin@moderntech.com', '$2b$10$replace_this_with_a_real_bcrypt_hash', 'admin');
