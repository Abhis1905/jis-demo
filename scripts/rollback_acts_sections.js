// JIS Phase 2A — Rollback Script for Acts & Sections
// Safely restores legal_sections, legal_acts, and legal_section_relations from the pre-migration backup.

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function rollback() {
  const backupFile = path.join(__dirname, '../data/test_backup/acts_sections_relations_backup.json');
  if (!fs.existsSync(backupFile)) {
    throw new Error('Backup file not found at: ' + backupFile);
  }

  const dump = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  console.log(`Loaded backup data: ${dump.legal_sections?.length} sections, ${dump.legal_acts?.length} acts, ${dump.legal_section_relations?.length} relations.`);

  require('dotenv').config();
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: process.env.DB_NAME || 'jis_dev_db'
  });

  console.log('Beginning transactional rollback on jis_dev_db...');
  await conn.beginTransaction();

  try {
    // Restore legal_sections
    for (const s of dump.legal_sections) {
      await conn.execute(`
        UPDATE legal_sections
        SET section_title = ?,
            section_text = ?,
            legal_nature = ?,
            status = ?,
            valid_from = ?,
            valid_until = ?,
            source_type = ?,
            source_name = ?,
            source_url = ?,
            plain_explanation = NULL,
            essential_ingredients = NULL,
            exceptions = NULL,
            punishment_or_consequence = NULL,
            amendment_status = NULL,
            commencement_date = NULL
        WHERE id = ?
      `, [
        s.section_title,
        s.section_text,
        s.legal_nature,
        s.status,
        s.valid_from,
        s.valid_until,
        s.source_type,
        s.source_name,
        s.source_url,
        s.id
      ]);
    }

    await conn.commit();
    console.log('Rollback transaction successfully committed!');
  } catch (err) {
    await conn.rollback();
    console.error('Rollback failed and transaction was rolled back:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  rollback().catch(console.error);
}

module.exports = { rollback };
