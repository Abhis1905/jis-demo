# JIS REST API Specification & Endpoint Documentation

This document describes all REST API endpoints implemented in `server.js` for the **Judiciary Information System (JIS)**.

All endpoints return JSON responses (with the exception of `/api/judgments/:id/pdf` which streams or redirects to official PDF documents) and use standard HTTP status codes (`200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

---

## 1. System Statistics

### `GET /api/stats`
Returns aggregate statistics of the legal knowledge base and court repository.

- **URL**: `/api/stats`
- **Method**: `GET`
- **Authentication**: None (Public)

#### Sample Response (`200 OK`):
```json
{
  "real_judgments": 4984,
  "legal_acts": 10,
  "legal_sections": 2419,
  "section_mappings": 149,
  "verified_pdfs": 82
}
```

---

## 2. Judgments Repository

### `GET /api/judgments/filters`
Returns available filter dropdown values (courts and years) extracted dynamically from verified judicial records.

- **URL**: `/api/judgments/filters`
- **Method**: `GET`

#### Sample Response (`200 OK`):
```json
{
  "courts": [
    "High Court of Judicature at Allahabad",
    "High Court of Judicature at Bombay",
    "High Court of Delhi",
    "Supreme Court of India"
  ],
  "years": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2014, 1997, 1978, 1973]
}
```

---

### `GET /api/judgments`
Searches, filters, and paginates verified landmark judgments and court repository records.

- **URL**: `/api/judgments`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (optional): Case name, citation, legal issue, or ratio search query.
  - `court` (optional): Exact court name filter.
  - `year` (optional): Judgment year filter (e.g. `2024`).
  - `page` (optional, default: `1`): 1-indexed page number.
  - `limit` (optional, default: `10`, max: `100`): Results per page.
  - `sort` (optional, default: `date_desc`): Sorting mode (`date_desc`, `date_asc`, `title_asc`).

#### Sample Response (`200 OK`):
```json
{
  "judgments": [
    {
      "id": 13,
      "court_tier": "Supreme Court",
      "court_name": "Supreme Court of India",
      "case_name": "Maneka Gandhi v. Union of India",
      "case_number": "Writ Petition (Civil) No. 231 of 1977",
      "citation": "(1978) 1 SCC 248",
      "neutral_citation": "1978 INSC 16",
      "judgment_date": "1978-01-25T00:00:00.000Z",
      "bench_judges": "M.H. Beg, C.J., Y.V. Chandrachud, P.N. Bhagwati, V.R. Krishna Iyer",
      "domain": "Constitutional Law",
      "legal_issue": "Whether Section 10(3)(c) of the Passports Act, 1967 violates Articles 14, 19(1)(a), 19(1)(g), and 21 of the Constitution.",
      "key_ratio": "Procedure established by law under Article 21 must be just, fair, and reasonable, not arbitrary or oppressive.",
      "is_landmark": 1,
      "pdf_id": 13
    }
  ],
  "total": 4984,
  "page": 1,
  "totalPages": 499,
  "limit": 10
}
```

---

### `GET /api/judgments/:id`
Retrieves a full case dossier including metadata, issues, findings, and cited statutory provisions.

- **URL**: `/api/judgments/:id`
- **Method**: `GET`
- **Parameters**: `id` (integer) — Curated judgment ID (`1–605`) or Repository record ID (`100001+`).

#### Sample Response (`200 OK`):
```json
{
  "judgment": {
    "id": 13,
    "case_name": "Maneka Gandhi v. Union of India",
    "court_name": "Supreme Court of India",
    "court_tier": "Supreme Court",
    "citation": "(1978) 1 SCC 248",
    "neutral_citation": "1978 INSC 16",
    "judgment_date": "1978-01-25T00:00:00.000Z",
    "domain": "Constitutional Law",
    "legal_issue": "Whether Section 10(3)(c) of Passports Act violates Article 21.",
    "key_ratio": "Procedure established by law must be just, fair, and reasonable.",
    "key_holding": "Impounding of passport without hearing held invalid.",
    "outcome": "Writ Petition Disposed with Directions"
  },
  "sections": [
    {
      "section_id": 4759,
      "section_number": "Art 21",
      "section_title": "Protection of life and personal liberty",
      "act_title": "Constitution of India",
      "relevance_nature": "Interpreted & Applied"
    }
  ],
  "document": {
    "id": 13,
    "original_filename": "SC_1978_Maneka_Gandhi_v_Union_of_India.pdf",
    "file_size_bytes": 1048576
  },
  "curated": {
    "overview": "Landmark ruling expanding the Golden Triangle of Fundamental Rights.",
    "issues": "Scope of personal liberty under Article 21.",
    "holding": "Statutory procedure must satisfy the test of substantive fairness.",
    "key_findings": [
      "Articles 14, 19, and 21 are mutually reinforcing.",
      "Principles of natural justice are implicit in Article 21."
    ]
  }
}
```

---

### `GET /api/judgments/:id/pdf`
Streams the authentic judgment PDF or redirects to the official court record order URL.

- **URL**: `/api/judgments/:id/pdf`
- **Method**: `GET`
- **Response**: Binary PDF byte stream (`application/pdf`) or HTTP `302 Found` redirect.

---

## 3. Statutory Acts & Sections

### `GET /api/acts`
Lists all 10 statutory enactments covered in the legal knowledge base.

- **URL**: `/api/acts`
- **Method**: `GET`

#### Sample Response (`200 OK`):
```json
[
  {
    "id": 11,
    "act_code": "IPC_1860",
    "title": "The Indian Penal Code, 1860",
    "short_title": "Indian Penal Code (IPC)",
    "enactment_year": 1860,
    "status": "Repealed / Historical",
    "section_count": 567
  },
  {
    "id": 14,
    "act_code": "BNS_2023",
    "title": "The Bharatiya Nyaya Sanhita, 2023",
    "short_title": "Bharatiya Nyaya Sanhita (BNS)",
    "enactment_year": 2023,
    "status": "Active",
    "section_count": 358
  }
]
```

---

### `GET /api/acts/:id`
Retrieves detailed information for a specific Act along with all its recorded provisions.

- **URL**: `/api/acts/:id`
- **Method**: `GET`

---

### `GET /api/sections/:id`
Returns a 20-point comprehensive statutory matrix for a legal section, including transitions and citing precedents.

- **URL**: `/api/sections/:id`
- **Method**: `GET`

#### Response Structure:
```json
{
  "section": {
    "id": 4778,
    "section_number": "Sec 9",
    "section_title": "Courts to try all civil suits unless barred",
    "section_text": "[OFFICIAL STATUTORY TEXT]...",
    "legal_nature": "Jurisdiction / Power",
    "commencement_date": "1909-01-01",
    "status": "Active",
    "plain_explanation": "Section 9 establishes that civil courts have inherent plenary jurisdiction...",
    "essential_ingredients": "1. Plenary jurisdiction...\n2. Suit of a civil nature...",
    "exceptions": "Suits barred by express statute or public policy.",
    "punishment_or_consequence": "Plaint is rejected or suit dismissed for lack of jurisdiction.",
    "amendment_status": "Active foundational procedural provision",
    "verification_status": "VERIFIED"
  },
  "mappings": {
    "outgoing": [],
    "incoming": []
  },
  "judgments": []
}
```

---

## 4. Legislative Concordance & Section Mapping

### `GET /api/mappings`
Returns the bidirectional statutory concordance matrix translating provisions of colonial criminal codes (IPC, CrPC, IEA) into the modernized Sanhitas (BNS, BNSS, BSA).

- **URL**: `/api/mappings`
- **Method**: `GET`

#### Sample Response (`200 OK`):
```json
[
  {
    "id": 150,
    "relation_type": "CORRESPONDS_TO",
    "mapping_nature": "CONSOLIDATED",
    "correspondence_cardinality": "ONE_TO_ONE",
    "what_changed": "Consolidated territorial jurisdiction and extraterritorial application into Section 1 BNS.",
    "what_remains_same": "Universal applicability within Indian sovereign territory.",
    "punishment_comparison": "Jurisdictional provision; no penal sanction.",
    "transitional_notes": "Offences committed prior to 1 July 2024 governed by IPC under Section 358(2) BNS.",
    "verification_status": "VERIFIED",
    "from_act": "Indian Penal Code (IPC)",
    "from_sec": "1",
    "from_title": "Title and extent of operation of the Code",
    "to_act": "Bharatiya Nyaya Sanhita (BNS)",
    "to_sec": "1",
    "to_title": "Short title, commencement and application"
  }
]
```
