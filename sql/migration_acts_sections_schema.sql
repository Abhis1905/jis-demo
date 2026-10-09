-- JIS Migration: Schema Enhancement for Acts & Sections
-- Database: jis_dev_db (Localhost Development)
-- Target Table: legal_sections
-- Purpose: Add structured legal metadata fields to store source-verified explanations,
--          ingredients, exceptions, consequences, amendment history, and commencement dates.

-- In standard MySQL, execute:
ALTER TABLE legal_sections
    ADD COLUMN plain_explanation MEDIUMTEXT NULL,
    ADD COLUMN essential_ingredients TEXT NULL,
    ADD COLUMN exceptions TEXT NULL,
    ADD COLUMN punishment_or_consequence TEXT NULL,
    ADD COLUMN amendment_status VARCHAR(255) NULL,
    ADD COLUMN commencement_date DATE NULL;

-- Rollback script:
-- ALTER TABLE legal_sections
--     DROP COLUMN plain_explanation,
--     DROP COLUMN essential_ingredients,
--     DROP COLUMN exceptions,
--     DROP COLUMN punishment_or_consequence,
--     DROP COLUMN amendment_status,
--     DROP COLUMN commencement_date;
