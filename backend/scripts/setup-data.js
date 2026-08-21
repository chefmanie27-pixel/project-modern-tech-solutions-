// scripts/setup-data.js
// Run this to properly link users with employees and setup test data

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function setupData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moderntech',
    multipleStatements: true
  });

  try {
    console.log('📦 Setting up data...');

    // Reset and recreate tables
    const schema = `
      -- Clean existing data
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

      -- Insert departments
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

      -- Insert employees
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

      -- Insert users (password: Password123!)
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
    `;

    await connection.query(schema);
    console.log('✅ Data setup complete!');
    console.log('📧 Test credentials:');
    console.log('  Admin: admin@moderntech.com / Password123!');
    console.log('  HR: lungile.moyo@moderntech.com / Password123!');
    console.log('  Employee: sibongile.nkosi@moderntech.com / Password123!');

  } catch (error) {
    console.error('❌ Error setting up data:', error);
  } finally {
    await connection.end();
  }
}

setupData();
