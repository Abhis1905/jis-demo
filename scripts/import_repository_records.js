/**
 * JIS Repository Records Ingestion Script
 * 
 * Ingests validated genuine records into `court_records_repository`
 * with compound matching against curated `legal_judgments`.
 * 
 * Usage:
 *   node scripts/import_repository_records.js [target_database_name]
 * 
 * Safety:
 *   Default target is `jis_test_db`.
 *   Will REJECT if target is `jis_db` unless explicitly confirmed.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const TARGET_DB = process.argv[2] || 'jis_test_db';
const MIGRATION_SQL_PATH = path.join(__dirname, '../sql/migration_staging_court_records.sql');
const DATA_FILE = path.join(__dirname, '../data/validation_audit/ready_records.json');
const MATCHES_FILE = path.join(__dirname, '../data/validation_audit/re_evaluated_curated_matches.json');

const BATCH_SIZE = 250;

function normalizeTitle(t) {
  return (t || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function runImport() {
  console.log('================================================================');
  console.log(`   JIS REPOSITORY IMPORT PIPELINE                                `);
  console.log(`   Target Database: ${TARGET_DB}                                `);
  console.log('================================================================\n');

  if (TARGET_DB === 'jis_db') {
    throw new Error('SAFETY BLOCK: Attempted import into production database `jis_db`! Per strict user instructions, production database must not be modified.');
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3307', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(),
    database: TARGET_DB,
    multipleStatements: true
  });

  console.log(`Connected to target database: ${TARGET_DB}`);

  // 1. Ensure Migration Schema Exists
  console.log('Applying updated migration schema (tables and views)...');
  await conn.execute('DROP VIEW IF EXISTS vw_unified_judicial_records');
  await conn.execute('DROP TABLE IF EXISTS court_records_repository');
  const migrationSql = fs.readFileSync(MIGRATION_SQL_PATH, 'utf8');
  await conn.query(migrationSql);
  console.log('Schema verified: `court_records_repository` and `vw_unified_judicial_records` ready.');
  console.log('Reset table `court_records_repository` for pristine import.');

  // 3. Load Curated Landmark Judgments for Compound Matching
  const [curatedRows] = await conn.execute(
    'SELECT id, case_name, citation, judgment_date FROM legal_judgments WHERE is_synthetic = 0 AND record_provenance = "REAL_VERIFIED"'
  );
  console.log(`Loaded ${curatedRows.length} curated landmark records for compound matching.`);

  // Load Verified Re-evaluated Matches
  const confirmedMatchesList = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf8'));
  const confirmedMatchMap = new Map();
  for (const m of confirmedMatchesList) {
    if (m.status === 'CONFIRMED_MATCH') {
      confirmedMatchMap.set(m.record_id, m.claimed_db_id);
    }
  }
  console.log(`Loaded ${confirmedMatchMap.size} pre-validated landmark match rules.`);

  // 4. Load Records to Ingest
  const records = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`Loaded ${records.length} validated records from ${path.basename(DATA_FILE)}.`);

  // 5. Ingestion in Batches
  let totalInserted = 0;
  let linkedCuratedCount = 0;

  console.log(`Beginning batch ingestion (${BATCH_SIZE} rows per batch)...`);

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const values = [];

    for (const rec of chunk) {
      // Compound Matching:
      // Priority 1: Check pre-validated confirmed matches map
      let matchedCuratedId = confirmedMatchMap.get(rec.record_id) || null;

      // Priority 2: Fallback compound match check against curated records
      if (!matchedCuratedId) {
        const recYear = rec.judgment_date ? new Date(rec.judgment_date).getFullYear() : null;
        const normRec = normalizeTitle(rec.case_name);

        const match = curatedRows.find(c => {
          const cYear = c.judgment_date ? new Date(c.judgment_date).getFullYear() : null;
          const normCur = normalizeTitle(c.case_name);
          const yearComp = recYear && cYear && Math.abs(recYear - cYear) <= 1;
          const titleExact = normRec === normCur;
          const citExact = rec.citation && c.citation && rec.citation.toLowerCase().trim() === c.citation.toLowerCase().trim();

          if (citExact && yearComp) return true;
          if (titleExact && yearComp) return true;
          return false;
        });

        // Do not match known collision cases
        if (match && rec.record_id !== 'JIS-REC-03124' && rec.record_id !== 'JIS-REC-03252') {
          matchedCuratedId = match.id;
        }
      }

      if (matchedCuratedId) {
        linkedCuratedCount++;
      }

      values.push([
        rec.record_id,
        rec.source_external_id,
        matchedCuratedId,
        rec.document_type || 'JUDGMENT',
        rec.court_tier,
        rec.court_name,
        rec.raw_court_code || null,
        rec.case_name,
        rec.case_number || null,
        rec.judgment_date || null,
        rec.citation || null,
        rec.neutral_citation || null,
        rec.domain || 'Evidence & Procedure',
        rec.precedential_value || null,
        rec.court_marking || null,
        rec.key_ratio,
        rec.has_order_pdf ? 1 : 0,
        rec.order_filename || null,
        rec.source_url || null,
        rec.source_order_url || null,
        rec.statutory_sections ? JSON.stringify(rec.statutory_sections) : null,
        `${rec.domain} ${rec.case_name}`.substring(0, 490),
        rec.is_landmark || 0,
        0,
        'REAL_VERIFIED'
      ]);
    }

    // Multi-row INSERT
    const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();

    const insertSql = `
      INSERT INTO court_records_repository (
        record_id, cnr, matched_curated_id, document_type,
        court_tier, court_name, raw_court_code, case_name, case_number,
        judgment_date, citation, neutral_citation, domain,
        precedential_value, court_marking, key_ratio,
        has_order_pdf, order_filename, source_url, source_order_url,
        statutory_sections, keywords, is_landmark, is_synthetic, record_provenance
      ) VALUES ${placeholders}
    `;

    await conn.execute(insertSql, flatValues);
    totalInserted += chunk.length;
    process.stdout.write(`Inserted ${totalInserted.toString().padStart(4, ' ')} / ${records.length} records...\r`);
  }

  console.log(`\n[Ingestion Successful] Inserted ${totalInserted} records into \`${TARGET_DB}.court_records_repository\`.`);
  console.log(`[Compound Match Links] ${linkedCuratedCount} records linked to curated landmark cases.`);

  // 6. Verification Queries
  const [repoTotalRows] = await conn.execute('SELECT COUNT(*) AS c FROM court_records_repository');
  const [viewTotalRows] = await conn.execute('SELECT COUNT(*) AS c FROM vw_unified_judicial_records');
  const [curatedTotalRows] = await conn.execute('SELECT COUNT(*) AS c FROM legal_judgments WHERE is_synthetic = 0 AND record_provenance = "REAL_VERIFIED"');

  const repoTotal = repoTotalRows[0].c;
  const viewTotal = viewTotalRows[0].c;
  const curatedTotal = curatedTotalRows[0].c;
  const uniqueRepoInView = totalInserted - linkedCuratedCount;
  const expectedViewTotal = curatedTotal + uniqueRepoInView;

  console.log('\n--- Ingestion Verification Audit ---');
  console.log(`- Staging Table Records: ${repoTotal}`);
  console.log(`- Curated Baseline Judgments: ${curatedTotal}`);
  console.log(`- Duplicates Suppressed in View: ${linkedCuratedCount}`);
  console.log(`- Expected Unified View Records: ${expectedViewTotal}`);
  console.log(`- Actual Unified View Records:   ${viewTotal}`);

  if (viewTotal === expectedViewTotal) {
    console.log('>>> VERIFICATION PASSED: View mathematically matches expected deduplicated total.');
  } else {
    console.warn(`>>> WARNING: Mismatch! Expected ${expectedViewTotal}, got ${viewTotal}`);
  }

  await conn.end();
  console.log(`\nPipeline for ${TARGET_DB} completed successfully.\n`);
  return { totalInserted, linkedCuratedCount, viewTotal };
}

runImport().catch(err => {
  console.error('[Import Failed]:', err);
  process.exit(1);
});
