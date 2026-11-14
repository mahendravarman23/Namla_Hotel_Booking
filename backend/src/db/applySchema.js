require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./pool');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Schema applied: table "hotels" is ready.');
}

main()
  .catch((err) => {
    console.error('Could not apply schema:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
