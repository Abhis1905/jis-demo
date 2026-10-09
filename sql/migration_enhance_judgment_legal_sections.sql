-- JIS Migration: Schema Enhancement for Judgment Legal Sections
-- Database: jis_dev_db (Localhost Development)
-- Target Table: judgment_legal_sections
-- Purpose: Add multi-judgment section ratio, legal principle, and precedent authority fields.

ALTER TABLE judgment_legal_sections
    ADD COLUMN legal_principle TEXT NULL,
    ADD COLUMN ratio_summary TEXT NULL,
    ADD COLUMN authority_type VARCHAR(50) DEFAULT 'BINDING_PRECEDENT',
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    ADD COLUMN source_reference VARCHAR(500) NULL,
    ADD COLUMN notes TEXT NULL,
    ADD COLUMN last_verified_at DATE NULL;
