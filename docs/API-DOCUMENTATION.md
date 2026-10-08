# JIS REST API Specification & Endpoint Documentation

This document describes all REST API endpoints implemented in `server.js` for the **Judiciary Information System (JIS) Demo**.

All endpoints return JSON responses (with the exception of `/api/judgments/:id/pdf` which streams binary PDF data) and use standard HTTP status codes (`200 OK`, `404 Not Found`, `500 Internal Server Error`).

---

## 1. Repository Statistics

### `GET /api/stats`
Returns live aggregate counts of all active legal repository entities. Strictly queries genuine, verified records.

- **URL**: `/api/stats`
- **Method**: `GET`
- **Authentication**: None (Public)
- **SQL Provenance Filter**: `WHERE is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'`

#### Sample Response (`200 OK`):
```json
{
  "real_judgments": 105,
  "legal_acts": 10,
  "legal_sections": 2419,
  "section_mappings": 149,
  "verified_pdfs": 98
}
```

---

## 2. Judgments Repository

### `GET /api/judgments/filters`
Returns available filter dropdown values (courts and years) extracted dynamically from verified judgment records.

- **URL**: `/api/judgments/filters`
- **Method**: `GET`
- **SQL Query**:
  - `SELECT DISTINCT court_name FROM legal_judgments WHERE is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED' ORDER BY court_name ASC`
  - `SELECT DISTINCT YEAR(judgment_date) AS yr FROM legal_judgments WHERE is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED' ORDER BY yr DESC`

#### Sample Response (`200 OK`):
```json
{
  "courts": [
    "Supreme Court of India"
  ],
  "years": [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2013, 2012, 2011, 2010, 2007, 2006, 2005, 2002, 1997,
    1996, 1994, 1993, 1992, 1990, 1985, 1984, 1983, 1981, 1980,
    1978, 1976, 1975, 1973, 1967, 1965, 1964, 1962, 1960, 1958,
    1954, 1951, 1950, 1947
  ]
}
```

---

### `GET /api/judgments`
Searches, filters, and paginates verified landmark judgments. Only returns genuine records matching `is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'`.

- **URL**: `/api/judgments`
- **Method**: `GET`
- **Query Parameters**:
  | Parameter | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | `q` | string | `""` | Search keyword matched against `case_name`, `citation`, `keywords`, and `legal_issue` |
  | `court` | string | `""` | Exact match for `court_name` |
  | `year` | integer | `""` | Filter by `YEAR(judgment_date)` |
  | `page` | integer | `1` | Page number (1-indexed) |
  | `limit` | integer | `10` | Records per page (maximum 50) |
  | `sort` | string | `""` | Sort order: `date_desc` (default: landmark first, then date desc), `date_asc`, or `title_asc` |

#### Sample Response (`200 OK`):
```json
{
  "total": 105,
  "page": 1,
  "limit": 10,
  "totalPages": 11,
  "judgments": [
    {
      "id": 11,
      "court_tier": "Supreme Court of India",
      "court_name": "Supreme Court of India",
      "case_name": "Kesavananda Bharati Sripadagalvaru v. State of Kerala",
      "case_number": "Writ Petition (Civil) No. 135 of 1970",
      "citation": "(1973) 4 SCC 225",
      "neutral_citation": "1973 INSC 258",
      "judgment_date": "1973-04-23T18:30:00.000Z",
      "bench_judges": "S.M. Sikri (CJI), J.M. Shelat, K.S. Hegde, A.N. Grover, A.N. Ray, P. Jaganmohan Reddy, D.G. Palekar, H.R. Khanna, K.K. Mathew, M.H. Beg, S.N. Dwivedi, A.K. Mukherjea, Y.V. Chandrachud",
      "domain": "Constitutional Law",
      "legal_issue": "Whether the power of Parliament to amend the Constitution under Article 368 is unlimited and whether fundamental rights can be abrogated.",
      "key_ratio": "Parliament has wide amending powers under Article 368 but cannot alter, damage, or destroy the basic structure or essential framework of the Constitution.",
      "is_landmark": 1,
      "pdf_id": 11
    }
  ]
}
```

