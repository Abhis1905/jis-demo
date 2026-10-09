require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function applyJudgmentLinks() {
  const data = JSON.parse(fs.readFileSync('data/enriched_judgment_links.json', 'utf8'));
  console.log(`Loaded ${data.length} enriched judgment links.`);

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  console.log('Beginning transactional update of judgment_legal_sections in jis_dev_db...');
  await conn.beginTransaction();

  let updated = 0;
  try {
    for (const item of data) {
      const [res] = await conn.execute(`
        UPDATE judgment_legal_sections
        SET legal_principle = ?,
            ratio_summary = ?,
            authority_type = ?,
            verification_status = ?,
            source_reference = ?,
            last_verified_at = ?
        WHERE id = ?
      `, [
        item.legal_principle,
        item.ratio_summary,
        item.authority_type,
        item.verification_status,
        item.source_reference,
        item.last_verified_at,
        item.id
      ]);
      if (res.affectedRows > 0) updated++;
    }

    await conn.commit();
    console.log(`Successfully updated ${updated} / ${data.length} rows in judgment_legal_sections!`);
  } catch (err) {
    await conn.rollback();
    console.error('Failed to update judgment links:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

applyJudgmentLinks().catch(console.error);
