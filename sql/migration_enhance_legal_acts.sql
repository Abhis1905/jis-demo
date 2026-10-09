-- JIS Migration: Schema Enhancement for Legal Acts
-- Database: jis_dev_db (Localhost Development)
-- Target Table: legal_acts
-- Purpose: Add 20-point legislative metadata fields for comprehensive legal reference.

ALTER TABLE legal_acts
    ADD COLUMN legislative_authority VARCHAR(255) NULL,
    ADD COLUMN jurisdiction_scope VARCHAR(255) NULL,
    ADD COLUMN assent_date DATE NULL,
    ADD COLUMN commencement_date DATE NULL,
    ADD COLUMN commencement_notification VARCHAR(500) NULL,
    ADD COLUMN legal_objective TEXT NULL,
    ADD COLUMN repeal_replacement_history TEXT NULL,
    ADD COLUMN amendment_milestones TEXT NULL,
    ADD COLUMN subordinate_rules TEXT NULL,
    ADD COLUMN transitional_provisions TEXT NULL,
    ADD COLUMN related_acts TEXT NULL,
    ADD COLUMN key_provisions TEXT NULL,
    ADD COLUMN known_limitations TEXT NULL,
    ADD COLUMN verification_status ENUM('VERIFIED', 'PARTIALLY_VERIFIED', 'UNVERIFIED') DEFAULT 'VERIFIED',
    ADD COLUMN last_verified_at DATE NULL;
