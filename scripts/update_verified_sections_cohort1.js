require('dotenv').config();
// JIS Phase 2A — Update Verified Sections Cohort 1
// Transactional, repeatable, and reversible import script for verified statutory sections.

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function updateCohort1() {
  const dataFile = path.join(__dirname, '../data/verified_sections_cohort1.json');
  if (!fs.existsSync(dataFile)) {
    throw new Error('Data file not found at: ' + dataFile);
  }

  const records = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  console.log(`Loaded ${records.length} verified statutory records for Cohort 1.`);

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  console.log('Beginning transactional update of Cohort 1 in jis_dev_db...');
  await conn.beginTransaction();

  let updatedCount = 0;
  try {
    for (const r of records) {
      const [res] = await conn.execute(`
        UPDATE legal_sections
        SET section_title = ?,
            section_text = ?,
            legal_nature = ?,
            status = ?,
            source_name = ?,
            source_url = ?,
            plain_explanation = ?,
            essential_ingredients = ?,
            exceptions = ?,
            punishment_or_consequence = ?,
            amendment_status = ?,
            commencement_date = ?
        WHERE id = ?
      `, [
        r.section_title,
        r.formatted_section_text,
        r.legal_nature,
        r.status,
        r.source_name,
        r.source_url,
        r.plain_explanation,
        r.essential_ingredients,
        r.exceptions || null,
        r.punishment_or_consequence || null,
        r.amendment_status || null,
        r.commencement_date || null,
        r.id
      ]);

      if (res.affectedRows > 0) {
        updatedCount++;
      } else {
        console.warn(`Warning: Section id ${r.id} (${r.section_number}) was not updated (affectedRows=0)`);
      }
    }

    if (updatedCount !== records.length) {
      throw new Error(`Expected to update ${records.length} rows, but updated ${updatedCount}. Rolling back.`);
    }

    await conn.commit();
    console.log(`Successfully committed transactional update of ${updatedCount} verified sections in jis_dev_db!`);
  } catch (err) {
    await conn.rollback();
    console.error('Update failed. Transaction has been rolled back:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  updateCohort1().catch(console.error);
}

module.exports = { updateCohort1 };
