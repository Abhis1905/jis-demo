#!/usr/bin/env python3
"""
Generate high-resolution PNG diagrams for the Judiciary Information System (JIS)
docs:
1. docs/ER-Diagram-Current.png
2. docs/ER-Diagram-Future.png
3. docs/System-Architecture.png
4. docs/Future-System-Architecture.png
"""

import os
import subprocess

def svg_box(x, y, w, h, rx=8, fill="#ffffff", stroke="#cbd5e1", stroke_width=1.5, shadow=True):
    sh = f'filter="url(#cardShadow)"' if shadow else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_width}" {sh} />'

def svg_header_bar(x, y, w, h, fill="#1e293b", rx=8, text="", badge=""):
    path = f'''
    <path d="M {x} {y+rx} Q {x} {y} {x+rx} {y} L {x+w-rx} {y} Q {x+w} {y} {x+w} {y+rx} L {x+w} {y+h} L {x} {y+h} Z" fill="{fill}" />
    <text x="{x+14}" y="{y+h-10}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#ffffff">{text}</text>
    '''
    if badge:
        path += f'''
        <rect x="{x+w-len(badge)*7-18}" y="{y+6}" width="{len(badge)*7+12}" height="18" rx="4" fill="rgba(255,255,255,0.2)" />
        <text x="{x+w-len(badge)*7-12}" y="{y+19}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="600" fill="#ffffff">{badge}</text>
        '''
    return path

def svg_field(x, y, name, ftype, is_pk=False, is_fk=False, desc=""):
    pkfk = ""
    if is_pk:
        pkfk = '<tspan fill="#b45309" font-weight="bold">PK </tspan>'
    elif is_fk:
        pkfk = '<tspan fill="#0284c7" font-weight="bold">FK </tspan>'
    
    line = f'''
    <text x="{x}" y="{y}" font-family="'SF Mono', Menlo, Consolas, Monaco, monospace" font-size="11" fill="#334155">
        {pkfk}<tspan font-weight="600" fill="#0f172a">{name}</tspan>: <tspan fill="#64748b">{ftype}</tspan>
    </text>
    '''
    if desc:
        line += f'<text x="{x+330}" y="{y}" font-family="-apple-system, sans-serif" font-size="10" fill="#94a3b8">{desc}</text>'
    return line

def render_table_card(x, y, w, title, badge, header_bg, fields):
    h = 36 + len(fields) * 22 + 14
    res = [svg_box(x, y, w, h, rx=8, fill="#ffffff", stroke="#cbd5e1")]
    res.append(svg_header_bar(x, y, w, 32, fill=header_bg, rx=8, text=title, badge=badge))
    fy = y + 52
    for f in fields:
        # f: (name, type, is_pk, is_fk, desc)
        name, ftype, is_pk, is_fk = f[0], f[1], f[2], f[3]
        desc = f[4] if len(f) > 4 else ""
        res.append(svg_field(x + 14, fy, name, ftype, is_pk, is_fk, desc))
        fy += 22
    return "\n".join(res), h

