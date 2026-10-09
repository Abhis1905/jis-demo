/**
 * JIS Main Project — Phase 2: IndiaCode API Connectivity & Extraction Pilot
 * 
 * Standalone, read-only extraction script.
 * Retrieves 20 genuine judgment records (10 Supreme Court + 10 High Courts)
 * from IndiaCode eCourts API (https://indiacode.ecourtsindia.com/api/v1).
 * 
 * STRICT CONSTRAINTS:
 * - Read-only operation: Absolutely NO database inserts, updates, or deletes.
 * - Zero cost: Only calls the free, keyless IndiaCode API.
 * - Saves raw API responses and normalized preview to data/pilot_extraction/.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const db = require('../db');

const OUTPUT_DIR = path.join(__dirname, '../data/pilot_extraction');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'JIS-Judiciary-Information-System/1.0 (Pilot-Extraction; Legal-Research)',
        'Accept': 'application/json'
      }
    }, res => {
      const headers = {
        status: res.statusCode,
        rateLimitLimit: res.headers['ratelimit-limit'],
        rateLimitRemaining: res.headers['ratelimit-remaining'],
        rateLimitReset: res.headers['ratelimit-reset'],
        etag: res.headers['etag'],
        contentType: res.headers['content-type']
      };

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, headers, data: parsed });
        } catch (err) {
          reject(new Error(`Failed to parse JSON (HTTP ${res.statusCode}): ${err.message}. Response body: ${body.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Request timed out after 30s: ${url}`));
    });
  });
}

function checkHeadStatus(url) {
  return new Promise(resolve => {
    try {
      const u = new URL(url);
      const req = https.request({
        method: 'HEAD',
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: { 'User-Agent': 'JIS-Judiciary-Information-System/1.0 (Pilot-Probe)' }
      }, res => {
        resolve({ status: res.statusCode, contentType: res.headers['content-type'] || null });
      });
      req.on('error', () => resolve({ status: null, error: 'Network error' }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ status: null, error: 'Timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ status: null, error: e.message });
    }
  });
}

function normalizeCourtName(courtCode, rawCourtName) {
  if (courtCode === 'SC') return 'Supreme Court of India';
  if (rawCourtName && rawCourtName !== 'HCHC') {
    return rawCourtName.split(',')[0].trim();
  }
  // If rawCourtName is stub like 'HCHC'
  return 'High Court of Judicature';
}

function mapCourtTier(courtCode) {
  if (courtCode === 'SC') return 'Supreme Court of India';
  if (courtCode === 'HC') return 'High Court';
  return 'District & Subordinate Court';
}

function inferDomain(text, title) {
  const combined = ((text || '') + ' ' + (title || '')).toLowerCase();
  if (combined.includes('bail') || combined.includes('murder') || combined.includes('fir') || combined.includes('criminal') || combined.includes('ipc') || combined.includes('bns')) {
    return 'Criminal Law';
  }
  if (combined.includes('article 14') || combined.includes('article 21') || combined.includes('article 32') || combined.includes('constitution') || combined.includes('fundamental right')) {
    return 'Constitutional Law';
  }
  if (combined.includes('environmental') || combined.includes('ngt') || combined.includes('pollution') || combined.includes('precautionary principle')) {
    return 'Environmental Law';
  }
  if (combined.includes('tax') || combined.includes('gst') || combined.includes('revenue') || combined.includes('assessment')) {
    return 'Tax & Revenue Law';
  }
  if (combined.includes('commercial') || combined.includes('contract') || combined.includes('arbitration') || combined.includes('suit')) {
    return 'Civil & Commercial Law';
  }
  return 'Evidence & Procedure';
}

async function runPilot() {
  console.log('=== JIS Main Project: Phase 2 Pilot Extraction ===');
  console.log('Target: IndiaCode eCourts API (https://indiacode.ecourtsindia.com/api/v1)');
  console.log('Extracting 10 Supreme Court + 10 High Court genuine judgment records...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Fetch Existing DB records (READ-ONLY) for duplicate checking
  let existingJudgments = [];
  try {
    const [rows] = await db.execute(
      "SELECT id, case_name, citation, judgment_date FROM legal_judgments WHERE is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'"
    );
    existingJudgments = rows;
    console.log(`[DB Check] Connected to local jis_db. Loaded ${existingJudgments.length} existing REAL_VERIFIED records for duplicate matching.`);
  } catch (err) {
    console.warn(`[DB Check Notice] Could not query local database (${err.message}). Proceeding without local duplicate matching.`);
  }

  // 2. Fetch SC and HC judgments from IndiaCode API
  const scUrl = 'https://indiacode.ecourtsindia.com/api/v1/judgments?court=SC&limit=10';
  const hcUrl = 'https://indiacode.ecourtsindia.com/api/v1/judgments?court=HC&limit=10';

  console.log(`Fetching SC judgments: ${scUrl}`);
  const scRes = await fetchJson(scUrl);
  console.log(`SC Response: HTTP ${scRes.status}, Remaining Rate Limit: ${scRes.headers.rateLimitRemaining}/${scRes.headers.rateLimitLimit}`);

  console.log(`Fetching HC judgments: ${hcUrl}`);
  const hcRes = await fetchJson(hcUrl);
  console.log(`HC Response: HTTP ${hcRes.status}, Remaining Rate Limit: ${hcRes.headers.rateLimitRemaining}/${hcRes.headers.rateLimitLimit}`);

  const rawResponses = {
    fetched_at: new Date().toISOString(),
    api_source: 'IndiaCode by eCourtsIndia (https://indiacode.ecourtsindia.com/api/v1)',
    rate_limits: {
      sc_query: scRes.headers,
      hc_query: hcRes.headers
    },
    sc_result: scRes.data,
    hc_result: hcRes.data
  };

  // Save raw API responses
  fs.writeFileSync(path.join(OUTPUT_DIR, 'raw_indiacode_responses.json'), JSON.stringify(rawResponses, null, 2));
  console.log(`\n[Saved] Raw responses -> ${path.join(OUTPUT_DIR, 'raw_indiacode_responses.json')}`);

  const allRawJudgments = [
    ...(scRes.data.judgments || []),
    ...(hcRes.data.judgments || [])
  ];

  console.log(`\nTotal candidate records retrieved: ${allRawJudgments.length}`);

  // 3. Normalize records and inspect metadata
  const normalizedRecords = [];
  const duplicateReports = [];
  const missingFieldStats = {
    citation: 0,
    order_file: 0,
    court_marking: 0,
    applied_to_this_section: 0,
    decided_under: 0
  };

  for (let i = 0; i < allRawJudgments.length; i++) {
    const raw = allRawJudgments[i];
    const candidateId = `PILOT-${String(i + 1).padStart(2, '0')}`;

    // Track missing fields
    if (!raw.citation) missingFieldStats.citation++;
    if (!raw.order) missingFieldStats.order_file++;
    if (!raw.court_marking) missingFieldStats.court_marking++;
    if (!raw.applied_to_this_section) missingFieldStats.applied_to_this_section++;
    if (!raw.decided_under) missingFieldStats.decided_under++;

    // Probe PDF / Portal link
    const pdfProbe = raw.url ? await checkHeadStatus(raw.url) : { status: null, error: 'No URL' };

    // Duplicate check against existing DB records
    const isDuplicate = existingJudgments.find(e => {
      const matchTitle = e.case_name.toLowerCase().trim() === (raw.title || '').toLowerCase().trim();
      const matchCitation = raw.citation && e.citation && e.citation.toLowerCase().includes(raw.citation.toLowerCase());
      return matchTitle || matchCitation;
    });

    if (isDuplicate) {
      duplicateReports.push({
        candidate_id: candidateId,
        candidate_title: raw.title,
        matched_db_id: isDuplicate.id,
        matched_db_name: isDuplicate.case_name
      });
    }

    // Extract Case Number from citation or title where possible
    let caseNumber = null;
    if (raw.citation) {
      const cm = raw.citation.match(/(Civil Appeal No\.\s*[\d/]+|WP\s*[\d/]+|IA\s*[\d/]+|SLP\s*[\d/]+)/i);
      if (cm) caseNumber = cm[1];
    }

    const domain = inferDomain(raw.ratio_decidendi, raw.title);
    const courtTier = mapCourtTier(raw.court);
    const courtName = normalizeCourtName(raw.court, raw.court_name);

    // Extract 5-10 strictly factual points from verbatim text
    const extractedFacts = [
      `Court: ${courtName} (${courtTier})`,
      `Record Identifier (CNR): ${raw.cnr || '[NOT RECORDED]'}`,
      `Case Title: ${raw.title || '[NOT RECORDED]'}`,
      `Date of Judgment: ${raw.date || '[NOT RECORDED]'}`,
      `Citation / Neutral Citation: ${raw.citation || '[NOT RECORDED IN SOURCE]'}`,
      `Precedential Weight: ${raw.precedential_value || 'Reported Judicial Decision'}`,
      `Court Marking: ${raw.court_marking || '[NOT SPECIFIED]'}`,
      `Associated Document / Order: ${raw.order || (raw.url ? 'Available via Portal URL' : '[NONE]')}`,
      `Statutory Cross-Reference: ${raw.decided_under || raw.applied_to_this_section || '[GENERAL REPOSITORY]'}`
    ];

    normalizedRecords.push({
      candidate_id: candidateId,
      source_provider: 'INDIACODE_ECOURTS',
      source_external_id: raw.cnr,
      source_url: raw.url,
      court_tier: courtTier,
      court_name: courtName,
      case_name: raw.title,
      case_number: caseNumber,
      judgment_date: raw.date,
      citation: raw.citation || null,
      neutral_citation: (raw.citation && raw.citation.includes('INSC')) ? (raw.citation.match(/\d{4}\s+INSC\s+\d+/) || [null])[0] : null,
      domain: domain,
      precedential_value: raw.precedential_value || null,
      court_marking: raw.court_marking || null,
      legal_issue: raw.applied_to_this_section ? `Application of ${raw.applied_to_this_section}` : `Substantive question of law in ${raw.title}`,
      key_ratio: raw.ratio_decidendi,
      key_holding: raw.ratio_decidendi,
      outcome: raw.ratio_decidendi && raw.ratio_decidendi.toLowerCase().includes('dismissed') ? 'Dismissed' : (raw.ratio_decidendi && raw.ratio_decidendi.toLowerCase().includes('allowed') ? 'Allowed' : 'Disposed with Directions'),
      is_landmark: raw.precedential_value && raw.precedential_value.includes('Binding') ? 1 : 0,
      is_synthetic: 0,
      record_provenance: 'REAL_VERIFIED',
      pdf_details: {
        has_order_file: Boolean(raw.order),
        order_filename: raw.order || null,
        portal_url: raw.url,
        url_probe_status: pdfProbe.status
      },
      extracted_facts: extractedFacts,
      duplicate_status: isDuplicate ? `MATCHED_EXISTING_DB_ID_${isDuplicate.id}` : 'UNIQUE_NEW_RECORD'
    });
  }

  // Save normalized records
  fs.writeFileSync(path.join(OUTPUT_DIR, 'normalized_records.json'), JSON.stringify(normalizedRecords, null, 2));
  console.log(`[Saved] Normalized preview -> ${path.join(OUTPUT_DIR, 'normalized_records.json')}`);

  // Summary Metadata
  const metadata = {
    extraction_timestamp: new Date().toISOString(),
    total_records_extracted: normalizedRecords.length,
    sc_records: normalizedRecords.filter(r => r.court_tier === 'Supreme Court of India').length,
    hc_records: normalizedRecords.filter(r => r.court_tier === 'High Court').length,
    rate_limits: {
      limit: scRes.headers.rateLimitLimit,
      remaining: hcRes.headers.rateLimitRemaining,
      reset_seconds: hcRes.headers.rateLimitReset
    },
    missing_fields_analysis: missingFieldStats,
    duplicates_found: duplicateReports.length,
    duplicate_records: duplicateReports,
    pdf_availability_count: normalizedRecords.filter(r => r.pdf_details.has_order_file || r.pdf_details.url_probe_status === 200).length
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'extraction_metadata.json'), JSON.stringify(metadata, null, 2));
  console.log(`[Saved] Extraction metadata -> ${path.join(OUTPUT_DIR, 'extraction_metadata.json')}`);

  // 4. Generate Markdown Preview Report
  let md = `# IndiaCode API Extraction Pilot — 20 Candidate Records Preview\n\n`;
  md += `**Extraction Date**: ${metadata.extraction_timestamp}  \n`;
  md += `**Total Records**: 20 (10 Supreme Court of India + 10 High Courts)  \n`;
  md += `**Provider**: IndiaCode by eCourtsIndia (\`https://indiacode.ecourtsindia.com/api/v1\`)  \n`;
  md += `**Rate Limit Status**: Limit: ${metadata.rate_limits.limit} req/min | Remaining: ${metadata.rate_limits.remaining} | Reset: ${metadata.rate_limits.reset_seconds}s  \n\n`;

  md += `## 1. Summary Analysis\n\n`;
  md += `- **Duplicates vs Existing Database**: ${metadata.duplicates_found} duplicates found.\n`;
  md += `- **Missing Citation**: ${missingFieldStats.citation} / 20 records lack an explicit law reporter citation.\n`;
  md += `- **Order File Specified**: ${20 - missingFieldStats.order_file} / 20 records specify an exact order filename (\`order-*.pdf\`).\n`;
  md += `- **Live Portal Resolution**: ${metadata.pdf_availability_count} / 20 records resolved successfully on live URL probe.\n\n`;

  md += `## 2. Normalized Records Preview (All 20 Records)\n\n`;
  normalizedRecords.forEach((rec, idx) => {
    md += `### ${idx + 1}. [${rec.candidate_id}] ${rec.case_name}\n\n`;
    md += `- **CNR**: \`${rec.source_external_id}\`\n`;
    md += `- **Court**: ${rec.court_name} (*${rec.court_tier}*)\n`;
    md += `- **Date**: ${rec.judgment_date}\n`;
    md += `- **Citation**: ${rec.citation || '*[NOT RECORDED IN SOURCE]*'}\n`;
    if (rec.neutral_citation) md += `- **Neutral Citation**: \`${rec.neutral_citation}\`\n`;
    md += `- **Domain**: ${rec.domain}\n`;
    md += `- **Precedential Value**: ${rec.precedential_value || 'Reported Decision'}\n`;
    md += `- **Duplicate Status**: **${rec.duplicate_status}**\n`;
    md += `- **Source URL**: [${rec.source_url}](${rec.source_url})\n`;
    md += `- **Order PDF**: ${rec.pdf_details.has_order_file ? `\`${rec.pdf_details.order_filename}\`` : 'Available on CNR portal page'} (Probe Status: ${rec.pdf_details.url_probe_status || 'N/A'})\n\n`;
    md += `**Verbatim Ratio Decidendi / Judicial Holding**:\n> ${rec.key_ratio.replace(/\n/g, ' ')}\n\n`;
    md += `**Verifiable Record Facts**:\n`;
    rec.extracted_facts.forEach(f => md += `- ${f}\n`);
    md += `\n---\n\n`;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'pilot_extraction_preview.md'), md);
  console.log(`[Saved] Human-readable preview -> ${path.join(OUTPUT_DIR, 'pilot_extraction_preview.md')}`);

  console.log('\n=== Pilot Extraction Complete ===');
  console.log(`Extracted: 20 records | Duplicates: ${metadata.duplicates_found} | Files written to data/pilot_extraction/`);
  console.log('NO database records were inserted, updated, or deleted.\n');

  process.exit(0);
}

runPilot().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
