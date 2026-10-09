require('dotenv').config();
const mysql = require('mysql2/promise');

async function inspectJLS() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: 'jis_dev_db'
  });

  const [totalRows] = await conn.execute('SELECT COUNT(*) as cnt FROM judgment_legal_sections');
  console.log('Total judgment_legal_sections links:', totalRows[0].cnt);

  const [realLinks] = await conn.execute(`
    SELECT jls.id, jls.judgment_id, jls.section_id, jls.relevance_nature, jls.legal_principle,
           j.case_name, j.citation, j.court_name, j.judgment_date,
           s.act_id, s.section_number, s.section_title
    FROM judgment_legal_sections jls
    JOIN legal_judgments j ON jls.judgment_id = j.id
    JOIN legal_sections s ON jls.section_id = s.id
    WHERE j.is_synthetic = 0
    ORDER BY jls.id ASC
  `);

  console.log(`Links to real judgments (is_synthetic=0): ${realLinks.length}`);
  console.log('First 5 real links:');
  for (const r of realLinks.slice(0, 5)) {
    console.log(`ID ${r.id}: Case "${r.case_name}" -> Sec ${r.section_number} (${r.section_title}) [Rel: ${r.relevance_nature}, Principle: ${r.legal_principle}]`);
  }

  await conn.end();
}

inspectJLS().catch(console.error);