# -----------------------------------------------------------------------------
# 1. ER DIAGRAM - CURRENT PRODUCTION
# -----------------------------------------------------------------------------
def build_current_er_svg():
    width = 2400
    height = 1480
    
    svg = [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
    <defs>
        <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b172a" />
            <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
        </marker>
        <marker id="circle" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
            <circle cx="5" cy="5" r="3" fill="#64748b" />
        </marker>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="{width}" height="{height}" fill="#f8fafc" />
    
    <!-- Top System Header Banner -->
    <rect x="0" y="0" width="{width}" height="100" fill="url(#headerGrad)" />
    <line x1="0" y1="100" x2="{width}" y2="100" stroke="#c59b27" stroke-width="3" />
    
    <text x="50" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc" letter-spacing="0.5">
        JUDICIARY INFORMATION SYSTEM (JIS) — CURRENT PRODUCTION ER DIAGRAM
    </text>
    <text x="50" y="75" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">
        Active Production Legal Repository &amp; Statutory Concordance Schema (Implemented Today in jis-demo)
    </text>
    
    <!-- Verified Provenance Badge -->
    <rect x="1800" y="32" width="550" height="38" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
    <circle cx="1820" cy="51" r="5" fill="#34d399" />
    <text x="1835" y="55" font-family="'SF Mono', Menlo, Consolas, monospace" font-size="11.5" font-weight="700" fill="#ecfdf5">
        STRICT FILTER: is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'
    </text>
    ''']
    
    # Domain Containers
    # Group A: STATUTORY FRAMEWORK (Left)
    svg.append('''
    <rect x="40" y="125" width="760" height="1310" rx="12" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6,4" />
    <rect x="60" y="112" width="280" height="26" rx="5" fill="#1e3a8a" />
    <text x="75" y="129" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">STATUTORY CODE &amp; PROVISIONS</text>
    ''')
    
    # Table 1: legal_acts
    t1_fields = [
        ("id", "INT", True, False, "Primary Key (Auto Increment)"),
        ("code", "VARCHAR(32)", False, False, "Act code (IPC, BNS, CONSTITUTION)"),
        ("title", "VARCHAR(255)", False, False, "Full statutory enactment title"),
        ("short_title", "VARCHAR(128)", False, False, "Standard judicial short title"),
        ("enactment_year", "INT", False, False, "Year passed by Parliament"),
        ("act_type", "VARCHAR(64)", False, False, "Substantive, Procedural, Constitutional"),
        ("status", "VARCHAR(32)", False, False, "ACTIVE, REPEALED, TRANSITIONAL")
    ]
    c1, h1 = render_table_card(60, 155, 720, "legal_acts", "10 RECORDS", "#1e3a8a", t1_fields)
    svg.append(c1)
    
    # Table 2: legal_chapters
    t2_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("act_id", "INT", False, True, "FK -> legal_acts.id"),
        ("chapter_number", "VARCHAR(16)", False, False, "Roman / Arabic Chapter notation"),
        ("chapter_title", "VARCHAR(255)", False, False, "Subject classification"),
        ("start_section", "VARCHAR(16)", False, False, "First section in chapter"),
        ("end_section", "VARCHAR(16)", False, False, "Last section in chapter")
    ]
    c2, h2 = render_table_card(60, 155 + h1 + 25, 720, "legal_chapters", "73 CHAPTERS", "#2563eb", t2_fields)
    svg.append(c2)
    
    # Table 3: legal_sections
    t3_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("act_id", "INT", False, True, "FK -> legal_acts.id"),
        ("chapter_id", "INT", False, True, "FK -> legal_chapters.id"),
        ("section_number", "VARCHAR(32)", False, False, "e.g. Sec 302, Sec 101, Art 21"),
        ("section_title", "VARCHAR(255)", False, False, "Marginal note / section title"),
        ("section_content", "MEDIUMTEXT", False, False, "Complete legislative provision wording"),
        ("legal_nature", "VARCHAR(64)", False, False, "Penal, Procedural, Fundamental Right"),
        ("section_order", "INT", False, False, "Sequential order within Act"),
        ("status", "VARCHAR(32)", False, False, "IN_FORCE, REPEALED, SUPERSEDED")
    ]
    c3, h3 = render_table_card(60, 155 + h1 + 25 + h2 + 25, 720, "legal_sections", "2,419 PROVISIONS", "#0369a1", t3_fields)
    svg.append(c3)
    
    # Table 4: legal_procedural_classifications
    t4_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("section_id", "INT", False, True, "FK -> legal_sections.id (1:1)"),
        ("bailable_status", "VARCHAR(32)", False, False, "Bailable / Non-Bailable"),
        ("cognizable_status", "VARCHAR(32)", False, False, "Cognizable / Non-Cognizable"),
        ("compoundable_status", "VARCHAR(32)", False, False, "Compoundable / Non-Compoundable"),
        ("triable_by", "VARCHAR(128)", False, False, "Court of Session, Magistrate 1st Class")
    ]
    c4, h4 = render_table_card(60, 155 + h1 + 25 + h2 + 25 + h3 + 25, 720, "legal_procedural_classifications", "PROCEDURAL MATRIX", "#0284c7", t4_fields)
    svg.append(c4)

    # Group B: TRANSITION CONCORDANCE (Center)
    svg.append('''
    <rect x="830" y="125" width="740" height="1310" rx="12" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1.5" stroke-dasharray="6,4" />
    <rect x="850" y="112" width="310" height="26" rx="5" fill="#5b21b6" />
    <text x="865" y="129" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">CONCORDANCE &amp; CLASSIFICATION</text>
    ''')

    # Table 5: legal_section_relations
    t5_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("from_section_id", "INT", False, True, "FK -> legal_sections.id (Source / Old Code)"),
        ("to_section_id", "INT", False, True, "FK -> legal_sections.id (Target / New Code)"),
        ("relation_type", "VARCHAR(64)", False, False, "REPLACED_BY, CONCORDANCE, TRANSITIONAL"),
        ("notes", "TEXT", False, False, "Legislative transition analysis & changes"),
        ("source_name", "VARCHAR(128)", False, False, "Official transition concordance matrix")
    ]
    c5, h5 = render_table_card(850, 155, 700, "legal_section_relations", "149 CONCORDANCES", "#5b21b6", t5_fields)
    svg.append(c5)

    # Table 6: legal_categories
    t6_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("name", "VARCHAR(128)", False, False, "Criminal, Constitutional, Evidence"),
        ("category_type", "VARCHAR(64)", False, False, "Taxonomy domain"),
        ("description", "TEXT", False, False, "Scope of subject domain")
    ]
    c6, h6 = render_table_card(850, 155 + h5 + 25, 700, "legal_categories", "28 TAXONOMIES", "#6d28d9", t6_fields)
    svg.append(c6)

    # Table 7: legal_section_categories
    t7_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("section_id", "INT", False, True, "FK -> legal_sections.id"),
        ("category_id", "INT", False, True, "FK -> legal_categories.id")
    ]
    c7, h7 = render_table_card(850, 155 + h5 + 25 + h6 + 25, 700, "legal_section_categories", "JUNCTION TABLE", "#7c3aed", t7_fields)
    svg.append(c7)

    # Table 8: judgment_legal_sections
    t8_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("judgment_id", "INT", False, True, "FK -> legal_judgments.id"),
        ("section_id", "INT", False, True, "FK -> legal_sections.id"),
        ("relevance_nature", "VARCHAR(64)", False, False, "Interpreted & Applied, Struck Down")
    ]
    c8, h8 = render_table_card(850, 155 + h5 + 25 + h6 + 25 + h7 + 25, 700, "judgment_legal_sections", "126 INTERPRETATIONS", "#4f46e5", t8_fields)
    svg.append(c8)

    # Group C: VERIFIED JUDGMENTS & DOCUMENTS (Right)
    svg.append('''
    <rect x="1600" y="125" width="760" height="1310" rx="12" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5" stroke-dasharray="6,4" />
    <rect x="1620" y="112" width="310" height="26" rx="5" fill="#065f46" />
    <text x="1635" y="129" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">VERIFIED PRECEDENT REPOSITORY</text>
    ''')

    # Table 9: legal_judgments
    t9_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("court_tier", "VARCHAR(64)", False, False, "Supreme Court of India, High Court"),
        ("court_name", "VARCHAR(128)", False, False, "Full official Court title"),
        ("case_name", "VARCHAR(255)", False, False, "Kesavananda Bharati, Puttaswamy, etc."),
        ("case_number", "VARCHAR(128)", False, False, "Official registration number"),
        ("citation", "VARCHAR(128)", False, False, "Official standard citation (e.g. SCC, AIR)"),
        ("neutral_citation", "VARCHAR(128)", False, False, "Indian Neutral Citation System (e.g. 1973 INSC 258)"),
        ("judgment_date", "DATETIME", False, False, "Date of pronouncement in open court"),
        ("bench_judges", "TEXT", False, False, "Bench composition / Coram"),
        ("bench_strength", "INT", False, False, "Number of judges on bench (e.g. 13, 9, 7)"),
        ("domain", "VARCHAR(64)", False, False, "Constitutional Law, Criminal Jurisprudence"),
        ("legal_issue", "TEXT", False, False, "Legal questions framed and decided"),
        ("key_ratio", "TEXT", False, False, "Ratio decidendi of judgment"),
        ("key_holding", "TEXT", False, False, "Operative holding and directions"),
        ("is_landmark", "TINYINT", False, False, "1 = Landmark precedent"),
        ("is_synthetic", "TINYINT", False, False, "0 = STRICTLY GENUINE (No synthetic)"),
        ("record_provenance", "VARCHAR(32)", False, False, "'REAL_VERIFIED' (Strict filter)")
    ]
    c9, h9 = render_table_card(1620, 155, 720, "legal_judgments", "105 REAL_VERIFIED", "#065f46", t9_fields)
    svg.append(c9)

    # Table 10: judgment_documents
    t10_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("judgment_id", "INT", False, True, "FK -> legal_judgments.id"),
        ("document_type", "VARCHAR(64)", False, False, "AUTHENTIC_JUDGMENT_PDF"),
        ("original_filename", "VARCHAR(255)", False, False, "Official registry PDF filename"),
        ("storage_path", "VARCHAR(255)", False, False, "uploads/legal_judgments/"),
        ("source_url", "VARCHAR(512)", False, False, "Authoritative judicial portal URL"),
        ("file_size_bytes", "BIGINT", False, False, "Exact byte size"),
        ("mime_type", "VARCHAR(64)", False, False, "application/pdf"),
        ("sha256_hash", "VARCHAR(64)", False, False, "Cryptographic verification hash"),
        ("is_verified", "TINYINT", False, False, "1 = Authenticated authentic document")
    ]
    c10, h10 = render_table_card(1620, 155 + h9 + 25, 720, "judgment_documents", "98 AUTHENTIC PDFS", "#047857", t10_fields)
    svg.append(c10)

    # Table 11: judgment_citations
    t11_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("judgment_id", "INT", False, True, "FK -> legal_judgments.id"),
        ("reporter_name", "VARCHAR(64)", False, False, "SCC, SCR, AIR, SCALE, Judis"),
        ("citation_string", "VARCHAR(128)", False, False, "Volume and page citation string"),
        ("page_number", "VARCHAR(32)", False, False, "Page reference in legal reporter"),
        ("year", "INT", False, False, "Publication year")
    ]
    c11, h11 = render_table_card(1620, 155 + h9 + 25 + h10 + 25, 720, "judgment_citations", "REPORTER CITATIONS", "#059669", t11_fields)
    svg.append(c11)

    svg.append('</svg>')
    return "\n".join(svg)

# -----------------------------------------------------------------------------
# 2. ER DIAGRAM - FUTURE SCOPE ENTERPRISE
# -----------------------------------------------------------------------------
def build_future_er_svg():
    width = 2700
    height = 1750
    
    svg = [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
    <defs>
        <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="futureHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e1b4b" />
        </linearGradient>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="{width}" height="{height}" fill="#f8fafc" />
    
    <!-- Header Banner -->
    <rect x="0" y="0" width="{width}" height="105" fill="url(#futureHeaderGrad)" />
    <line x1="0" y1="105" x2="{width}" y2="105" stroke="#f59e0b" stroke-width="3" />
    
    <text x="50" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="800" fill="#f8fafc">
        JUDICIARY INFORMATION SYSTEM (JIS) — FUTURE ENTERPRISE ER ARCHITECTURE
    </text>
    <text x="50" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#cbd5e1">
        Comprehensive Planned E-Courts Lifecycle Architecture Harmonized with Current Active Legal Repository
    </text>
    
    <!-- Dual Legend Badges -->
    <rect x="1560" y="28" width="520" height="48" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="1585" cy="52" r="6" fill="#38bdf8" />
    <text x="1605" y="46" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">ACTIVE REPOSITORY (IMPLEMENTED TODAY)</text>
    <text x="1605" y="64" font-family="-apple-system, sans-serif" font-size="10.5" fill="#94a3b8">In Production: Acts, Sections, Mappings, 105 Verified Judgments</text>
    
    <rect x="2100" y="28" width="550" height="48" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="1.5" />
    <circle cx="2125" cy="52" r="6" fill="#f59e0b" />
    <text x="2145" y="46" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#fbbf24">PLANNED / FUTURE SCOPE — NOT CURRENTLY IMPLEMENTED</text>
    <text x="2145" y="64" font-family="-apple-system, sans-serif" font-size="10.5" fill="#fed7aa">Architected for Future E-Courts Integration (No DB Changes in Demo)</text>
    ''']

    # Column 1: IDENTITY, RBAC & COURT ROSTER (Planned)
    svg.append('''
    <rect x="40" y="130" width="620" height="1570" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="6,4" />
    <rect x="60" y="117" width="340" height="26" rx="5" fill="#b45309" />
    <text x="75" y="134" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">PLANNED: USERS, ROLES &amp; COURT ROSTER</text>
    ''')

    # Users
    u_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("username", "VARCHAR(64)", False, False, "Unique login handle"),
        ("email", "VARCHAR(128)", False, False, "Verified judicial/bar email"),
        ("mobile_phone", "VARCHAR(20)", False, False, "Secure 2FA OTP phone"),
        ("user_type", "VARCHAR(32)", False, False, "JUDGE, ADVOCATE, REGISTRAR, LITIGANT"),
        ("account_status", "VARCHAR(32)", False, False, "ACTIVE, SUSPENDED, PENDING"),
        ("created_at", "DATETIME", False, False, "Registration audit timestamp")
    ]
    cu, hu = render_table_card(60, 160, 580, "users", "[PLANNED - USERS]", "#b45309", u_fields)
    svg.append(cu)

    # Roles & User Roles
    r_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("role_code", "VARCHAR(64)", False, False, "ROLE_JUDICIAL_OFFICER, ROLE_BAR"),
        ("role_name", "VARCHAR(128)", False, False, "Human readable role title"),
        ("permissions", "JSON", False, False, "Array of RBAC capability flags")
    ]
    cr, hr = render_table_card(60, 160 + hu + 20, 580, "roles & user_roles", "[PLANNED - RBAC]", "#d97706", r_fields)
    svg.append(cr)

    # Judges
    j_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("user_id", "INT", False, True, "FK -> users.id (1:1)"),
        ("court_id", "INT", False, True, "FK -> courts.id"),
        ("full_name", "VARCHAR(128)", False, False, "Hon'ble Justice / Magistrate"),
        ("designation", "VARCHAR(64)", False, False, "CHIEF_JUSTICE, PUISNE_JUDGE"),
        ("appointment_date", "DATE", False, False, "Date of warrant & swearing in"),
        ("bar_council_id", "VARCHAR(64)", False, False, "Bar enrollment reference")
    ]
    cj, hj = render_table_card(60, 160 + hu + 20 + hr + 20, 580, "judges", "[PLANNED - JUDGE]", "#b45309", j_fields)
    svg.append(cj)

    # Advocates
    adv_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("user_id", "INT", False, True, "FK -> users.id (1:1)"),
        ("bar_council_reg_no", "VARCHAR(64)", False, False, "State Bar Council Enrollment No."),
        ("state_bar_council", "VARCHAR(64)", False, False, "Bar Council jurisdiction"),
        ("chamber_firm", "VARCHAR(128)", False, False, "Chamber / Law Firm name"),
        ("is_aor", "BOOLEAN", False, False, "Advocate-on-Record qualified")
    ]
    cadv, hadv = render_table_card(60, 160 + hu + 20 + hr + 20 + hj + 20, 580, "advocates", "[PLANNED - ADVOCATE]", "#d97706", adv_fields)
    svg.append(cadv)

    # Registrars
    reg_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("user_id", "INT", False, True, "FK -> users.id (1:1)"),
        ("court_id", "INT", False, True, "FK -> courts.id"),
        ("officer_code", "VARCHAR(32)", False, False, "Registry Cadre Code"),
        ("designation", "VARCHAR(64)", False, False, "REGISTRAR_JUDICIAL, LISTING"),
        ("branch", "VARCHAR(64)", False, False, "Filing & Scrutiny, Listing, Decrees")
    ]
    creg, hreg = render_table_card(60, 160 + hu + 20 + hr + 20 + hj + 20 + hadv + 20, 580, "registrars", "[PLANNED - REGISTRAR]", "#b45309", reg_fields)
    svg.append(creg)

    # Courts & Benches
    cb_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("court_code", "VARCHAR(32)", False, False, "National Code (SC-IND, HC-DEL)"),
        ("name", "VARCHAR(128)", False, False, "Full court name"),
        ("tier", "VARCHAR(64)", False, False, "SUPREME_COURT, HIGH_COURT"),
        ("bench_id", "INT", False, True, "FK -> benches.id (Courtroom allocation)"),
        ("bench_name", "VARCHAR(64)", False, False, "Constitution Bench, Div. Bench"),
        ("bench_type", "VARCHAR(32)", False, False, "CONSTITUTION, DIVISION, SINGLE")
    ]
    ccb, hcb = render_table_card(60, 160 + hu + 20 + hr + 20 + hj + 20 + hadv + 20 + hreg + 20, 580, "courts & benches", "[PLANNED - COURT/BENCH]", "#d97706", cb_fields)
    svg.append(ccb)

    # Column 2: CASE LIFECYCLE & LITIGANTS (Planned)
    svg.append('''
    <rect x="690" y="130" width="630" height="1570" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="6,4" />
    <rect x="710" y="117" width="350" height="26" rx="5" fill="#c2410c" />
    <text x="725" y="134" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">PLANNED: E-FILING, CASES &amp; PROCEEDINGS</text>
    ''')

    # Case Filings
    cf_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("filing_token", "VARCHAR(64)", False, False, "E-Filing Token (EF-2026-00492)"),
        ("court_id", "INT", False, True, "FK -> courts.id"),
        ("filed_by_user_id", "INT", False, True, "FK -> users.id (Advocate/Litigant)"),
        ("filing_timestamp", "DATETIME", False, False, "Submission timestamp"),
        ("scrutiny_status", "VARCHAR(32)", False, False, "PENDING, DEFECTS, PASSED"),
        ("scrutinized_by", "INT", False, True, "FK -> registrars.id"),
        ("defect_notes", "TEXT", False, False, "Registry defect checklist")
    ]
    ccf, hcf = render_table_card(710, 160, 590, "case_filings", "[PLANNED - FILING]", "#c2410c", cf_fields)
    svg.append(ccf)

    # Cases
    case_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("filing_id", "INT", False, True, "FK -> case_filings.id (1:1)"),
        ("court_id", "INT", False, True, "FK -> courts.id"),
        ("bench_id", "INT", False, True, "FK -> benches.id"),
        ("cnr_number", "VARCHAR(32)", False, False, "Case Natural Record No. (DLHC0100492)"),
        ("case_type", "VARCHAR(32)", False, False, "WP(C), CRLA, SLP, CS"),
        ("case_number", "VARCHAR(64)", False, False, "Judicial Registration Number"),
        ("title", "VARCHAR(255)", False, False, "Petitioner vs Respondent"),
        ("current_stage", "VARCHAR(64)", False, False, "ADMISSION, ARGUMENTS, DISPOSED"),
        ("disposal_nature", "VARCHAR(64)", False, False, "DISMISSED, ALLOWED, SETTLED")
    ]
    ccase, hcase = render_table_card(710, 160 + hcf + 20, 590, "cases", "[PLANNED - CASE]", "#ea580c", case_fields)
    svg.append(ccase)

    # Case Parties / Litigants
    cp_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("case_id", "INT", False, True, "FK -> cases.id"),
        ("party_role", "VARCHAR(32)", False, False, "PETITIONER, RESPONDENT, APPELLANT"),
        ("party_sequence", "INT", False, False, "1st Party, 2nd Party, etc."),
        ("full_name", "VARCHAR(128)", False, False, "Litigant individual / corporate entity"),
        ("advocate_id", "INT", False, True, "FK -> advocates.id (Legal counsel)")
    ]
    ccp, hcp = render_table_card(710, 160 + hcf + 20 + hcase + 20, 590, "case_parties / litigants", "[PLANNED - LITIGANTS]", "#c2410c", cp_fields)
    svg.append(ccp)

    # Case Documents
    cd_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("case_id", "INT", False, True, "FK -> cases.id"),
        ("document_category", "VARCHAR(64)", False, False, "PETITION, VAKALATNAMA, AFFIDAVIT"),
        ("title", "VARCHAR(255)", False, False, "Pleading / Exhibit title"),
        ("file_storage_uri", "VARCHAR(255)", False, False, "Encrypted vault storage URI"),
        ("sha256_checksum", "VARCHAR(64)", False, False, "Digital integrity digest"),
        ("is_digitally_signed", "BOOLEAN", False, False, "DSC digital signature verified")
    ]
    ccd, hcd = render_table_card(710, 160 + hcf + 20 + hcase + 20 + hcp + 20, 590, "case_documents", "[PLANNED - DOCUMENTS]", "#ea580c", cd_fields)
    svg.append(ccd)

    # Hearings & Orders
    ho_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("case_id", "INT", False, True, "FK -> cases.id"),
        ("bench_id", "INT", False, True, "FK -> benches.id"),
        ("hearing_date", "DATE", False, False, "Cause list date"),
        ("cause_list_item_no", "INT", False, False, "Daily serial item number"),
        ("hearing_purpose", "VARCHAR(64)", False, False, "ADMISSION, ARGUMENTS, ORDERS"),
        ("order_type", "VARCHAR(64)", False, False, "INTERIM_INJUNCTION, BAIL, FINAL"),
        ("signed_by_judge_id", "INT", False, True, "FK -> judges.id (Judicial attestation)"),
        ("operative_order", "TEXT", False, False, "Operative order directions")
    ]
    cho, hho = render_table_card(710, 160 + hcf + 20 + hcase + 20 + hcp + 20 + hcd + 20, 590, "hearings & orders", "[PLANNED - HEARINGS/ORDERS]", "#c2410c", ho_fields)
    svg.append(cho)

    # Column 3: CROSS-CUTTING (Notifications & Audit Logs) + BRIDGE
    svg.append('''
    <rect x="1350" y="130" width="620" height="1570" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6,4" />
    <rect x="1370" y="117" width="370" height="26" rx="5" fill="#475569" />
    <text x="1385" y="134" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">SYSTEM AUDIT &amp; PRECEDENT BRIDGE</text>
    ''')

    # Notifications
    notif_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("user_id", "INT", False, True, "FK -> users.id"),
        ("channel", "VARCHAR(32)", False, False, "SMS, EMAIL, IN_APP, WHATSAPP"),
        ("title", "VARCHAR(128)", False, False, "Cause list listing, defect alert"),
        ("message_content", "TEXT", False, False, "Dispatch body"),
        ("is_read", "BOOLEAN", False, False, "Read status")
    ]
    cnot, hnot = render_table_card(1370, 160, 580, "notifications", "[PLANNED - NOTIFICATIONS]", "#475569", notif_fields)
    svg.append(cnot)

    # Audit Logs
    audit_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("user_id", "INT", False, True, "FK -> users.id"),
        ("action_code", "VARCHAR(64)", False, False, "CASE_FILED, ORDER_SIGNED, SCRUTINY"),
        ("target_entity", "VARCHAR(64)", False, False, "CASES, ORDERS, PLEADINGS"),
        ("target_id", "INT", False, False, "Target row identifier"),
        ("ip_address", "VARCHAR(45)", False, False, "Client origin IP"),
        ("timestamp", "DATETIME", False, False, "Immutable audit timestamp")
    ]
    caud, haud = render_table_card(1370, 160 + hnot + 20, 580, "audit_logs", "[PLANNED - AUDIT LOGS]", "#334155", audit_fields)
    svg.append(caud)

    # Bridge Box explaining integration
    svg.append(f'''
    <rect x="1370" y="{160 + hnot + 20 + haud + 25}" width="580" height="220" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
    <text x="1390" y="{160 + hnot + 20 + haud + 55}" font-family="-apple-system, sans-serif" font-size="14" font-weight="800" fill="#1e3a8a">
        ⚡ PRECEDENT RESOLUTION BRIDGE
    </text>
    <text x="1390" y="{160 + hnot + 20 + haud + 80}" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="600" fill="#1d4ed8">
        How Planned E-Courts cases flow into Active Legal Precedents:
    </text>
    <text x="1390" y="{160 + hnot + 20 + haud + 105}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">
        1. When a planned `cases` record reaches final judicial disposal,
    </text>
    <text x="1390" y="{160 + hnot + 20 + haud + 125}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">
        2. Landmark &amp; authoritative rulings are published into `legal_judgments`.
    </text>
    <text x="1390" y="{160 + hnot + 20 + haud + 145}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">
        3. Authoring `judges` link to `legal_judgments.bench_judges`.
    </text>
    <text x="1390" y="{160 + hnot + 20 + haud + 165}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">
        4. Official certified orders feed `judgment_documents` (PDF Vault).
    </text>
    <text x="1390" y="{160 + hnot + 20 + haud + 185}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">
        5. Cases cite active statutory sections via `judgment_legal_sections`.
    </text>
    ''')

    # Column 4: ACTIVE PRODUCTION REPOSITORY (Implemented Today)
    svg.append('''
    <rect x="2000" y="130" width="660" height="1570" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5" />
    <rect x="2020" y="117" width="410" height="26" rx="5" fill="#15803d" />
    <text x="2035" y="134" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">ACTIVE IN PRODUCTION: LEGAL REPOSITORY</text>
    ''')

    # legal_judgments
    act_j_fields = [
        ("id", "INT", True, False, "Primary Key (105 Verified Precedents)"),
        ("case_name", "VARCHAR(255)", False, False, "Kesavananda, Puttaswamy, etc."),
        ("citation", "VARCHAR(128)", False, False, "Official SCC / AIR citations"),
        ("neutral_citation", "VARCHAR(128)", False, False, "Indian Neutral Citation System"),
        ("judgment_date", "DATETIME", False, False, "Date of pronouncement"),
        ("bench_judges", "TEXT", False, False, "Full bench coram composition"),
        ("bench_strength", "INT", False, False, "Judge count on bench"),
        ("legal_issue", "TEXT", False, False, "Issues framed and decided"),
        ("key_ratio", "TEXT", False, False, "Ratio decidendi of judgment"),
        ("is_landmark", "TINYINT", False, False, "1 = Landmark precedence"),
        ("is_synthetic", "TINYINT", False, False, "STRICTLY 0 - REAL RECORDS"),
        ("record_provenance", "VARCHAR(32)", False, False, "'REAL_VERIFIED' STRICT")
    ]
    caj, haj = render_table_card(2020, 160, 620, "legal_judgments", "[ACTIVE REPOSITORY]", "#15803d", act_j_fields)
    svg.append(caj)

    # judgment_documents & citations
    act_doc_fields = [
        ("id", "INT", True, False, "Primary Key"),
        ("judgment_id", "INT", False, True, "FK -> legal_judgments.id"),
        ("storage_path", "VARCHAR(255)", False, False, "uploads/legal_judgments/ (98 PDFs)"),
        ("sha256_hash", "VARCHAR(64)", False, False, "Cryptographic integrity digest"),
        ("reporter_name", "VARCHAR(64)", False, False, "SCC, SCR, AIR citations")
    ]
    cadoc, hadoc = render_table_card(2020, 160 + haj + 20, 620, "judgment_documents & citations", "[ACTIVE REPOSITORY]", "#16a34a", act_doc_fields)
    svg.append(cadoc)

    # legal_sections & legal_acts
    act_sec_fields = [
        ("id", "INT", True, False, "Primary Key (2,419 Provisions)"),
        ("act_id", "INT", False, True, "FK -> legal_acts.id (10 Enactments)"),
        ("section_number", "VARCHAR(32)", False, False, "Sec 302, Sec 101, Art 21"),
        ("section_title", "VARCHAR(255)", False, False, "Marginal section note"),
        ("legal_nature", "VARCHAR(64)", False, False, "Penal, Procedural, Constitutional")
    ]
    casec, hasec = render_table_card(2020, 160 + haj + 20 + hadoc + 20, 620, "legal_sections & legal_acts", "[ACTIVE REPOSITORY]", "#15803d", act_sec_fields)
    svg.append(casec)

    # legal_section_relations (Concordance)
    act_rel_fields = [
        ("id", "INT", True, False, "Primary Key (149 Mappings)"),
        ("from_section_id", "INT", False, True, "FK -> legal_sections.id (Old Code)"),
        ("to_section_id", "INT", False, True, "FK -> legal_sections.id (New Code)"),
        ("relation_type", "VARCHAR(64)", False, False, "REPLACED_BY, CONCORDANCE"),
        ("notes", "TEXT", False, False, "Transition concordance scope")
    ]
    carel, harel = render_table_card(2020, 160 + haj + 20 + hadoc + 20 + hasec + 20, 620, "legal_section_relations", "[ACTIVE REPOSITORY]", "#16a34a", act_rel_fields)
    svg.append(carel)

    svg.append('</svg>')
    return "\n".join(svg)

