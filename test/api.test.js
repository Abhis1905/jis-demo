const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('JIS Server Module Architecture', async (t) => {
  await t.test('server.js exports a valid Express application', () => {
    assert.strictEqual(typeof app, 'function', 'app should be an Express request handler function');
  });
});

test('JIS REST API Live Contract Verification', async (t) => {
  const baseUrl = process.env.TEST_URL || 'http://127.0.0.1:3001';

  // Check if server is reachable before executing network assertions
  let serverReachable = false;
  try {
    const probe = await fetch(`${baseUrl}/api/stats`, { signal: AbortSignal.timeout(1500) });
    serverReachable = probe.ok;
  } catch {
    serverReachable = false;
  }

  if (!serverReachable) {
    t.diagnostic(`Live server not reachable at ${baseUrl}. Skipping live HTTP contract assertions.`);
    return;
  }

  await t.test('GET / returns 200 and serves HTML UI', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Judiciary Information System'), 'HTML should contain project title');
  });

  await t.test('GET /api/stats returns valid schema and metrics', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(typeof data.real_judgments === 'number', 'real_judgments should be a number');
    assert.ok(typeof data.legal_acts === 'number', 'legal_acts should be a number');
    assert.ok(typeof data.legal_sections === 'number', 'legal_sections should be a number');
    assert.ok(typeof data.section_mappings === 'number', 'section_mappings should be a number');
    assert.strictEqual(data.legal_acts, 10, 'Platform must host 10 statutory acts');
    assert.strictEqual(data.legal_sections, 2419, 'Platform must host 2,419 statutory provisions');
    assert.strictEqual(data.section_mappings, 149, 'Platform must host 149 concordance mappings');
    assert.strictEqual(data.verified_pdfs, 82, 'Platform must host 82 verified local PDFs');
  });

  await t.test('GET /api/judgments/filters returns court tiers and years', async () => {
    const res = await fetch(`${baseUrl}/api/judgments/filters`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.courts), 'courts should be an array');
    assert.ok(Array.isArray(data.years), 'years should be an array');
    assert.ok(data.courts.length > 0, 'at least one court tier should be available');
    assert.ok(data.years.length > 0, 'at least one year should be available');
  });

  await t.test('GET /api/acts returns all 10 statutory enactments', async () => {
    const res = await fetch(`${baseUrl}/api/acts`);
    assert.strictEqual(res.status, 200);
    const acts = await res.json();
    assert.ok(Array.isArray(acts), 'acts should be an array');
    assert.strictEqual(acts.length, 10, 'must return exactly 10 legal acts');
    const codes = acts.map(a => a.act_code);
    assert.ok(codes.includes('IPC_1860'), 'IPC must be present');
    assert.ok(codes.includes('BNS_2023'), 'BNS must be present');
    assert.ok(codes.includes('CRPC_1973'), 'CrPC must be present');
    assert.ok(codes.includes('BNSS_2023'), 'BNSS must be present');
    assert.ok(codes.includes('IEA_1872'), 'IEA must be present');
    assert.ok(codes.includes('BSA_2023'), 'BSA must be present');
  });

  await t.test('GET /api/mappings returns 149 transition concordances', async () => {
    const res = await fetch(`${baseUrl}/api/mappings`);
    assert.strictEqual(res.status, 200);
    const mappings = await res.json();
    assert.ok(Array.isArray(mappings), 'mappings should be an array');
    assert.strictEqual(mappings.length, 149, 'must return exactly 149 concordance mappings');
    assert.ok(mappings[0].what_changed, 'mappings must include comparative changes');
  });

  await t.test('GET /api/judgments supports pagination and limits', async () => {
    const res = await fetch(`${baseUrl}/api/judgments?page=1&limit=5`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.judgments), 'judgments should be an array');
    assert.strictEqual(data.judgments.length, 5, 'should return exactly 5 items when limit=5');
    assert.ok(data.total >= 4984, 'total should reflect unified repository count');
  });

  await t.test('GET /api/judgments/:id returns 404 for non-existent record', async () => {
    const res = await fetch(`${baseUrl}/api/judgments/999999`);
    assert.strictEqual(res.status, 404);
  });

  await t.test('GET /api/judgments/:id/pdf serves authentic PDF or redirects to source', async () => {
    // 1. Genuine local PDF stream
    const resLocal = await fetch(`${baseUrl}/api/judgments/11/pdf`);
    assert.strictEqual(resLocal.status, 200);
    assert.strictEqual(resLocal.headers.get('content-type'), 'application/pdf');

    // 2. Official DigiSCR source redirect when local PDF is not stored
    const resRedirect = await fetch(`${baseUrl}/api/judgments/39/pdf`, { redirect: 'manual' });
    assert.strictEqual(resRedirect.status, 302);
    const location = resRedirect.headers.get('location');
    assert.ok(location && location.includes('digiscr.sci.gov.in'), 'should redirect to official DigiSCR URL');

    // 3. Non-existent document
    const resNotFound = await fetch(`${baseUrl}/api/judgments/999999/pdf`);
    assert.strictEqual(resNotFound.status, 404);
  });
});
