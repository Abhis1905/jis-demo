/**
 * JIS Database Isolation Safeguard
 * 
 * Verifies that the connected database strictly matches the expected target.
 * Rejects and terminates if the database name is unexpected or touches production.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function verifyDbTarget(expectedDb = 'jis_test_db') {
  const configuredDb = process.env.DB_NAME;

  console.log(`[JIS Safeguard] Target verification check...`);
  console.log(`[JIS Safeguard] Expected target: '${expectedDb}'`);
  console.log(`[JIS Safeguard] Configured target: '${configuredDb}'`);

  if (!configuredDb) {
    console.error(`[FATAL SAFEGUARD] DB_NAME environment variable is not defined.`);
    process.exit(1);
  }

  if (configuredDb === 'jis_db') {
    console.error(`[FATAL SAFEGUARD] OPERATION BLOCKED! Target is production 'jis_db'. Refusing execution.`);
    process.exit(1);
  }

  if (configuredDb !== expectedDb) {
    console.error(`[FATAL SAFEGUARD] OPERATION BLOCKED! Configured database '${configuredDb}' does not match expected target '${expectedDb}'.`);
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: configuredDb,
    waitForConnections: true,
    connectionLimit: 2,
    connectTimeout: 5000
  });

  try {
    const [rows] = await pool.query('SELECT DATABASE() AS current_db, USER() AS active_user, @@version AS mysql_version');
    const activeDb = rows[0].current_db;
    if (activeDb !== expectedDb) {
      console.error(`[FATAL SAFEGUARD] Live active database '${activeDb}' does not match expected '${expectedDb}'. Aborting.`);
      await pool.end();
      process.exit(1);
    }
    console.log(`[JIS Safeguard] Connected to verified database: '${activeDb}' as '${rows[0].active_user}' (MySQL ${rows[0].mysql_version})`);
    await pool.end();
    return true;
  } catch (err) {
    console.error(`[JIS Safeguard] Connection verification failed: ${err.message}`);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

if (require.main === module) {
  const target = process.argv[2] || process.env.EXPECTED_DB || 'jis_test_db';
  verifyDbTarget(target);
}

module.exports = { verifyDbTarget };
