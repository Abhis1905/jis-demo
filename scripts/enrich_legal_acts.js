require('dotenv').config();
// JIS Phase 2A/B — Enrich Legal Acts (20-Point Legislative Reference Data)
// Database: jis_dev_db (Localhost Development)

const mysql = require('mysql2/promise');

const actsData = [
  {
    id: 11,
    legislative_authority: 'Imperial Legislative Council of British India (First Law Commission under Lord Macaulay)',
    jurisdiction_scope: 'Pan-India (Extended to Jammu & Kashmir via J&K Reorganisation Act, 2019; extraterritorial under Sections 3 and 4)',
    assent_date: '1860-10-06',
    commencement_date: '1862-01-01',
    commencement_notification: 'Gazette of India, 1860; operation deferred to 1 January 1862',
    legal_objective: 'Provide a general substantive penal code for India, defining criminal offences and prescribing proportionate punishments.',
    repeal_replacement_history: 'Repealed and replaced by the Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023) w.e.f. 1 July 2024.',
    amendment_milestones: 'Cruelty Sec 498A added (1983); Dowry death Sec 304B added (1986); Criminal Law (Amendment) Act 2013 (Verma Committee, Sec 354A-D, 376A-E); Criminal Law (Amendment) Act 2018 (child rape penalties).',
    subordinate_rules: 'Procedural application governed by CrPC, 1973 (now BNSS, 2023) and State Police Regulations.',
    transitional_provisions: 'Section 358(2) BNS guarantees that offences committed prior to 1 July 2024 shall be investigated, inquired, tried, and punished under the IPC.',
    related_acts: 'Code of Criminal Procedure, 1973; Indian Evidence Act, 1872; Bharatiya Nyaya Sanhita, 2023; POCSO Act, 2012; NDPS Act, 1985.',
    key_provisions: 'General Exceptions (76-106); Offences against State (121-130); Offences affecting human life and body (299-377); Offences against property (378-424); Offences relating to marriage (493-498A).',
    known_limitations: 'Historical code superseded for offences committed on or after 1 July 2024; retained exclusively for legacy and pending trials.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 12,
    legislative_authority: 'Parliament of India (41st Law Commission Report)',
    jurisdiction_scope: 'Whole of India (Limited application of Chapters VIII, X, XI in Nagaland and tribal areas per Section 1 proviso)',
    assent_date: '1974-01-25',
    commencement_date: '1974-04-01',
    commencement_notification: 'The Gazette of India Extraordinary, Part II, Section 1',
    legal_objective: 'Consolidate and amend the law relating to criminal procedure, separating judiciary from executive (Article 50) and ensuring fair trial under Article 21.',
    repeal_replacement_history: 'Repealed and replaced by the Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023) w.e.f. 1 July 2024.',
    amendment_milestones: 'Plea Bargaining Chapter XXIA added (2005); Sec 41A-D arrest safeguards & Sec 50A notification added (2008); Victim compensation Sec 357A added (2008); Expedited trial rules (2013, 2018).',
    subordinate_rules: 'High Court Criminal Rules of Practice, State Police Regulations, Jail Manuals.',
    transitional_provisions: 'Section 531(2) BNSS provides that pending appeals, applications, trials, inquiries, or investigations pending as on 1 July 2024 shall continue under the 1973 Code.',
    related_acts: 'Indian Penal Code, 1860; Indian Evidence Act, 1872; Bharatiya Nagarik Suraksha Sanhita, 2023; Special penal statutes.',
    key_provisions: 'Arrest safeguards (41, 41A, 41B, 50A); FIR and investigation (154, 156, 173); Remand & default bail (167); Bail & bonds (436, 437, 438, 439); Inherent powers (482).',
    known_limitations: 'Superseded by BNSS for fresh proceedings registered on or after 1 July 2024; governs all pre-July 2024 proceedings.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 13,
    legislative_authority: 'Imperial Legislative Council of British India (Drafted by Sir James Fitzjames Stephen)',
    jurisdiction_scope: 'All judicial proceedings in or before any Court throughout India, including Courts-martial (excluding affidavits and arbitrations)',
    assent_date: '1872-03-15',
    commencement_date: '1872-09-01',
    commencement_notification: 'Gazette of India, March 1872',
    legal_objective: 'Consolidate, define and amend the law of Evidence in civil and criminal proceedings, governing relevancy of facts, modes of proof, and burdens of proof.',
    repeal_replacement_history: 'Repealed and replaced by the Bharatiya Sakshya Adhiniyam, 2023 (Act No. 47 of 2023) w.e.f. 1 July 2024.',
    amendment_milestones: 'Information Technology Act, 2000 (electronic evidence Sections 65A, 65B, 85A-C); Section 155(4) omitted (2002); Rape consent presumption Section 114A added (2013).',
    subordinate_rules: 'High Court Rules of Practice, Digital Forensic Manuals.',
    transitional_provisions: 'Section 170(2) BSA provides that proceedings where evidence was tendered or recorded under prior law proceed under the 1872 Act.',
    related_acts: 'Code of Civil Procedure, 1908; Code of Criminal Procedure, 1973; Bharatiya Sakshya Adhiniyam, 2023; Information Technology Act, 2000.',
    key_provisions: 'Relevancy of facts (5-55); Admissions & confessions (17-31); Dying declaration (32(1)); Electronic evidence certificate (65B); Burden of proof (101-114A); Estoppel (115).',
    known_limitations: 'Superseded by BSA, 2023 for fresh evidentiary tenders post-1 July 2024.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 14,
    legislative_authority: 'Parliament of India (Ministry of Home Affairs)',
    jurisdiction_scope: 'Whole of India; extraterritorial jurisdiction over Indian citizens and cyber offences targeting Indian computers',
    assent_date: '2023-12-25',
    commencement_date: '2024-07-01',
    commencement_notification: 'MHA Notification S.O. 850(E) dated 23 February 2024 (Section 106(2) held in abeyance)',
    legal_objective: 'Modernise and decolonise substantive penal law, consolidate offences into 358 sections, introduce community service, penalise mob lynching, and protect state integrity.',
    repeal_replacement_history: 'Consolidates and replaces the Indian Penal Code, 1860 w.e.f. 1 July 2024 (Section 358 BNS).',
    amendment_milestones: 'Enacted December 2023; operationalised 1 July 2024; Section 106(2) hit-and-run held in abeyance pending consultations.',
    subordinate_rules: 'Community Service Guidelines, State Government rules.',
    transitional_provisions: 'Section 358(2) guarantees that pre-1 July 2024 offences continue to be governed by IPC, 1860.',
    related_acts: 'Bharatiya Nagarik Suraksha Sanhita, 2023; Bharatiya Sakshya Adhiniyam, 2023; POCSO Act; NDPS Act.',
    key_provisions: 'Community service (Sec 4); Offences against women & children (Sec 63-99); Murder & Mob lynching (Sec 101, 103); Acts endangering sovereignty & unity (Sec 152); Organised crime & terrorism (Sec 111, 112); Property offences (Sec 303-318).',
    known_limitations: 'Section 106(2) deferred; awaiting commencement notification.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 15,
    legislative_authority: 'Parliament of India (Ministry of Home Affairs)',
    jurisdiction_scope: 'Whole of India; limited application in Nagaland and tribal areas per Section 1(2) proviso',
    assent_date: '2023-12-25',
    commencement_date: '2024-07-01',
    commencement_notification: 'MHA Notification S.O. 851(E) dated 23 February 2024',
    legal_objective: 'Modernise criminal procedure through mandatory audio-video electronic recording, institutionalise Zero FIR and e-FIR, streamline bail procedures, and introduce time-bound investigation and trial milestones.',
    repeal_replacement_history: 'Repealed and replaced the Code of Criminal Procedure, 1973 w.e.f. 1 July 2024 (Section 531 BNSS).',
    amendment_milestones: 'Enacted December 2023; operationalised 1 July 2024.',
    subordinate_rules: 'BNSS Audio-Video Electronic Means Rules, State Police SOPs on Zero FIR and e-FIR.',
    transitional_provisions: 'Section 531(2) provides that appeals, applications, trials, inquiries, or investigations pending as on 1 July 2024 shall be disposed of under the 1973 Code.',
    related_acts: 'Bharatiya Nyaya Sanhita, 2023; Bharatiya Sakshya Adhiniyam, 2023; Special penal enactments.',
    key_provisions: 'Arrest safeguards & notice of appearance (35, 37); Audio-video recording of search & seizure (105); Zero FIR and Electronic FIR (173); Preliminary enquiry (173(3)); Police custody in tranches (187); Bail provisions (479, 480, 482, 483); Inherent powers (528).',
    known_limitations: 'Digital forensic infrastructure rollout is phased across Indian states.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 16,
    legislative_authority: 'Parliament of India (Ministry of Home Affairs)',
    jurisdiction_scope: 'All judicial proceedings in or before any Court throughout India, including Courts-martial (excluding affidavits and arbitrations)',
    assent_date: '2023-12-25',
    commencement_date: '2024-07-01',
    commencement_notification: 'MHA Notification S.O. 852(E) dated 23 February 2024',
    legal_objective: 'Modernise the law of evidence by granting primary evidentiary parity to electronic and digital records, standardising certificate submissions, and consolidating evidentiary rules into 170 sections.',
    repeal_replacement_history: 'Repealed and replaced the Indian Evidence Act, 1872 w.e.f. 1 July 2024 (Section 170 BSA).',
    amendment_milestones: 'Enacted December 2023; operationalised 1 July 2024.',
    subordinate_rules: 'Standardized Schedule Certificate for Electronic Records, Digital Forensics Examiner certification guidelines.',
    transitional_provisions: 'Section 170(2) preserves the application of prior law to pending proceedings where evidence was recorded or tendered prior to 1 July 2024.',
    related_acts: 'Code of Civil Procedure, 1908; Bharatiya Nagarik Suraksha Sanhita, 2023; Information Technology Act, 2000.',
    key_provisions: 'Relevancy of statements (14-22); Confessions and discovery of fact (23); Dying declarations (26); Electronic records definitions & admissibility (57, 61, 63); Standard Certificate Schedule; Presumptions as to electronic records (86-88); Burden of proof (104-120).',
    known_limitations: 'State forensic custody logs subject to ongoing administrative standardization.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 17,
    legislative_authority: 'Constituent Assembly of India (We, The People of India)',
    jurisdiction_scope: 'Entire territory of India; supreme organic lex suprema of the Republic',
    assent_date: '1949-11-26',
    commencement_date: '1950-01-26',
    commencement_notification: 'Articles 5-9, 60, 324, 366-367, 379-380, 388, 391-393 came into force 26 Nov 1949; remainder on 26 Jan 1950 (Republic Day)',
    legal_objective: 'Establish a Sovereign Socialist Secular Democratic Republic, secure Justice, Liberty, Equality, and promote Fraternity; establish constitutional institutions and federal governance.',
    repeal_replacement_history: 'Repealed the Indian Independence Act, 1947 and Government of India Act, 1935 (Article 395).',
    amendment_milestones: '1st Amendment 1951 (Art 19(2), 9th Sched); 42nd Amendment 1976 (Socialist, Secular added); 44th Amendment 1978 (property right modified, emergency safeguards); 86th Amendment 2002 (Art 21A); 101st Amendment 2016 (GST); 103rd Amendment 2019 (EWS); 106th Amendment 2023 (Women reservation).',
    subordinate_rules: 'Supreme Court Rules, 2013; High Court Constitutional Writ Rules.',
    transitional_provisions: 'Articles 372-392 provided for continuance of existing laws and temporary governance provisions.',
    related_acts: 'All laws enacted by Parliament and State Legislatures derive validity from the Constitution of India.',
    key_provisions: 'Preamble; Fundamental Rights (Part III, Art 12-35); Directive Principles (Part IV); Supreme Court jurisdiction (Art 124-147); High Courts jurisdiction (Art 214-231); Amendment of Constitution (Art 368).',
    known_limitations: 'Constitutional amendments subject to judicial review under the Basic Structure Doctrine.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 18,
    legislative_authority: 'Imperial Legislative Council of British India',
    jurisdiction_scope: 'Whole of India (Extended to Jammu & Kashmir in 2019; excludes Nagaland and tribal areas per Section 1(3) proviso)',
    assent_date: '1908-03-21',
    commencement_date: '1909-01-01',
    commencement_notification: 'Gazette of India, March 1908',
    legal_objective: 'Consolidate and amend the laws relating to the procedure of the Courts of Civil Judicature in India.',
    repeal_replacement_history: 'Consolidated prior Codes of 1859, 1877, and 1882.',
    amendment_milestones: 'CPC (Amendment) Act 1976 (Section 100 substantial questions of law, Section 80(2) urgent relief); CPC (Amendment) Acts 1999 & 2002 (written statement timelines, Section 89 ADR, Section 115 revision restrictions).',
    subordinate_rules: 'High Court Civil Rules of Practice, First Schedule Orders I to LI (amendable by High Courts per Sections 122-128).',
    transitional_provisions: 'Sections 157 and 158 provided transition from the 1882 Code.',
    related_acts: 'Commercial Courts Act, 2015; Family Courts Act, 1984; Arbitration and Conciliation Act, 1996; Specific Relief Act, 1963.',
    key_provisions: 'Plenary jurisdiction (Sec 9); Res Sub-Judice & Res Judicata (Sec 10, 11); Government suits notice (Sec 80); ADR mechanism (Sec 89); Appeals (Sec 96, 100); Review & Revision (Sec 114, 115); Inherent powers (Sec 151).',
    known_limitations: 'State High Courts have enacted distinct local amendments to procedural Orders in the First Schedule.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 19,
    legislative_authority: 'Parliament of India (Ministry of Law and Justice)',
    jurisdiction_scope: 'Whole of India',
    assent_date: '2015-12-31',
    commencement_date: '2015-10-23',
    commencement_notification: 'Gazette of India Extraordinary, Part II, Section 1, No. 4 (Retrospective operation from Ordinance date)',
    legal_objective: 'Provide for the constitution of Commercial Courts, Commercial Appellate Courts, Commercial Division and Commercial Appellate Division in High Courts for adjudicating commercial disputes of specified value and ensuring speedy resolution.',
    repeal_replacement_history: 'Replaced Commercial Courts, Commercial Division and Commercial Appellate Division of High Courts Ordinance, 2015.',
    amendment_milestones: 'Commercial Courts (Amendment) Act, 2018 (reduced specified value threshold from ₹1 Crore to ₹3 Lakhs; introduced Section 12A mandatory pre-institution mediation).',
    subordinate_rules: 'Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018; Commercial Court Practice Directions.',
    transitional_provisions: 'Section 15 provided for transfer of pending commercial suits exceeding specified value from civil courts to newly constituted commercial courts.',
    related_acts: 'Code of Civil Procedure, 1908; Arbitration and Conciliation Act, 1996; Legal Services Authorities Act, 1987.',
    key_provisions: 'Definition of commercial dispute (Sec 2(1)(c)); Specified value (Sec 12); Mandatory pre-institution mediation (Sec 12A); Strict procedural timelines amending CPC (Schedule); Appeals (Sec 13); Bar of revision (Sec 8).',
    known_limitations: 'Pre-institution mediation rules operationalized through state legal services authorities.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  },
  {
    id: 20,
    legislative_authority: 'Parliament of India (Ministry of Law and Justice)',
    jurisdiction_scope: 'Whole of India; applies to areas notified by State Governments in consultation with High Courts',
    assent_date: '1984-09-14',
    commencement_date: '1984-09-14',
    commencement_notification: 'Enabling Act; operative dates phased by State Government gazette notifications per Section 1(3)',
    legal_objective: 'Promote conciliation in, and secure speedy settlement of, disputes relating to marriage and family affairs and for matters connected therewith.',
    repeal_replacement_history: 'Special legislation prevailing over general jurisdiction of civil and criminal courts in notified areas.',
    amendment_milestones: 'Family Courts (Amendment) Act, 1991 (appeal procedures); Family Courts (Amendment) Act, 2022 (validated establishment of family courts in Himachal Pradesh and Nagaland).',
    subordinate_rules: 'Family Courts (High Court) Rules; Family Courts (State) Rules; Marriage Counsellors Regulations.',
    transitional_provisions: 'Section 8(c) mandated transfer of pending matrimonial suits and maintenance proceedings from civil courts and magistrates to Family Courts upon establishment.',
    related_acts: 'Hindu Marriage Act, 1955; Special Marriage Act, 1954; Code of Civil Procedure, 1908; Code of Criminal Procedure, 1973 (Chapter IX).',
    key_provisions: 'Establishment of Family Courts (Sec 3); Exclusive jurisdiction over marriage, property, custody, maintenance (Sec 7); Exclusion of civil courts jurisdiction (Sec 8); Mandatory duty to promote settlement (Sec 9); Simplified procedure (Sec 10, 14); Appeals to High Court division bench (Sec 19).',
    known_limitations: 'Operational coverage dependent on State Government notifications; not yet established in all tier-3 talukas.',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-10-09'
  }
];

async function updateActs() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3307, user: 'root', password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (() => { throw new Error('DB_PASSWORD environment variable is required'); })(), database: 'jis_dev_db'
  });

  console.log('Enriching 10 Acts in legal_acts with comprehensive 20-point metadata...');
  await conn.beginTransaction();

  try {
    for (const a of actsData) {
      await conn.execute(`
        UPDATE legal_acts
        SET legislative_authority = ?,
            jurisdiction_scope = ?,
            assent_date = ?,
            commencement_date = ?,
            commencement_notification = ?,
            legal_objective = ?,
            repeal_replacement_history = ?,
            amendment_milestones = ?,
            subordinate_rules = ?,
            transitional_provisions = ?,
            related_acts = ?,
            key_provisions = ?,
            known_limitations = ?,
            verification_status = ?,
            last_verified_at = ?
        WHERE id = ?
      `, [
        a.legislative_authority,
        a.jurisdiction_scope,
        a.assent_date,
        a.commencement_date,
        a.commencement_notification,
        a.legal_objective,
        a.repeal_replacement_history,
        a.amendment_milestones,
        a.subordinate_rules,
        a.transitional_provisions,
        a.related_acts,
        a.key_provisions,
        a.known_limitations,
        a.verification_status,
        a.last_verified_at,
        a.id
      ]);
    }

    await conn.commit();
    console.log('Successfully updated all 10 Acts in legal_acts!');
  } catch (err) {
    await conn.rollback();
    console.error('Failed to update acts:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

updateActs().catch(console.error);
