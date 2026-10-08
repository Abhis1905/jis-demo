#!/usr/bin/env python3
import json
import os

with open('/tmp/full_105_with_sections.json', 'r') as f:
    cases = json.load(f)

print(f"Loaded {len(cases)} cases.")

# We will populate case_details dictionary keyed by str(case_id)
# Each entry:
# {
#   "overview": "...",
#   "issues": "...",
#   "holding": "...",
#   "key_findings": ["1...", "2...", "3...", "4...", "5...", "6...", "7..."],
#   "provisions": [
#      {"provision": "...", "act": "...", "title": "...", "relevance": "..."}
#   ]
# }

case_records = {}

# A comprehensive curation mapping for each judgment ID
# Let's define the curated data
curated = {
    11: {
        "overview": "His Holiness Kesavananda Bharati, head of the Edneer Mutt in Kasaragod, challenged Kerala land reform legislation under Article 32. While the petition was pending, Parliament enacted the 24th, 25th, and 29th Constitutional Amendments to bypass the ruling in Golak Nath and insulate Ninth Schedule laws from judicial review. A historic 13-judge Constitution Bench was assembled to decide whether Parliament's amending power under Article 368 was absolute or subject to inherent constitutional limitations.",
        "issues": "Whether Parliament's constituent power to amend the Constitution under Article 368 is unlimited, and whether constitutional amendments can abrogate or emasculate fundamental rights under Part III.",
        "holding": "By a 7:6 majority, the Supreme Court established the Basic Structure Doctrine. Parliament holds plenary power to amend any part of the Constitution, including Fundamental Rights, but cannot alter, damage, or destroy the basic structure or essential framework of the Constitution.",
        "key_findings": [
            "The power to amend under Article 368 is a constituent power, not ordinary legislative power, but the word 'amend' implies that the original constitutional identity cannot be destroyed.",
            "Parliament cannot rewrite or replace the Constitution with an entirely new document or abrogate its fundamental democratic framework.",
            "Core features including supremacy of the Constitution, republican and democratic governance, separation of powers, and secularism form the inviolable basic structure.",
            "Judicial review is an indispensable constitutional mechanism to enforce the basic structure limitation against unconstitutional amendments.",
            "Article 13(2) does not apply to constitutional amendments under Article 368, thereby overruling the contrary holding in Golak Nath.",
            "Section 4 of the 25th Amendment Act, which barred judicial review of laws declared to further Directive Principles under Article 39(b) and (c), was held unconstitutional.",
            "The basic structure doctrine harmonizes popular parliamentary sovereignty with constitutional supremacy and protection of human rights."
        ],
        "provisions": [
            {"provision": "Article 368", "act": "Constitution of India", "title": "Power of Parliament to amend the Constitution", "relevance": "Interpreted to establish that the power of constitutional amendment is subject to the implied limitation of the Basic Structure Doctrine."},
            {"provision": "Article 13", "act": "Constitution of India", "title": "Laws inconsistent with fundamental rights", "relevance": "Examined regarding whether 'law' in Article 13(2) includes constitutional amendments; Golak Nath overruled on this point."},
            {"provision": "Article 32", "act": "Constitution of India", "title": "Remedies for enforcement of Fundamental Rights", "relevance": "Affirmed as a foundational pillar of the basic structure enabling citizens to challenge unconstitutional amendments."},
            {"provision": "Article 31C", "act": "Constitution of India", "title": "Saving of laws giving effect to certain directive principles", "relevance": "First part upheld, but the conclusive declaration clause barring judicial review was severed and struck down."}
        ]
    },
    12: {
        "overview": "A retired High Court judge, Justice K.S. Puttaswamy, challenged the constitutional validity of the Union Government's biometric identification project (Aadhaar). When the State contended that early decisions in M.P. Sharma (1954) and Kharak Singh (1962) precluded any fundamental right to privacy, the matter was referred to a 9-judge Constitution Bench to conclusively resolve the constitutional status of privacy.",
        "issues": "Whether the Right to Privacy is guaranteed as an independent Fundamental Right under the Constitution of India, and whether the earlier decisions in M.P. Sharma and Kharak Singh laid down correct law.",
        "holding": "A unanimous 9-judge Constitution Bench held that privacy is a fundamental, natural, and inalienable right protected as an intrinsic part of the right to life and personal liberty under Article 21 and the freedoms guaranteed by Part III.",
        "key_findings": [
            "Privacy is not a granted privilege but an inalienable natural right inherent to human dignity, autonomy, and bodily integrity.",
            "M.P. Sharma was overruled to the extent it held privacy is not a fundamental right, and the majority observations in Kharak Singh were formally overruled.",
            "Privacy encompasses three critical facets: bodily privacy, spatial privacy, and informational privacy / personal data autonomy.",
            "Any state encroachment on privacy must satisfy a rigorous three-fold test: legality (existence of law), legitimate state aim, and proportionality.",
            "Informational privacy requires that individuals have control over the collection, storage, and processing of their personal data by state and non-state entities.",
            "The right extends protection against state surveillance, unauthorized profiling, and psychological intrusion.",
            "Sexual orientation and intimate personal choices are protected facets of privacy and constitutional liberty under Article 21."
        ],
        "provisions": [
            {"provision": "Article 21", "act": "Constitution of India", "title": "Protection of life and personal liberty", "relevance": "Recognized as the primary constitutional repository of the right to privacy, encompassing personal autonomy and dignity."},
            {"provision": "Article 14", "act": "Constitution of India", "title": "Equality before law", "relevance": "Invoked to subject arbitrary privacy intrusions to non-arbitrariness review."},
            {"provision": "Article 19", "act": "Constitution of India", "title": "Protection of freedoms", "relevance": "Protects informational privacy, free expression, movement, and private association from unjustified state surveillance."}
        ]
    },
    13: {
        "overview": "The Regional Passport Officer, New Delhi, impounded the passport of journalist Maneka Gandhi under Section 10(3)(c) of the Passports Act, 1967 'in the public interest' without furnishing reasons or providing a pre-decisional hearing. The petitioner approached the Supreme Court under Article 32 challenging the administrative order as arbitrary and violative of her fundamental rights to personal liberty, free speech, and freedom of movement.",
        "issues": "Whether the right to travel abroad is part of personal liberty under Article 21, and whether 'procedure established by law' requires that such procedure must be just, fair, and reasonable conforming to natural justice.",
        "holding": "The 7-judge Constitution Bench held that 'procedure established by law' under Article 21 cannot be arbitrary, oppressive, or fanciful; it must be just, fair, and reasonable. The Golden Triangle doctrine established that Articles 14, 19, and 21 are mutually reinforcing and not water-tight compartments.",
        "key_findings": [
            "The right to travel abroad is an integral component of 'personal liberty' protected under Article 21.",
            "Procedure established by law under Article 21 must satisfy the standards of fairness, reasonableness, and justice, effectively incorporating substantive due process principles into Indian jurisprudence.",
            "Articles 14, 19, and 21 form a constitutional trinity or 'Golden Triangle'; a law depriving personal liberty must simultaneously pass the tests of non-arbitrariness under Article 14 and reasonableness under Article 19.",
            "Principles of natural justice (audi alteram partem) are implicit in Article 21 and must be read into statutory provisions unless excluded by clear legislative necessity.",
            "Post-decisional hearing was accepted in this case as curing the initial absence of notice, avoiding mechanical invalidation of administrative steps taken for urgent reasons.",
            "The narrow literal interpretation of Article 21 adopted in A.K. Gopalan was conclusively buried.",
            "Executive discretion to curtail fundamental freedoms without communicating reasons is antithetical to the rule of law."
        ],
        "provisions": [
            {"provision": "Article 21", "act": "Constitution of India", "title": "Protection of life and personal liberty", "relevance": "Transformed from a literal procedural check into a substantive guarantee requiring just, fair, and reasonable procedure."},
            {"provision": "Article 14", "act": "Constitution of India", "title": "Equality before law", "relevance": "Applied as an overarching test against arbitrary administrative action affecting personal liberty."},
            {"provision": "Article 19(1)(a)", "act": "Constitution of India", "title": "Freedom of speech and expression", "relevance": "Held to be affected when the right to travel abroad for journalistic activities was curtailed."},
            {"provision": "Section 10(3)(c)", "act": "Passports Act, 1967", "title": "Impounding of passport in the public interest", "relevance": "Statutory power subjected to mandatory natural justice requirements and reasonable justification."}
        ]
    },
    14: {
        "overview": "LGBTQ+ activists, dancers, and professionals challenged the constitutional validity of Section 377 of the Indian Penal Code, which criminalized 'carnal intercourse against the order of nature'. The petitioners argued that criminalizing consensual sexual acts between adults in private violated the rights to equality, non-discrimination, freedom of expression, and bodily privacy.",
        "issues": "Whether Section 377 IPC, to the extent that it criminalizes consensual sexual conduct between adults in private, violates Articles 14, 15, 19, and 21 of the Constitution.",
        "holding": "A unanimous 5-judge Constitution Bench read down Section 377 IPC, holding that consensual sexual acts between consenting adults in private are decriminalized. The Court overruled Suresh Kumar Koushal (2014) and affirmed full constitutional equality for LGBTQ+ citizens.",
        "key_findings": [
            "Constitutional morality must triumph over majoritarian or social morality in adjudicating fundamental rights.",
            "Sexual orientation is an innate, biological attribute and an integral facet of individual identity, privacy, and personal autonomy.",
            "Discrimination based on sexual orientation is prohibited under Article 15(1) as a form of sex-based discrimination.",
            "Section 377's application to consenting adults is manifestly arbitrary under Article 14, lacking any rational nexus with a legitimate state purpose.",
            "Bodily autonomy and freedom to choose an intimate partner are protected liberties under Article 21 and Article 19(1)(a).",
            "The ruling in Suresh Kumar Koushal v. Naz Foundation was formally overruled as flawed and regressive.",
            "Section 377 remains valid only regarding non-consensual sexual acts, bestiality, and sexual offenses against minors."
        ],
        "provisions": [
            {"provision": "Section 377", "act": "Indian Penal Code (IPC)", "title": "Unnatural offences", "relevance": "Read down so that private consensual sexual activity between consenting adults is no longer a criminal offence."},
            {"provision": "Article 14", "act": "Constitution of India", "title": "Equality before law", "relevance": "Applied via the doctrine of manifest arbitrariness to strike down the criminalization of consensual acts."},
            {"provision": "Article 15", "act": "Constitution of India", "title": "Prohibition of discrimination", "relevance": "Interpreted to include discrimination on grounds of sexual orientation within the ambit of 'sex'."},
            {"provision": "Article 21", "act": "Constitution of India", "title": "Protection of life and personal liberty", "relevance": "Affirmed as guaranteeing personal autonomy, dignity, and intimate relational privacy."}
        ]
    },
    15: {
        "overview": "The Executive Chairman of the Legal Aid Services West Bengal addressed a letter to the Chief Justice regarding custodial deaths in police lockups. Treating the communication as a PIL under Article 32, the Court examined widespread custodial violence and torture by law enforcement agencies and addressed the urgent need for structural safeguards during arrest and interrogation.",
        "issues": "What preventive, punitive, and remedial measures are required to eradicate custodial violence, torture, and deaths in police custody while safeguarding human rights under Articles 21 and 22.",
        "holding": "The Supreme Court formulated 11 mandatory, binding guidelines to govern every arrest and detention in India. The Court held that custodial torture violates human dignity under Article 21 and affirmed monetary compensation for constitutional torts.",
        "key_findings": [
            "Custodial violence, torture, and lockup deaths constitute serious infringements of the rule of law and human dignity under Article 21.",
            "Police personnel carrying out arrest and interrogation must bear accurate, visible, and clear identification and name tags.",
            "An arrest memo specifying date, time, and signed by at least one respectable witness must be prepared at the time of arrest.",
            "The arrested person has the right to have a friend, relative, or person interested in their welfare informed of their arrest within 8 to 12 hours.",
            "The arrested person must be medically examined at the time of arrest and re-examined every 48 hours by a trained medical officer.",
            "Copies of all arrest documents and memos must be forwarded to the local Magistrate for judicial oversight.",
            "Failure by police officers to adhere to the guidelines renders them liable for departmental disciplinary action as well as contempt of court."
        ],
        "provisions": [
            {"provision": "Article 21", "act": "Constitution of India", "title": "Protection of life and personal liberty", "relevance": "Formulated the bedrock for holding custodial violence strictly prohibited even against criminal suspects."},
            {"provision": "Article 22", "act": "Constitution of India", "title": "Protection against arrest and detention", "relevance": "Enforced procedural safeguards including the right to know grounds of arrest and consult legal counsel."},
            {"provision": "Section 41B", "act": "Code of Criminal Procedure (CrPC)", "title": "Procedure of arrest and duties of officer", "relevance": "Later codified into CrPC pursuant to the guidelines laid down in this landmark verdict."},
            {"provision": "Section 50A", "act": "Code of Criminal Procedure (CrPC)", "title": "Obligation to inform relative of arrest", "relevance": "Legislatively enacted into the procedural code directly reflecting the D.K. Basu arrest notification mandate."}
        ]
    },
    16: {
        "overview": "A minor girl was kidnapped, and despite repeated approaches to the police station, the police officer refused to register an FIR and delayed action for days. A writ petition was filed under Article 32 to determine whether police officers have discretion to conduct a preliminary inquiry before registering an FIR when information discloses the commission of a cognizable offence.",
        "issues": "Whether registration of an FIR is mandatory under Section 154 of the Code of Criminal Procedure upon receipt of information disclosing a cognizable offence, or whether the police officer has the discretion to conduct a preliminary inquiry first.",
        "holding": "A 5-judge Constitution Bench unanimously held that registration of an FIR is mandatory under Section 154 CrPC if information discloses the commission of a cognizable offence. Police officers possess no discretion to conduct a preliminary inquiry in such situations.",
        "key_findings": [
            "The use of the word 'shall' in Section 154(1) CrPC indicates mandatory legislative intent; registration cannot be delayed or avoided.",
            "The police officer cannot evaluate whether the information is credible or reasonable prior to registering the FIR.",
            "Preliminary inquiry is permissible only in exceptional categories: matrimonial disputes, commercial offences, medical negligence cases, corruption cases, or abnormal delay cases.",
            "Where preliminary inquiry is permissible, it must be limited to verifying whether the information discloses a cognizable offence and not to ascertain truth.",
            "A preliminary inquiry must be concluded expeditiously within a maximum period of 7 days (later clarified up to 15 days in exceptional circumstances).",
            "Delinquent police officers who refuse to register an FIR disclose disciplinary delinquency and face statutory prosecution under Section 166A IPC.",
            "Mandatory FIR registration safeguards complainant rights, ensures prompt collection of evidence, and curtails police manipulation."
        ],
        "provisions": [
            {"provision": "Section 154", "act": "Code of Criminal Procedure (CrPC)", "title": "Information in cognizable cases (FIR)", "relevance": "Interpreted as strictly mandatory, obligating station house officers to register an FIR without subjective discretion."},
            {"provision": "Section 166A", "act": "Indian Penal Code (IPC)", "title": "Public servant disobeying direction under law", "relevance": "Affirmed as the penal consequence for law enforcement officers refusing to register mandatory FIRs."},
            {"provision": "Section 173 BNSS", "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS)", "title": "Information in cognizable cases", "relevance": "Corresponds to Section 154 CrPC in the new procedural framework, adopting the Lalita Kumari mandatory mandate."}
        ]
    },
    17: {
        "overview": "The appellant, Arnesh Kumar, faced arrest under Section 498A IPC (cruelty by husband or relatives) and Section 4 of the Dowry Prohibition Act following matrimonial disputes. He approached the Supreme Court seeking anticipatory bail, prompting the Court to examine the rampant problem of mechanical, indiscriminate arrests under Section 498A and other offences punishable with imprisonment up to 7 years.",
        "issues": "Whether police officers can mechanically arrest accused persons under Section 498A IPC without satisfying the objective necessity criteria specified in Section 41 CrPC, and what remedies exist against arbitrary detention.",
        "holding": "The Supreme Court issued mandatory directions prohibiting mechanical arrests in offences punishable with imprisonment up to 7 years. Police officers must satisfy the preconditions under Section 41(1)(b) CrPC and issue a notice of appearance under Section 41A CrPC before effecting arrest.",
        "key_findings": [
            "Arrest brings humiliation, curtails freedom, and casts scars forever; power to arrest must be distinguished from the necessity to arrest.",
            "In offences punishable with imprisonment up to 7 years, arrest cannot be made merely because a cognizable case is registered.",
            "Police officers must be provided with a checklist containing the specific grounds specified under Section 41(1)(b)(ii) CrPC.",
            "The arresting officer must record written reasons justifying why arrest is necessary (to prevent further offences, prevent tampering, or secure attendance).",
            "Magistrates cannot authorize mechanical remand under Section 167 CrPC without perusing the police checklist and independent satisfaction.",
            "Failure to comply with Section 41/41A CrPC renders the arresting officer liable for departmental proceedings and contempt of court.",
            "Judicial Magistrates authorizing detention without recording satisfaction are subject to disciplinary action by the High Court."
        ],
        "provisions": [
            {"provision": "Section 41", "act": "Code of Criminal Procedure (CrPC)", "title": "When police may arrest without warrant", "relevance": "Interpreted to require mandatory objective justification and recorded reasons before arresting without warrant."},
            {"provision": "Section 41A", "act": "Code of Criminal Procedure (CrPC)", "title": "Notice of appearance before police officer", "relevance": "Established as the default procedural requirement instead of custodial arrest for offences up to 7 years."},
            {"provision": "Section 498A", "act": "Indian Penal Code (IPC)", "title": "Husband or relative of husband subjecting woman to cruelty", "relevance": "Subjected to strict procedural oversight to prevent mechanical harassment and misuse of penal machinery."},
            {"provision": "Section 35 BNSS", "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS)", "title": "When police may arrest without warrant", "relevance": "The corresponding BNSS provision codifying the safeguards against mechanical arrest."}
        ]
    },
    18: {
        "overview": "The appellant was convicted of murdering three family members and sentenced to death under Section 302 IPC. The Supreme Court heard a constitutional challenge to the validity of the death penalty under Section 302 IPC and Section 354(3) CrPC on the grounds that capital punishment violates Articles 14, 19, and 21 of the Constitution.",
        "issues": "Whether the death penalty provided under Section 302 IPC and Section 354(3) CrPC is unconstitutional, and what principles govern judicial discretion in awarding capital punishment.",
        "holding": "A 4:1 majority of the 5-judge Constitution Bench upheld the constitutional validity of capital punishment under Section 302 IPC and Section 354(3) CrPC, propounding the landmark 'Rarest of Rare Cases' doctrine.",
        "key_findings": [
            "The death penalty for murder does not violate Article 19 or 21, as the Constitution itself contemplates deprivation of life by 'procedure established by law'.",
            "Under Section 354(3) CrPC, life imprisonment is the general rule and the death sentence is the exceptional sentence requiring special reasons.",
            "Capital punishment must be restricted only to the 'rarest of rare cases' where the alternative option of life imprisonment is unquestionably foreclosed.",
            "Sentencing courts must carry out a comprehensive balancing test weighing aggravating circumstances against mitigating circumstances.",
            "The mitigating circumstances of the offender—including age, mental condition, possibility of reformation, and socioeconomic background—must be given full weight.",
            "A real and abiding concern for the dignity of human life postulates that death should not be awarded unless the crime is so abhorrent that society's conscience demands it.",
            "Justice P.N. Bhagwati delivered a celebrated lone dissent arguing that capital punishment is cruel, arbitrary, and violative of Articles 14 and 21."
        ],
        "provisions": [
            {"provision": "Section 302", "act": "Indian Penal Code (IPC)", "title": "Punishment for murder", "relevance": "Constitutional validity of capital punishment as an alternative punishment was upheld by the majority."},
            {"provision": "Section 354(3)", "act": "Code of Criminal Procedure (CrPC)", "title": "Language and contents of judgment - Special reasons for death penalty", "relevance": "Interpreted to establish that life imprisonment is the rule and capital sentence the rare exception requiring recorded special reasons."},
            {"provision": "Article 21", "act": "Constitution of India", "title": "Protection of life and personal liberty", "relevance": "Held not violated by capital punishment when awarded through just, fair, and non-arbitrary judicial procedure."}
        ]
    },
    19: {
        "overview": "Shayara Bano, a Muslim woman who was abruptly divorced through instant triple talaq (talaq-e-biddat) via a speed post letter, filed a writ petition under Article 32 challenging the practice along with nikah halala and polygamy. A 5-judge Constitution Bench comprising judges of five different religious backgrounds was constituted to determine the constitutional validity of talaq-e-biddat.",
        "issues": "Whether the practice of Talaq-e-Biddat (instant triple talaq) is protected as an essential religious practice under Article 25 of the Constitution, or whether it violates fundamental rights under Article 14.",
        "holding": "By a 3:2 majority, the Supreme Court declared the practice of Talaq-e-Biddat (instant triple talaq) to be unconstitutional, arbitrary, and void in law. The Court held that what is bad in theology cannot be good in law.",
        "key_findings": [
            "Talaq-e-biddat is not an essential religious practice of Islam, as it is considered sinful and disapproved by Islamic jurists themselves.",
            "Section 2 of the Muslim Personal Law (Shariat) Application Act, 1937 recognized talaq, subjecting it to constitutional review under Article 13(1).",
            "Instant triple talaq permits a Muslim man to sever the marital tie whimsically and capriciously without any attempt at reconciliation, violating Article 14.",
            "The doctrine of 'manifest arbitrariness' was firmly established as an independent ground under Article 14 to invalidate both statutory provisions and state-recognized customs.",
            "Legislation or custom that is capricious, irrational, or without adequate determining principle is manifestly arbitrary.",
            "Fundamental rights under Part III prevail over discriminatory personal law practices that are not protected as core religious tenets.",
            "Chief Justice Khehar and Justice Abdul Nazeer dissented, holding that personal law is outside Part III and recommended legislative intervention."
        ],
        "provisions": [
            {"provision": "Article 14", "act": "Constitution of India", "title": "Equality before law", "relevance": "Applied through the doctrine of manifest arbitrariness to strike down the unilateral practice of instant triple talaq."},
            {"provision": "Article 25", "act": "Constitution of India", "title": "Freedom of conscience and free profession of religion", "relevance": "Held not to protect talaq-e-biddat because it was not an essential religious practice of Islam."},
            {"provision": "Muslim Personal Law (Shariat) Application Act, 1937", "act": "Statutory Act", "title": "Section 2", "relevance": "Held to bring rules regarding marriage and divorce within the definition of 'laws in force' subject to constitutional review."}
        ]
    },
    20: {
        "overview": "An Indian expatriate, Joseph Shine, challenged the constitutional validity of Section 497 of the Indian Penal Code and Section 198(2) of the Code of Criminal Procedure. Section 497 criminalized adultery but punished only the male paramour, treated the woman as a victim devoid of agency, and excused the act if committed with the consent or connivance of the woman's husband.",
        "issues": "Whether Section 497 IPC and Section 198(2) CrPC violate Articles 14, 15, and 21 of the Constitution by discriminating on the basis of sex and denying women constitutional agency, equality, and dignity.",
        "holding": "A unanimous 5-judge Constitution Bench struck down Section 497 of the IPC and Section 198(2) of the CrPC as unconstitutional, holding that adultery can be a ground for civil divorce but cannot remain a criminal offence.",
        "key_findings": [
            "Section 497 IPC treated a married woman as the chattel or property of her husband, violating her fundamental right to human dignity under Article 21.",
            "The exemption granted when adultery occurred with the husband's 'consent or connivance' reduced the woman to a possession whose violation depended on the master's assent.",
            "The provision discriminated on grounds of sex under Article 15(1) by denying women the right to prosecute an unfaithful husband or the female paramour.",
            "Section 497 was manifestly arbitrary under Article 14 because it punished only the man while assuming the woman was incapable of independent moral agency.",
            "Criminalizing marital infidelity represents an unwarranted state intrusion into the private, intimate domain of individuals.",
            "Adultery remains a valid ground for civil remedies including divorce and dissolution of marriage, but state penal coercion is illegitimate.",
            "The earlier decisions in Sowmithri Vishnu (1985) and V. Revathi (1988) upholding the provision were overruled."
        ],
        "provisions": [
            {"provision": "Section 497", "act": "Indian Penal Code (IPC)", "title": "Adultery", "relevance": "Struck down in its entirety as unconstitutional and violative of Articles 14, 15, and 21."},
            {"provision": "Section 198(2)", "act": "Code of Criminal Procedure (CrPC)", "title": "Prosecution for offences against marriage", "relevance": "Declared unconstitutional to the extent it permitted only the husband to file a complaint of adultery."},
            {"provision": "Article 14", "act": "Constitution of India", "title": "Equality before law", "relevance": "Applied to condemn the unequal and arbitrary patriarchal classifications underpinning the penal provision."},
            {"provision": "Article 21", "act": "Constitution of India", "title": "Protection of life and personal liberty", "relevance": "Affirmed as protecting female agency, dignity, and private intimate autonomy."}
        ]
    }
}

print(f"Curated {len(curated)} core landmark judgments.")
