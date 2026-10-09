require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function applyMappings() {
  const data = JSON.parse(fs.readFileSync('data/enriched_section_mappings.json', 'utf8'));
  console.log(`Loaded ${data.length} enriched section mappings.`);

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  console.log('Beginning transactional update of legal_section_relations in jis_dev_db...');
  await conn.beginTransaction();

  let updated = 0;
  try {
    for (const item of data) {
      const [res] = await conn.execute(`
        UPDATE legal_section_relations
        SET mapping_nature = ?,
            correspondence_cardinality = ?,
            what_changed = ?,
            what_remains_same = ?,
            substantive_impact = ?,
            procedural_safeguards = ?,
            punishment_comparison = ?,
            transitional_notes = ?,
            verification_status = ?,
            last_verified_at = ?
        WHERE id = ?
      `, [
        item.mapping_nature,
        item.correspondence_cardinality,
        item.what_changed,
        item.what_remains_same,
        item.substantive_impact,
        item.procedural_safeguards,
        item.punishment_comparison,
        item.transitional_notes,
        item.verification_status,
        item.last_verified_at,
        item.id
      ]);
      if (res.affectedRows > 0) updated++;
    }

    await conn.commit();
    console.log(`Successfully updated ${updated} / ${data.length} rows in legal_section_relations!`);
  } catch (err) {
    await conn.rollback();
    console.error('Failed to update mappings:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

applyMappings().catch(console.error);
