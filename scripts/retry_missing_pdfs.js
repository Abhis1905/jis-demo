const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const manifestPath = path.join(__dirname, '../data/verified_pdf_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const list = JSON.parse(fs.readFileSync('/tmp/all_105_judgments.json', 'utf8'));
const matches = JSON.parse(fs.readFileSync('/tmp/kanoon_matches.json', 'utf8'));

const extraDocIds = {
  40: '753224',
  41: '141126788',
  43: '1934103',
  45: '322504',
  46: '338008',
  48: '66970168',
  70: '413103',
  71: '34062092',
  72: '961612',
  74: '43023',
  75: '884513',
  78: '1514672',
  80: '177921960',
  82: '190772988',
  84: '36423291',
  86: '17990001',
  88: '198803407',
  89: '139834510',
  91: '1353689',
  92: '590378',
  93: '217501',
  225: '438670'
};

const uploadsDir = path.join(__dirname, '../uploads/legal_judgments');

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').substring(0, 80);
}

function downloadDoc(docId, outPath) {
  const cookieFile = `/tmp/retry_cook_${docId}.txt`;
  const htmlFile = `/tmp/retry_html_${docId}.html`;
  try {
    execSync(`curl -s -c "${cookieFile}" -b "${cookieFile}" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" "https://indiankanoon.org/doc/${docId}/" > "${htmlFile}"`, { timeout: 20000 });
    const html = fs.readFileSync(htmlFile, 'utf8');
    const m = html.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/);
    if (!m) return false;
    const csrf = m[1];
    execSync(`curl -s -b "${cookieFile}" -c "${cookieFile}" -d "csrfmiddlewaretoken=${csrf}&type=pdf" -H "Referer: https://indiankanoon.org/doc/${docId}/" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" "https://indiankanoon.org/doc/${docId}/" -o "${outPath}"`, { timeout: 35000 });
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

async function run() {
  const items = Object.entries(extraDocIds);
  console.log(`Retrying ${items.length} items...`);

  for (let i = 0; i < items.length; i++) {
    const [idStr, docId] = items[i];
    const id = parseInt(idStr, 10);
    const j = list.find(x => x.id === id);
    if (!j) continue;

    const prefix = j.court_name.includes('High Court') ? 'HC' : 'SC';
    const filename = `${prefix}_${id}_${sanitizeFilename(j.case_name)}.pdf`;
    const outPath = path.join(uploadsDir, filename);

    console.log(`[${i+1}/${items.length}] Retrying ID ${id}: ${j.case_name} (doc:${docId})...`);
    const size = downloadDoc(docId, outPath);
    if (size) {
      manifest[id] = {
        judgment_id: id,
        original_filename: filename,
        storage_path: `uploads/legal_judgments/${filename}`,
        file_size_bytes: size,
        source: `Indian Kanoon doc:${docId}`
      };
      console.log(`  -> SUCCESS: ${filename} (${Math.round(size/1024)} KB)`);
    } else {
      console.log(`  -> FAILED doc:${docId}`);
    }

    await new Promise(r => setTimeout(r, 1200));
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest updated: ${Object.keys(manifest).length} verified PDFs in total.`);
}

run();
