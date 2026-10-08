const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Load matches
const list = JSON.parse(fs.readFileSync('/tmp/all_105_judgments.json', 'utf8'));
const matches = JSON.parse(fs.readFileSync('/tmp/kanoon_matches.json', 'utf8'));

// Additional verified matches
const extraMatches = {
  28: { docId: '1706770', titleText: 'Sri Sankari Prasad Singh Deo vs Union Of India (1951)' },
  32: { docId: '165099707', titleText: 'ADM Jabalpur vs Shivakant Shukla (1976)' },
  53: { docId: '154625515', titleText: 'State of Punjab vs Principal Secretary to Governor (2023)' },
  56: { docId: '13149785', titleText: 'Sharad Birdhichand Sarda vs State of Maharashtra (1984)' },
  58: { docId: '853252', titleText: 'Prem Shankar Shukla vs Delhi Administration (1980)' },
  60: { docId: '499119', titleText: 'Khatri vs State of Bihar (Bhagalpur Blinding) (1981)' },
  62: { docId: '810491', titleText: 'Rudul Sah vs State of Bihar (1983)' },
  64: { docId: '1033637', titleText: 'State of Haryana vs Ch. Bhajan Lal (1990)' },
  65: { docId: '481284', titleText: 'State of UP vs Deoman Upadhyaya (1960)' },
  66: { docId: '184128', titleText: 'Pulukuri Kotayya vs King-Emperor (1947)' },
  77: { docId: '298957', titleText: 'T.N. Godavarman Thirumulkpad vs Union of India (1996)' }
};

// Existing verified PDFs already present
const existingPdfs = {
  12: 'SC_2017_Puttaswamy_Privacy_9J_WP_C_494_2012.pdf',
  13: 'SC_1978_Maneka_Gandhi_v_Union_of_India_JUDIS_5154.pdf',
  14: 'SC_2018_Navtej_Singh_Johar_v_Union_of_India_WP_Crl_76_2016.pdf',
  16: 'SC_2013_Lalita_Kumari_v_Govt_of_UP_JUDIS_40960.pdf',
  17: 'SC_2014_Arnesh_Kumar_v_State_of_Bihar_JUDIS_41736.pdf',
  20: 'SC_2018_Joseph_Shine_v_Union_of_India_WP_Crl_194_2017.pdf',
  23: 'SC_2022_Satender_Kumar_Antil_v_CBI_SLP_Crl_5191_2021.pdf',
  24: 'SC_2024_ADR_Electoral_Bonds_Case_WP_C_880_2017.pdf',
  50: 'SC_2018_Common_Cause_v_Union_of_India_WP_C_215_2005.pdf',
  81: 'SC_2018_Indian_Young_Lawyers_Sabarimala_WP_C_373_2006.pdf',
  83: 'SC_2018_Puttaswamy_Aadhaar_5J_WP_C_494_2012.pdf'
};

const uploadsDir = path.join(__dirname, '../uploads/legal_judgments');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').substring(0, 80);
}

function downloadDoc(docId, outPath) {
  const cookieFile = `/tmp/kcook_${docId}.txt`;
  const htmlFile = `/tmp/kdoc_${docId}.html`;
  try {
    execSync(`curl -s -c "${cookieFile}" -b "${cookieFile}" "https://indiankanoon.org/doc/${docId}/" > "${htmlFile}"`, { timeout: 15000 });
    const html = fs.readFileSync(htmlFile, 'utf8');
    const m = html.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/);
    if (!m) return false;
    const csrf = m[1];
    execSync(`curl -s -b "${cookieFile}" -c "${cookieFile}" -d "csrfmiddlewaretoken=${csrf}&type=pdf" -H "Referer: https://indiankanoon.org/doc/${docId}/" "https://indiankanoon.org/doc/${docId}/" -o "${outPath}"`, { timeout: 30000 });
    const stat = fs.statSync(outPath);
    if (stat.size < 1000) {
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      return false;
    }
    return stat.size;
  } catch (err) {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    return false;
  } finally {
    if (fs.existsSync(cookieFile)) fs.unlinkSync(cookieFile);
    if (fs.existsSync(htmlFile)) fs.unlinkSync(htmlFile);
  }
}

async function main() {
  const manifest = {};
  let totalReady = 0;

  // First, register the 11 already present files
  for (const [idStr, filename] of Object.entries(existingPdfs)) {
    const id = parseInt(idStr, 10);
    const fullPath = path.join(uploadsDir, filename);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      manifest[id] = {
        judgment_id: id,
        original_filename: filename,
        storage_path: `uploads/legal_judgments/${filename}`,
        file_size_bytes: stat.size,
        source: 'Official SC / JUDIS'
      };
      totalReady++;
    }
  }

  // Next, build list to download
  const toDownload = [];
  for (const j of list) {
    if (manifest[j.id]) continue; // already registered

    let docId = null;
    let title = j.case_name;

    if (extraMatches[j.id]) {
      docId = extraMatches[j.id].docId;
    } else {
      const match = matches.find(m => m.id === j.id && m.matched && m.kanoon_doc_id);
      if (match) docId = match.kanoon_doc_id;
    }

    if (docId) {
      toDownload.push({ id: j.id, docId, case_name: j.case_name, court_name: j.court_name });
    }
  }

  console.log(`Starting downloads for ${toDownload.length} cases...`);

  for (let i = 0; i < toDownload.length; i++) {
    const item = toDownload[i];
    const prefix = item.court_name.includes('High Court') ? 'HC' : 'SC';
    const filename = `${prefix}_${item.id}_${sanitizeFilename(item.case_name)}.pdf`;
    const outPath = path.join(uploadsDir, filename);

    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      const stat = fs.statSync(outPath);
      manifest[item.id] = {
        judgment_id: item.id,
        original_filename: filename,
        storage_path: `uploads/legal_judgments/${filename}`,
        file_size_bytes: stat.size,
        source: `Indian Kanoon doc:${item.docId}`
      };
      totalReady++;
      console.log(`[${i+1}/${toDownload.length}] Already exists: ID ${item.id} -> ${filename} (${stat.size} bytes)`);
      continue;
    }

    console.log(`[${i+1}/${toDownload.length}] Downloading ID ${item.id}: ${item.case_name} (doc:${item.docId})...`);
    const size = downloadDoc(item.docId, outPath);
    if (size) {
      manifest[item.id] = {
        judgment_id: item.id,
        original_filename: filename,
        storage_path: `uploads/legal_judgments/${filename}`,
        file_size_bytes: size,
        source: `Indian Kanoon doc:${item.docId}`
      };
      totalReady++;
      console.log(`  -> Success: ${filename} (${Math.round(size/1024)} KB)`);
    } else {
      console.log(`  -> FAILED to download doc ${item.docId}`);
    }

    // Delay 700ms
    await new Promise(r => setTimeout(r, 700));
  }

  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'verified_pdf_manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\n========================================`);
  console.log(`Total verified PDFs ready: ${Object.keys(manifest).length} / 105`);
  console.log(`Saved manifest to data/verified_pdf_manifest.json`);
  console.log(`========================================\n`);
}

main();
