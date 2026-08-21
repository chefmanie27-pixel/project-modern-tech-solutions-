// config/db.js
import mysql from "mysql2/promise";
import env from "./env.js";

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ MySQL database connection failed:", error.message);
    return false;
  }
}

// Helper function for queries (MySQL version)
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export { pool, testDatabaseConnection, query };
