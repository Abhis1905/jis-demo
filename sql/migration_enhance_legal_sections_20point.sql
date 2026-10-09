-- JIS Migration: Schema Enhancement for Legal Sections (20-Point Analysis)
-- Database: jis_dev_db (Localhost Development)
-- Target Table: legal_sections
-- Purpose: Add 20-point section metadata columns for comprehensive legal reference.

ALTER TABLE legal_sections
    ADD COLUMN legal_objective TEXT NULL,
    ADD COLUMN scope_applicability TEXT NULL,
    ADD COLUMN persons_covered TEXT NULL,
    ADD COLUMN procedural_mechanism TEXT NULL,
    ADD COLUMN responsible_authority VARCHAR(255) NULL,
    ADD COLUMN burden_of_proof TEXT NULL,
    ADD COLUMN related_provisions TEXT NULL,
    ADD COLUMN transitional_notes TEXT NULL,
    ADD COLUMN illustrative_example TEXT NULL,
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'UNVERIFIED',
    ADD COLUMN last_verified_at DATE NULL;
