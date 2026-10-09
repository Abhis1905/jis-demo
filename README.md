# Judiciary Information System (JIS)

> Full-stack legal intelligence platform providing structured access to Indian judicial precedents, statutory enactments, and criminal law transition concordances.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](#running-tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

The **Judiciary Information System (JIS)** is an open legal reference and research platform designed to model Indian case law, legislative enactments, and statutory transitions. The application bridges the gap between historical criminal enactments (Indian Penal Code 1860, Code of Criminal Procedure 1973, Indian Evidence Act 1872) and the newly implemented criminal codes (Bharatiya Nyaya Sanhita 2023, Bharatiya Nagarik Suraksha Sanhita 2023, Bharatiya Sakshya Adhiniyam 2023).

JIS operates without heavy frontend dependencies or complex build steps, pairing a lightweight Express.js REST API with a responsive vanilla JavaScript interface backed by a normalized MySQL relational schema.

---

## Application Showcase

| Constitutional Home & Portal | Judicial Precedents Explorer |
| :---: | :---: |
| ![JIS Homepage](docs/screenshots/01-homepage.png) | ![Precedents Explorer](docs/screenshots/02-judgments-repository.png) |

---

## Key Features

- **Judicial Precedents Explorer**: Search thousands of judicial decisions by case name, citation, legal issue, or ratio decidendi, with faceted filtering by court tier and judgment year.
- **Structured Case Dossiers**: Comprehensive case records featuring legal issues, holdings, judicial findings, cited statutory provisions, and direct official PDF document delivery.
- **Statutory Acts & Provisions Directory**: Covers 10 statutory enactments and 2,419 provisions across constitutional, civil, and criminal law with official marginal headings, commencement dates, and chapter classifications.
- **Criminal Law Transition Concordance**: Bidirectional mapping matrix connecting 149 provisions of repealed colonial codes to their modern Sanhita counterparts, detailing legislative changes, punishment comparisons, and statutory transitional saving rules.
- **RESTful API**: Standardized JSON API powering search, filtering, metadata retrieval, and document streaming.

---

## System Architecture

```mermaid
flowchart TD
    subgraph Presentation Tier
        UI["Semantic HTML5 / Responsive CSS / Vanilla JS<br/>(public/index.html & public/script.js)"]
    end

    subgraph Application Tier
        API["Express.js 5.x REST Engine<br/>(server.js)"]
        AUTH["Route Handlers & Query Sanitization"]
        PDF["Document Streaming Pipeline"]
    end

    subgraph Data & Storage Tier
        DB[("MySQL 8.0 Relational Database<br/>(jis_dev_db / jis_db)")]
        VAULT["Local Document Storage<br/>(uploads/legal_judgments/)"]
    end

    UI -->|Async HTTP Fetch| API
    API --> AUTH
    AUTH -->|Connection Pool (mysql2)| DB
    API --> PDF
    PDF -->|Stream / Redirect| VAULT
```

---

## Tech Stack

- **Runtime**: Node.js (v18.x, v20.x, v22.x)
- **Backend**: Express.js 5.x
- **Database**: MySQL 8.0 with `mysql2/promise` connection pooling
- **Frontend**: Semantic HTML5, CSS3, Vanilla JavaScript (zero external UI dependencies)
- **CI / Testing**: Native Node.js test runner (`node:test`, `node:assert`), GitHub Actions

---

## Project Structure

```
jis-demo/
├── .github/
│   └── workflows/
│       └── ci.yml                   # Node.js CI test workflow
├── .env.example                     # Environment template (no secrets)
├── .gitignore                       # Git exclusion rules
├── package.json                     # Project dependencies and npm scripts
├── server.js                        # Express REST engine and route handlers
├── db.js                            # MySQL connection pool configuration
├── public/                          # Static frontend application
│   ├── index.html                   # Semantic portal layout
│   ├── script.js                    # Client router and UI controller
│   ├── style.css                    # Responsive stylesheet
│   ├── judiciary-insignia.svg       # Institutional insignia
│   └── preamble.jpg                 # Constitutional preamble asset
├── data/                            # Curated data and manifests
│   ├── case_records.json            # Curated case summaries and legal findings
│   ├── verified_pdf_manifest.json   # Local PDF verification manifest
│   └── verified_sections_cohort1.json # Landmark provisions benchmark
├── docs/                            # Technical specifications and diagrams
│   ├── API-DOCUMENTATION.md         # Comprehensive REST API reference
│   ├── ARCHITECTURE-AND-SCOPE.md    # Architecture and domain scope reference
│   ├── ER-Diagram-Current.mmd       # Active schema entity-relationship diagram
│   ├── ER-Diagram-Future.mmd        # Target enterprise lifecycle diagram
│   ├── System-Architecture.mmd      # System architecture diagram
│   └── screenshots/                 # Application screenshots
├── sql/                             # Versioned database migrations
│   ├── migration_staging_court_records.sql
│   ├── migration_acts_sections_schema.sql
│   ├── migration_enhance_legal_acts.sql
│   ├── migration_enhance_legal_sections_20point.sql
│   ├── migration_enhance_legal_section_relations.sql
│   └── migration_enhance_judgment_legal_sections.sql
├── test/                            # Automated test suite
│   └── api.test.js                  # Integration and API contract tests
├── uploads/
│   └── legal_judgments/             # Local judicial PDF documents
└── scripts/                         # Administrative and migration utilities
    ├── rollback_acts_sections.js    # Transactional rollback utility
    └── import_repository_records.js # Record ingestion pipeline
```

---

## Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **MySQL** 8.0 or higher
- **npm** v9+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhis1905/jis-demo.git
   cd jis-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to configure your MySQL connection:
   ```ini
   PORT=3001
   NODE_ENV=development
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=jis_dev_db
   ```

4. **Initialize database schema and migrations:**
   ```bash
   mysql -u root -p jis_dev_db < sql/migration_staging_court_records.sql
   mysql -u root -p jis_dev_db < sql/migration_acts_sections_schema.sql
   mysql -u root -p jis_dev_db < sql/migration_enhance_legal_acts.sql
   mysql -u root -p jis_dev_db < sql/migration_enhance_legal_sections_20point.sql
   mysql -u root -p jis_dev_db < sql/migration_enhance_legal_section_relations.sql
   mysql -u root -p jis_dev_db < sql/migration_enhance_judgment_legal_sections.sql
   ```

5. **Start the application:**
   ```bash
   npm start
   ```
   Open `http://localhost:3001` in your browser.

---

## Running Tests

The test suite runs using Node.js's native test runner:

```bash
npm test
```

Tests verify module exports, route availability, live API contracts, schema integrity, and 404 error handling.

---

## API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats` | Aggregated metrics for judgments, acts, sections, and mappings |
| `GET` | `/api/judgments/filters` | Dynamic court tiers and available judgment years |
| `GET` | `/api/judgments` | Paginated search and filtering across court decisions |
| `GET` | `/api/judgments/:id` | Full case dossier: metadata, findings, and cited sections |
| `GET` | `/api/judgments/:id/pdf` | Streams local PDF or redirects to official court record URL |
| `GET` | `/api/acts` | Lists all 10 statutory enactments with section counts |
| `GET` | `/api/acts/:id` | Act details with complete section listing |
| `GET` | `/api/sections/:id` | 20-point statutory matrix, transition mappings, and citing precedents |
| `GET` | `/api/mappings` | Full statutory concordance matrix (Old Codes $\to$ New Sanhitas) |

*Detailed request and response schemas are available in [`docs/API-DOCUMENTATION.md`](docs/API-DOCUMENTATION.md).*

---

## Data Provenance & Verification

- **Landmark Provisions (Cohort 1, 72 sections)**: Verbatim statutory text, essential ingredients, statutory exceptions, penalties, and Supreme Court precedent citations validated against official Gazette publications.
- **General Provisions (Cohort 2, 2,347 sections)**: Marginal headings, commencement dates, and chapter classifications validated against India Code, with plain explanations structured under chapter-level statutory norms.
- **Document Availability**: 82 verified Supreme Court judgments feature locally stored official PDFs; remaining court records provide verified links to official High Court eCourts orders.
- **Transitional Law**: Concordance records strictly reference statutory saving provisions (Section 358 BNS, Section 531 BNSS, Section 170 BSA) ensuring accurate guidance for pending vs. post-July 1, 2024 proceedings.

---

## License

This project is licensed under the [MIT License](LICENSE). Judicial decisions and statutory enactments cited are public records under Indian law.
