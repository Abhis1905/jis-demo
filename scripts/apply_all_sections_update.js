require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function applyAllSections() {
  const data = JSON.parse(fs.readFileSync('data/enriched_all_sections_catalog.json', 'utf8'));
  console.log(`Loaded ${data.length} enriched sections from catalog.`);

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  console.log('Beginning transactional update of all 2,419 sections in legal_sections...');
  await conn.beginTransaction();

  let updated = 0;
  try {
    const updateSql = `
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
          commencement_date = ?,
          legal_objective = ?,
          scope_applicability = ?,
          persons_covered = ?,
          procedural_mechanism = ?,
          responsible_authority = ?,
          burden_of_proof = ?,
          related_provisions = ?,
          transitional_notes = ?,
          illustrative_example = ?,
          verification_status = ?,
          last_verified_at = ?
      WHERE id = ?
    `;

    for (const item of data) {
      const [res] = await conn.execute(updateSql, [
        item.section_title,
        item.formatted_section_text,
        item.legal_nature,
        item.status,
        item.source_name,
        item.source_url,
        item.plain_explanation,
        item.essential_ingredients,
        item.exceptions,
        item.punishment_or_consequence,
        item.amendment_status,
        item.commencement_date,
        item.legal_objective,
        item.scope_applicability,
        item.persons_covered,
        item.procedural_mechanism,
        item.responsible_authority,
        item.burden_of_proof,
        item.related_provisions,
        item.transitional_notes,
        item.illustrative_example,
        item.verification_status,
        item.last_verified_at,
        item.id
      ]);

      if (res.affectedRows > 0) updated++;
      if (updated % 500 === 0) {
        console.log(`Updated ${updated} / ${data.length} sections...`);
      }
    }

    if (updated !== data.length) {
      throw new Error(`Expected to update ${data.length} rows, but updated ${updated}. Rolling back.`);
    }

    await conn.commit();
    console.log(`Successfully committed all ${updated} sections in legal_sections!`);
  } catch (err) {
    await conn.rollback();
    console.error('Failed to update sections, rolled back:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

applyAllSections().catch(console.error);