# -----------------------------------------------------------------------------
# 3. SYSTEM ARCHITECTURE - CURRENT PRODUCTION
# -----------------------------------------------------------------------------
def build_current_arch_svg():
    width = 2400
    height = 1450
    
    svg = [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
    <defs>
        <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="curArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b172a" />
            <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="{width}" height="{height}" fill="#f8fafc" />
    
    <!-- Top System Header Banner -->
    <rect x="0" y="0" width="{width}" height="100" fill="url(#curArchGrad)" />
    <line x1="0" y1="100" x2="{width}" y2="100" stroke="#c59b27" stroke-width="3" />
    
    <text x="50" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">
        JUDICIARY INFORMATION SYSTEM (JIS) — CURRENT SYSTEM ARCHITECTURE
    </text>
    <text x="50" y="75" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">
        Production Constitutional &amp; Legal Repository Architecture • Strict REAL_VERIFIED Judgment Pipeline
    </text>
    
    <rect x="1800" y="32" width="550" height="38" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
    <circle cx="1820" cy="51" r="5" fill="#34d399" />
    <text x="1835" y="55" font-family="'SF Mono', Menlo, Consolas, monospace" font-size="11.5" font-weight="700" fill="#ecfdf5">
        STATUS: LIVE &amp; OPERATIONAL ON HTTP://LOCALHOST:3001
    </text>
    ''']

    # TIER 1: CLIENT PRESENTATION TIER
    svg.append('''
    <!-- TIER 1 -->
    <rect x="50" y="130" width="2300" height="320" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 142 Q 50 130 62 130 L 2338 130 Q 2350 130 2350 142 L 2350 170 L 50 170 Z" fill="#1e293b" />
    <text x="70" y="157" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffffff">
        TIER 1: PRESENTATION LAYER (Semantic HTML5, CSS3 &amp; Vanilla JavaScript Client)
    </text>
    ''')

    cards_tier1 = [
        ("🏛️ Constitutional Homepage", "public/index.html", [
            "• Authentic Supreme Court insignia",
            "• Sanskrit Devanagari identity",
            "• Indian Constitutional Preamble values",
            "• Real-time metric cards (from /api/stats)"
        ], 70, 190, 430, "#0f172a"),
        ("⚖️ Judgments Explorer View", "#judgments-view", [
            "• Live search by ratio, title & issue",
            "• Multi-tier Court & Year filters",
            "• Strict genuine verified records only",
            "• Fast responsive pagination (10 per page)"
        ], 520, 190, 430, "#1e3a8a"),
        ("📜 Judgment Detail Dossier", "#judgment-detail-view", [
            "• Case Overview & background",
            "• Legal Issues presented to Court",
            "• Operative Judgment & Holding",
            "• 5-7 Point-wise case-specific findings",
            "• Interpreted Statutory Provisions"
        ], 970, 190, 430, "#0369a1"),
        ("📑 Verified PDF Viewer", "#pdf-modal", [
            "• Inline streamed authentic PDF",
            "• Direct Supreme Court registry links",
            "• SHA-256 integrity verification badge",
            "• Clean full-screen inspection"
        ], 1420, 190, 430, "#0f766e"),
        ("🔄 Statutory Concordance Matrix", "#mappings-view", [
            "• IPC ➔ BNS Concordance table",
            "• CrPC ➔ BNSS Transition mapping",
            "• IEA ➔ BSA Evidentiary mapping",
            "• Bidirectional provision cross-links"
        ], 1870, 190, 430, "#4338ca")
    ]

    for title, sub, lines, cx, cy, cw, color in cards_tier1:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="240" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2" />
        <rect x="{cx}" y="{cy}" width="{cw}" height="32" rx="8" fill="{color}" />
        <text x="{cx+12}" y="{cy+21}" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">{title}</text>
        <text x="{cx+12}" y="{cy+50}" font-family="'SF Mono', Menlo, monospace" font-size="10" font-weight="600" fill="#64748b">{sub}</text>
        ''')
        ly = cy + 74
        for l in lines:
            svg.append(f'<text x="{cx+12}" y="{ly}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">{l}</text>')
            ly += 22

    # TIER 2: APPLICATION & REST API TIER
    svg.append('''
    <!-- TIER 2 -->
    <rect x="50" y="490" width="2300" height="380" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 502 Q 50 490 62 490 L 2338 490 Q 2350 490 2350 502 L 2350 530 L 50 530 Z" fill="#1e3a8a" />
    <text x="70" y="517" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffffff">
        TIER 2: APPLICATION ENGINE &amp; REST APIS (Node.js &amp; Express 4.x - server.js)
    </text>
    ''')

    cards_tier2 = [
        ("GET /api/stats", "Repository Metrics Engine", [
            "• Real-time SQL aggregation",
            "• Strict REAL_VERIFIED filter",
            "• Total acts, sections, mappings",
            "• Verified PDF document count"
        ], 70, 550, 430, "#1e3a8a"),
        ("GET /api/judgments", "Verified Judgment Search Pipeline", [
            "• Parameters: q, court, year, sort, page",
            "• SQL WHERE: is_synthetic = 0",
            "• SQL AND: record_provenance = 'REAL_VERIFIED'",
            "• In-memory PDF manifest enrichment"
        ], 520, 550, 430, "#0369a1"),
        ("GET /api/judgments/:id", "Single Judgment Detail Pipeline", [
            "• Verified record integrity validation",
            "• JOINs judgment_legal_sections",
            "• Injects curated findings from case_records.json",
            "• Returns PDF metadata & source URL"
        ], 970, 550, 430, "#0f766e"),
        ("GET /api/judgments/:id/pdf", "Verified PDF Stream Pipeline", [
            "• Looks up data/verified_pdf_manifest.json",
            "• Pipes authenticated PDF directly to client",
            "• Headers: application/pdf, inline",
            "• Fallback to official judicial portal URL"
        ], 1420, 550, 430, "#065f46"),
        ("GET /api/acts & /api/mappings", "Statutory Concordance Engine", [
            "• Returns 10 Acts & 2,419 Sections",
            "• Resolves bidirectional mappings",
            "• IPC ➔ BNS, CrPC ➔ BNSS, IEA ➔ BSA",
            "• Procedural classifications"
        ], 1870, 550, 430, "#4338ca")
    ]

    for title, sub, lines, cx, cy, cw, color in cards_tier2:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="290" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2" />
        <rect x="{cx}" y="{cy}" width="{cw}" height="32" rx="8" fill="{color}" />
        <text x="{cx+12}" y="{cy+21}" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">{title}</text>
        <text x="{cx+12}" y="{cy+50}" font-family="-apple-system, sans-serif" font-size="10.5" font-weight="600" fill="#64748b">{sub}</text>
        ''')
        ly = cy + 76
        for l in lines:
            svg.append(f'<text x="{cx+12}" y="{ly}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">{l}</text>')
            ly += 24

    # TIER 3: DATA & KNOWLEDGE STORAGE TIER
    svg.append('''
    <!-- TIER 3 -->
    <rect x="50" y="910" width="2300" height="490" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 922 Q 50 910 62 910 L 2338 910 Q 2350 910 2350 922 L 2350 950 L 50 950 Z" fill="#0f766e" />
    <text x="70" y="937" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffffff">
        TIER 3: DATA, DOCUMENT &amp; KNOWLEDGE STORAGE TIER
    </text>
    ''')

    cards_tier3 = [
        ("🗄️ Relational Database (MySQL 8 - jis_db)", [
            "• legal_judgments (105 REAL_VERIFIED Cases)",
            "• legal_acts (10 Substantive, Procedural & Constitutional Enactments)",
            "• legal_sections (2,419 Provisions & Articles)",
            "• legal_section_relations (149 Transition Concordances)",
            "• judgment_legal_sections (126 Judicial Interpretations)",
            "• judgment_documents (Verified Document Metadata Records)",
            "• Strict WHERE is_synthetic = 0 AND record_provenance = 'REAL_VERIFIED'"
        ], 70, 970, 720, "#0f766e"),
        ("📂 Authenticated PDF Storage Vault", [
            "• uploads/legal_judgments/ (98 Authentic Supreme Court Judgments)",
            "• data/verified_pdf_manifest.json (Cryptographic Manifest & Hashes)",
            "• Includes landmark rulings: Kesavananda, Puttaswamy, Maneka Gandhi,",
            "  Navtej Johar, Lalita Kumari, Arnesh Kumar, Electoral Bonds, etc.",
            "• Direct byte-stream delivery with zero third-party tracking",
            "• Local filesystem persistence with absolute provenance integrity"
        ], 830, 970, 720, "#047857"),
        ("🧠 Judicial Analysis & Intelligence Store", [
            "• data/case_records.json (105 Curated Judicial Knowledge Records)",
            "• Case Overview: Background & constitutional dispute origin",
            "• Issues Before The Court: Exact legal questions adjudicated",
            "• Judgment & Holding: Operative constitutional decision",
            "• Key Legal Findings: 5-7 Case-specific point-wise legal findings",
            "• Relevant Statutory Provisions & Interpreted Doctrines"
        ], 1590, 970, 720, "#065f46")
    ]

    for title, lines, cx, cy, cw, color in cards_tier3:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="400" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2" />
        <rect x="{cx}" y="{cy}" width="{cw}" height="32" rx="8" fill="{color}" />
        <text x="{cx+14}" y="{cy+21}" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">{title}</text>
        ''')
        ly = cy + 65
        for l in lines:
            svg.append(f'<text x="{cx+14}" y="{ly}" font-family="-apple-system, sans-serif" font-size="11.5" fill="#334155">{l}</text>')
            ly += 26

    svg.append('</svg>')
    return "\n".join(svg)

