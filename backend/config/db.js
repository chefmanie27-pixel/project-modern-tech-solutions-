// config/db.js
// Single shared connection pool — imported by every model.
// Never open per-request connections (see plan §Azhar step 3).

import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3000,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client', err);
  process.exit(1);
});

export default pool;