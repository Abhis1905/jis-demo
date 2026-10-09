require('dotenv').config();
const mysql = require('mysql2/promise');

async function inspect() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  const [relations] = await conn.execute(`
    SELECT r.id, r.from_section_id, sf.act_id as from_act_id, sf.section_number as from_sec, sf.section_title as from_title,
           r.to_section_id, st.act_id as to_act_id, st.section_number as to_sec, st.section_title as to_title,
           r.relation_type, r.notes, r.mapping_nature
    FROM legal_section_relations r
    JOIN legal_sections sf ON r.from_section_id = sf.id
    JOIN legal_sections st ON r.to_section_id = st.id
    ORDER BY r.id ASC
  `);

  console.log('Total mappings in legal_section_relations:', relations.length);
  const actPairs = {};
  for (const r of relations) {
    const pair = `${r.from_act_id} -> ${r.to_act_id}`;
    actPairs[pair] = (actPairs[pair] || 0) + 1;
  }
  console.log('Act pairs:', actPairs);
  console.log('Sample mapping 1:', relations[0]);
  console.log('Sample mapping 50:', relations[49]);
  console.log('Sample mapping 149:', relations[relations.length - 1]);

  const [sectionsVerification] = await conn.execute(`
    SELECT act_id, verification_status, COUNT(*) as count
    FROM legal_sections
    GROUP BY act_id, verification_status
    ORDER BY act_id, verification_status
  `);
  console.log('Sections verification status breakdown:');
  console.table(sectionsVerification);

  const [judgmentLinks] = await conn.execute(`
    SELECT COUNT(*) as total_links,
           SUM(CASE WHEN j.source_provider = 'INDIAN_KANOON' OR j.source_provider = 'ECOURTS_OFFICIAL' OR j.source_provider = 'MANUPATRA_BENCHMARK' OR j.source_provider = 'SCC_BENCHMARK' THEN 1 ELSE 0 END) as real_links,
           SUM(CASE WHEN j.is_synthetic = 0 THEN 1 ELSE 0 END) as non_synthetic_links
    FROM judgment_legal_sections jls
    JOIN legal_judgments j ON jls.judgment_id = j.id
  `);
  console.log('Judgment legal sections overview:', judgmentLinks[0]);

  await conn.end();
}

inspect().catch(console.error);
