// Judiciary Information System (JIS) — Vanilla JS Controller
let curSecs = [], curMaps = [], lastActId = null;

function router() {
  const h = location.hash || '#/';
  ['home', 'judgments', 'acts', 'mapping'].forEach(n => document.getElementById(`nav-${n}`)?.classList.toggle('active', (n === 'home' && (h === '#/' || !h)) || (n !== 'home' && h.startsWith(`#/${n}`))));
  if (h.startsWith('#/judgment/')) { showView('view-judgment-detail'); loadJudgmentDetail(h.split('/')[2]); }
  else if (h.startsWith('#/acts/')) { lastActId = h.split('/')[2]; showView('view-act-detail'); loadActDetail(lastActId); }
  else if (h.startsWith('#/sections/')) { showView('view-section-detail'); loadSectionDetail(h.split('/')[2]); }
  else if (h === '#/acts') { showView('view-acts'); loadActs(); }
  else if (h === '#/mapping') { showView('view-mapping'); loadMappings(); }
  else if (h === '#/judgments') { showView('view-judgments'); loadRepoJudgments(); }
  else { showView('view-home'); }
}

function showView(id) {
  document.querySelectorAll('.portal-view').forEach(v => v.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
  window.scrollTo(0, 0);
}

async function loadFilterOptions() {
  try {
    const { courts, years } = await (await fetch('/api/judgments/filters')).json();
    const c = document.getElementById('repo-filter-court'), y = document.getElementById('repo-filter-year');
    if (c && c.options.length <= 1) courts.forEach(v => c.add(new Option(v, v)));
    if (y && y.options.length <= 1) years.forEach(v => y.add(new Option(v, v)));
  } catch (e) { console.error('Filter load err', e); }
}

function getRepoParams(page = 1) {
  const q = document.getElementById('repo-search-query')?.value.trim() || '';
  const court = document.getElementById('repo-filter-court')?.value || '';
  const year = document.getElementById('repo-filter-year')?.value || '';
  const sort = document.getElementById('repo-filter-sort')?.value || 'date_desc';
  const params = new URLSearchParams({ page, limit: 10, sort });
  if (q) params.set('q', q);
  if (court) params.set('court', court);
  if (year) params.set('year', year);
  return params;
}

async function loadRepoJudgments(page = 1) {
  const el = document.getElementById('repo-judgments-list'), countEl = document.getElementById('repo-results-count');
  el.innerHTML = '<p class="loading">Loading judicial decisions...</p>';
  try {
    const data = await (await fetch(`/api/judgments?${getRepoParams(page)}`)).json();
    countEl.textContent = `${data.total} Judicial Decisions`;
    el.innerHTML = data.judgments.length ? data.judgments.map(renderJudgmentCard).join('') : '<p class="empty-msg">No verified judgments match your search.</p>';
    renderRepoPagination(data.page, data.totalPages);
  } catch { el.innerHTML = '<p class="error-msg">Failed to load judgments.</p>'; }
}

function renderJudgmentCard(j) {
  const dt = j.judgment_date ? new Date(j.judgment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
  return `<article class="judgment-card">
    <div class="card-top"><h3 class="card-title"><a href="#/judgment/${j.id}">${escapeHtml(j.case_name)}</a></h3></div>
    <div class="meta-row"><span><strong>Court:</strong> ${escapeHtml(j.court_name)}</span><span class="sep">&bull;</span><span><strong>Date:</strong> ${dt}</span><span class="sep">&bull;</span><span><strong>Citation:</strong> ${escapeHtml(j.citation || j.neutral_citation || 'N/A')}</span></div>
    <p class="issue-text">${escapeHtml(j.legal_issue || j.key_ratio || 'Judicial decision of record.')}</p>
    <div class="card-actions"><a href="#/judgment/${j.id}" class="btn btn-sm btn-outline">View Judgment &rarr;</a>${j.pdf_id ? `<a href="/api/judgments/${j.id}/pdf" target="_blank" class="btn btn-sm btn-pdf">View Judgment PDF</a>` : ''}</div>
  </article>`;
}

function renderRepoPagination(page, totalPages) {
  const bar = document.getElementById('repo-pagination');
  if (totalPages <= 1) return (bar.innerHTML = '');
  bar.innerHTML = `<button type="button" class="btn-page" ${page <= 1 ? 'disabled' : ''} onclick="loadRepoJudgments(${page - 1})">&larr; Previous</button><span class="page-info">Page ${page} of ${totalPages}</span><button type="button" class="btn-page" ${page >= totalPages ? 'disabled' : ''} onclick="loadRepoJudgments(${page + 1})">Next &rarr;</button>`;
}

async function loadJudgmentDetail(id) {
  const el = document.getElementById('judgment-detail-content');
  el.innerHTML = '<p class="loading">Loading judicial record...</p>';
  try {
    const { judgment: j, sections, document: doc, curated: c } = await (await fetch(`/api/judgments/${id}`)).json();
    const dt = j.judgment_date ? new Date(j.judgment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
    const ov = c?.overview || j.factual_summary || 'Judicial record of decision.';
    const iss = c?.issues || j.legal_issue || 'Constitutional question of record.';
    const hld = c?.holding || j.key_holding || j.key_ratio || 'Judgment of the court.';
    const findHtml = c?.key_findings?.length ? `<ol class="findings-list">${c.key_findings.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ol>` : (j.court_reasoning ? `<p>${escapeHtml(j.court_reasoning)}</p>` : '<p class="empty-text">No findings recorded.</p>');
    const provList = c?.provisions?.length ? c.provisions : (sections || []).map(s => ({ provision: `${s.act_title} Sec ${s.section_number}`, title: s.section_title, relevance: s.relevance_nature || 'Interpreted provision' }));
    const provHtml = provList.length ? `<div class="provisions-grid">${provList.map(p => `<div class="prov-card"><div class="prov-badge">${escapeHtml(p.provision)}</div><div class="prov-title">${escapeHtml(p.title || '')}</div><p class="prov-rel"><strong>Why it mattered:</strong> ${escapeHtml(p.relevance)}</p></div>`).join('')}</div>` : '<p class="empty-text">No statutory provisions recorded.</p>';
    el.innerHTML = `<div class="detail-header"><h1 class="detail-title">${escapeHtml(j.case_name)}</h1><div class="meta-grid"><div><strong>Court:</strong> ${escapeHtml(j.court_name)} (${escapeHtml(j.court_tier)})</div><div><strong>Judgment Date:</strong> ${dt}</div><div><strong>Case Number:</strong> ${escapeHtml(j.case_number || 'N/A')}</div><div><strong>Citation:</strong> ${escapeHtml(j.citation || j.neutral_citation || 'N/A')}</div><div><strong>Neutral Citation:</strong> ${escapeHtml(j.neutral_citation || 'N/A')}</div><div><strong>Bench / Judges:</strong> ${escapeHtml(j.bench_judges || 'N/A')}${j.bench_strength ? ` (${j.bench_strength} Judges)` : ''}</div></div></div>
      <div class="pdf-status-box ${doc ? 'available' : 'unavailable'}"><div class="pdf-status-text"><strong>Official Judicial Document:</strong> <span>${doc ? `${escapeHtml(doc.original_filename)} (${Math.round(doc.file_size_bytes / 1024)} KB)` : 'Original PDF not available for this record'}</span></div>${doc ? `<a href="/api/judgments/${j.id}/pdf" target="_blank" class="btn btn-primary btn-pdf-view">VIEW ORIGINAL JUDGMENT PDF &rarr;</a>` : ''}</div>
      <div class="detail-section"><h2>CASE OVERVIEW</h2><p class="section-body">${escapeHtml(ov)}</p></div>
      <div class="detail-section"><h2>ISSUES BEFORE THE COURT</h2><p class="section-body">${escapeHtml(iss)}</p></div>
      <div class="detail-section"><h2>JUDGMENT &amp; HOLDING</h2><p class="section-body">${escapeHtml(hld)}</p></div>
      <div class="detail-section"><h2>KEY LEGAL FINDINGS</h2>${findHtml}</div>
      <div class="detail-section"><h2>RELEVANT CONSTITUTIONAL / STATUTORY PROVISIONS</h2>${provHtml}</div>`;
  } catch { el.innerHTML = '<p class="error-msg">Judgment not found or failed to load.</p>'; }
}

async function loadActs() {
  const el = document.getElementById('acts-list');
  el.innerHTML = '<p class="loading">Loading legislative acts...</p>';
  try {
    const acts = await (await fetch('/api/acts')).json();
    el.innerHTML = acts.map(a => `<div class="act-card"><div class="act-card-header"><span class="badge ${a.status === 'Active' ? 'badge-active' : 'badge-repealed'}">${escapeHtml(a.status)}</span><span class="enact-year">Enacted ${a.enactment_year}</span></div><h3 class="act-title"><a href="#/acts/${a.id}">${escapeHtml(a.title)}</a></h3><p class="act-short">${escapeHtml(a.short_title)} &bull; ${escapeHtml(a.act_number || '')}</p><p class="act-desc">${escapeHtml(a.description || 'Statutory legal enactment.')}</p><div class="act-footer"><a href="#/acts/${a.id}" class="btn btn-sm btn-outline">Browse Sections (${a.section_count}) &rarr;</a></div></div>`).join('');
  } catch { el.innerHTML = '<p class="error-msg">Failed to load acts.</p>'; }
}

async function loadActDetail(id) {
  const head = document.getElementById('act-detail-header');
  head.innerHTML = '<p class="loading">Loading act details...</p>';
  try {
    const { act, sections } = await (await fetch(`/api/acts/${id}`)).json();
    curSecs = sections;
    head.innerHTML = `<div class="header-badges"><span class="badge ${act.status === 'Active' ? 'badge-active' : 'badge-repealed'}">${escapeHtml(act.status)}</span><span class="enact-year">Enacted ${act.enactment_year}</span></div><h1>${escapeHtml(act.title)}</h1><p class="act-meta"><strong>Short Title:</strong> ${escapeHtml(act.short_title)} &bull; <strong>Act Number:</strong> ${escapeHtml(act.act_number || 'N/A')}</p><p class="act-full-desc">${escapeHtml(act.description || '')}</p><div class="act-summary-bar"><strong>Provisions:</strong> ${sections.length} statutory sections recorded</div>`;
    renderActSections(sections);
  } catch { head.innerHTML = '<p class="error-msg">Failed to load act details.</p>'; }
}

function renderActSections(secs) {
  const el = document.getElementById('act-sections-list');
  el.innerHTML = !secs.length ? '<p class="empty-msg">No sections found.</p>' : `
    <table class="sections-table"><thead><tr><th style="width:110px;">Section</th><th>Title &amp; Subject Matter</th><th style="width:150px;">Nature</th><th style="width:90px;">Action</th></tr></thead><tbody>
      ${secs.map(s => `<tr><td><strong>Sec ${escapeHtml(s.section_number)}</strong></td><td><a href="#/sections/${s.id}" class="sec-link">${escapeHtml(s.section_title)}</a></td><td><span class="badge-tag">${escapeHtml(s.legal_nature || 'Statutory')}</span></td><td><a href="#/sections/${s.id}" class="btn btn-sm btn-table">View</a></td></tr>`).join('')}
    </tbody></table>`;
}

async function loadSectionDetail(id) {
  const el = document.getElementById('section-detail-content');
  document.getElementById('section-back-btn').onclick = () => (lastActId ? (location.hash = `#/acts/${lastActId}`) : history.back());
  el.innerHTML = '<p class="loading">Loading section text...</p>';
  try {
    const { section: s, mappings, judgments } = await (await fetch(`/api/sections/${id}`)).json();
    lastActId = s.act_id;
    const rels = [...(mappings.outgoing || []), ...(mappings.incoming || [])];
    const mapHtml = rels.length ? `<div class="detail-section"><h2>Statutory Transition &amp; Equivalence Mapping</h2><div class="transition-box">${rels.map(r => `<div class="transition-row"><span class="badge badge-relation">${escapeHtml(r.relation_type)}</span><span class="transition-desc">Mapped to <strong>${escapeHtml(r.related_act)} Sec ${escapeHtml(r.related_sec_num)}</strong> (<a href="#/sections/${r.related_sec_id}">${escapeHtml(r.related_sec_title)}</a>)</span>${r.notes ? `<p class="transition-notes"><strong>Note:</strong> ${escapeHtml(r.notes)}</p>` : ''}</div>`).join('')}</div></div>` : '';
    const judgHtml = judgments?.length ? `<div class="detail-section"><h2>Verified Judicial Interpretations (${judgments.length})</h2><ul class="section-link-list">${judgments.map(j => `<li><a href="#/judgment/${j.id}"><strong>${escapeHtml(j.case_name)}</strong> (${escapeHtml(j.citation || 'Verified')})</a><span class="relevance-tag">${escapeHtml(j.relevance_nature)}</span></li>`).join('')}</ul></div>` : '';
    el.innerHTML = `<div class="detail-header"><p class="section-act-breadcrumb"><a href="#/acts/${s.act_id}">${escapeHtml(s.act_title)}</a> &bull; Chapter Provision</p><h1 class="detail-title">Section ${escapeHtml(s.section_number)}: ${escapeHtml(s.section_title)}</h1><div class="section-meta-tags"><span class="badge-tag">Nature: ${escapeHtml(s.legal_nature || 'General')}</span><span class="badge ${s.status === 'Active' ? 'badge-active' : 'badge-repealed'}">${escapeHtml(s.status)}</span></div></div>
      <div class="detail-section"><h2>Official Statutory Text</h2><div class="statutory-text-box">${escapeHtml(s.section_text || 'Official statutory text not recorded.')}</div></div>${mapHtml}${judgHtml}`;
  } catch { el.innerHTML = '<p class="error-msg">Section not found.</p>'; }
}

async function loadMappings() {
  const el = document.getElementById('mappings-list');
  el.innerHTML = '<p class="loading">Loading legislative concordance matrix...</p>';
  try { curMaps = await (await fetch('/api/mappings')).json(); renderMappings(curMaps); } catch { el.innerHTML = '<p class="error-msg">Failed to load mappings.</p>'; }
}

function renderMappings(list) {
  const el = document.getElementById('mappings-list');
  el.innerHTML = !list.length ? '<p class="empty-msg">No mappings match the filter.</p>' : `
    <div class="mapping-table-wrap"><table class="sections-table mapping-table"><thead><tr><th>Prior Law (IPC / CrPC / IEA)</th><th style="width:150px;text-align:center;">Relation</th><th>New Sanhita (BNS / BNSS / BSA)</th><th>Legislative Notes</th></tr></thead><tbody>
      ${list.map(m => `<tr><td><span class="act-pill">${escapeHtml(m.from_act)}</span><br><a href="#/sections/${m.from_sec_id}"><strong>Sec ${escapeHtml(m.from_sec)}</strong>: ${escapeHtml(m.from_title)}</a></td><td style="text-align:center;"><span class="badge badge-relation">${escapeHtml(m.relation_type)}</span></td><td><span class="act-pill new-act">${escapeHtml(m.to_act)}</span><br><a href="#/sections/${m.to_sec_id}"><strong>Sec ${escapeHtml(m.to_sec)}</strong>: ${escapeHtml(m.to_title)}</a></td><td class="notes-cell">${escapeHtml(m.notes || '—')}</td></tr>`).join('')}
    </tbody></table></div>`;
}

function escapeHtml(s) {
  return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  loadFilterOptions();
  document.getElementById('repo-search-form')?.addEventListener('submit', e => { e.preventDefault(); loadRepoJudgments(1); });
  document.getElementById('repo-search-reset')?.addEventListener('click', () => {
    ['repo-search-query', 'repo-filter-court', 'repo-filter-year'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const s = document.getElementById('repo-filter-sort'); if (s) s.value = 'date_desc';
    loadRepoJudgments(1);
  });
  ['repo-filter-court', 'repo-filter-year', 'repo-filter-sort'].forEach(id => document.getElementById(id)?.addEventListener('change', () => loadRepoJudgments(1)));
  document.getElementById('section-search-input')?.addEventListener('input', e => {
    const v = e.target.value.toLowerCase().trim();
    renderActSections(!v ? curSecs : curSecs.filter(s => s.section_number.toLowerCase().includes(v) || (s.section_title && s.section_title.toLowerCase().includes(v))));
  });
  const filterMaps = () => {
    const q = document.getElementById('mapping-search-input')?.value.toLowerCase().trim() || '', type = document.getElementById('mapping-type-filter')?.value || '';
    renderMappings(curMaps.filter(m => (!type || m.relation_type === type) && (!q || m.from_sec.toLowerCase().includes(q) || m.to_sec.toLowerCase().includes(q) || m.from_title.toLowerCase().includes(q) || m.to_title.toLowerCase().includes(q) || (m.notes && m.notes.toLowerCase().includes(q)))));
  };
  document.getElementById('mapping-search-input')?.addEventListener('input', filterMaps);
  document.getElementById('mapping-type-filter')?.addEventListener('change', filterMaps);
  window.addEventListener('hashchange', router);
  router();
});
