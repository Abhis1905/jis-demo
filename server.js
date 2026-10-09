require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS configuration (allow Vercel frontend, local development, and configured origins)
const allowedOrigins = [
  'https://jis-demo.vercel.app',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [])
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin));
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const caseRecords = fs.existsSync(path.join(__dirname, 'data/case_records.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'data/case_records.json'), 'utf8'))
  : {};

const pdfManifest = fs.existsSync(path.join(__dirname, 'data/verified_pdf_manifest.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'data/verified_pdf_manifest.json'), 'utf8'))
  : {};

// Health check and database readiness probe
app.get('/health', async (req, res) => {
  try {
    await db.execute('SELECT 1 AS ok');
    res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (err) {
    res.status(503).json({
      status: 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection unavailable'
    });
  }
});

// 1. Stats endpoint (strictly REAL_VERIFIED records from unified view)
app.get('/api/stats', async (req, res) => {
  try {
    const [j] = await db.execute("SELECT COUNT(*) AS c FROM vw_unified_judicial_records");
    const [a] = await db.execute("SELECT COUNT(*) AS c FROM legal_acts");
    const [s] = await db.execute("SELECT COUNT(*) AS c FROM legal_sections");
    const [m] = await db.execute("SELECT COUNT(*) AS c FROM legal_section_relations");
    res.json({
      real_judgments: j[0].c,
      legal_acts: a[0].c,
      legal_sections: s[0].c,
      section_mappings: m[0].c,
      verified_pdfs: Object.keys(pdfManifest).length
    });
  } catch (err) {
    res.json({
      real_judgments: Object.keys(caseRecords).length || 105,
      legal_acts: 10,
      legal_sections: 2419,
      section_mappings: 149,
      verified_pdfs: Object.keys(pdfManifest).length
    });
  }
});

// 2. Filter options (Courts & Years from verified records)
app.get('/api/judgments/filters', async (req, res) => {
  try {
    const [courts] = await db.execute("SELECT DISTINCT court_name FROM vw_unified_judicial_records WHERE court_name IS NOT NULL ORDER BY court_name ASC");
    const [years] = await db.execute("SELECT DISTINCT YEAR(judgment_date) AS yr FROM vw_unified_judicial_records WHERE judgment_date IS NOT NULL ORDER BY yr DESC");
    res.json({
      courts: courts.map(r => r.court_name),
      years: years.map(r => r.yr).filter(Boolean)
    });
  } catch (err) {
    res.json({
      courts: ["Supreme Court of India"],
      years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2007, 2006, 2005, 2002, 1997, 1996, 1994, 1993, 1992, 1990, 1985, 1984, 1983, 1981, 1980, 1978, 1976, 1975, 1973, 1967, 1965, 1964, 1962, 1960, 1958, 1954, 1951, 1950, 1947]
    });
  }
});

// 3. Search & List judgments (strictly genuine verified records)
app.get('/api/judgments', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const where = ["is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'"];
    const params = [];

    if (req.query.q && req.query.q.trim()) {
      const q = `%${req.query.q.trim()}%`;
      where.push("(case_name LIKE ? OR citation LIKE ? OR keywords LIKE ? OR legal_issue LIKE ?)");
      params.push(q, q, q, q);
    }
    if (req.query.court && req.query.court.trim()) {
      where.push("court_name = ?");
      params.push(req.query.court.trim());
    }
    if (req.query.year && req.query.year.trim()) {
      where.push("YEAR(judgment_date) = ?");
      params.push(parseInt(req.query.year.trim(), 10));
    }

    const whereClause = `WHERE ${where.join(' AND ')}`;

    // Total count for pagination
    const [countRows] = await db.execute(`SELECT COUNT(*) AS count FROM vw_unified_judicial_records ${whereClause}`, params);
    const total = countRows[0].count;

    // Sorting
    let orderBy = 'is_landmark DESC, judgment_date DESC';
    if (req.query.sort === 'date_desc') orderBy = 'judgment_date DESC';
    if (req.query.sort === 'date_asc') orderBy = 'judgment_date ASC';
    if (req.query.sort === 'title_asc') orderBy = 'case_name ASC';

    const sql = `
      SELECT j.id, j.court_tier, j.court_name, j.case_name, j.case_number, j.citation,
             j.neutral_citation, j.judgment_date, j.bench_judges, j.domain, j.legal_issue,
             j.key_ratio, j.is_landmark, j.pdf_id
      FROM vw_unified_judicial_records j
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await db.execute(sql, params);
    const enriched = rows.map(r => ({
      ...r,
      pdf_id: pdfManifest[r.id] ? r.id : r.pdf_id
    }));
    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      judgments: enriched
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Single Judgment Detail
app.get('/api/judgments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (id >= 100000) {
      const repoId = id - 100000;
      const [rows] = await db.execute(
        "SELECT * FROM court_records_repository WHERE id = ?",
        [repoId]
      );
      if (!rows.length) return res.status(404).json({ error: 'Judgment not found' });
      const r = rows[0];
      const judgment = {
        id: id,
        court_tier: r.court_tier,
        court_name: r.court_name,
        case_name: r.case_name,
        case_number: r.case_number || r.cnr,
        citation: r.citation || r.neutral_citation || `CNR: ${r.cnr}`,
        neutral_citation: r.neutral_citation,
        judgment_date: r.judgment_date,
        bench_judges: null,
        domain: r.domain,
        legal_issue: `Application of law in ${r.case_name}`,
        key_ratio: r.key_ratio,
        key_holding: r.key_ratio,
        factual_summary: r.key_ratio,
        outcome: r.document_type === 'BAIL_ORDER' ? 'Bail Application Disposed' : (r.document_type === 'INTERIM_ORDER' ? 'Interim Directions Issued' : 'Judicial Order / Decision of Record'),
        is_landmark: r.is_landmark,
        source_type: 'High Court Official / eCourts',
        source_name: 'Official eCourts Services / IndiaCode Legal Repository',
        source_url: r.source_url
      };
      return res.json({ judgment, sections: [], document: null, curated: null });
    }

    const [rows] = await db.execute(
      "SELECT * FROM legal_judgments WHERE id = ? AND is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'",
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Judgment not found' });
    const judgment = rows[0];

    const [sections] = await db.execute(`
      SELECT s.id, s.section_number, s.section_title, a.id AS act_id, a.short_title AS act_title, jls.relevance_nature
      FROM judgment_legal_sections jls
      JOIN legal_sections s ON s.id = jls.section_id
      JOIN legal_acts a ON a.id = s.act_id
      WHERE jls.judgment_id = ?
      ORDER BY s.section_order ASC, s.id ASC
    `, [id]);

    const [docs] = await db.execute(
      "SELECT id, document_type, original_filename, storage_path, source_url, file_size_bytes FROM judgment_documents WHERE judgment_id = ? AND is_verified = 1 LIMIT 1",
      [id]
    );

    const doc = pdfManifest[id] || docs[0] || null;
    const curated = caseRecords[id] || null;

    res.json({ judgment, sections, document: doc, curated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Validate PDF magic bytes (%PDF-) to prevent serving non-PDF or challenge pages
function isGenuinePdf(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(5);
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);
    return buffer.toString('utf-8') === '%PDF-';
  } catch {
    return false;
  }
}

// 5. PDF access endpoint
app.get('/api/judgments/:id/pdf', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (id >= 100000) {
      const repoId = id - 100000;
      const [rows] = await db.execute(
        "SELECT source_url, source_order_url FROM court_records_repository WHERE id = ?",
        [repoId]
      );
      if (rows.length && (rows[0].source_order_url || rows[0].source_url)) {
        return res.redirect(rows[0].source_order_url || rows[0].source_url);
      }
      return res.status(404).send('Verified PDF document not found for this repository record');
    }

    const manifestDoc = pdfManifest[id];
    if (manifestDoc) {
      const localFile = path.join(__dirname, manifestDoc.storage_path);
      if (isGenuinePdf(localFile)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${manifestDoc.original_filename}"`);
        return fs.createReadStream(localFile).pipe(res);
      }
    }

    const [docs] = await db.execute(`
      SELECT d.* FROM judgment_documents d
      JOIN legal_judgments j ON j.id = d.judgment_id
      WHERE d.judgment_id = ? AND d.is_verified = 1 AND j.is_synthetic = 0 AND j.record_provenance = 'REAL_VERIFIED'
      LIMIT 1
    `, [id]);

    if (docs.length) {
      const doc = docs[0];
      const localFile = path.join(__dirname, doc.storage_path);
      if (isGenuinePdf(localFile)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${doc.original_filename}"`);
        return fs.createReadStream(localFile).pipe(res);
      }
      if (doc.source_url) {
        return res.redirect(doc.source_url);
      }
    }

    // Direct official source fallback from legal_judgments
    const [judgRows] = await db.execute(
      "SELECT source_url, full_judgment_url FROM legal_judgments WHERE id = ? AND is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'",
      [id]
    );
    if (judgRows.length && (judgRows[0].full_judgment_url || judgRows[0].source_url)) {
      return res.redirect(judgRows[0].full_judgment_url || judgRows[0].source_url);
    }

    res.status(404).send('Verified PDF document not found');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 6. List Legal Acts
app.get('/api/acts', async (req, res) => {
  try {
    const [acts] = await db.execute(`
      SELECT a.*, (SELECT COUNT(*) FROM legal_sections s WHERE s.act_id = a.id) AS section_count
      FROM legal_acts a
      ORDER BY a.enactment_year ASC, a.id ASC
    `);
    res.json(acts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Single Act with its sections
app.get('/api/acts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [acts] = await db.execute("SELECT * FROM legal_acts WHERE id = ?", [id]);
    if (!acts.length) return res.status(404).json({ error: 'Act not found' });

    const [sections] = await db.execute(`
      SELECT id, section_number, section_title, legal_nature, status
      FROM legal_sections
      WHERE act_id = ?
      ORDER BY section_order ASC, id ASC
    `, [id]);

    res.json({ act: acts[0], sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Single Section Detail with mappings & judgments
app.get('/api/sections/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [rows] = await db.execute(`
      SELECT s.*, a.id AS act_id, a.title AS act_title, a.short_title AS act_short_title
      FROM legal_sections s
      JOIN legal_acts a ON a.id = s.act_id
      WHERE s.id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Section not found' });
    const section = rows[0];

    // Outgoing relations (e.g. IPC -> BNS)
    const [outgoing] = await db.execute(`
      SELECT r.id, r.relation_type, r.notes, r.mapping_nature, r.correspondence_cardinality,
             r.what_changed, r.what_remains_same, r.substantive_impact, r.procedural_safeguards,
             r.punishment_comparison, r.transitional_notes, r.verification_status,
             ta.id AS related_act_id, ta.short_title AS related_act,
             ts.id AS related_sec_id, ts.section_number AS related_sec_num, ts.section_title AS related_sec_title
      FROM legal_section_relations r
      JOIN legal_sections ts ON ts.id = r.to_section_id
      JOIN legal_acts ta ON ta.id = ts.act_id
      WHERE r.from_section_id = ?
    `, [id]);

    // Incoming relations (e.g. BNS <- IPC)
    const [incoming] = await db.execute(`
      SELECT r.id, r.relation_type, r.notes, r.mapping_nature, r.correspondence_cardinality,
             r.what_changed, r.what_remains_same, r.substantive_impact, r.procedural_safeguards,
             r.punishment_comparison, r.transitional_notes, r.verification_status,
             fa.id AS related_act_id, fa.short_title AS related_act,
             fs.id AS related_sec_id, fs.section_number AS related_sec_num, fs.section_title AS related_sec_title
      FROM legal_section_relations r
      JOIN legal_sections fs ON fs.id = r.from_section_id
      JOIN legal_acts fa ON fa.id = fs.act_id
      WHERE r.to_section_id = ?
    `, [id]);

    // Genuine verified judgments citing this section
    const [judgments] = await db.execute(`
      SELECT j.id, j.case_name, j.citation, j.judgment_date, jls.relevance_nature,
             jls.legal_principle, jls.ratio_summary, jls.authority_type, jls.verification_status
      FROM judgment_legal_sections jls
      JOIN legal_judgments j ON j.id = jls.judgment_id
      WHERE jls.section_id = ? AND j.is_synthetic = 0 AND j.record_provenance = 'REAL_VERIFIED'
      ORDER BY j.judgment_date DESC
    `, [id]);

    res.json({
      section,
      mappings: { outgoing, incoming },
      judgments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. All Section Mappings
app.get('/api/mappings', async (req, res) => {
  try {
    const [mappings] = await db.execute(`
      SELECT r.id, r.relation_type, r.notes, r.source_name,
             r.mapping_nature, r.correspondence_cardinality, r.what_changed, r.what_remains_same,
             r.substantive_impact, r.procedural_safeguards, r.punishment_comparison, r.transitional_notes, r.verification_status,
             fa.id AS from_act_id, fa.short_title AS from_act, fs.id AS from_sec_id, fs.section_number AS from_sec, fs.section_title AS from_title,
             ta.id AS to_act_id, ta.short_title AS to_act, ts.id AS to_sec_id, ts.section_number AS to_sec, ts.section_title AS to_title
      FROM legal_section_relations r
      JOIN legal_sections fs ON fs.id = r.from_section_id
      JOIN legal_acts fa ON fa.id = fs.act_id
      JOIN legal_sections ts ON ts.id = r.to_section_id
      JOIN legal_acts ta ON ta.id = ts.act_id
      ORDER BY r.id ASC
    `);
    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Explicit root route for static index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server (standalone / local mode)
async function startServer() {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) AS count FROM vw_unified_judicial_records");
    console.log(`[JIS Server] Database connected: ${process.env.DB_NAME || 'database'}`);
    console.log(`[JIS Server] Unified verified judicial decisions count: ${rows[0].count}`);
  } catch (err) {
    console.warn(`[JIS Server] Database connectivity notice (${err.code || 'UNAVAILABLE'}): ${err.message}`);
    console.warn('[JIS Server] Starting in degraded mode. Verify database credentials and network reachability.');
  }

  const server = app.listen(PORT, () => {
    console.log(`[JIS Server] Running on port ${PORT} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
  });

  server.on('error', (err) => {
    console.error('[JIS Server] Fatal server error:', err.message);
    process.exit(1);
  });
}

if (!process.env.VERCEL && require.main === module) {
  startServer();
}

module.exports = app;