# -----------------------------------------------------------------------------
# 4. SYSTEM ARCHITECTURE - FUTURE ENTERPRISE
# -----------------------------------------------------------------------------
def build_future_arch_svg():
    width = 2500
    height = 1580
    
    svg = [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
    <defs>
        <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="futArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e1b4b" />
        </linearGradient>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="{width}" height="{height}" fill="#f8fafc" />
    
    <!-- Header Banner -->
    <rect x="0" y="0" width="{width}" height="105" fill="url(#futArchGrad)" />
    <line x1="0" y1="105" x2="{width}" y2="105" stroke="#f59e0b" stroke-width="3" />
    
    <text x="50" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">
        JUDICIARY INFORMATION SYSTEM (JIS) — FUTURE ENTERPRISE SYSTEM ARCHITECTURE
    </text>
    <text x="50" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#cbd5e1">
        Target Architecture: End-to-End E-Courts Lifecycle Integrated with Active Statutory &amp; Precedent Repository
    </text>
    
    <!-- Legend -->
    <rect x="1560" y="28" width="440" height="48" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="1585" cy="52" r="6" fill="#38bdf8" />
    <text x="1605" y="46" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">ACTIVE IN PRODUCTION TODAY</text>
    <text x="1605" y="64" font-family="-apple-system, sans-serif" font-size="10.5" fill="#94a3b8">Repository Engine, Real Verified Judgments &amp; PDFs</text>
    
    <rect x="2020" y="28" width="440" height="48" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="1.5" />
    <circle cx="2045" cy="52" r="6" fill="#f59e0b" />
    <text x="2065" y="46" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#fbbf24">PLANNED / FUTURE SCOPE</text>
    <text x="2065" y="64" font-family="-apple-system, sans-serif" font-size="10.5" fill="#fed7aa">Target Modules (Not Currently Implemented in Demo)</text>
    ''']

    # LAYER 1: MULTI-CHANNEL PERSONA PORTALS [PLANNED]
    svg.append('''
    <!-- LAYER 1 -->
    <rect x="50" y="130" width="2400" height="230" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 142 Q 50 130 62 130 L 2438 130 Q 2450 130 2450 142 L 2450 166 L 50 166 Z" fill="#b45309" />
    <text x="70" y="155" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
        1. USER &amp; PERSONA ACCESS PORTALS [PLANNED / FUTURE SCOPE — NOT CURRENTLY IMPLEMENTED]
    </text>
    ''')

    portals = [
        ("🏛️ Citizen & Litigant Portal", [
            "• Public Case Status by CNR / Case No.",
            "• Daily Cause List View by Courtroom",
            "• Constitutional & Landmark Precedent Search",
            "• Certified Order & Judgment Download"
        ], 70, 180, 560, "#b45309"),
        ("⚖️ Advocate & Bar Portal", [
            "• Online E-Filing & Defect Curing Desk",
            "• Digital Vakalatnama & Appearance Registry",
            "• Personalized Daily Hearing Board & Calendar",
            "• Electronic Pleading Docket Submission"
        ], 670, 180, 560, "#c2410c"),
        ("👨‍⚖️ Judicial Bench Portal", [
            "• Digital Courtroom Case File (E-Docket)",
            "• Daily Cause List Proceedings & Notes",
            "• Interim Injunction & Bail Order Signing",
            "• Final Judgment Pronouncement Workflow"
        ], 1270, 180, 560, "#b45309"),
        ("📋 Registry & Scrutiny Portal", [
            "• E-Filing Scrutiny & Defect Checking",
            "• CNR Number Generation & Registration",
            "• Roster Allocation & Bench Constitution",
            "• Certified Copy Issuance Desk"
        ], 1870, 180, 560, "#c2410c")
    ]

    for title, lines, cx, cy, cw, color in portals:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="160" rx="8" fill="#ffffff" stroke="#fef3c7" stroke-width="1.2" />
        <rect x="{cx}" y="{cy}" width="{cw}" height="28" rx="8" fill="{color}" />
        <text x="{cx+10}" y="{cy+18}" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">{title}</text>
        ''')
        ly = cy + 48
        for l in lines:
            svg.append(f'<text x="{cx+10}" y="{ly}" font-family="-apple-system, sans-serif" font-size="10.5" fill="#334155">{l}</text>')
            ly += 22

    # LAYER 2: SECURITY & GATEWAY [PLANNED]
    svg.append('''
    <!-- LAYER 2 -->
    <rect x="50" y="380" width="2400" height="150" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 392 Q 50 380 62 380 L 2438 380 Q 2450 380 2450 392 L 2450 416 L 50 416 Z" fill="#9a3412" />
    <text x="70" y="405" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
        2. SECURITY, IDENTITY &amp; API GATEWAY LAYER [PLANNED / FUTURE SCOPE — NOT CURRENTLY IMPLEMENTED]
    </text>
    ''')

    gateways = [
        ("🛡️ API Gateway & WAF", "Rate limiting, TLS 1.3 termination, CORS & DDOS shield", 70, 430, 760),
        ("🔐 IAM & Role-Based Access Control (RBAC)", "Judges, Advocates, Registrars, Litigants, 2FA Auth & Audit Tokens", 870, 430, 760),
        ("📜 Cryptographic Audit Interceptor", "Digital Signature (DSC) verification, SHA-256 chain-of-custody logging", 1670, 430, 760)
    ]
    for title, desc, cx, cy, cw in gateways:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="85" rx="8" fill="#ffffff" stroke="#fef3c7" stroke-width="1.2" />
        <text x="{cx+14}" y="{cy+30}" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#9a3412">{title}</text>
        <text x="{cx+14}" y="{cy+55}" font-family="-apple-system, sans-serif" font-size="11" fill="#475569">{desc}</text>
        ''')

    # LAYER 3: CORE APPLICATION SERVICES (Planned Microservices + Active Repository Engine)
    svg.append('''
    <!-- LAYER 3 -->
    <rect x="50" y="550" width="2400" height="470" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 562 Q 50 550 62 550 L 2438 550 Q 2450 550 2450 562 L 2450 586 L 50 586 Z" fill="#1e293b" />
    <text x="70" y="575" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
        3. MODULAR APPLICATION SERVICES (PLANNED E-COURTS WORKFLOW SERVICES + ACTIVE PRODUCTION REPOSITORY)
    </text>
    ''')

    services = [
        ("📁 E-Filing & Scrutiny Engine", "[PLANNED]", [
            "• Pleading verification & defect checklist",
            "• Digital Vakalatnama attestation",
            "• CNR registration & tracking number"
        ], 70, 600, 560, "#b45309"),
        ("🏛️ Court & Roster Service", "[PLANNED]", [
            "• Bench constitution (Single, Division, Full)",
            "• Judge allocation & tenure management",
            "• Courtroom mapping & roster periods"
        ], 670, 600, 560, "#c2410c"),
        ("📅 Hearing & Cause List Service", "[PLANNED]", [
            "• Automated daily cause list generation",
            "• Adjournment & listing scheduler",
            "• Real-time Court Master proceedings entry"
        ], 1270, 600, 560, "#b45309"),
        ("📝 Orders & Bail Service", "[PLANNED]", [
            "• Interim injunction orders drafting",
            "• Bail bonds & conditions recording",
            "• Cryptographically signed order generation"
        ], 1870, 600, 560, "#c2410c"),

        ("🔔 Notification Engine", "[PLANNED]", [
            "• SMS / WhatsApp / Email dispatchers",
            "• Next hearing alerts for litigants",
            "• Defect notification to advocates"
        ], 70, 780, 560, "#9a3412"),
        ("🛡️ Audit & Compliance Logger", "[PLANNED]", [
            "• Immutable log stream for filings & orders",
            "• User IP, action delta & state capture",
            "• Forensic chain-of-custody compliance"
        ], 670, 780, 560, "#7c2d12"),
        ("📚 Statutory & Precedent Repository Engine", "🟢 ACTIVE TODAY IN PRODUCTION", [
            "• 105 Real Verified Precedents (Kesavananda, Puttaswamy, etc.)",
            "• 2,419 Statutory Sections across Old & New Criminal Codes",
            "• 149 Transition Concordance Mappings (IPC ➔ BNS, etc.)",
            "• Verified PDF Streaming Pipeline (98 Authentic Documents)",
            "• Case overview, issues, holdings & 5-7 legal findings"
        ], 1270, 780, 1160, "#065f46")
    ]

    for title, badge, lines, cx, cy, cw, color in services:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="160" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2" />
        <rect x="{cx}" y="{cy}" width="{cw}" height="28" rx="8" fill="{color}" />
        <text x="{cx+10}" y="{cy+18}" font-family="-apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">{title}</text>
        <rect x="{cx+cw-len(badge)*7-14}" y="{cy+5}" width="{len(badge)*7+8}" height="18" rx="4" fill="rgba(255,255,255,0.25)" />
        <text x="{cx+cw-len(badge)*7-10}" y="{cy+18}" font-family="-apple-system, sans-serif" font-size="9" font-weight="600" fill="#ffffff">{badge}</text>
        ''')
        ly = cy + 48
        for l in lines:
            svg.append(f'<text x="{cx+10}" y="{ly}" font-family="-apple-system, sans-serif" font-size="10.5" fill="#334155">{l}</text>')
            ly += 22

    # LAYER 4: MULTI-TIER PERSISTENCE & DATA LAYER
    svg.append('''
    <!-- LAYER 4 -->
    <rect x="50" y="1040" width="2400" height="500" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M 50 1052 Q 50 1040 62 1040 L 2438 1040 Q 2450 1040 2450 1052 L 2450 1076 L 50 1076 Z" fill="#0f766e" />
    <text x="70" y="1065" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
        4. PERSISTENCE &amp; STORAGE ARCHITECTURE (PLANNED E-COURTS STORES + ACTIVE PRODUCTION LEGAL REPOSITORY)
    </text>
    ''')

    stores = [
        ("🗄️ Planned Operational DB", "PLANNED", [
            "• cases, case_filings, case_parties",
            "• hearings, orders, court_benches",
            "• users, roles, advocates, judges",
            "• notifications, audit_logs",
            "• OLTP Case lifecycle transactions"
        ], 70, 1090, 560, "#b45309"),
        ("🏛️ Active Legal Knowledge DB (jis_db)", "🟢 ACTIVE TODAY", [
            "• legal_judgments (105 REAL_VERIFIED Cases)",
            "• legal_acts (10 Statutory Enactments)",
            "• legal_sections (2,419 Provisions & Articles)",
            "• legal_section_relations (149 Concordances)",
            "• judgment_legal_sections (126 Interpretations)"
        ], 670, 1090, 560, "#065f46"),
        ("📂 Document & Evidence Vault", "HYBRID: ACTIVE + PLANNED", [
            "• uploads/legal_judgments/ (98 Authentic PDFs) [ACTIVE]",
            "• data/verified_pdf_manifest.json (Integrity Hashes) [ACTIVE]",
            "• Encrypted Case Pleadings & Vakalatnamas [PLANNED]",
            "• Signed Interim & Certified Orders [PLANNED]",
            "• S3 / MinIO Compliant Secure Object Vault [PLANNED]"
        ], 1270, 1090, 560, "#047857"),
        ("🔍 Legal Search & Analytics Cluster", "PLANNED", [
            "• Elasticsearch / OpenSearch cluster",
            "• Ratio decidendi legal vector embeddings",
            "• Full-text case search across 75 years",
            "• Cross-court citation network graph",
            "• Judicial analytics & pendency dashboards"
        ], 1870, 1090, 560, "#0369a1")
    ]

    for title, badge, lines, cx, cy, cw, color in stores:
        svg.append(f'''
        <rect x="{cx}" y="{cy}" width="{cw}" height="420" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2" />
        <rect x="{cx}" y="{cy}" width="{cw}" height="32" rx="8" fill="{color}" />
        <text x="{cx+12}" y="{cy+21}" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff">{title}</text>
        <rect x="{cx+cw-len(badge)*7-14}" y="{cy+6}" width="{len(badge)*7+8}" height="20" rx="4" fill="rgba(255,255,255,0.25)" />
        <text x="{cx+cw-len(badge)*7-10}" y="{cy+20}" font-family="-apple-system, sans-serif" font-size="9.5" font-weight="600" fill="#ffffff">{badge}</text>
        ''')
        ly = cy + 68
        for l in lines:
            svg.append(f'<text x="{cx+12}" y="{ly}" font-family="-apple-system, sans-serif" font-size="11" fill="#334155">{l}</text>')
            ly += 26

    svg.append('</svg>')
    return "\n".join(svg)

def main():
    import re
    os.makedirs('docs', exist_ok=True)
    
    diagrams = [
        ("docs/ER-Diagram-Current.svg", "docs/ER-Diagram-Current.png", build_current_er_svg),
        ("docs/ER-Diagram-Future.svg", "docs/ER-Diagram-Future.png", build_future_er_svg),
        ("docs/System-Architecture.svg", "docs/System-Architecture.png", build_current_arch_svg),
        ("docs/Future-System-Architecture.svg", "docs/Future-System-Architecture.png", build_future_arch_svg)
    ]
    
    for svg_path, png_path, builder in diagrams:
        print(f"Generating {svg_path}...")
        raw_svg = builder()
        # Clean unescaped ampersands for strict XML/CoreSVG compliance
        svg_content = re.sub(r'&(?!(?:amp|lt|gt|quot|apos);)', '&amp;', raw_svg)
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Converting {svg_path} -> {png_path} using sips...")
        res = subprocess.run(["sips", "-s", "format", "png", svg_path, "--out", png_path], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error converting {svg_path}: {res.stderr}")
        else:
            size_kb = os.path.getsize(png_path) / 1024
            print(f"Created {png_path} ({size_kb:.1f} KB)")

if __name__ == '__main__':
    main()