---

### `GET /api/judgments/:id`
Retrieves full case dossier for a single verified judgment, including interpreted statutory sections, PDF metadata, and curated legal analysis.

- **URL**: `/api/judgments/:id`
- **Method**: `GET`
- **Parameters**: `id` (integer) - Primary key in `legal_judgments`

#### Sample Response (`200 OK`):
```json
{
  "judgment": {
    "id": 11,
    "court_tier": "Supreme Court of India",
    "court_name": "Supreme Court of India",
    "case_name": "Kesavananda Bharati Sripadagalvaru v. State of Kerala",
    "case_number": "Writ Petition (Civil) No. 135 of 1970",
    "citation": "(1973) 4 SCC 225",
    "neutral_citation": "1973 INSC 258",
    "judgment_date": "1973-04-23T18:30:00.000Z",
    "bench_judges": "S.M. Sikri (CJI), J.M. Shelat, K.S. Hegde, A.N. Grover, A.N. Ray, P. Jaganmohan Reddy, D.G. Palekar, H.R. Khanna, K.K. Mathew, M.H. Beg, S.N. Dwivedi, A.K. Mukherjea, Y.V. Chandrachud",
    "bench_strength": 13,
    "domain": "Constitutional Law",
    "legal_issue": "Whether the power of Parliament to amend the Constitution under Article 368 is unlimited...",
    "key_ratio": "Parliament has wide amending powers under Article 368 but cannot alter the basic structure...",
    "key_holding": "Basic Structure Doctrine established.",
    "is_landmark": 1,
    "is_synthetic": 0,
    "record_provenance": "REAL_VERIFIED"
  },
  "sections": [
    {
      "id": 4755,
      "section_number": "Art 13",
      "section_title": "Laws inconsistent with or in derogation of the fundamental rights (Judicial Review)",
      "act_id": 17,
      "act_title": "Constitution of India",
      "relevance_nature": "Interpreted & Applied"
    }
  ],
  "document": {
    "docId": "257876",
    "original_filename": "SC_11_Kesavananda_Bharati_Sripadagalvaru_v_State_of_Kerala.pdf",
    "storage_path": "uploads/legal_judgments/SC_11_Kesavananda_Bharati_Sripadagalvaru_v_State_of_Kerala.pdf",
    "file_size": 2761352,
    "sha256": "4ea361093e098be39dd161da210874e0d9b4b0a196414ce528bf9c9a04f93ee7"
  },
  "curated": {
    "overview": "His Holiness Kesavananda Bharati Sripadagalvaru, head of the Edneer Mutt...",
    "issues": "1. Whether the 24th, 25th, and 29th Constitutional Amendments are constitutionally valid...",
    "holding": "Parliament possesses constituent power under Article 368 to amend any provision...",
    "key_findings": [
      "Article 368 does not confer power to alter the Basic Structure.",
      "Constitutional supremacy and democracy are core basic features.",
      "Judicial review is an unalterable constitutional pillar.",
      "Golak Nath overruled to recognize Parliament's power to amend Part III within basic structure limits.",
      "Ninth Schedule immunity cannot protect laws that violate the basic structure."
    ]
  }
}
```

---

### `GET /api/judgments/:id/pdf`
Streams the authentic verified PDF document directly to the client browser with inline content disposition.

