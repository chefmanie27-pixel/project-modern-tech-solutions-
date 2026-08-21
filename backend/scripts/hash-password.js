// scripts/hash-password.js
// One-off helper: generates a bcrypt hash so you can seed a real admin login.
// Usage: node scripts/hash-password.js "admin123"

import bcrypt from "bcrypt";

const plainPassword = process.argv[2];

if (!plainPassword) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Bcrypt hash:");
  console.log(hash);
  console.log("\nPaste this into db/seed.sql in place of the placeholder.");
});
