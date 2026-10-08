# JIS Architecture & Implementation Scope Reference

This document delineates the **Current Implemented Production Scope** of `jis-demo` from the **Planned Future Enterprise Scope**.

---

## 1. High-Level Architectural Division

```
┌────────────────────────────────────────────────────────────────────────┐
│                   JUDICIARY INFORMATION SYSTEM (JIS)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌──────────────────────────────────┐      ┌──────────────────────────────────┐
│   CURRENT IMPLEMENTED SCOPE      │      │      PLANNED FUTURE SCOPE        │
│   (Active in jis-demo Today)     │      │   (Enterprise E-Courts System)   │
├──────────────────────────────────┤      ├──────────────────────────────────┤
│ • 105 Real Verified Judgments    │      │ • E-Filing & Registry Scrutiny   │
│ • 98 Authenticated Registry PDFs │      │ • Case Management & Litigants    │
│ • 10 Statutory Enactments        │      │ • Court Roster & Bench Allocation│
│ • 2,419 Statutory Sections       │      │ • Cause Lists & Hearing Notes    │
│ • 149 Transition Concordances    │      │ • Interim Orders & Bail Signing  │
│ • Case Overviews, Issues & Ratios│      │ • Advocate & Litigant Portals    │
│ • Strict Provenance Enforcement  │      │ • RBAC (Judge, Advocate, Clerk)  │
│ • Modern Web UI & REST API Engine│      │ • Multi-Channel Notifications    │
│                                  │      │ • Immutable Audit Logging        │
└──────────────────────────────────┘      └──────────────────────────────────┘
```

---

## 2. Scope Matrix

| Functional Module | Current Status in `jis-demo` | Future Enterprise Target | Database Table Status |
| :--- | :--- | :--- | :--- |
| **Constitutional Homepage** | ✅ **Implemented** (Authentic emblem, preamble values, Sanskrit motto) | Future multi-portal entrance | `None` (Static semantic UI) |
| **Verified Judgments Repository** | ✅ **Implemented** (105 real verified landmark cases, live search & filters) | National full-text precedent search | `legal_judgments` (105 rows) |
| **Verified Judgment PDFs** | ✅ **Implemented** (98 authentic Supreme Court PDFs with SHA-256 validation) | S3-compliant distributed document store | `judgment_documents` + `verified_pdf_manifest.json` |
| **Statutory Acts & Codes** | ✅ **Implemented** (10 Acts: IPC, CrPC, IEA, BNS, BNSS, BSA, Constitution, etc.) | National legislative updates API | `legal_acts` (10 rows) |
| **Legislative Sections** | ✅ **Implemented** (2,419 provisions with marginal notes and full texts) | Complete All-India statutory corpus | `legal_sections` (2,419 rows) |
| **Concordance Matrix** | ✅ **Implemented** (149 transitions from colonial codes to new Sanhitas) | Automated concordance cross-linker | `legal_section_relations` (149 rows) |
| **Judicial Analysis & Ratios** | ✅ **Implemented** (Case overviews, legal issues, holdings, 5-7 findings) | AI-assisted ratio extraction | `data/case_records.json` |
| **User Authentication & RBAC** | ⏳ *Planned / Future Scope* | Multi-factor auth for Judges, Advocates, Registrars | `None in demo` (Architected in Future ER) |
| **E-Filing & Scrutiny** | ⏳ *Planned / Future Scope* | Online filing token, defect notice and curing workflow | `None in demo` (Architected in Future ER) |
| **Case Lifecycle & Dockets** | ⏳ *Planned / Future Scope* | CNR numbers, civil/criminal case registration, stage tracker | `None in demo` (Architected in Future ER) |
| **Litigants & Representation** | ⏳ *Planned / Future Scope* | Petitioners, respondents, advocates, e-Vakalatnamas | `None in demo` (Architected in Future ER) |
| **Court Rosters & Benches** | ⏳ *Planned / Future Scope* | Chief Justice roster allocation, division benches, courtrooms | `None in demo` (Architected in Future ER) |
| **Daily Cause Lists & Hearings**| ⏳ *Planned / Future Scope* | Real-time automated cause list, Court Master daily notes | `None in demo` (Architected in Future ER) |
| **Orders & Injunctions** | ⏳ *Planned / Future Scope* | Digitally signed interim injunctions, bail orders, directions | `None in demo` (Architected in Future ER) |
| **Notifications & Alerts** | ⏳ *Planned / Future Scope* | SMS, WhatsApp, Email cause list and defect dispatchers | `None in demo` (Architected in Future ER) |
| **Forensic Audit Logging** | ⏳ *Planned / Future Scope* | Cryptographic chain-of-custody logging of all actions | `None in demo` (Architected in Future ER) |

---

## 3. The Precedent Resolution Bridge

A fundamental architectural insight of the future-proof JIS design is how the **planned operational E-Courts lifecycle** integrates directly into the **active legal repository implemented today**:

1. **Instituted Cases ➔ Adjudication**: Cases flow through `case_filings` ➔ `cases` ➔ `hearings` ➔ `orders`.
2. **Final Disposition ➔ Authoritative Precedents**: When a case concludes with a substantial question of law or landmark principle, the bench marks it for publication.
3. **Bridge into Active Repository**:
   - The disposed case generates an authoritative record in `legal_judgments`.
   - The authoring judge links to `legal_judgments.bench_judges`.
   - The verified signed order or judgment PDF is deposited into `judgment_documents` (PDF Vault).
   - The legal ratio is mapped to statutory sections via `judgment_legal_sections`.
4. **Public Legal Research**: The decision immediately becomes searchable in the public Judgments Repository powered by the existing engine.

This design guarantees that the current `jis-demo` code and repository tables will serve as the permanent foundational core for future enterprise expansions without requiring any breaking schema changes or database migrations.
