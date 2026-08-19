<<<<<<< HEAD
// config/db.js
// Single shared MySQL connection pool.
// Every model imports this — never open a new connection per request.

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
=======
const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
>>>>>>> origin/backend/wendy
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

<<<<<<< HEAD
// Quick sanity check you can call once on server startup
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL connected");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
=======
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully");
    connection.release();
  } catch (error) {
    console.error("MySQL database connection failed:", error.message);
  }
}

module.exports = {
  pool,
  testDatabaseConnection,
};
>>>>>>> origin/backend/wendy
