require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function exportMappings() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  const [rows] = await conn.execute(`
    SELECT r.id,
           r.from_section_id, sf.act_id as from_act_id, fa.short_title as from_act, sf.section_number as from_sec, sf.section_title as from_title,
           r.to_section_id, st.act_id as to_act_id, ta.short_title as to_act, st.section_number as to_sec, st.section_title as to_title,
           r.relation_type, r.notes, r.source_name, r.source_url
    FROM legal_section_relations r
    JOIN legal_sections sf ON r.from_section_id = sf.id
    JOIN legal_acts fa ON sf.act_id = fa.id
    JOIN legal_sections st ON r.to_section_id = st.id
    JOIN legal_acts ta ON st.act_id = ta.id
    ORDER BY r.id ASC
  `);

  fs.writeFileSync('data/section_mappings_audit.json', JSON.stringify(rows, null, 2));
  console.log(`Exported ${rows.length} mappings to data/section_mappings_audit.json`);

  await conn.end();
}

exportMappings().catch(console.error);