- **URL**: `/api/judgments/:id/pdf`
- **Method**: `GET`
- **Parameters**: `id` (integer) - Judgment ID
- **Response Headers**:
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline; filename="<original_filename>"`
- **Error Codes**:
  - `404 Not Found`: If no verified PDF exists for the judgment.

---

## 3. Statutory Acts & Sections

### `GET /api/acts`
Retrieves all 10 statutory acts contained in the legal repository with precomputed section counts.

- **URL**: `/api/acts`
- **Method**: `GET`

#### Sample Response (`200 OK`):
```json
[
  {
    "id": 1,
    "code": "IPC",
    "title": "The Indian Penal Code, 1860",
    "short_title": "Indian Penal Code",
    "enactment_year": 1860,
    "act_type": "Substantive Criminal Law",
    "status": "REPEALED / HISTORICAL",
    "section_count": 567
  },
  {
    "id": 2,
    "code": "IEA",
    "title": "The Indian Evidence Act, 1872",
    "short_title": "Indian Evidence Act",
    "enactment_year": 1872,
    "act_type": "Law of Evidence",
    "status": "REPEALED / HISTORICAL",
    "section_count": 184
  },
  {
    "id": 17,
    "code": "CONSTITUTION",
    "title": "The Constitution of India",
    "short_title": "Constitution of India",
    "enactment_year": 1949,
    "act_type": "Constitutional Law",
    "status": "ACTIVE",
    "section_count": 24
  }
]
```

---

### `GET /api/acts/:id`
Retrieves details of a single statutory act along with its ordered list of sections.

- **URL**: `/api/acts/:id`
- **Method**: `GET`
- **Parameters**: `id` (integer) - Act ID

#### Sample Response (`200 OK`):
```json
{
  "act": {
    "id": 1,
    "code": "IPC",
    "title": "The Indian Penal Code, 1860",
    "short_title": "Indian Penal Code",
    "enactment_year": 1860,
    "status": "REPEALED / HISTORICAL"
  },
  "sections": [
    {
      "id": 1,
      "section_number": "1",
      "section_title": "Title and extent of operation of the Code",
      "legal_nature": "Preliminary",
      "status": "REPEALED"
    },
    {
      "id": 302,
      "section_number": "302",
      "section_title": "Punishment for murder",
      "legal_nature": "Penal",
      "status": "REPEALED"
    }
  ]
}
```

---

### `GET /api/sections/:id`
Retrieves full provision text, bidirectional statutory transitions (incoming and outgoing mappings), and genuine verified judgments citing this section.

- **URL**: `/api/sections/:id`
- **Method**: `GET`
- **Parameters**: `id` (integer) - Section ID

#### Sample Response (`200 OK`):
```json
{
  "section": {
    "id": 302,
    "section_number": "302",
    "section_title": "Punishment for murder",
    "section_content": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    "legal_nature": "Penal",
    "act_id": 1,
    "act_title": "The Indian Penal Code, 1860",
    "act_short_title": "Indian Penal Code"
  },
  "mappings": {
    "outgoing": [
      {
        "relation_type": "REPLACED_BY",
        "notes": "Corresponds to Section 103(1) of Bharatiya Nyaya Sanhita, 2023.",
        "related_act_id": 4,
        "related_act": "Bharatiya Nyaya Sanhita",
        "related_sec_id": 1101,
        "related_sec_num": "103(1)",
        "related_sec_title": "Punishment for murder"
      }
    ],
    "incoming": []
  },
  "judgments": [
    {
      "id": 3,
      "case_name": "Bachan Singh v. State of Punjab",
      "citation": "(1980) 2 SCC 684",
      "judgment_date": "1980-05-09T00:00:00.000Z",
      "relevance_nature": "Rarest of Rare Doctrine Pronounced"
    }
  ]
}
```

---

### `GET /api/mappings`
Returns the complete statutory transition concordance matrix mapping old colonial criminal codes (IPC, CrPC, IEA) to the new Sanhitas (BNS, BNSS, BSA).

- **URL**: `/api/mappings`
- **Method**: `GET`

#### Sample Response (`200 OK`):
```json
[
  {
    "id": 1,
    "relation_type": "CORRESPONDS_TO",
    "notes": "Title, extent and commencement",
    "source_name": "Legislative Concordance Table",
    "from_act_id": 1,
    "from_act": "Indian Penal Code",
    "from_sec_id": 1,
    "from_sec": "1",
    "from_title": "Title and extent of operation of the Code",
    "to_act_id": 4,
    "to_act": "Bharatiya Nyaya Sanhita",
    "to_sec_id": 1001,
    "to_sec": "1",
    "to_title": "Short title, commencement and application"
  }
]
```
