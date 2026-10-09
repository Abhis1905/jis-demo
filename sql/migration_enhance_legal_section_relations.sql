-- JIS Migration: Schema Enhancement for Legal Section Relations
-- Database: jis_dev_db (Localhost Development)
-- Target Table: legal_section_relations
-- Purpose: Add 20-point comparative concordance metadata fields.

ALTER TABLE legal_section_relations
    ADD COLUMN mapping_nature VARCHAR(100) NULL,
    ADD COLUMN correspondence_cardinality VARCHAR(50) NULL,
    ADD COLUMN what_changed TEXT NULL,
    ADD COLUMN what_remains_same TEXT NULL,
    ADD COLUMN substantive_impact TEXT NULL,
    ADD COLUMN procedural_safeguards TEXT NULL,
    ADD COLUMN punishment_comparison TEXT NULL,
    ADD COLUMN transitional_notes TEXT NULL,
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    ADD COLUMN last_verified_at DATE NULL;
