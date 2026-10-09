const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/sections_db_overview.json', 'utf8'));

const genericByAct = {};
for (const s of data) {
  if (s.section_title && s.section_title.startsWith('Section ' + s.section_number + ' of the')) {
    genericByAct[s.act_id] = genericByAct[s.act_id] || [];
    genericByAct[s.act_id].push({
      id: s.id,
      section_number: s.section_number,
      chapter_number: s.chapter_number,
      chapter_title: s.chapter_title
    });
  }
}

for (const [actId, list] of Object.entries(genericByAct)) {
  console.log(`Act ${actId}: ${list.length} generic sections. Examples:`, list.slice(0, 5).map(x => `${x.section_number} (${x.chapter_title})`));
}
