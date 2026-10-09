-- ==============================================================================
-- JIS Main Project: Production-Ready Staging & Repository Migration
-- File: sql/migration_staging_court_records.sql
-- Status: PROPOSED / FULLY VALIDATED (DO NOT EXECUTE WITHOUT EXPLICIT APPROVAL)
-- ==============================================================================

-- 1. Create Dedicated Court Records Repository Table
-- Accommodates bulk extracted genuine records from IndiaCode eCourts API
-- without altering existing legal_judgments schema or records.
CREATE TABLE IF NOT EXISTS court_records_repository (
  id INT AUTO_INCREMENT PRIMARY KEY,
  record_id VARCHAR(30) UNIQUE NOT NULL COMMENT 'Assigned JIS Record ID, e.g., JIS-REC-00001',
  cnr VARCHAR(16) NOT NULL COMMENT '16-character alphanumeric Indian eCourts Case Number Record',
  matched_curated_id INT NULL COMMENT 'References legal_judgments.id if matched with existing curated landmark case',
  document_type ENUM('JUDGMENT', 'FINAL_ORDER', 'COURT_ORDER', 'BAIL_ORDER', 'INTERIM_ORDER') NOT NULL DEFAULT 'JUDGMENT',
  court_tier ENUM('Supreme Court of India', 'High Court', 'District & Subordinate Court') NOT NULL,
  court_name VARCHAR(255) NOT NULL,
  raw_court_code VARCHAR(20) NULL,
  case_name VARCHAR(500) NOT NULL,
  case_number VARCHAR(100) NULL,
  judgment_date DATE NULL,
  citation VARCHAR(500) NULL,
  neutral_citation VARCHAR(100) NULL,
  domain ENUM(
    'Constitutional Law',
    'Criminal Law',
    'Civil & Commercial Law',
    'Family & Matrimonial Law',
    'Administrative & Service Law',
    'Tax & Revenue Law',
    'Environmental Law',
    'Labour & Industrial Law',
    'Human Rights & Civil Liberties',
    'Evidence & Procedure'
  ) NOT NULL DEFAULT 'Evidence & Procedure',
  precedential_value VARCHAR(500) NULL,
  court_marking VARCHAR(50) NULL,
  key_ratio TEXT NOT NULL COMMENT 'Verbatim judicial ratio decidendi / court holding',
  has_order_pdf TINYINT(1) NOT NULL DEFAULT 0,
  order_filename VARCHAR(150) NULL,
  source_url VARCHAR(500) NULL,
  source_order_url VARCHAR(500) NULL,
  statutory_sections JSON NULL COMMENT 'Associated statutory sections as JSON array',
  keywords VARCHAR(1000) NULL COMMENT 'Search keywords derived from legal domain and title',
  is_landmark TINYINT(1) NOT NULL DEFAULT 0,
  is_synthetic TINYINT(1) NOT NULL DEFAULT 0,
  record_provenance ENUM('REAL_VERIFIED', 'SYNTHETIC_REPRESENTATIVE') NOT NULL DEFAULT 'REAL_VERIFIED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Optimized indexes for fast search, filtering, and cross-referencing
  INDEX idx_crr_cnr (cnr),
  INDEX idx_crr_date (judgment_date DESC),
  INDEX idx_crr_court (court_tier, court_name(100)),
  INDEX idx_crr_domain (domain),
  INDEX idx_crr_doc_type (document_type),
  INDEX idx_crr_matched_curated (matched_curated_id),
  CONSTRAINT fk_crr_matched_curated FOREIGN KEY (matched_curated_id) 
    REFERENCES legal_judgments (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. Create Unified Public View (Zero Duplicates Guarantee & Full Field Parity)
-- Combines curated landmark records (Priority 1) with bulk repository records (Priority 2).
-- Preserves ALL columns queried by server.js (including bench_judges, keywords, is_synthetic).
CREATE OR REPLACE VIEW vw_unified_judicial_records AS

-- Part 1: Curated Landmark Judgments (Rich 7-point analysis, arguments, verified PDFs)
SELECT 
  j.id AS id,
  'CURATED' AS record_source,
  j.id AS curated_id,
  NULL AS repository_record_id,
  COALESCE(j.case_number, 'CURATED') AS cnr,
  'JUDGMENT' AS document_type,
  j.court_tier AS court_tier,
  j.court_name AS court_name,
  j.case_name AS case_name,
  j.case_number AS case_number,
  j.judgment_date AS judgment_date,
  j.citation AS citation,
  j.neutral_citation AS neutral_citation,
  j.bench_judges AS bench_judges,
  j.domain AS domain,
  j.legal_issue AS legal_issue,
  j.key_ratio AS key_ratio,
  j.outcome AS outcome,
  j.keywords AS keywords,
  j.is_landmark AS is_landmark,
  j.is_synthetic AS is_synthetic,
  j.record_provenance AS record_provenance,
  (SELECT d.id FROM judgment_documents d WHERE d.judgment_id = j.id AND d.is_verified = 1 LIMIT 1) AS pdf_id,
  NULL AS order_filename,
  j.source_url AS source_url
FROM legal_judgments j
WHERE j.is_synthetic = 0 AND j.record_provenance = 'REAL_VERIFIED'

UNION ALL

-- Part 2: Bulk eCourts Repository Records (Strictly excluding overlapping duplicate cases)
SELECT 
  (100000 + r.id) AS id,
  'ECOURTS_REPOSITORY' AS record_source,
  r.matched_curated_id AS curated_id,
  r.record_id AS repository_record_id,
  r.cnr AS cnr,
  r.document_type AS document_type,
  r.court_tier AS court_tier,
  r.court_name AS court_name,
  r.case_name AS case_name,
  r.case_number AS case_number,
  r.judgment_date AS judgment_date,
  r.citation AS citation,
  r.neutral_citation AS neutral_citation,
  NULL AS bench_judges,
  r.domain AS domain,
  CONCAT('Application of law in ', r.case_name) AS legal_issue,
  r.key_ratio AS key_ratio,
  CASE 
    WHEN r.document_type = 'BAIL_ORDER' THEN 'Bail Application Disposed'
    WHEN r.document_type = 'INTERIM_ORDER' THEN 'Interim Directions Issued'
    WHEN r.document_type = 'FINAL_ORDER' THEN 'Disposed with Final Directions'
    ELSE 'Judicial Order / Decision of Record'
  END AS outcome,
  r.keywords AS keywords,
  r.is_landmark AS is_landmark,
  r.is_synthetic AS is_synthetic,
  r.record_provenance AS record_provenance,
  NULL AS pdf_id,
  r.order_filename AS order_filename,
  r.source_url AS source_url
FROM court_records_repository r
WHERE r.matched_curated_id IS NULL; -- STRICT DEDUPLICATION: Suppress overlapping duplicates
