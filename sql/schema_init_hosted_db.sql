-- ==============================================================================
-- JIS Hosted Database Initial Schema
-- Complete DDL for clean provisioning on Render Private MySQL (Target: jis_test_db)
-- Self-contained topological order: 12 base tables + 1 unified view
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. states_uts (No dependencies)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `states_uts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('State','Union Territory') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'State',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. high_courts (No dependencies)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `high_courts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `established_year` int DEFAULT NULL,
  `principal_seat_city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. high_court_benches (FK -> high_courts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `high_court_benches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `high_court_id` int NOT NULL,
  `bench_name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bench_type` enum('Principal Seat','Permanent Bench','Circuit Bench') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Principal Seat',
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_hc_bench` (`high_court_id`,`bench_name`),
  CONSTRAINT `high_court_benches_ibfk_1` FOREIGN KEY (`high_court_id`) REFERENCES `high_courts` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. districts (FK -> states_uts, high_courts, high_court_benches)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `districts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state_ut_id` int NOT NULL,
  `high_court_id` int NOT NULL,
  `bench_id` int NOT NULL,
  `district_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `headquarters` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_state_district` (`state_ut_id`,`district_name`),
  KEY `idx_bench` (`bench_id`),
  KEY `idx_hc` (`high_court_id`),
  CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`state_ut_id`) REFERENCES `states_uts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `districts_ibfk_2` FOREIGN KEY (`high_court_id`) REFERENCES `high_courts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `districts_ibfk_3` FOREIGN KEY (`bench_id`) REFERENCES `high_court_benches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. legal_acts (No dependencies)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `legal_acts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `act_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `act_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enactment_year` int NOT NULL,
  `enforcing_date` date NOT NULL,
  `repeal_date` date DEFAULT NULL,
  `jurisdiction` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'All India',
  `status` enum('Active','Repealed / Historical','Pending Enforcement') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'India Code',
  `source_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Legislative Department, Ministry of Law and Justice',
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `retrieved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `legislative_authority` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jurisdiction_scope` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assent_date` date DEFAULT NULL,
  `commencement_date` date DEFAULT NULL,
  `commencement_notification` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_objective` text COLLATE utf8mb4_unicode_ci,
  `repeal_replacement_history` text COLLATE utf8mb4_unicode_ci,
  `amendment_milestones` text COLLATE utf8mb4_unicode_ci,
  `subordinate_rules` text COLLATE utf8mb4_unicode_ci,
  `transitional_provisions` text COLLATE utf8mb4_unicode_ci,
  `related_acts` text COLLATE utf8mb4_unicode_ci,
  `key_provisions` text COLLATE utf8mb4_unicode_ci,
  `known_limitations` text COLLATE utf8mb4_unicode_ci,
  `verification_status` enum('VERIFIED','PARTIALLY_VERIFIED','UNVERIFIED') COLLATE utf8mb4_unicode_ci DEFAULT 'VERIFIED',
  `last_verified_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `act_code` (`act_code`),
  KEY `idx_act_status` (`status`),
  KEY `idx_act_year` (`enactment_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. legal_chapters (FK -> legal_acts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `legal_chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `act_id` int NOT NULL,
  `chapter_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_order` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_act_chapter` (`act_id`,`chapter_number`),
  KEY `idx_ch_act` (`act_id`),
  CONSTRAINT `legal_chapters_ibfk_1` FOREIGN KEY (`act_id`) REFERENCES `legal_acts` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. legal_sections (FK -> legal_acts, legal_chapters)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `legal_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `act_id` int NOT NULL,
  `chapter_id` int DEFAULT NULL,
  `section_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_order` int NOT NULL,
  `section_text` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `legal_nature` enum('Substantive Offence','Procedure','Evidence / Admissibility','Definition / General Explanation','General Exception','Jurisdiction / Power','Constitutional Right','Miscellaneous') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Substantive Offence',
  `valid_from` date NOT NULL,
  `valid_until` date DEFAULT NULL,
  `status` enum('Active','Repealed / Historical','Amended') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `source_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'India Code',
  `source_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Legislative Department, Ministry of Law and Justice',
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `retrieved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `plain_explanation` mediumtext COLLATE utf8mb4_unicode_ci,
  `essential_ingredients` text COLLATE utf8mb4_unicode_ci,
  `exceptions` text COLLATE utf8mb4_unicode_ci,
  `punishment_or_consequence` text COLLATE utf8mb4_unicode_ci,
  `amendment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commencement_date` date DEFAULT NULL,
  `legal_objective` text COLLATE utf8mb4_unicode_ci,
  `scope_applicability` text COLLATE utf8mb4_unicode_ci,
  `persons_covered` text COLLATE utf8mb4_unicode_ci,
  `procedural_mechanism` text COLLATE utf8mb4_unicode_ci,
  `responsible_authority` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `burden_of_proof` text COLLATE utf8mb4_unicode_ci,
  `related_provisions` text COLLATE utf8mb4_unicode_ci,
  `transitional_notes` text COLLATE utf8mb4_unicode_ci,
  `illustrative_example` text COLLATE utf8mb4_unicode_ci,
  `verification_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'UNVERIFIED',
  `last_verified_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_act_section` (`act_id`,`section_number`),
  KEY `chapter_id` (`chapter_id`),
  KEY `idx_sec_num` (`section_number`),
  KEY `idx_sec_status` (`status`),
  KEY `idx_sec_valid` (`valid_from`,`valid_until`),
  CONSTRAINT `legal_sections_ibfk_1` FOREIGN KEY (`act_id`) REFERENCES `legal_acts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `legal_sections_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `legal_chapters` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. legal_judgments (FK -> high_courts, high_court_benches, districts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `legal_judgments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `court_tier` enum('Supreme Court of India','High Court','District & Subordinate Court') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `court_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `high_court_id` int DEFAULT NULL,
  `bench_id` int DEFAULT NULL,
  `district_id` int DEFAULT NULL,
  `case_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `case_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `citation` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `neutral_citation` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `judgment_date` date NOT NULL,
  `bench_judges` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `bench_strength` int DEFAULT '2',
  `domain` enum('Constitutional Law','Criminal Law','Civil & Commercial Law','Family & Matrimonial Law','Administrative & Service Law','Tax & Revenue Law','Environmental Law','Labour & Industrial Law','Human Rights & Civil Liberties','Evidence & Procedure') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `legal_issue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_ratio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_holding` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `factual_summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `petitioner_arguments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `respondent_arguments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `court_reasoning` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `outcome` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_landmark` tinyint(1) DEFAULT '1',
  `is_synthetic` tinyint(1) NOT NULL DEFAULT '0',
  `record_provenance` enum('REAL_VERIFIED','SYNTHETIC_REPRESENTATIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REAL_VERIFIED',
  `keywords` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_type` enum('Supreme Court Official / eSCR','High Court Official / eCourts','India Code / Gazette','Authoritative Law Repository') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_judgment_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `retrieved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `high_court_id` (`high_court_id`),
  KEY `bench_id` (`bench_id`),
  KEY `district_id` (`district_id`),
  KEY `idx_judg_court` (`court_tier`),
  KEY `idx_judg_date` (`judgment_date`),
  KEY `idx_judg_domain` (`domain`),
  KEY `idx_judg_citation` (`citation`),
  KEY `idx_judg_provenance` (`is_synthetic`,`record_provenance`),
  CONSTRAINT `legal_judgments_ibfk_1` FOREIGN KEY (`high_court_id`) REFERENCES `high_courts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `legal_judgments_ibfk_2` FOREIGN KEY (`bench_id`) REFERENCES `high_court_benches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `legal_judgments_ibfk_3` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. judgment_documents (FK -> legal_judgments)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `judgment_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judgment_id` int NOT NULL,
  `document_type` enum('FULL_JUDGMENT_PDF','OFFICIAL_ORDER_PDF','REPORTABLE_JUDGMENT_PDF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FULL_JUDGMENT_PDF',
  `original_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size_bytes` int unsigned DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_judg_doc_type` (`judgment_id`,`document_type`),
  KEY `idx_jd_judgment` (`judgment_id`),
  KEY `idx_jd_verified` (`is_verified`),
  CONSTRAINT `judgment_documents_ibfk_1` FOREIGN KEY (`judgment_id`) REFERENCES `legal_judgments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. legal_section_relations (FK -> legal_sections)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `legal_section_relations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_section_id` int NOT NULL,
  `to_section_id` int DEFAULT NULL,
  `relation_type` enum('REPLACED_BY','CORRESPONDS_TO','MODIFIED_BY','REPEALED','RELATED_TO','NO_DIRECT_EQUIVALENT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Bureau of Police Research & Development (BPR&D) / MHA',
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `retrieved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mapping_nature` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correspondence_cardinality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `what_changed` text COLLATE utf8mb4_unicode_ci,
  `what_remains_same` text COLLATE utf8mb4_unicode_ci,
  `substantive_impact` text COLLATE utf8mb4_unicode_ci,
  `procedural_safeguards` text COLLATE utf8mb4_unicode_ci,
  `punishment_comparison` text COLLATE utf8mb4_unicode_ci,
  `transitional_notes` text COLLATE utf8mb4_unicode_ci,
  `verification_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'VERIFIED',
  `last_verified_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `from_section_id` (`from_section_id`),
  KEY `to_section_id` (`to_section_id`),
  KEY `idx_rel_type` (`relation_type`),
  CONSTRAINT `legal_section_relations_ibfk_1` FOREIGN KEY (`from_section_id`) REFERENCES `legal_sections` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `legal_section_relations_ibfk_2` FOREIGN KEY (`to_section_id`) REFERENCES `legal_sections` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. judgment_legal_sections (FK -> legal_judgments, legal_sections)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `judgment_legal_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judgment_id` int NOT NULL,
  `section_id` int NOT NULL,
  `relevance_nature` enum('Interpreted & Applied','Substantial Question of Law','Overruled / Struck Down','Referred','Guilt / Conviction Provision') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Interpreted & Applied',
  `legal_principle` text COLLATE utf8mb4_unicode_ci,
  `ratio_summary` text COLLATE utf8mb4_unicode_ci,
  `authority_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'BINDING_PRECEDENT',
  `verification_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'VERIFIED',
  `source_reference` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `last_verified_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_judg_sec` (`judgment_id`,`section_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `judgment_legal_sections_ibfk_1` FOREIGN KEY (`judgment_id`) REFERENCES `legal_judgments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `judgment_legal_sections_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `legal_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. court_records_repository (FK -> legal_judgments)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `court_records_repository` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Assigned JIS Record ID, e.g., JIS-REC-00001',
  `cnr` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '16-character alphanumeric Indian eCourts Case Number Record',
  `matched_curated_id` int DEFAULT NULL COMMENT 'References legal_judgments.id if matched with existing curated landmark case',
  `document_type` enum('JUDGMENT','FINAL_ORDER','COURT_ORDER','BAIL_ORDER','INTERIM_ORDER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'JUDGMENT',
  `court_tier` enum('Supreme Court of India','High Court','District & Subordinate Court') COLLATE utf8mb4_unicode_ci NOT NULL,
  `court_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raw_court_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `case_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `case_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `judgment_date` date DEFAULT NULL,
  `citation` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `neutral_citation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `domain` enum('Constitutional Law','Criminal Law','Civil & Commercial Law','Family & Matrimonial Law','Administrative & Service Law','Tax & Revenue Law','Environmental Law','Labour & Industrial Law','Human Rights & Civil Liberties','Evidence & Procedure') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Evidence & Procedure',
  `precedential_value` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `court_marking` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key_ratio` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Verbatim judicial ratio decidendi / court holding',
  `has_order_pdf` tinyint(1) NOT NULL DEFAULT '0',
  `order_filename` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_order_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statutory_sections` json DEFAULT NULL COMMENT 'Associated statutory sections as JSON array',
  `keywords` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Search keywords derived from legal domain and title',
  `is_landmark` tinyint(1) NOT NULL DEFAULT '0',
  `is_synthetic` tinyint(1) NOT NULL DEFAULT '0',
  `record_provenance` enum('REAL_VERIFIED','SYNTHETIC_REPRESENTATIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REAL_VERIFIED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `record_id` (`record_id`),
  KEY `idx_crr_cnr` (`cnr`),
  KEY `idx_crr_date` (`judgment_date` DESC),
  KEY `idx_crr_court` (`court_tier`,`court_name`(100)),
  KEY `idx_crr_domain` (`domain`),
  KEY `idx_crr_doc_type` (`document_type`),
  KEY `idx_crr_matched_curated` (`matched_curated_id`),
  CONSTRAINT `fk_crr_matched_curated` FOREIGN KEY (`matched_curated_id`) REFERENCES `legal_judgments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. vw_unified_judicial_records (Unified View - Curated + Repository)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW `vw_unified_judicial_records` AS

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
WHERE r.matched_curated_id IS NULL;

SET FOREIGN_KEY_CHECKS = 1;
