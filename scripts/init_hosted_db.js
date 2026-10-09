/**
 * JIS Hosted Database Initialization & Schema Provisioner
 * 
 * Safely initializes the 12 base tables and unified view in the target database.
 * Strictly enforces database isolation safeguards before executing DDL.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { verifyDbTarget } = require('./verify_db_target');

async function initHostedDatabase() {
  const targetDb = process.env.DB_NAME || 'jis_test_db';

  // 1. Enforce strict isolation safeguard
  console.log('------------------------------------------------------------');
  console.log('[JIS DB Init] Starting hosted database schema initialization...');
  console.log('------------------------------------------------------------');
  await verifyDbTarget(targetDb);

  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: targetDb,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 2,
    connectTimeout: 10000
  });

  try {
    const schemaSqlPath = path.join(__dirname, '../sql/schema_init_hosted_db.sql');
    if (!fs.existsSync(schemaSqlPath)) {
      throw new Error(`Schema file not found at ${schemaSqlPath}`);
    }

    const ddl = fs.readFileSync(schemaSqlPath, 'utf8');
    console.log(`[JIS DB Init] Executing schema DDL from sql/schema_init_hosted_db.sql...`);

    // Execute complete idempotent DDL
    await pool.query(ddl);
    console.log(`[JIS DB Init] Schema initialization DDL executed successfully.`);

    // 2. Verify all 12 tables and 1 view exist
    const expectedEntities = [
      'states_uts',
      'high_courts',
      'high_court_benches',
      'districts',
      'legal_acts',
      'legal_chapters',
      'legal_sections',
      'legal_judgments',
      'judgment_documents',
      'legal_section_relations',
      'judgment_legal_sections',
      'court_records_repository',
      'vw_unified_judicial_records'
    ];

    console.log(`[JIS DB Init] Verifying created tables and views in '${targetDb}'...`);
    const [rows] = await pool.query(
      `SELECT TABLE_NAME, TABLE_TYPE 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ?`,
      [targetDb]
    );

    const createdNames = rows.map(r => r.TABLE_NAME);
    const missing = expectedEntities.filter(e => !createdNames.includes(e));

    if (missing.length > 0) {
      throw new Error(`Schema verification incomplete. Missing entities: ${missing.join(', ')}`);
    }

    console.log(`[JIS DB Init] All 12 base tables and 1 unified view verified successfully!`);
    console.log('------------------------------------------------------------');
    await pool.end();
    return true;
  } catch (err) {
    console.error(`[JIS DB Init] Schema initialization failed: ${err.message}`);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

if (require.main === module) {
  initHostedDatabase();
}

module.exports = { initHostedDatabase };
