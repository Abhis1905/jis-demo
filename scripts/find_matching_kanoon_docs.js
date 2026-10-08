const fs = require('fs');
const https = require('https');
const path = require('path');

const list = JSON.parse(fs.readFileSync('/tmp/all_105_judgments.json', 'utf8'));

// Existing PDFs already downloaded and verified
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

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanParties(name) {
  const parts = name.replace(/\([^)]*\)/g, '').replace(/@.*/g, '').split(/\s+v\.?\s+|\s+vs\.?\s+/i);
  const pet = (parts[0] || '').trim();
  const resp = (parts[1] || '').trim();
  return { pet, resp };
}

function parseKanoonDate(text) {
  // e.g. "on 24 April, 1973" or "on 9 May, 1980"
  const m = text.match(/on\s+(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})/);
  if (!m) return null;
  const months = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
  };
  const d = m[1].padStart(2, '0');
  const mo = months[m[2].toLowerCase()] || '01';
  const yr = m[3];
  return `${yr}-${mo}-${d}`;
}

async function searchKanoon(j) {
  const { pet, resp } = cleanParties(j.case_name);
  const yr = j.dt ? j.dt.substring(0, 4) : '';
  
  // Try precise search queries in order
  const queries = [
    `title:${pet} ${resp} ${yr}`,
    `title:${pet} ${yr}`,
    `"${pet}" "${resp}" ${yr}`
  ];

  for (const q of queries) {
    const url = 'https://indiankanoon.org/search/?formInput=' + encodeURIComponent(q);
    try {
      const html = await fetchText(url);
      const regex = /<a href="\/docfragment\/([0-9]+)\/[^"]*">(.*?)<\/a>/g;
      let m;
      const candidates = [];
      while ((m = regex.exec(html)) !== null) {
        const docId = m[1];
        const titleText = m[2].replace(/<[^>]+>/g, '').trim();
        const dateStr = parseKanoonDate(titleText);
        candidates.push({ docId, titleText, dateStr });
      }

      // Check for exact date match first
      if (j.dt) {
        const exact = candidates.find(c => c.dateStr === j.dt);
        if (exact) return { matched: true, confidence: 'EXACT_DATE', ...exact };
      }

      // Check for year match and strong title match
      if (yr) {
        const yrMatch = candidates.find(c => c.dateStr && c.dateStr.startsWith(yr));
        if (yrMatch) return { matched: true, confidence: 'YEAR_MATCH', ...yrMatch };
      }

      if (candidates.length > 0 && !q.includes(yr)) {
        // Fallback candidate if petitioner is clearly in title
        const top = candidates[0];
        if (top.titleText.toLowerCase().includes(pet.toLowerCase().split(' ')[0])) {
          return { matched: true, confidence: 'NAME_MATCH', ...top };
        }
      }
    } catch (err) {
      console.error(`Error searching for ${j.case_name}:`, err.message);
    }
  }

  return { matched: false };
}

async function run() {
  console.log(`Processing ${list.length} cases...`);
  const results = [];

  for (let i = 0; i < list.length; i++) {
    const j = list[i];
    if (existingPdfs[j.id]) {
      results.push({
        id: j.id,
        case_name: j.case_name,
        has_existing_pdf: true,
        pdf_filename: existingPdfs[j.id],
        matched: true,
        confidence: 'LOCAL_VERIFIED'
      });
      console.log(`[${i+1}/${list.length}] ID ${j.id} [LOCAL_VERIFIED]: ${j.case_name}`);
      continue;
    }

    const match = await searchKanoon(j);
    if (match.matched) {
      results.push({
        id: j.id,
        case_name: j.case_name,
        target_date: j.dt,
        kanoon_doc_id: match.docId,
        kanoon_title: match.titleText,
        kanoon_date: match.dateStr,
        confidence: match.confidence,
        matched: true
      });
      console.log(`[${i+1}/${list.length}] ID ${j.id} [${match.confidence}]: ${j.case_name} -> doc:${match.docId} (${match.dateStr})`);
    } else {
      results.push({
        id: j.id,
        case_name: j.case_name,
        matched: false
      });
      console.log(`[${i+1}/${list.length}] ID ${j.id} [NO MATCH]: ${j.case_name}`);
    }

    // Gentle delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 600));
  }

  const matchedCount = results.filter(r => r.matched).length;
  console.log(`\n========================================`);
  console.log(`Matching Complete: ${matchedCount} / ${list.length} matched`);
  console.log(`========================================\n`);

  fs.writeFileSync('/tmp/kanoon_matches.json', JSON.stringify(results, null, 2));
}

run();
