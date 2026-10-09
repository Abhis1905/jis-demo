// JIS Phase 2A — Cohort 1 Verified Sections Generator
// Generates data/verified_sections_cohort1.json with source-backed statutory texts,
// plain explanations, essential ingredients, exceptions, consequences, and amendment notes.

const fs = require('fs');
const path = require('path');

const cohort1 = [
  // ==========================================
  // CONSTITUTION OF INDIA (Act 17)
  // ==========================================
  {
    id: 4756, act_id: 17, section_number: 'Art 14',
    section_title: 'Equality before law and equal protection of the laws',
    legal_nature: 'Constitutional Right', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Unamended core provision; declared part of the Basic Structure',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
    plain_explanation: 'Article 14 guarantees two interrelated principles of justice: "equality before the law" (a negative concept prohibiting special privileges) and "equal protection of the laws" (a positive duty to treat similarly situated persons alike). It operates as an anti-arbitrariness charter binding all state action.',
    essential_ingredients: '1. Applies to any person (citizens and non-citizens alike, including juristic entities).\n2. Prohibits state discrimination without reasonable classification.\n3. Requires an intelligible differentia distinguishing persons grouped together from those left out.\n4. Requires a rational nexus between the differentia and the statutory objective sought to be achieved.\n5. Doctrine of Non-Arbitrariness: State action that is unfair, capricious, or irrational per se violates Article 14 (E.P. Royappa / Maneka Gandhi).',
    exceptions: 'Reasonable classification is permissible; protective discrimination / affirmative action under Articles 15 and 16; immunities granted to the President and Governors under Article 361.',
    punishment_or_consequence: 'Any legislative enactment, executive order, or administrative decision violating Article 14 is ultra vires and void under Article 13(2). Enforceable by writ under Article 32 (SC) or Article 226 (HC).'
  },
  {
    id: 4757, act_id: 17, section_number: 'Art 19',
    section_title: 'Protection of certain rights regarding freedom of speech, expression, assembly, association, movement, residence, and profession',
    legal_nature: 'Constitutional Right', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Amended by 1st, 16th, and 44th Constitutional Amendments (Right to property removed from 19(1)(f) in 1978)',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) All citizens shall have the right—\n(a) to freedom of speech and expression;\n(b) to assemble peaceably and without arms;\n(c) to form associations or unions or co-operative societies;\n(d) to move freely throughout the territory of India;\n(e) to reside and settle in any part of the territory of India; and\n(g) to practise any profession, or to carry on any occupation, trade or business.\n\n(2) Nothing in sub-clause (a) of clause (1) shall affect the operation of any existing law, or prevent the State from making any law, in so far as such law imposes reasonable restrictions on the exercise of the right conferred by the said sub-clause in the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality or in relation to contempt of court, defamation or incitement to an offence.',
    plain_explanation: 'Article 19 guarantees six basic democratic freedoms exclusively to Indian citizens. These freedoms are not absolute; each freedom is subject to exhaustively enumerated reasonable restrictions imposed by valid law.',
    essential_ingredients: '1. Available only to Indian citizens.\n2. Six fundamental freedoms: Speech & Expression, Peaceful Assembly, Associations/Unions/Co-operatives, Free Movement, Residence/Settlement, Profession/Trade.\n3. Restrictions must be imposed by enacted law, not executive fiat.\n4. Restrictions must be "reasonable" under the proportionality test (Modern Dental College / Anuradha Bhasin).\n5. Restrictions must strictly fall within specified heads in clauses (2) to (6).',
    exceptions: 'Exhaustive heads of restriction: Sovereignty and integrity of India, security of the State, friendly relations with foreign States, public order, decency or morality, contempt of court, defamation, or incitement to an offence.',
    punishment_or_consequence: 'Laws imposing arbitrary, excessive, or disproportionate restrictions are liable to be struck down under Article 13(2). Enforceable via Articles 32 and 226.'
  },
  {
    id: 4759, act_id: 17, section_number: 'Art 21',
    section_title: 'Protection of life and personal liberty',
    legal_nature: 'Constitutional Right', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Interpreted broadly via Maneka Gandhi (1978) and K.S. Puttaswamy (2017); non-derogable under Article 359 post-44th Amendment',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    plain_explanation: 'Article 21 is the bedrock of constitutional jurisprudence in India. It guarantees that no individual can have their life or personal liberty taken away except through a procedure that is just, fair, reasonable, and non-arbitrary.',
    essential_ingredients: '1. Applies to all persons, both citizens and non-citizens.\n2. "Life" means meaningful human existence with dignity, not mere animal existence (Francis Coralie Mullin).\n3. "Procedure established by law" requires substantive and procedural due process: the law must be valid and the procedure must be just, fair, and reasonable (Maneka Gandhi).\n4. Encompasses unenumerated rights: Right to Privacy (Puttaswamy), Right to Speedy Trial (Hussainara Khatoon), Right to Clean Environment (M.C. Mehta), Right to Health, and Right to Legal Aid.',
    exceptions: 'Lawful deprivation strictly pursuant to just, fair, and valid statutory criminal procedure.',
    punishment_or_consequence: 'State actions violating Article 21 are void. The Supreme Court and High Courts may award constitutional tort compensation (Rudal Sah / Nilabati Behera) and quash unlawful detentions.'
  },
  {
    id: 4762, act_id: 17, section_number: 'Art 25',
    section_title: 'Freedom of conscience and free profession, practice and propagation of religion',
    legal_nature: 'Constitutional Right', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Unamended core secular provision',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) Subject to public order, morality and health and to the other provisions of this Part, all persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion.\n\n(2) Nothing in this article shall affect the operation of any existing law or prevent the State from making any law—\n(a) regulating or restricting any economic, financial, political or other secular activity which may be associated with religious practice;\n(b) providing for social welfare and reform or the throwing open of Hindu religious institutions of a public character to all classes and sections of Hindus.',
    plain_explanation: 'Article 25 protects an individual\'s inner freedom of conscience and outer liberty to practice, profess, and peacefully propagate their religious faith, subject to overarching public welfare and constitutional morality.',
    essential_ingredients: '1. Freedom of conscience: inner spiritual liberty to hold any belief or none.\n2. Right to profess: outward declaration of belief.\n3. Right to practice: performance of religious rites, ceremonies, and customs.\n4. Right to propagate: exposition of tenets without forcible conversion.\n5. Essential Religious Practices Test: Protection extends only to integral religious practices, not secular activities associated with religion (Sabarimala / Shirur Mutt).',
    exceptions: 'Subject to public order, morality, health, other fundamental rights in Part III, and state power to legislate for secular activities and social reform.',
    punishment_or_consequence: 'Discriminatory or excessive state interference with essential religious practices is invalid under Articles 32 and 226.'
  },
  {
    id: 4763, act_id: 17, section_number: 'Art 32',
    section_title: 'Remedies for enforcement of fundamental rights (Prerogative Writs)',
    legal_nature: 'Constitutional Right', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Declared by Dr. B.R. Ambedkar as the "very soul of the Constitution"; basic structure',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed.\n\n(2) The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, whichever may be appropriate, for the enforcement of any of the rights conferred by this Part.',
    plain_explanation: 'Article 32 provides a directly guaranteed fundamental right to petition the Supreme Court of India for the enforcement of any fundamental right in Part III. The Court has broad powers to issue prerogative writs and mould relief.',
    essential_ingredients: '1. Direct access to the Supreme Court without needing to exhaust subordinate appellate remedies for Part III violations.\n2. Five constitutional writs:\n   - Habeas Corpus (release from unlawful detention);\n   - Mandamus (command to public authority to perform legal duty);\n   - Prohibition (preventing inferior tribunal from exceeding jurisdiction);\n   - Quo Warranto (challenging usurpation of public office);\n   - Certiorari (quashing judicial/quasi-judicial orders passed without jurisdiction).\n3. Foundation of Public Interest Litigation (PIL) relaxing locus standi (Bandhua Mukti Morcha / S.P. Gupta).',
    exceptions: 'Cannot be invoked for simple statutory or contractual rights not amounting to fundamental rights.',
    punishment_or_consequence: 'Supreme Court may issue binding writs, award damages for fundamental right violations, and order release or enforcement.'
  },
  {
    id: 4767, act_id: 17, section_number: 'Art 131',
    section_title: 'Original jurisdiction of the Supreme Court',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Amended by Constitution (7th Amendment) Act, 1956',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: 'Subject to the provisions of this Constitution, the Supreme Court shall, to the exclusion of any other court, have original jurisdiction in any dispute—\n(a) between the Government of India and one or more States; or\n(b) between the Government of India and any State or States on one side and one or more other States on the other; or\n(c) between two or more States,\nif and in so far as the dispute involves any question (whether of law or fact) on which the existence or extent of a legal right depends.',
    plain_explanation: 'Article 131 vests exclusive original jurisdiction in the Supreme Court to adjudicate federal disputes between the Union government and States, or between States inter se.',
    essential_ingredients: '1. Exclusive forum: no High Court or subordinate court can entertain these disputes.\n2. Parties must strictly be Union vs State(s) or State vs State.\n3. Dispute must involve a legal right, not purely political controversy.',
    exceptions: 'Excludes pre-Constitution treaties/agreements (proviso to Art 131) and interstate river water disputes barred under Article 262.',
    punishment_or_consequence: 'Judgments rendered under Article 131 are final and binding on all constituent governments of the Indian federation.'
  },
  {
    id: 4768, act_id: 17, section_number: 'Art 136',
    section_title: 'Special leave to appeal by the Supreme Court',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Unamended plenary discretionary power',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) Notwithstanding anything in this Chapter, the Supreme Court may, in its discretion, grant special leave to appeal from any judgment, decree, determination, sentence or order in any cause or matter passed or made by any court or tribunal in the territory of India.\n\n(2) Nothing in clause (1) shall apply to any judgment, determination, sentence or order passed or made by any court or tribunal constituted by or under any law relating to the Armed Forces.',
    plain_explanation: 'Article 136 confers extraordinary, plenary appellate jurisdiction on the Supreme Court. It is an exceptional power exercised when substantial injustice has been caused or grave legal questions arise.',
    essential_ingredients: '1. Discretionary power of the Supreme Court, not an absolute right of the litigant.\n2. Overrides normal procedural barriers ("Notwithstanding anything in this Chapter").\n3. Applies against judgments, decrees, determinations, or orders from any court or tribunal in India.\n4. Exercised sparingly to prevent grave injustice or resolve substantial questions of law.',
    exceptions: 'Explicitly excludes courts or tribunals constituted under armed forces law (Court Martial).',
    punishment_or_consequence: 'The Supreme Court may grant Special Leave to Appeal (SLP), admit the appeal, set aside, modify, or remand the impugned order.'
  },
  {
    id: 4769, act_id: 17, section_number: 'Art 141',
    section_title: 'Law declared by Supreme Court to be binding on all courts (Doctrine of Precedent / Stare Decisis)',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Unamended core constitutional doctrine',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: 'The law declared by the Supreme Court shall be binding on all courts within the territory of India.',
    plain_explanation: 'Article 141 codifies the doctrine of precedent (stare decisis) for the Republic of India. The ratio decidendi of any judgment rendered by the Supreme Court is binding law on all High Courts and subordinate courts across India.',
    essential_ingredients: '1. "Law declared": encompasses ratio decidendi as well as considered obiter dicta of the Supreme Court.\n2. Territorial reach: binding throughout India on all judicial and quasi-judicial tribunals.\n3. The Supreme Court is not bound by its own prior decisions; larger benches may overrule smaller benches (Bengal Immunity Co. / Keshav Mills).\n4. All subordinate authorities are bound; deliberate refusal to follow SC precedent amounts to judicial impropriety and contempt.',
    exceptions: 'Per incuriam judgments (decisions rendered in ignorance of statutory terms or binding precedent) do not create binding ratio.',
    punishment_or_consequence: 'Orders of lower courts passed in violation of Article 141 are invalid and liable to summary reversal.'
  },
  {
    id: 4770, act_id: 17, section_number: 'Art 142',
    section_title: 'Enforcement of decrees and orders of Supreme Court and orders as to discovery, etc. (Complete Justice)',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Unamended; interpreted in Union Carbide (1991) and Supreme Court Bar Association (1998)',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) The Supreme Court in the exercise of its jurisdiction may pass such decree or make such order as is necessary for doing complete justice in any cause or matter pending before it, and any decree so passed or order so made shall be enforceable throughout the territory of India in such manner as may be prescribed by or under any law made by Parliament and, until provision in that behalf is so made, in such manner as the President may by order prescribe.',
    plain_explanation: 'Article 142 equips the Supreme Court with inherent power to pass any decree or order necessary for doing "complete justice" between the parties, bridging statutory gaps where positive law provides no remedy.',
    essential_ingredients: '1. Available exclusively to the Supreme Court.\n2. Must be exercised in a matter pending before the Court.\n3. Objective must be "doing complete justice".\n4. Cannot be used to build a new edifice where the law expressly forbids it, but supplements positive law (Supreme Court Bar Association v. Union of India).',
    exceptions: 'Cannot override substantive statutory prohibitions or fundamental rights.',
    punishment_or_consequence: 'Decrees and orders passed under Article 142 are executable nationwide as if passed by Parliament.'
  },
  {
    id: 4771, act_id: 17, section_number: 'Art 214',
    section_title: 'High Courts for States',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Amended by Constitution (7th Amendment) Act, 1956',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: 'There shall be a High Court for each State.',
    plain_explanation: 'Article 214 establishes the High Court as the principal constitutional judicial institution and superior court of record for each State within the Indian union.',
    essential_ingredients: '1. Constitutional mandate establishing a High Court for each State.\n2. High Courts are superior courts of record with plenary jurisdiction.\n3. Subject to Article 231, Parliament may establish a common High Court for two or more States / Union Territories.',
    exceptions: 'Article 231 allows Parliament by law to establish a common High Court for two or more States (e.g. Punjab & Haryana High Court; Bombay High Court).',
    punishment_or_consequence: 'Constitutional establishment of State judicial leadership.'
  },
  {
    id: 4773, act_id: 17, section_number: 'Art 226',
    section_title: 'Power of High Courts to issue certain writs (Prerogative Writ Jurisdiction)',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Amended by 15th and 42nd/44th Constitutional Amendments; basic structure under L. Chandra Kumar',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) Notwithstanding anything in Article 32, every High Court shall have power, throughout the territories in relation to which it exercises jurisdiction, to issue to any person or authority, including in appropriate cases, any Government, within those territories directions, orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, or any of them, for the enforcement of any of the rights conferred by Part III and for any other purpose.',
    plain_explanation: 'Article 226 empowers High Courts to issue prerogative writs and orders not only for the enforcement of Fundamental Rights (Part III) but also "for any other purpose" (ordinary legal rights and statutory duties). Its scope is wider than Article 32.',
    essential_ingredients: '1. Jurisdiction extends throughout the State territory or wherever cause of action arises (Art 226(2)).\n2. Dual purpose: Enforcement of Part III Fundamental Rights, and "for any other purpose" (statutory/administrative legality).\n3. Power to issue 5 prerogative writs: Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari.\n4. Discretionary remedy: High Court may refuse if alternative efficacious statutory remedy exists, except for fundamental rights violations or breach of natural justice (Whirlpool Corporation).',
    exceptions: 'Discretionary; normally barred if effective alternative statutory remedy exists, unless jurisdiction is lacking or principles of natural justice are breached.',
    punishment_or_consequence: 'High Court can quash administrative/quasi-judicial actions, order release of detenus, and direct public authorities to discharge duties.'
  },
  {
    id: 4777, act_id: 17, section_number: 'Art 368',
    section_title: 'Power of Parliament to amend the Constitution and procedure therefor (Basic Structure Doctrine)',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1950-01-26', amendment_status: 'Amended by 24th and 42nd Amendments; clauses (4) and (5) struck down in Minerva Mills (1980)',
    source_name: 'Constitution of India, 1950 (Ministry of Law and Justice)',
    source_url: 'https://legislative.gov.in/constitution-of-india/',
    statutory_text: '(1) Notwithstanding anything in this Constitution, Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article.\n\n(2) An amendment of this Constitution may be initiated only by the introduction of a Bill for the purpose in either House of Parliament, and when the Bill is passed in each House by a majority of the total membership of that House and by a majority of not less than two-thirds of the members of that House present and voting, it shall be presented to the President who shall give his assent to the Bill and thereupon the Constitution shall stand amended in accordance with the terms of the Bill.',
    plain_explanation: 'Article 368 governs the constituent power of Parliament to amend the Constitution. Under the landmark Basic Structure Doctrine established in Kesavananda Bharati (1973), Parliament\'s amending power is limited and cannot destroy the core identity or basic structure of the Constitution.',
    essential_ingredients: '1. Special majority: Majority of total membership + 2/3rd members present and voting in each House.\n2. Federal ratification: Certain provisions (Articles 54, 55, 73, 162, 241, Chapter IV Part V, Chapter V Part VI, 7th Schedule) require ratification by at least half the State Legislatures.\n3. Basic Structure Limitation: Amending power does not include the power to abrogate judicial review, federalism, secularism, democracy, rule of law, or separation of powers (Kesavananda / Minerva Mills / NJAC).',
    exceptions: 'Ordinary law amendments under Articles 2, 3, 4, 169 do not require Article 368 procedure.',
    punishment_or_consequence: 'Constitutional amendments that breach the Basic Structure are unconstitutional and void ab initio.'
  },

  // ==========================================
  // CODE OF CIVIL PROCEDURE, 1908 (Act 18)
  // ==========================================
  {
    id: 4778, act_id: 18, section_number: 'Sec 9',
    section_title: 'Courts to try all civil suits unless barred',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Active foundational procedural provision',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: 'The Courts shall (subject to the provisions herein contained) have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred.\n\nExplanation I.—A suit in which the right to property or to an office is contested is a suit of a civil nature, notwithstanding that such right may depend entirely on the decision of questions as to religious rites or ceremonies.\n\nExplanation II.—For the purposes of this section, it is immaterial whether or not any fees are attached to the office referred to in Explanation I or whether or not such office is attached to a particular place.',
    plain_explanation: 'Section 9 establishes the foundational principle that civil courts have inherent plenary jurisdiction to try all suits of a civil nature, unless statutory law expressly or by necessary implication bars their cognizance.',
    essential_ingredients: '1. Plenary jurisdiction: Civil courts are presumed to have jurisdiction over civil rights disputes.\n2. "Suit of a civil nature": Involves adjudication of private civil rights and obligations, property, contracts, or office.\n3. Exclusion of jurisdiction: Must be strictly construed; party asserting bar must establish express or implied statutory exclusion (Dhulabhai v. State of M.P.).',
    exceptions: 'Suits barred by express statute (e.g. Debt Recovery Tribunal, NCLT, Family Courts Act, Industrial Disputes Act) or impliedly barred by public policy.',
    punishment_or_consequence: 'If jurisdiction is barred, plaint is rejected or suit dismissed for lack of subject-matter jurisdiction.'
  },
  {
    id: 4779, act_id: 18, section_number: 'Sec 10',
    section_title: 'Stay of suit (Res Sub-Judice)',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Active procedural safeguard against conflicting verdicts',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: 'No Court shall proceed with the trial of any suit in which the matter in issue is also directly and substantially in issue in a previously instituted suit between the same parties, or between parties under whom they or any of them claim litigating under the same title where such suit is pending in the same or any other Court in India having jurisdiction to grant the relief claimed, or in any Court beyond the limits of India established or continued by the Central Government and having like jurisdiction, or before the Supreme Court.\n\nExplanation.—The pendency of a suit in a foreign Court does not preclude the Courts in India from trying a suit founded on the same cause of action.',
    plain_explanation: 'Section 10 codifies the doctrine of Res Sub-Judice. It mandates that a court must stay the trial of a subsequently instituted suit if the matter in issue is directly and substantially identical to an already pending suit between the same parties.',
    essential_ingredients: '1. Two suits: a previously instituted suit and a subsequently instituted suit.\n2. Matter in issue must be directly and substantially identical in both suits.\n3. Same parties or parties litigating under the same title.\n4. Previous suit must be pending in a court of competent jurisdiction.\n5. Object is to prevent parallel proceedings and conflicting judicial verdicts.',
    exceptions: 'Does not bar institution of the second suit (only stays trial); does not apply to foreign court pendency (Explanation to Sec 10).',
    punishment_or_consequence: 'Court stays the trial of the subsequently filed suit pending disposal of the previously instituted suit.'
  },
  {
    id: 4780, act_id: 18, section_number: 'Sec 11',
    section_title: 'Res Judicata',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Key doctrine of judicial finality; amended in 1976 with Explanations VII and VIII',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: 'No Court shall try any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties, or between parties under whom they or any of them claim, litigating under the same title, in a Court competent to try such subsequent suit or the suit in which such issue has been subsequently raised, and has been heard and finally decided by such Court.\n\nExplanation I to VIII clarify constructive res judicata, execution proceedings, and courts of limited jurisdiction.',
    plain_explanation: 'Section 11 embodies the rule of finality of judicial determinations (interest reipublicae ut sit finis litium). Once a court of competent jurisdiction has heard and finally decided an issue between the parties, neither party can re-litigate the same issue.',
    essential_ingredients: '1. Former suit and subsequent suit.\n2. Matter in issue was directly and substantially in issue in the former suit.\n3. Same parties or litigating under the same title.\n4. Competence of former court to try the matter.\n5. Issue was heard and finally decided on merits.\n6. Constructive Res Judicata (Explanation IV): Any matter which might and ought to have been made ground of defence or attack is deemed to have been in issue.',
    exceptions: 'Does not apply to decrees obtained by fraud or collusion (Section 44 Evidence Act), or where former court completely lacked subject-matter jurisdiction.',
    punishment_or_consequence: 'Subsequent suit or issue is barred and dismissed at the threshold.'
  },
  {
    id: 4785, act_id: 18, section_number: 'Sec 80',
    section_title: 'Notice to Government or public officer prior to institution of suit',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Amended in 1976 to introduce urgent interim relief exception under sub-section (2)',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: '(1) Save as otherwise provided in sub-section (2), no suit shall be instituted against the Government or against a public officer in respect of any act purporting to be done by such public officer in his official capacity, until the expiration of two months next after notice in writing has been delivered to, or left at the office of...\n\n(2) A suit to obtain an urgent or immediate relief against the Government or any public officer in respect of any act purporting to be done by such public officer in his official capacity, may be instituted, with the leave of the Court, without serving any notice as required by sub-section (1)...',
    plain_explanation: 'Section 80 requires a mandatory two-month statutory notice to be delivered before filing a civil suit against the Government or a public officer, giving the administration an opportunity to examine the claim and avoid litigation.',
    essential_ingredients: '1. Suit against Central/State Government or public officer for acts in official capacity.\n2. Mandatory 2-month prior written notice detailing cause of action, claimant identity, and relief sought.\n3. Sub-section (2) exception: Court may grant leave to institute suit without 2-month notice if urgent/immediate relief is sought, but no interim relief can be granted without giving reasonable opportunity to the Government.',
    exceptions: 'Urgent/immediate relief under sub-section (2) with leave of the Court.',
    punishment_or_consequence: 'Plaint filed without mandatory notice or leave of the Court is rejected under Order VII Rule 11 CPC.'
  },
  {
    id: 4787, act_id: 18, section_number: 'Sec 96',
    section_title: 'Appeal from original decree (First Appeal)',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Amended by 1976 and 1999/2002 CPC Amendments',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: '(1) Save where otherwise expressly provided in the body of this Code or by any other law for the time being in force, an appeal shall lie from every decree passed by any Court exercising original jurisdiction to the Court authorized to hear appeals from the decisions of such Court.\n(2) An appeal may lie from an original decree passed ex parte.\n(3) No appeal shall lie from a decree passed by the Court with the consent of parties.\n(4) No appeal shall lie, except on a question of law, from a decree in any suit of the nature cognizable by Courts of Small Causes, when the amount or value of the subject-matter of the original suit does not exceed ten thousand rupees.',
    plain_explanation: 'Section 96 provides the substantive statutory right to file a First Appeal against an original civil decree. The First Appellate Court is the final court of fact and re-evaluates both questions of fact and law.',
    essential_ingredients: '1. Statutory right created by law (not inherent).\n2. Lies from every original decree (including ex parte decrees under sub-section (2)).\n3. First Appellate Court has plenary power to re-appreciate entire evidence and law.',
    exceptions: 'No appeal lies from a consent/compromise decree under sub-section (3); restricted appeals for small causes claims under sub-section (4).',
    punishment_or_consequence: 'First Appellate Court may confirm, reverse, modify decree, or remand the matter.'
  },
  {
    id: 4788, act_id: 18, section_number: 'Sec 100',
    section_title: 'Second appeal (Substantial question of law)',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Substituted by CPC (Amendment) Act, 1976 to restrict second appeals strictly to substantial questions of law',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: '(1) Save as otherwise expressly provided in the body of this Code or by any other law for the time being in force, an appeal shall lie to the High Court from every decree passed in appeal by any Court subordinate to the High Court, if the High Court is satisfied that the case involves a substantial question of law.\n\n(2) An appeal may lie under this section from an appellate decree passed ex parte.\n\n(3) In an appeal under this section, the memorandum of appeal shall precisely state the substantial question of law involved in the appeal.\n\n(4) Where the High Court is satisfied that a substantial question of law is involved in any case, it shall formulate that question.\n\n(5) The appeal shall be heard on the question so formulated...',
    plain_explanation: 'Section 100 governs Second Appeals to the High Court from appellate decrees. A Second Appeal is strictly confined to "substantial questions of law" and the High Court cannot interfere with findings of fact unless they are perverse.',
    essential_ingredients: '1. Lies exclusively to the High Court against an appellate decree.\n2. Must involve a "substantial question of law" (Sir Chunilal Mehta v. Century Spg. & Mfg. Co. / Santosh Hazari).\n3. High Court must formulate the substantial question of law before hearing the appeal.\n4. Concurrent findings of fact cannot be disturbed unless perverse or based on no evidence.',
    exceptions: 'Pure questions of fact or settled questions of law do not qualify.',
    punishment_or_consequence: 'High Court hears and decides the substantial question of law, upholding or reversing the appellate decree.'
  },
  {
    id: 4789, act_id: 18, section_number: 'Sec 114',
    section_title: 'Review',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Active procedural remedy read with Order XLVII Rule 1 CPC',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: 'Subject as aforesaid, any person considering himself aggrieved—\n(a) by a decree or order from which an appeal is allowed by this Code, but from which no appeal has been preferred,\n(b) by a decree or order from which no appeal is allowed by this Code, or\n(c) by a decision on a reference from a Court of Small Causes,\nmay apply for a review of judgment to the Court which passed the decree or made the order, and the Court may make such order thereon as it thinks fit.',
    plain_explanation: 'Section 114 empowers a civil court to review its own judgment or order to rectify an error apparent on the face of the record, upon discovery of new and important evidence, or for any other sufficient reason.',
    essential_ingredients: '1. Applied to the same court that passed the impugned decree or order.\n2. Permissible only where no appeal has been preferred or no appeal lies.\n3. Grounds (Order XLVII Rule 1): Discovery of new and important matter/evidence despite due diligence; error apparent on the face of the record; or any other sufficient reason.\n4. Cannot be treated as an appeal in disguise (Kamlesh Verma v. Mayawati).',
    exceptions: 'Cannot re-argue merits or seek a second hearing on contentious findings.',
    punishment_or_consequence: 'Court may grant review and modify/vacate its order, or reject the review application.'
  },
  {
    id: 4790, act_id: 18, section_number: 'Sec 115',
    section_title: 'Revision',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1909-01-01', amendment_status: 'Substantially amended in 1999/2002 to restrict interlocutory revisions',
    source_name: 'The Code of Civil Procedure, 1908 (Act No. 5 of 1908)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    statutory_text: '(1) The High Court may call for the record of any case which has been decided by any Court subordinate to such High Court and in which no appeal lies thereto, and if such subordinate Court appears—\n(a) to have exercised a jurisdiction not vested in it by law, or\n(b) to have failed to exercise a jurisdiction so vested, or\n(c) to have acted in the exercise of its jurisdiction illegally or with material irregularity,\nthe High Court may make such order in the case as it thinks fit:\nProvided that the High Court shall not, under this section, vary or reverse any order made, or any order deciding an issue, in the course of a suit or other proceeding, except where the order, if it had been made in favour of the party applying for revision, would have finally disposed of the suit or other proceedings.',
    plain_explanation: 'Section 115 confers supervisory revisional jurisdiction on the High Court over subordinate civil courts in cases where no appeal lies, strictly confined to curing jurisdictional errors.',
    essential_ingredients: '1. Case decided by a subordinate court.\n2. No appeal lies to the High Court.\n3. Subordinate court has: exercised jurisdiction not vested; failed to exercise jurisdiction vested; or acted with material irregularity.\n4. Proviso (post-2002 amendment): High Court will not interfere with interlocutory orders unless the order would have finally disposed of the suit.',
    exceptions: 'Barred where an appeal lies; barred against purely procedural interlocutory orders not terminating proceedings (Shiv Shakti Coop. Housing Society v. Swaraj Developers).',
    punishment_or_consequence: 'High Court sets aside, corrects, or directs the subordinate court to exercise lawful jurisdiction.'
  },

  // ==========================================
  // COMMERCIAL COURTS ACT, 2015 (Act 19)
  // ==========================================
  {
    id: 4804, act_id: 19, section_number: '12A',
    section_title: 'Pre-Institution Mediation and Settlement',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2018-05-03', amendment_status: 'Inserted by Commercial Courts (Amendment) Act, 2018; held mandatory in Patil Automation (2022)',
    source_name: 'The Commercial Courts Act, 2015 (Act No. 4 of 2016)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2156',
    statutory_text: '(1) A suit, which does not contemplate any urgent interim relief under this Act, shall not be instituted unless the plaintiff exhausts the remedy of pre-institution mediation in accordance with such manner and procedure as may be prescribed by rules made by the Central Government.\n\n(2) The Central Government may, by notification, authorise the Authorities constituted under the Legal Services Authorities Act, 1987, for the purposes of pre-institution mediation.\n\n(3) Notwithstanding anything contained in the Legal Services Authorities Act, 1987, the Authority authorised by the Central Government under sub-section (2) shall complete the process of mediation within a period of three months from the date of application made by the plaintiff under sub-section (1):\nProvided that the period of mediation may be extended for a further period of two months with the consent of the parties.\n\n(4) If the parties to the commercial dispute arrive at a settlement of the dispute, it shall be reduced into writing and shall be signed by the parties to the dispute and the mediator.\n\n(5) The settlement arrived at under this section shall have the same status and effect as if it is an arbitral award on agreed terms under sub-section (4) of section 30 of the Arbitration and Conciliation Act, 1996.',
    plain_explanation: 'Section 12A makes pre-institution mediation mandatory for commercial suits that do not contemplate urgent interim relief. The Supreme Court in Patil Automation v. Rakheja Engineers (2022) ruled that this requirement is strictly mandatory and non-compliance results in rejection of the plaint.',
    essential_ingredients: '1. Applies to all commercial suits governed by the Commercial Courts Act, 2015.\n2. Mandatory pre-condition: Plaintiff must approach the Legal Services Authority for mediation before filing suit.\n3. Exception: Only where the plaintiff contemplates and seeks urgent interim relief.\n4. Time-bound: Mediation must be completed within 3 months (extendable by 2 months by consent).\n5. Enforceability: Any settlement reached is enforceable directly as an arbitral award under Section 30(4) of the Arbitration Act.',
    exceptions: 'Commercial suits where the plaintiff legitimately contemplates and pleads urgent interim relief.',
    punishment_or_consequence: 'Plaint instituted without exhausting Section 12A mediation (and without bona fide urgent interim relief) is rejected under Order VII Rule 11 CPC.'
  },

  // ==========================================
  // FAMILY COURTS ACT, 1984 (Act 20)
  // ==========================================
  {
    id: 4822, act_id: 20, section_number: '7',
    section_title: 'Jurisdiction of Family Courts',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '1984-09-14', amendment_status: 'Active foundational jurisdiction clause',
    source_name: 'The Family Courts Act, 1984 (Act No. 66 of 1984)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1782',
    statutory_text: '(1) Subject to the other provisions of this Act, a Family Court shall—\n(a) have and exercise all the jurisdiction exercisable by any district court or any subordinate civil court under any law for the time being in force in respect of suits and proceedings of the nature referred to in the Explanation; and\n(b) be deemed, for the purposes of exercising such jurisdiction under such law, to be a district court or, as the case may be, such subordinate civil court for the area to which the jurisdiction of the Family Court extends.\n\nExplanation.—The suits and proceedings referred to in this sub-section are suits and proceedings of the following nature, namely:—\n(a) a suit or proceeding between the parties to a marriage for a decree of nullity of marriage, restitution of conjugal rights, judicial separation or dissolution of marriage;\n(b) a suit or proceeding for a declaration as to the validity of a marriage or as to the matrimonial status of any person;\n(c) a suit or proceeding between the parties to a marriage with respect to the property of the parties or of either of them;\n(d) a suit or proceeding for an order or injunction in circumstances arising out of a marital relationship;\n(e) a suit or proceeding for a declaration as to the legitimacy of any person;\n(f) a suit or proceeding for maintenance;\n(g) a suit or proceeding in relation to the guardianship of the person or the custody of, or access to, any minor.\n\n(2) Subject to the other provisions of this Act, a Family Court shall also have and exercise—\n(a) the jurisdiction exercisable by a Magistrate of the first class under Chapter IX (relating to order for maintenance of wives, children and parents) of the Code of Criminal Procedure, 1973; and\n(b) such other jurisdiction as may be conferred on it by any other enactment.',
    plain_explanation: 'Section 7 sets out the comprehensive, exclusive jurisdiction of Family Courts over matrimonial disputes, property claims arising out of marriage, legitimacy, child custody, guardianship, and maintenance claims.',
    essential_ingredients: '1. Vests all civil court powers regarding family and marital disputes in the Family Court.\n2. Exclusive jurisdiction over: Divorce, Nullity, Restitution, Matrimonial Property, Legitimacy, Maintenance, and Child Custody/Guardianship.\n3. Vests criminal magistrate maintenance powers under Chapter IX CrPC / BNSS (Section 125 CrPC / Section 144 BNSS) in the Family Court.\n4. Excludes civil courts and ordinary magistrates in areas where a Family Court is established.',
    exceptions: 'Excludes matters not arising from marriage or family relationships; tribal customary exceptions where Act not notified.',
    punishment_or_consequence: 'Ordinary civil courts and magistrates have no jurisdiction in notified Family Court areas.'
  },
  {
    id: 4824, act_id: 20, section_number: '9',
    section_title: 'Duty of Family Court to make efforts for settlement',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '1984-09-14', amendment_status: 'Active statutory mandate promoting conciliation over adversarial litigation',
    source_name: 'The Family Courts Act, 1984 (Act No. 66 of 1984)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1782',
    statutory_text: '(1) In every suit or proceeding, endeavour shall be made by the Family Court in the first instance, where it is possible to do so consistent with the nature and circumstances of the case, to assist and persuade the parties in arriving at a settlement in respect of the subject-matter of the suit or proceeding and for this purpose a Family Court may, subject to any rules made by the High Court, follow such procedure as it may think fit.\n\n(2) If, in any suit or proceeding, at any stage, it appears to the Family Court that there is a reasonable possibility of a settlement between the parties, the Family Court may adjourn the proceedings for such period as it thinks fit to enable attempts to be made to effect such settlement.',
    plain_explanation: 'Section 9 imposes an affirmative statutory duty on the Family Court to promote conciliation and assist the parties in arriving at an amicable settlement before proceeding to adversarial trial.',
    essential_ingredients: '1. Duty in the first instance to persuade parties towards settlement.\n2. Court may adopt non-adversarial conciliatory procedures and enlist marriage counsellors.\n3. Power to adjourn proceedings at any stage to facilitate settlement attempts.\n4. Adjudication is secondary to restorative settlement.',
    exceptions: 'Where circumstances make reconciliation impossible or harmful (e.g. severe domestic violence or abandonment).',
    punishment_or_consequence: 'Failure of court to make conciliation efforts may lead appellate court to remand proceedings for mandatory settlement attempts.'
  },

  // ==========================================
  // INDIAN PENAL CODE, 1860 (Act 11)
  // ==========================================
  {
    id: 2552, act_id: 11, section_number: '124A',
    section_title: 'Sedition',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1870-11-25', amendment_status: 'Inserted by Act 27 of 1870; kept in abeyance by Supreme Court in S.G. Vombatkere v. Union of India (2022); replaced by Section 152 BNS',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever, by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards, the Government established by law in India, shall be punished with imprisonment for life, to which fine may be added, or with imprisonment which may extend to three years, to which fine may be added, or with fine.\n\nExplanation 1.—The expression "disaffection" includes disloyalty and all feelings of enmity.\nExplanation 2.—Comments expressing disapprobation of the measures of the Government with a view to obtain their alteration by lawful means, without exciting or attempting to excite hatred, contempt or disaffection, do not constitute an offence under this section.\nExplanation 3.—Comments expressing disapprobation of the administrative or other action of the Government without exciting or attempting to excite hatred, contempt or disaffection, do not constitute an offence under this section.',
    plain_explanation: 'Section 124A penalised sedition—exciting hatred, contempt, or disaffection against the Government established by law. The Supreme Court in Kedar Nath Singh (1962) restricted its application strictly to incitement to violence or public disorder. In May 2022, the Supreme Court directed that all pending trials, appeals, and proceedings under Section 124A be kept in abeyance.',
    essential_ingredients: '1. Words (spoken/written), signs, visible representations, or actions.\n2. Bringing or attempting to bring into hatred or contempt, or exciting disaffection towards the Government.\n3. Kedar Nath rule: Actual incitement to violence or tendency to create public disorder is an essential ingredient.',
    exceptions: 'Explanations 2 and 3 protect lawful criticism, vigorous dissent, and political disapprobation aimed at lawful changes.',
    punishment_or_consequence: 'Imprisonment for life with fine, or imprisonment up to 3 years with fine, or fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 2746, act_id: 11, section_number: '300',
    section_title: 'Murder',
    legal_nature: 'Definition / General Explanation', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 101 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death, or—\n2ndly.—If it is done with the intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused, or—\n3rdly.—If it is done with the intention of causing bodily injury to any person and the bodily injury intended to be inflicted is sufficient in the ordinary course of nature to cause death, or—\n4thly.—If the person committing the act knows that it is so imminently dangerous that it must, in all probability, cause death or such bodily injury as is likely to cause death, and commits such act without any excuse for incurring the risk of causing death or such injury as aforesaid.\n\nFive Exceptions reduce murder to culpable homicide not amounting to murder: (1) Grave and sudden provocation, (2) Exceeding right of private defence in good faith, (3) Public servant exceeding powers in good faith, (4) Sudden fight in heat of passion without premeditation, (5) Consent of deceased above 18 years.',
    plain_explanation: 'Section 300 defines the mental and factual thresholds that elevate culpable homicide to murder. If an act causing death falls within any of the four culpable homicide clauses and does not attract any of the five statutory exceptions, it constitutes murder.',
    essential_ingredients: '1. Act causing death of a human being.\n2. Mens rea under four heads:\n   - Clause 1: Intention to cause death;\n   - Clause 2: Intention to cause injury known to be likely to cause death of that particular victim;\n   - Clause 3: Intention to cause injury objectively sufficient in ordinary course of nature to cause death (Virsa Singh rule);\n   - Clause 4: Knowledge of imminent danger with absence of excuse.',
    exceptions: 'Five statutory exceptions: Grave & sudden provocation; Private defence exceeded in good faith; Public servant exceeding duty; Sudden fight without premeditation; Adult victim consent.',
    punishment_or_consequence: 'Punishable under Section 302 IPC (Death or life imprisonment and fine). If an exception applies, punishable under Section 304 IPC.'
  },
  {
    id: 2748, act_id: 11, section_number: '302',
    section_title: 'Punishment for murder',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 103 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    plain_explanation: 'Section 302 prescribes the punishment for the offence of murder defined under Section 300. In India, life imprisonment is the standard sentence, while the death penalty is restricted strictly to the "rarest of rare" cases (Bachan Singh v. State of Punjab / Machhi Singh v. State of Punjab).',
    essential_ingredients: '1. Commission of murder as defined under Section 300 IPC.\n2. Proof beyond reasonable doubt of actus reus and requisite mens rea.\n3. Sentencing requires judicial balancing of aggravating and mitigating circumstances.',
    exceptions: 'If any of the 5 exceptions in Section 300 apply, conviction shifts to Section 304 IPC.',
    punishment_or_consequence: 'Death penalty or imprisonment for life, and mandatory fine. (Cognizable, non-bailable, triable exclusively by Court of Session).'
  },
  {
    id: 2752, act_id: 11, section_number: '304B',
    section_title: 'Dowry death',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1986-11-19', amendment_status: 'Inserted by Dowry Prohibition (Amendment) Act, 1986; replaced by Section 80 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: '(1) Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called "dowry death", and such husband or relative shall be deemed to have caused her death.\n\nExplanation.—For the purposes of this sub-section, "dowry" shall have the same meaning as in section 2 of the Dowry Prohibition Act, 1961.\n\n(2) Whoever commits dowry death shall be punished with imprisonment for a term which shall not be less than seven years but which may extend to imprisonment for life.',
    plain_explanation: 'Section 304B creates a deemed statutory offence of dowry death to combat unnatural deaths of married women, operating in tandem with the statutory presumption under Section 113B of the Indian Evidence Act.',
    essential_ingredients: '1. Death of a woman caused by burns, bodily injury, or occurring otherwise than under normal circumstances.\n2. Death occurred within seven years of her marriage.\n3. Woman was subjected to cruelty or harassment by husband or husband\'s relatives.\n4. Cruelty/harassment was "soon before her death".\n5. Cruelty was for, or in connection with, demands for dowry.\n6. Statutory presumption under Section 113B Evidence Act shifts burden to the accused once foundational facts are established.',
    exceptions: 'Accused can rebut presumption by proving absence of dowry harassment and natural/independent cause of death.',
    punishment_or_consequence: 'Imprisonment for not less than 7 years, extending up to imprisonment for life. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 2755, act_id: 11, section_number: '307',
    section_title: 'Attempt to murder',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 109 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine; and if hurt is caused to any person by such act, the offender shall be liable either to imprisonment for life, or to such punishment as is hereinbefore mentioned.',
    plain_explanation: 'Section 307 penalises attempts to murder. It does not require that bodily injury actually be caused; the test is whether the accused committed an overt act with the intention or knowledge and under circumstances that, had death resulted, would constitute murder.',
    essential_ingredients: '1. Intention or knowledge to commit murder under Section 300 IPC.\n2. Execution of an overt act towards the commission of murder beyond mere preparation.\n3. The act failed to cause death due to extraneous circumstances.\n4. If hurt is actually caused, aggravated punishment of life imprisonment may be imposed.',
    exceptions: 'General exceptions under Chapter IV IPC.',
    punishment_or_consequence: 'Imprisonment up to 10 years and fine; if bodily hurt is caused, imprisonment for life or up to 10 years with fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 2805, act_id: 11, section_number: '354A',
    section_title: 'Sexual harassment and punishment for sexual harassment',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '2013-02-03', amendment_status: 'Inserted by Criminal Law (Amendment) Act, 2013 post-Justice Verma Committee; replaced by Section 75 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: '(1) A man committing any of the following acts—\n(i) physical contact and advances involving unwelcome and explicit sexual overtures; or\n(ii) a demand or request for sexual favours; or\n(iii) showing pornography against the will of a woman; or\n(iv) making sexually coloured remarks,\nshall be guilty of the offence of sexual harassment.\n\n(2) Any man who commits the offence specified in clause (i) or clause (ii) or clause (iii) of sub-section (1) shall be punished with rigorous imprisonment for a term which may extend to three years, or with fine, or with both.\n\n(3) Any man who commits the offence specified in clause (iv) of sub-section (1) shall be punished with imprisonment of either description for a term which may extend to one year, or with fine, or with both.',
    plain_explanation: 'Section 354A was introduced following the Justice Verma Committee recommendations to penalise distinct forms of non-contact and contact sexual harassment of women, including demands for sexual favours, showing pornography, and sexually coloured remarks.',
    essential_ingredients: '1. Perpetrator must be a man; victim must be a woman.\n2. Four distinct categories of prohibited conduct:\n   - Physical contact and unwelcome sexual advances;\n   - Demands/requests for sexual favours;\n   - Showing pornography against her will;\n   - Sexually coloured remarks.',
    exceptions: 'Bona fide social interaction devoid of sexual intent.',
    punishment_or_consequence: 'Clauses (i)-(iii): Rigorous imprisonment up to 3 years, or fine, or both (Cognizable, bailable). Clause (iv): Imprisonment up to 1 year, or fine, or both (Cognizable, bailable).'
  },
  {
    id: 2834, act_id: 11, section_number: '375',
    section_title: 'Rape',
    legal_nature: 'Definition / General Explanation', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Extensively amended by Criminal Law (Amendment) Act, 2013; replaced by Section 63 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'A man is said to commit "rape" if he—\n(a) penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her to do so with him or any other person; or\n(b) inserts, to any extent, any object or a part of the body, not being the penis, into the vagina, the urethra or anus of a woman or makes her to do so with him or any other person; or\n(c) manipulates any part of the body of a woman so as to cause penetration into the vagina, urethra, anus or any part of body of such woman or makes her to do so with him or any other person; or\n(d) applies his mouth to the vagina, anus, urethra of a woman or makes her to do so with him or any other person,\nunder circumstances falling under any of the following seven descriptions:—\nFirst.—Against her will.\nSecondly.—Without her consent.\nThirdly.—With her consent obtained under fear of death or hurt.\nFourthly.—With her consent given when man knows he is not her husband.\nFifthly.—With her consent when of unsound mind or intoxicated unable to understand nature and consequences.\nSixthly.—With or without her consent when she is under eighteen years of age.\nSeventhly.—When she is unable to communicate consent.\n\nExplanation 2 defines consent as an unequivocal voluntary agreement by words, gestures, or non-verbal communication.',
    plain_explanation: 'Section 375 provides an expanded definition of rape covering non-consensual penile and non-penile penetrative sexual acts, codifying strict standards of consent and affirmative non-consent.',
    essential_ingredients: '1. Man committing penetrative acts under clauses (a) to (d).\n2. Absence of consent or consent vitiated under any of the seven descriptions.\n3. Statutory consent requires unequivocal voluntary agreement; mere absence of physical resistance does not imply consent.\n4. Age of consent is 18 years.',
    exceptions: 'Medical procedure/intervention; Exception 2: Marital intercourse where wife is not under eighteen years of age (read with Independent Thought v. Union of India).',
    punishment_or_consequence: 'Punishable under Section 376 IPC.'
  },
  {
    id: 2835, act_id: 11, section_number: '376',
    section_title: 'Punishment for rape',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Amended in 2013 and 2018; replaced by Section 64 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: '(1) Whoever, except in the cases provided for in sub-section (2), commits rape, shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.\n\n(2) Aggravated forms of rape (police officers, public servants, armed forces, custodial staff, management of hospitals/institutions, gang rape, pregnancy, repeated offences, or on minor victims) shall be punished with rigorous imprisonment for not less than ten years (or twenty years for minors) extending to imprisonment for life (remainder of natural life) and fine.',
    plain_explanation: 'Section 376 prescribes severe minimum mandatory punishments for rape, with heightened statutory minimums for custodial, institutional, gang, and minor victim rapes.',
    essential_ingredients: '1. Conviction under Section 375 IPC.\n2. Sub-section (1): Base sentence of minimum 10 years rigorous imprisonment.\n3. Sub-section (2): Aggravated categories with mandatory minimums of 10 years, 20 years, or life (remainder of natural life).',
    exceptions: 'None once commission of rape under Section 375 is established.',
    punishment_or_consequence: 'Rigorous imprisonment not less than 10 years extending to life imprisonment and fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 2844, act_id: 11, section_number: '377',
    section_title: 'Unnatural offences',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Read down by Supreme Court in Navtej Singh Johar v. Union of India (2018); consensual adult acts decriminalised',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever voluntarily has carnal intercourse against the order of nature with any man, woman or animal, shall be punished with imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.\n\nExplanation.—Penetration is sufficient to constitute the carnal intercourse necessary to the offence described in this section.',
    plain_explanation: 'Section 377 penalised non-procreative carnal intercourse "against the order of nature". In a historic five-judge bench ruling in Navtej Singh Johar v. Union of India (2018), the Supreme Court struck down Section 377 to the extent it criminalised consensual sexual acts between adults in private, affirming constitutional rights to dignity, equality, and privacy. It continues to apply only to bestiality and non-consensual acts.',
    essential_ingredients: '1. Penetration into any orifice against the order of nature.\n2. Post-Navtej Johar limitation: Strictly confined to non-consensual acts and carnal intercourse with animals (bestiality).\n3. Consensual adult sexual conduct is constitutionally protected under Articles 14, 15, 19, and 21.',
    exceptions: 'Consensual sexual conduct between consenting adults in private.',
    punishment_or_consequence: 'Imprisonment for life or up to 10 years with fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 2845, act_id: 11, section_number: '378',
    section_title: 'Theft',
    legal_nature: 'Definition / General Explanation', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 303 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.\n\nFive Explanations clarify severance from earth, moving obstacles, and consent.',
    plain_explanation: 'Section 378 defines theft. The essential gravamen is the dishonest moving of movable property out of another\'s possession without consent.',
    essential_ingredients: '1. Dishonest intention to take property (animus furandi).\n2. Property must be movable property.\n3. Property must be taken out of the possession of another person.\n4. Taking must be without that person\'s consent.\n5. Moving the property in order to effect such taking.',
    exceptions: 'Bona fide claim of right in good faith excludes dishonest intention.',
    punishment_or_consequence: 'Punishable under Section 379 IPC.'
  },
  {
    id: 2846, act_id: 11, section_number: '379',
    section_title: 'Punishment for theft',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 303(2) BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
    plain_explanation: 'Section 379 prescribes punishment for simple theft.',
    essential_ingredients: '1. Commission of theft as defined in Section 378 IPC.\n2. Proof of dishonest taking and moving of movable property without consent.',
    exceptions: 'None.',
    punishment_or_consequence: 'Imprisonment up to 3 years, or fine, or both. (Cognizable, non-bailable, triable by any Magistrate).'
  },
  {
    id: 2873, act_id: 11, section_number: '405',
    section_title: 'Criminal breach of trust',
    legal_nature: 'Definition / General Explanation', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 316 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property in violation of any direction of law prescribing the mode in which such trust is to be discharged, or of any legal contract, express or implied, which he has made touching the discharge of such trust, or wilfully suffers any other person so to do, commits "criminal breach of trust".',
    plain_explanation: 'Section 405 defines criminal breach of trust. Unlike theft, property in breach of trust comes into the accused\'s possession lawfully through entrustment, but is subsequently dishonestly misappropriated or converted.',
    essential_ingredients: '1. Entrustment of property or dominion over property to the accused.\n2. Dishonest misappropriation or conversion to own use.\n3. Dishonest use or disposal in violation of legal direction or contract.',
    exceptions: 'Mere breach of contract without dishonest mens rea does not constitute criminal breach of trust.',
    punishment_or_consequence: 'Punishable under Section 406 IPC.'
  },
  {
    id: 2874, act_id: 11, section_number: '406',
    section_title: 'Punishment for criminal breach of trust',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 316(2) BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever commits criminal breach of trust shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
    plain_explanation: 'Section 406 prescribes the penalty for simple criminal breach of trust defined under Section 405.',
    essential_ingredients: '1. Proof of entrustment of property.\n2. Proof of dishonest conversion or misappropriation.',
    exceptions: 'None.',
    punishment_or_consequence: 'Imprisonment up to 3 years, or fine, or both. (Cognizable, non-bailable, triable by Magistrate of the first class).'
  },
  {
    id: 2888, act_id: 11, section_number: '420',
    section_title: 'Cheating and dishonestly inducing delivery of property',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Replaced by Section 318(4) BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    plain_explanation: 'Section 420 penalises the aggravated offence of cheating where fraudulent deception induces the victim to part with property or execute a valuable security. Fraudulent or dishonest intention at the inception of the transaction is mandatory (Hridaya Ranjan Prasad Verma v. State of Bihar).',
    essential_ingredients: '1. Deception of any person.\n2. Fraudulent or dishonest inducement at inception.\n3. Inducing victim to deliver property or make/alter/destroy a valuable security.\n4. Mens rea at the very threshold of the transaction.',
    exceptions: 'Subsequent failure to perform a contractual promise without dishonest intent at the inception is a civil breach, not an offence under Section 420.',
    punishment_or_consequence: 'Imprisonment up to 7 years and fine. (Cognizable, non-bailable, triable by Magistrate of the first class).'
  },
  {
    id: 2971, act_id: 11, section_number: '497',
    section_title: 'Adultery',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1862-01-01', amendment_status: 'Struck down as unconstitutional by Supreme Court in Joseph Shine v. Union of India (2018); omitted in BNS',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever has sexual intercourse with a person who is and whom he knows or has reason to believe to be the wife of another man, without the consent or connivance of that man, such sexual intercourse not amounting to the offence of rape, is guilty of the offence of adultery, and shall be punished with imprisonment of either description for a term which may extend to five years, or with fine, or with both. In such case the wife shall not be punishable as an abettor.',
    plain_explanation: 'Section 497 penalised adultery as an offence against the husband. In September 2018, a unanimous five-judge Constitution Bench in Joseph Shine v. Union of India struck down Section 497 as unconstitutional, holding that treating women as chattel of their husbands violates Articles 14, 15, and 21. Adultery remains a civil ground for divorce but is no longer a criminal offence in India.',
    essential_ingredients: '1. Historical penal provision struck down under Articles 14 and 21.\n2. Discriminated against women on gender stereotypes.\n3. No longer a criminal offence under Indian penal law; omitted in Bharatiya Nyaya Sanhita, 2023.',
    exceptions: 'Decriminalised; retains validity purely as a civil ground for marital dissolution.',
    punishment_or_consequence: 'Declared void under Article 13(1) of the Constitution.'
  },
  {
    id: 2973, act_id: 11, section_number: '498A',
    section_title: 'Husband or relative of husband of a woman subjecting her to cruelty',
    legal_nature: 'Substantive Offence', status: 'Repealed / Historical',
    commencement_date: '1983-12-25', amendment_status: 'Inserted by Criminal Law (Second Amendment) Act, 1983; replaced by Section 85 BNS (2023)',
    source_name: 'The Indian Penal Code, 1860 (Act No. 45 of 1860)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2263',
    statutory_text: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.\n\nExplanation.—For the purposes of this section, "cruelty" means—\n(a) any wilful conduct which is of such a nature as is likely to drive the woman to commit suicide or to cause grave injury or danger to life, limb or health (whether mental or physical) of the woman; or\n(b) harassment of the woman where such harassment is with a view to coercing her or any person related to her to meet any unlawful demand for any property or valuable security or is on account of failure by her or any person related to her to meet such demand.',
    plain_explanation: 'Section 498A penalises cruelty inflicted on a married woman by her husband or in-laws, encompassing both severe physical/mental cruelty driving her to suicide and harassment for unlawful dowry demands.',
    essential_ingredients: '1. Woman subjected to cruelty must be married.\n2. Accused must be husband or relative of the husband.\n3. "Cruelty" under Explanation:\n   - Clause (a): Wilful conduct likely to drive her to suicide or cause grave injury to physical/mental health;\n   - Clause (b): Harassment coercing her or her family to meet unlawful demands for property/valuable security.\n4. Arnesh Kumar safeguards apply to prevent mechanical arrest.',
    exceptions: 'General marital discord or wear and tear of marriage not amounting to wilful severe conduct.',
    punishment_or_consequence: 'Imprisonment up to 3 years and fine. (Cognizable, non-bailable, triable by Magistrate of the first class).'
  },

  // ==========================================
  // BHARATIYA NYAYA SANHITA, 2023 (Act 14)
  // ==========================================
  {
    id: 3757, act_id: 14, section_number: '63',
    section_title: 'Rape',
    legal_nature: 'Definition / General Explanation', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active foundational penal provision; replaces Section 375 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: 'A man is said to commit "rape" if he—\n(a) penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her to do so with him or any other person; or\n(b) inserts, to any extent, any object or a part of the body, not being the penis, into the vagina, the urethra or anus of a woman or makes her to do so with him or any other person; or\n(c) manipulates any part of the body of a woman so as to cause penetration into the vagina, urethra, anus or any part of body of such woman or makes her to do so with him or any other person; or\n(d) applies his mouth to the vagina, anus, urethra of a woman or makes her to do so with him or any other person,\nunder circumstances falling under any of the seven statutory descriptions (against will, without consent, vitiated consent, victim under eighteen years of age, or inability to communicate consent).\n\nExplanation 2 clarifies consent as unequivocal voluntary agreement.',
    plain_explanation: 'Section 63 BNS replaces Section 375 IPC, defining the offence of rape with modernised drafting and preserving statutory consent standards.',
    essential_ingredients: '1. Man committing penetrative acts under clauses (a) to (d).\n2. Absence of consent or vitiation of consent.\n3. Consent standard: Unequivocal voluntary agreement by words or non-verbal communication.\n4. Age of consent remains 18 years.',
    exceptions: 'Medical procedure; marital intercourse where wife is not under 18 years.',
    punishment_or_consequence: 'Punishable under Section 64 BNS.'
  },
  {
    id: 3758, act_id: 14, section_number: '64',
    section_title: 'Punishment for rape',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active penal provision; replaces Section 376 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Whoever, except in the cases provided for in sub-section (2), commits rape, shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.\n\n(2) Aggravated rape (by police officer, public servant, member of armed forces, custodial staff, medical management, gang rape, on pregnant woman, repeatedly, or causing bodily harm) shall be punished with rigorous imprisonment for not less than ten years, extending to imprisonment for life (remainder of natural life) and fine.',
    plain_explanation: 'Section 64 BNS prescribes statutory sentences for rape, retaining the 10-year minimum sentence and heightened penalties for aggravated custodial or institutional rape.',
    essential_ingredients: '1. Conviction under Section 63 BNS.\n2. Sub-section (1): Rigorous imprisonment not less than 10 years extending to life.\n3. Sub-section (2): Aggravated categories punished with mandatory minimum 10 years up to life (natural life) and fine.',
    exceptions: 'None once commission is established.',
    punishment_or_consequence: 'Rigorous imprisonment not less than 10 years extending to life imprisonment and fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 3774, act_id: 14, section_number: '80',
    section_title: 'Dowry death',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active penal provision; replaces Section 304B IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called "dowry death", and such husband or relative shall be deemed to have caused her death.\n\n(2) Whoever commits dowry death shall be punished with imprisonment for a term which shall not be less than seven years but which may extend to imprisonment for life.',
    plain_explanation: 'Section 80 BNS replaces Section 304B IPC, maintaining strict protection against dowry deaths occurring within seven years of marriage.',
    essential_ingredients: '1. Death of a woman within seven years of marriage by burns, injury, or unnatural circumstances.\n2. Cruelty or harassment by husband or relatives soon before death in connection with dowry demands.\n3. Statutory presumption operates in tandem with Section 85 of Bharatiya Sakshya Adhiniyam, 2023.',
    exceptions: 'Rebuttable by demonstrating natural causes and lack of dowry harassment.',
    punishment_or_consequence: 'Imprisonment not less than 7 years extending to imprisonment for life. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 3795, act_id: 14, section_number: '101',
    section_title: 'Murder',
    legal_nature: 'Definition / General Explanation', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active foundational definition; replaces Section 300 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: 'Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death, or—\n(b) if it is done with the intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused, or—\n(c) if it is done with the intention of causing bodily injury to any person and the bodily injury intended to be inflicted is sufficient in the ordinary course of nature to cause death, or—\n(d) if the person committing the act knows that it is so imminently dangerous that it must, in all probability, cause death or such bodily injury as is likely to cause death, and commits such act without any excuse for incurring the risk of causing death or such injury.\n\nRetains the five traditional exceptions reducing murder to culpable homicide not amounting to murder.',
    plain_explanation: 'Section 101 BNS codifies the substantive definition of murder in India\'s new criminal code, directly replacing Section 300 IPC.',
    essential_ingredients: '1. Act causing death of a human being.\n2. Requisite mens rea under four clauses.\n3. Preserves the 5 exceptions: Provocation, Private defence, Public servant duty, Sudden fight, Adult consent.',
    exceptions: 'Five statutory exceptions reduce murder to culpable homicide not amounting to murder (Section 105 BNS).',
    punishment_or_consequence: 'Punishable under Section 103 BNS.'
  },
  {
    id: 3797, act_id: 14, section_number: '103',
    section_title: 'Punishment for murder (including Mob Lynching)',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active; sub-section (2) introduces explicit penalisation of mob lynching; replaces Section 302 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.\n\n(2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.',
    plain_explanation: 'Section 103 BNS prescribes the punishment for murder. While sub-section (1) preserves the traditional penalty of death or life imprisonment from Section 302 IPC, sub-section (2) introduces a landmark new provision specifically criminalising mob lynching committed by five or more persons on discriminatory grounds.',
    essential_ingredients: '1. Sub-section (1): Commission of murder under Section 101 BNS.\n2. Sub-section (2) (Mob Lynching):\n   - Group of five or more persons acting in concert;\n   - Murder committed on ground of race, caste, community, sex, place of birth, language, personal belief, or other ground;\n   - Imposes joint criminal liability on each member of the group.',
    exceptions: 'General exceptions under Chapter III BNS.',
    punishment_or_consequence: 'Death or imprisonment for life, and mandatory fine. (Cognizable, non-bailable, triable exclusively by Court of Session).'
  },
  {
    id: 3803, act_id: 14, section_number: '109',
    section_title: 'Attempt to murder',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active penal provision; replaces Section 307 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine; and if hurt is caused to any person by such act, the offender shall be liable either to imprisonment for life, or to such punishment as is hereinbefore mentioned.',
    plain_explanation: 'Section 109 BNS replaces Section 307 IPC, penalising attempts to commit murder.',
    essential_ingredients: '1. Intention or knowledge to commit murder under Section 101 BNS.\n2. Overt act moving beyond preparation toward execution of the deed.\n3. Failure to cause death due to extraneous reasons.',
    exceptions: 'General exceptions under Chapter III BNS.',
    punishment_or_consequence: 'Imprisonment up to 10 years and fine; if bodily hurt is caused, life imprisonment or imprisonment up to 10 years with fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 3846, act_id: 14, section_number: '152',
    section_title: 'Act endangering sovereignty, unity and integrity of India',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active landmark provision; replaces colonial sedition (Section 124A IPC) with a sovereignty-protection standard',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: 'Whoever, purposely or knowingly, by words, either spoken or written, or by signs, or by visible representation, or by electronic communication or by use of financial mean, or otherwise, excites or attempts to excite, secession or armed rebellion or subversive activities, or encourages feelings of separatist activities or endangers sovereignty or unity and integrity of India; or indulges in or commits any such act shall be punished with imprisonment for life or with imprisonment which may extend to seven years, and shall also be liable to fine.\n\nExplanation.—Comments expressing disapprobation of the measures, or administrative or other action of the Government with a view to obtain their alteration by lawful means without exciting or attempting to excite the activities referred to in this section, do not constitute an offence under this section.',
    plain_explanation: 'Section 152 BNS fundamentally replaces the colonial concept of sedition ("disaffection towards the Government") under Section 124A IPC with targeted offences aimed at protecting the sovereignty, unity, and territorial integrity of the Republic of India against armed rebellion, secession, and subversion.',
    essential_ingredients: '1. Mens rea: Purposely or knowingly.\n2. Means: Spoken/written words, signs, visible representation, electronic communication, financial means, or overt acts.\n3. Prohibited activities: Exciting or attempting to excite secession, armed rebellion, subversive activities, separatist activities, or endangering sovereignty, unity, and integrity of India.\n4. Modernised to cover cyber and electronic communication as well as terror/financial funding.',
    exceptions: 'The Explanation expressly protects democratic criticism, vigorous dissent, and peaceful opposition aimed at changing government policy by lawful means.',
    punishment_or_consequence: 'Imprisonment for life or imprisonment up to 7 years, and fine. (Cognizable, non-bailable, triable by Court of Session).'
  },
  {
    id: 3997, act_id: 14, section_number: '303',
    section_title: 'Theft and punishment for theft',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active consolidated provision; combines Section 378 and 379 IPC and adds community service option for petty theft',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.\n\n(2) Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both; and in case of theft where the value of the stolen property is less than five thousand rupees, and a person is convicted for the first time, shall upon returning the value of property or restoring the stolen property, be punished with community service.',
    plain_explanation: 'Section 303 BNS consolidates the definition and punishment for theft, introducing community service as an innovative penal alternative for first-time petty theft where the value is under five thousand rupees.',
    essential_ingredients: '1. Dishonest intention to take movable property out of another\'s possession without consent.\n2. Moving property in order to such taking.\n3. Community service alternative for first-time offenders where stolen value < ₹5,000.',
    exceptions: 'Bona fide claim of right in good faith.',
    punishment_or_consequence: 'Imprisonment up to 3 years, or fine, or both; or community service for first-time petty theft under ₹5,000. (Cognizable, non-bailable, triable by any Magistrate).'
  },
  {
    id: 4010, act_id: 14, section_number: '316',
    section_title: 'Criminal breach of trust',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active consolidated provision; replaces Sections 405 and 406 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property in violation of any direction of law... commits criminal breach of trust.\n\n(2) Whoever commits criminal breach of trust shall be punished with imprisonment of either description for a term which may extend to five years, or with fine, or with both.',
    plain_explanation: 'Section 316 BNS consolidates the definition and punishment for criminal breach of trust, raising the maximum imprisonment from 3 years (under IPC 406) to 5 years.',
    essential_ingredients: '1. Entrustment of property or dominion over property.\n2. Dishonest misappropriation or conversion.\n3. Violation of statutory direction or contract.',
    exceptions: 'Commercial breach without dishonest mens rea.',
    punishment_or_consequence: 'Imprisonment up to 5 years, or fine, or both. (Cognizable, non-bailable, triable by Magistrate of the first class).'
  },
  {
    id: 4012, act_id: 14, section_number: '318',
    section_title: 'Cheating',
    legal_nature: 'Substantive Offence', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active consolidated provision; incorporates Section 415 and 420 IPC',
    source_name: 'The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2189',
    statutory_text: '(1) Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person... is said to "cheat".\n\n(4) Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    plain_explanation: 'Section 318 BNS replaces Section 415 and Section 420 IPC, consolidating simple cheating and aggravated cheating inducing delivery of property under a unified section.',
    essential_ingredients: '1. Fraudulent deception.\n2. Inducing victim to deliver property or make/alter/destroy valuable security.\n3. Dishonest intention present at the inception.',
    exceptions: 'Innocent contractual breach without initial fraudulent inducement.',
    punishment_or_consequence: 'Sub-section (4): Imprisonment up to 7 years and fine. (Cognizable, non-bailable, triable by Magistrate of the first class).'
  },

  // ==========================================
  // CODE OF CRIMINAL PROCEDURE, 1973 (Act 12)
  // ==========================================
  {
    id: 3029, act_id: 12, section_number: '41A',
    section_title: 'Notice of appearance before police officer',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '2010-11-01', amendment_status: 'Inserted by CrPC (Amendment) Act, 2008; enforced post-Arnesh Kumar (2014); replaced by Section 35(3) BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) The police officer shall, in all cases where the arrest of a person is not required under the provisions of sub-section (1) of section 41, issue a notice directing the person against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists that he has committed a cognizable offence, to appear before him or at such other place as may be specified in the notice.\n\n(2) Where such a notice is issued to any person, it shall be the duty of that person to comply with the terms of the notice.\n\n(3) Where such person complies and continues to comply with the notice, he shall not be arrested in respect of the offence referred to in the notice unless, for reasons to be recorded, the police officer is of the opinion that he ought to be arrested.',
    plain_explanation: 'Section 41A mandates that in offences punishable with imprisonment up to seven years where arrest is not immediately necessary, the police must issue a formal notice of appearance rather than effecting arrest. In Arnesh Kumar v. State of Bihar (2014), the Supreme Court made compliance mandatory to prevent arbitrary arrests in matrimonial and other disputes.',
    essential_ingredients: '1. Offence punishable with imprisonment up to 7 years.\n2. Mandatory duty to issue notice of appearance if arrest under Section 41(1) criteria is unnecessary.\n3. Person who complies cannot be arrested unless reasons are recorded in writing.\n4. Arrest without notice or recorded justification invites disciplinary action and contempt.',
    exceptions: 'Arrest permissible if person fails to comply with notice or police record specific reasons justifying arrest under Section 41(1)(b).',
    punishment_or_consequence: 'Protects citizen liberty; failure by police to record reasons attracts disciplinary proceedings and judicial contempt.'
  },
  {
    id: 3030, act_id: 12, section_number: '41B',
    section_title: 'Procedure of arrest and duties of officer making arrest (D.K. Basu guidelines)',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '2010-11-01', amendment_status: 'Inserted by CrPC (Amendment) Act, 2008 codifying D.K. Basu v. State of West Bengal; replaced by Section 37 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: 'Every police officer while making an arrest shall—\n(a) bear an accurate, visible and clear identification of his name which will facilitate easy identification;\n(b) prepare a memorandum of arrest which shall be—\n(i) attested by at least one witness, who is a member of the family of the person arrested or a respectable member of the locality where the arrest is made;\n(ii) countersigned by the person arrested; and\n(c) inform the person arrested, unless the memorandum is attested by a member of his family, that he has a right to have a relative or a friend named by him informed of his arrest.',
    plain_explanation: 'Section 41B codifies the landmark custodial safeguards established in D.K. Basu v. State of West Bengal, requiring clear name tags, a formal arrest memo attested by a witness, and notification to a family member or friend.',
    essential_ingredients: '1. Visible, accurate name tag worn by the arresting officer.\n2. Mandatory preparation of an arrest memo recording date, time, and location.\n3. Attestation by a family member or respectable local witness.\n4. Countersignature by the arrestee.\n5. Obligation to inform the arrestee of the right to have a nominated friend/relative informed.',
    exceptions: 'None.',
    punishment_or_consequence: 'Arrest without compliance is illegal and subjects the arresting officer to departmental and contempt proceedings.'
  },
  {
    id: 3042, act_id: 12, section_number: '50A',
    section_title: 'Obligation of person making arrest to inform about the arrest, etc., to a nominated person',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '2006-06-23', amendment_status: 'Inserted by CrPC (Amendment) Act, 2005; replaced by Section 48 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) Once the arrest is made, the person making the arrest shall forthwith give the information regarding such arrest and place where the arrested person is being held to any of his friends, relatives or such other persons as may be disclosed or nominated by the arrested person for the purpose of giving such information.\n(2) The police officer shall inform the arrested person of his rights under sub-section (1) as soon as he is brought to the police station.\n(3) An entry of the fact as to who has been informed of the arrest shall be made in a book to be kept in the police station.\n(4) It shall be the duty of the Magistrate to satisfy himself that the requirements of sub-sections (2) and (3) have been complied with.',
    plain_explanation: 'Section 50A mandates that immediate notification of an arrest and place of detention be given to a nominated friend or relative, with entries made in the station diary and verified by the Magistrate.',
    essential_ingredients: '1. Forthwith information of arrest and place of detention to a nominated person.\n2. Station diary entry recording name of the person notified.\n3. Judicial oversight: Magistrate must independently verify compliance when the accused is produced.',
    exceptions: 'None.',
    punishment_or_consequence: 'Judicial verification by Magistrate; breach constitutes illegal detention.'
  },
  {
    id: 3161, act_id: 12, section_number: '154',
    section_title: 'Information in cognizable cases (First Information Report - FIR)',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Enforced post-Lalita Kumari Constitution Bench (2013); replaced by Section 173 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.\n\n(2) A copy of the information as recorded under sub-section (1) shall be given forthwith, free of cost, to the informant.\n\n(3) Any person aggrieved by a refusal on the part of an officer in charge of a police station to record the information referred to in sub-section (1) may send the substance of such information, in writing and by post, to the Superintendent of Police concerned...',
    plain_explanation: 'Section 154 governs the registration of a First Information Report (FIR). In Lalita Kumari v. Govt. of U.P. (2013), a five-judge Constitution Bench held that registration of an FIR is mandatory under Section 154 if the information discloses the commission of a cognizable offence.',
    essential_ingredients: '1. Information discloses commission of a cognizable offence.\n2. Oral information must be reduced to writing and read over to the informant.\n3. Information must be signed by the informant.\n4. Substance entered in the General Diary (Station Diary).\n5. Mandatory free copy given forthwith to the informant.\n6. Lalita Kumari rule: Mandatory registration without preliminary enquiry, except for limited categories (matrimonial, commercial, medical negligence, corruption, or abnormal delay).',
    exceptions: 'Limited preliminary enquiry (up to 7 days) permitted only in specific categories specified in Lalita Kumari.',
    punishment_or_consequence: 'Refusal to register an FIR by a public servant punishable under Section 166A IPC; remedy lies under Sec 154(3) to SP and Sec 156(3) before Magistrate.'
  },
  {
    id: 3175, act_id: 12, section_number: '167',
    section_title: 'Procedure when investigation cannot be completed in twenty-four hours (Default Bail / Statutory Remand)',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Amended in 1978; default bail held indefeasible right under Article 21; replaced by Section 187 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) Whenever any person is arrested and detained in custody, and it appears that the investigation cannot be completed within the period of twenty-four hours fixed by section 57, and there are grounds for believing that the accusation or information is well-founded, the officer in charge of the police station... shall forthwith transmit to the nearest Judicial Magistrate a copy of the entries in the diary... and shall at the same time forward the accused to such Magistrate.\n\n(2) The Magistrate to whom an accused person is forwarded under this section may, whether he has or has not jurisdiction to try the case, from time to time, authorise the detention of the accused in such custody as such Magistrate thinks fit, for a term not exceeding fifteen days in the whole...\nProvided that—\n(a) the Magistrate may authorise the detention of the accused person, otherwise than in the custody of the police, beyond the period of fifteen days, if he is satisfied that adequate grounds exist... but no Magistrate shall authorise the detention of the accused person in custody under this paragraph for a total period exceeding—\n(i) ninety days, where the investigation relates to an offence punishable with death, imprisonment for life or imprisonment for a term of not less than ten years;\n(ii) sixty days, where the investigation relates to any other offence,\nand, on the expiry of the said period of ninety days, or sixty days, as the case may be, the accused person shall be released on bail if he is prepared to and does furnish bail (Default Bail).',
    plain_explanation: 'Section 167 regulates police and judicial custody during investigation. Police custody is restricted strictly to a maximum of 15 days during the initial period. If the police fail to file a chargesheet within 60 or 90 days, the accused acquires an indefeasible fundamental right to "default bail" under Article 21 (Bikramjit Singh / Ritu Chhabaria).',
    essential_ingredients: '1. Accused produced before Magistrate within 24 hours of arrest.\n2. Maximum 15 days police custody in the whole, restricted strictly to the first 15 days from arrest.\n3. Beyond 15 days, detention can only be in judicial custody.\n4. Total investigation period capped at 90 days (for offences punishable with 10+ years/life/death) or 60 days (for other offences).\n5. Default bail: Accrues automatically on the 61st or 91st day if chargesheet is not filed.',
    exceptions: 'Special statutes (UAPA, NDPS) extend statutory remand period to 180 days on special report of public prosecutor.',
    punishment_or_consequence: 'Indefeasible right to bail upon expiry of statutory period; detention thereafter without chargesheet is unconstitutional.'
  },
  {
    id: 3376, act_id: 12, section_number: '354',
    section_title: 'Language and contents of judgment',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Sub-section (3) requires "special reasons" for death penalty post-Bachan Singh; replaced by Section 392 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) Except as otherwise expressly provided by this Code, every judgment referred to in section 353—\n(a) shall be written in the language of the Court;\n(b) shall contain the point or points for determination, the decision thereon and the reasons for the decision;\n(c) shall specify the offence (if any) of which, and the section of the Indian Penal Code or other law under which, the accused is convicted and the punishment to which he is sentenced;\n(d) if it be a judgment of acquittal, shall state the offence of which the accused is acquitted and direct that he be set at liberty.\n\n(3) When the conviction is for an offence punishable with death or, in the alternative, with imprisonment for life or imprisonment for a term of years, the judgment shall state the reasons for the sentence awarded, and, in the case of sentence of death, the special reasons for such sentence.',
    plain_explanation: 'Section 354 governs the structure and legal contents of a criminal judgment. Sub-section (3) reflects a fundamental legislative policy shift: life imprisonment is the rule, and the death penalty can only be imposed if "special reasons" are recorded.',
    essential_ingredients: '1. Written in the language of the Court.\n2. Clear points for determination, decisions, and detailed reasons.\n3. Specification of offence, statutory section, and sentence.\n4. Sub-section (3): Mandatory recording of "special reasons" for awarding the death penalty, demonstrating why life imprisonment is completely inadequate.',
    exceptions: 'Summary trials under Section 260 CrPC.',
    punishment_or_consequence: 'Failure to record reasons or special reasons invalidates the sentencing order and requires appellate remand.'
  },
  {
    id: 3463, act_id: 12, section_number: '437',
    section_title: 'When bail may be taken in case of non-bailable offence',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Amended in 1980 and 2005; replaced by Section 480 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) When any person accused of, or suspected of, the commission of any non-bailable offence is arrested or detained without warrant by an officer in charge of a police station or appears or is brought before a Court other than the High Court or Court of Session, he may be released on bail, but—\n(i) such person shall not be so released if there appear reasonable grounds for believing that he has been guilty of an offence punishable with death or imprisonment for life;\n(ii) such person shall not be so released if such offence is a cognizable offence and he had been previously convicted of an offence punishable with death, imprisonment for life or imprisonment for seven years or more...\nProvided that the Court may direct that a person referred to in clause (i) or clause (ii) be released on bail if such person is under the age of sixteen years or is a woman or is sick or infirm.',
    plain_explanation: 'Section 437 governs the grant of regular bail in non-bailable offences by courts other than High Courts or Sessions Courts (i.e. Magistrate Courts). It bars bail where reasonable grounds suggest guilt of offences punishable with life imprisonment or death, subject to humanitarian provisos for women, minors, and the sick.',
    essential_ingredients: '1. Discretionary bail before Magistrate Courts in non-bailable offences.\n2. Disqualifications: Reasonable grounds for believing guilt of offence punishable with death or life imprisonment, or habitual offenders.\n3. Proviso 1 (Beneficial exception): Court may grant bail notwithstanding disqualification if the person is under 16 years, a woman, sick, or infirm.\n4. Power to impose conditions to prevent witness tampering or repetition of offence.',
    exceptions: 'Statutory bar under clause (i) and (ii), subject to humanitarian provisos.',
    punishment_or_consequence: 'Release on executing bail bonds with or without sureties; bail liable to cancellation under Section 437(5).'
  },
  {
    id: 3464, act_id: 12, section_number: '438',
    section_title: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail)',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Substituted in 2005; interpreted in Gurbaksh Singh Sibbia (1980) and Sushila Aggarwal (2020); replaced by Section 482 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail; and that Court may, after taking into consideration, inter alia, the following factors, namely:—\n(i) the nature and gravity of the accusation;\n(ii) the antecedents of the applicant;\n(iii) the possibility of the applicant to flee from justice; and\n(iv) where the accusation has been made with the object of injuring or humiliating the applicant by having him so arrested,\neither reject the application forthwith or issue an interim order for the grant of anticipatory bail.',
    plain_explanation: 'Section 438 provides for anticipatory bail—an extraordinary direction issued by the High Court or Court of Session that in the event of arrest on an accusation of a non-bailable offence, the applicant shall be released on bail. In Sushila Aggarwal v. State (NCT of Delhi) (2020), a Constitution Bench held that anticipatory bail should not normally be limited to a fixed time period and can continue until the conclusion of trial.',
    essential_ingredients: '1. Concurrent jurisdiction vested only in High Court and Court of Session.\n2. Applicant must demonstrate reasonable belief of impending arrest on accusation of a non-bailable offence.\n3. Judicial balancing: Nature/gravity of offence, criminal antecedents, flight risk, and bona fides of accusation.\n4. Pre-condition of arrest is eliminated; protects against humiliation and false implication.\n5. Standard conditions: Co-operation with investigation, not leaving country without permission, and no witness tampering.',
    exceptions: 'Express statutory bars under Section 18 / 18A of SC/ST (Prevention of Atrocities) Act, 1989 (subject to prima facie scrutiny per Prathvi Raj Chauhan).',
    punishment_or_consequence: 'Protection from custodial arrest; applicant released on furnishing bail bonds upon arrest.'
  },
  {
    id: 3465, act_id: 12, section_number: '439',
    section_title: 'Special powers of High Court or Court of Session regarding bail',
    legal_nature: 'Procedure', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Amended in 2018 to add mandatory notice in rape cases; replaced by Section 483 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: '(1) A High Court or Court of Session may direct—\n(a) that any person accused of an offence and in custody be released on bail, and if the offence is of the nature specified in sub-section (3) of section 437, may impose any condition which it considers necessary for the purposes mentioned in that sub-section;\n(b) that any condition imposed by a Magistrate when releasing any person on bail be set aside or modified:\nProvided that the High Court or the Court of Session shall, before granting bail to a person who is accused of an offence which is triable exclusively by the Court of Session or which, though not so triable, is punishable with imprisonment for life, give notice of the application for bail to the Public Prosecutor...\n\n(2) A High Court or Court of Session may direct that any person who has been released on bail under this Chapter be arrested and commit him to custody.',
    plain_explanation: 'Section 439 confers wide, unfettered discretionary powers on the High Court and Court of Session to grant regular bail to any person in custody, modify conditions imposed by Magistrates, and cancel bail where liberty has been abused.',
    essential_ingredients: '1. Jurisdiction of superior courts: High Court and Sessions Court.\n2. Applicant must be "in custody" (physical custody or constructive custody via surrender).\n3. Broad discretion guided by judicial principles (Gudikanti Narasimhulu / P. Chidambaram): Nature of charge, severity of punishment, likelihood of absconding, and tampering with evidence.\n4. Power under sub-section (2) to cancel bail for supervening misconduct or perversity.',
    exceptions: 'Strict twin conditions under special statutes (Section 37 NDPS Act, Section 45 PMLA, Section 43D(5) UAPA) restrict Section 439 discretion.',
    punishment_or_consequence: 'Release from custody on bail bonds, or cancellation of bail and remanding the accused back to custody.'
  },
  {
    id: 3508, act_id: 12, section_number: '482',
    section_title: 'Saving of inherent powers of High Court',
    legal_nature: 'Jurisdiction / Power', status: 'Repealed / Historical',
    commencement_date: '1974-04-01', amendment_status: 'Replaced by Section 528 BNSS',
    source_name: 'The Code of Criminal Procedure, 1973 (Act No. 2 of 1974)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/1611',
    statutory_text: 'Nothing in this Code shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under this Code, or to prevent abuse of the process of any Court or otherwise to secure the ends of justice.',
    plain_explanation: 'Section 482 preserves the inherent supervisory powers of the High Court to prevent abuse of the process of any criminal court and secure the ends of justice. It is the primary statutory vehicle for quashing groundless FIRs, chargesheets, and criminal complaints (State of Haryana v. Bhajan Lal).',
    essential_ingredients: '1. Vested exclusively in the High Court.\n2. Inherent power recognized and preserved, not created by statute.\n3. Three statutory purposes:\n   - To give effect to any order under the Code;\n   - To prevent abuse of the process of any court;\n   - To secure the ends of justice.\n4. Bhajan Lal principles: FIR/complaint may be quashed where allegations taken at face value disclose no cognizable offence, or where criminal proceedings are manifestly attended with mala fides.',
    exceptions: 'Cannot be used where an express statutory remedy or prohibition exists; cannot appreciate disputed questions of fact.',
    punishment_or_consequence: 'Quashing of FIR, chargesheet, summoning order, or criminal proceedings, terminating vexatious prosecution.'
  },

  // ==========================================
  // BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (Act 15)
  // ==========================================
  {
    id: 4087, act_id: 15, section_number: '35',
    section_title: 'When police may arrest without warrant and Notice of appearance',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active foundational procedural provision; consolidates Section 41 and 41A CrPC',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: '(1) Any police officer may without an order from a Magistrate and without a warrant, arrest any person...\nProvided that in cases where the offence is punishable with imprisonment for a term which may be less than three years and of infirmity or illness, the arrest shall be made after taking permission from a police officer not below the rank of Deputy Superintendent of Police.\n\n(3) The police officer shall, in all cases where the arrest of a person is not required under sub-section (1), issue a notice directing the person against whom a reasonable complaint has been made... to appear before him or at such other place as may be specified in the notice.',
    plain_explanation: 'Section 35 BNSS consolidates Section 41 and Section 41A CrPC, establishing modernised arrest procedures and making notices of appearance standard practice for offences punishable up to seven years, with additional safeguards for offences under three years requiring prior permission of a Deputy Superintendent of Police.',
    essential_ingredients: '1. Arrest without warrant restricted by objective statutory criteria.\n2. Prior DSP permission required for arresting infirm, elderly, or sick persons accused of offences punishable under 3 years.\n3. Mandatory notice of appearance where arrest criteria under sub-section (1) are not met.\n4. Accused who complies with notice cannot be arrested without recording written reasons.',
    exceptions: 'Arrest permissible if person fails to comply with notice or conditions of Section 35(1) are satisfied.',
    punishment_or_consequence: 'Protection against arbitrary arrest; non-compliance by police invites departmental action and judicial censure.'
  },
  {
    id: 4089, act_id: 15, section_number: '37',
    section_title: 'Procedure of arrest and duties of officer making arrest',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active; replaces Section 41B CrPC with enhanced digital and witness safeguards',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: 'Every police officer while making an arrest shall—\n(a) bear an accurate, visible and clear identification of his name which will facilitate easy identification;\n(b) prepare a memorandum of arrest which shall be attested by at least one witness, who is a member of the family of the person arrested or a respectable member of the locality... and countersigned by the person arrested; and\n(c) inform the person arrested, unless the memorandum is attested by a member of his family, that he has a right to have a relative or a friend named by him informed of his arrest.',
    plain_explanation: 'Section 37 BNSS codifies statutory arrest safeguards, preserving the D.K. Basu mandate and establishing clear identification and documentation standards.',
    essential_ingredients: '1. Visible name identification of the arresting officer.\n2. Arrest memo recording time, date, place, attested by a family/local witness.\n3. Countersigned by arrestee.\n4. Right to inform family/friend immediately.',
    exceptions: 'None.',
    punishment_or_consequence: 'Breach of arrest safeguards renders arrest unlawful and triggers judicial reprimand.'
  },
  {
    id: 4225, act_id: 15, section_number: '173',
    section_title: 'Information in cognizable cases (First Information Report, Zero FIR, Electronic FIR)',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active landmark reform; introduces statutory Zero FIR, e-FIR, and Preliminary Enquiry; replaces Section 154 CrPC',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: '(1) Every information relating to the commission of a cognizable offence, irrespective of the area where the offence is committed, may be given orally or by electronic communication to an officer in charge of a police station, and if given—\n(i) orally, it shall be reduced to writing by him or under his direction, and be read over to the informant;\n(ii) by electronic communication, it shall be taken on record by him on being signed within three days by the person giving it (Electronic FIR);\nand every such information... shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer (Zero FIR):\n\nProvided that in cases where the offence is punishable with imprisonment for three years or more but less than seven years, the officer in charge of the police station may with the prior permission of an officer not below the rank of Deputy Superintendent of Police, proceed to conduct a preliminary enquiry within a period of fourteen days to ascertain whether there exists a prima facie case for proceeding in the matter.',
    plain_explanation: 'Section 173 BNSS fundamentally modernises criminal reporting in India by granting statutory recognition to Zero FIR (information may be lodged at any police station regardless of jurisdiction) and Electronic FIR (e-FIR taken on record and signed within three days). It also codifies preliminary enquiry within 14 days with prior DSP permission for offences punishable between 3 and 7 years.',
    essential_ingredients: '1. Zero FIR: Information can be given irrespective of territorial jurisdiction.\n2. Electronic FIR: May be sent electronically, valid upon physical signature within 3 days.\n3. Mandatory free copy given forthwith to informant.\n4. Preliminary Enquiry proviso: For offences punishable between 3 and 7 years, preliminary enquiry may be conducted within 14 days with prior DSP approval before registering FIR.',
    exceptions: 'Preliminary enquiry permitted for 3 to 7-year offences before FIR registration.',
    punishment_or_consequence: 'Mandatory registration; failure attracts disciplinary action and complaint to SP under sub-section (4).'
  },
  {
    id: 4239, act_id: 15, section_number: '187',
    section_title: 'Procedure when investigation cannot be completed in twenty-four hours (Custody in Tranches)',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active landmark procedural reform; replaces Section 167 CrPC',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: '(1) Whenever any person is arrested and detained in custody, and it appears that the investigation cannot be completed within the period of twenty-four hours... the officer in charge shall forward the accused to the nearest Magistrate...\n\n(2) The Magistrate may authorise the detention of the accused person in such custody as such Magistrate thinks fit, for a term not exceeding fifteen days in the whole, or in parts, at any time during the initial forty days or sixty days out of the total period of sixty days or ninety days, as the case may be...\n\n(3) On expiry of the period of sixty days or ninety days, the accused person shall be released on bail if he is prepared to and does furnish bail (Default Bail).',
    plain_explanation: 'Section 187 BNSS replaces Section 167 CrPC. While it retains default bail if investigation is not completed within 60 or 90 days, it introduces a major reform allowing 15 days of police custody to be sought in parts or tranches throughout the initial 40 days (for 60-day cases) or 60 days (for 90-day cases), rather than restricting police custody strictly to the first 15 days.',
    essential_ingredients: '1. Production before Magistrate within 24 hours.\n2. Total police custody capped at 15 days.\n3. Police custody may be granted "in the whole, or in parts, at any time" during the initial 40 or 60 days.\n4. Total investigation period remains 60 or 90 days.\n5. Default bail accrues on expiry of 60/90 days if chargesheet is not filed.',
    exceptions: 'Special statutory regimes (UAPA, NDPS).',
    punishment_or_consequence: 'Accused entitled to default bail if chargesheet is not filed within statutory limits.'
  },
  {
    id: 4532, act_id: 15, section_number: '480',
    section_title: 'When bail may be taken in case of non-bailable offence',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active; replaces Section 437 CrPC',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: '(1) When any person accused of, or suspected of, the commission of any non-bailable offence is arrested or detained without warrant... or is brought before a Court other than the High Court or Court of Session, he may be released on bail, but—\n(i) such person shall not be so released if there appear reasonable grounds for believing that he has been guilty of an offence punishable with death or imprisonment for life...\nProvided that the Court may direct that a person referred to in clause (i) or clause (ii) be released on bail if such person is under the age of sixteen years or is a woman or is sick or infirm.',
    plain_explanation: 'Section 480 BNSS replaces Section 437 CrPC, governing the grant of regular bail by Magistrate courts in non-bailable offences.',
    essential_ingredients: '1. Discretionary bail before Magistrate Courts.\n2. Disqualifications for offences punishable with death/life imprisonment.\n3. Humanitarian provisos for minors under 16, women, and sick/infirm persons.',
    exceptions: 'Habitual offenders and death/life imprisonment offences.',
    punishment_or_consequence: 'Release on executing bail bonds; power to cancel bail under sub-section (5).'
  },
  {
    id: 4534, act_id: 15, section_number: '482',
    section_title: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail)',
    legal_nature: 'Procedure', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active; replaces Section 438 CrPC',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: '(1) Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail; and that Court may, after taking into consideration, inter alia, the nature and gravity of accusation, antecedents, and flight risk... either reject the application or grant anticipatory bail.',
    plain_explanation: 'Section 482 BNSS replaces Section 438 CrPC, preserving the high constitutional remedy of anticipatory bail before High Courts and Sessions Courts.',
    essential_ingredients: '1. Reasonable apprehension of arrest in non-bailable offence.\n2. Jurisdiction of High Court and Court of Session.\n3. Standard safeguards protecting against malicious prosecution.',
    exceptions: 'Express statutory bars under SC/ST Act.',
    punishment_or_consequence: 'Protection against custodial arrest; release upon furnishing bail bonds.'
  },
  {
    id: 4580, act_id: 15, section_number: '528',
    section_title: 'Saving of inherent powers of High Court',
    legal_nature: 'Jurisdiction / Power', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active foundational supervisory jurisdiction; replaces Section 482 CrPC',
    source_name: 'The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2190',
    statutory_text: 'Nothing in this Sanhita shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under this Sanhita, or to prevent abuse of the process of any Court or otherwise to secure the ends of justice.',
    plain_explanation: 'Section 528 BNSS preserves the inherent powers of the High Court to prevent abuse of judicial process and secure the ends of justice, serving as the direct statutory successor to Section 482 CrPC.',
    essential_ingredients: '1. Exclusive inherent jurisdiction of the High Court.\n2. Inherent power to prevent abuse of process of any criminal court.\n3. Power to quash malicious or groundless criminal complaints and FIRs under Bhajan Lal standards.',
    exceptions: 'Cannot override explicit statutory prohibitions; cannot conduct mini-trial on disputed facts.',
    punishment_or_consequence: 'Quashing of criminal proceedings, FIRs, or chargesheets.'
  },

  // ==========================================
  // INDIAN EVIDENCE ACT, 1872 (Act 13)
  // ==========================================
  {
    id: 3538, act_id: 13, section_number: '27',
    section_title: 'How much of information received from accused may be proved (Recovery of Fact / Discovery)',
    legal_nature: 'Evidence / Admissibility', status: 'Repealed / Historical',
    commencement_date: '1872-09-01', amendment_status: 'Interpreted in Pulukuri Kottaya (1947); replaced by Section 23 BSA (2023)',
    source_name: 'The Indian Evidence Act, 1872 (Act No. 1 of 1872)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2188',
    statutory_text: 'Provided that, when any fact is deposed to as discovered in consequence of information received from a person accused of any offence, in the custody of a police officer, so much of such information, whether it amounts to a confession or not, as relates distinctly to the fact thereby discovered, may be proved.',
    plain_explanation: 'Section 27 operates as a proviso and exception to the general prohibition against police confessions (Sections 25 and 26). Under the doctrine of confirmation by subsequent facts (Pulukuri Kottaya v. King-Emperor), so much of the information given by an accused in custody as distinctly leads to the discovery of a material fact (e.g. weapon, stolen goods, body) is admissible in evidence.',
    essential_ingredients: '1. Accused must be in police custody.\n2. Information provided by the accused led to the discovery of a fact.\n3. Fact discovered was not previously known to the police.\n4. Only the distinct portion of the statement directly leading to discovery is admissible; confessional narrative of past conduct remains inadmissible.',
    exceptions: 'Inadmissible if the discovered object was already known to police or in an open public place accessible to all.',
    punishment_or_consequence: 'Renders the statement and discovery admissible as substantive corroborative evidence.'
  },
  {
    id: 3543, act_id: 13, section_number: '32',
    section_title: 'Cases in which statement of relevant fact by person who is dead or cannot be found, etc., is relevant (Dying Declaration)',
    legal_nature: 'Evidence / Admissibility', status: 'Repealed / Historical',
    commencement_date: '1872-09-01', amendment_status: 'Replaced by Section 26 BSA (2023)',
    source_name: 'The Indian Evidence Act, 1872 (Act No. 1 of 1872)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2188',
    statutory_text: 'Statements, written or verbal, of relevant facts made by a person who is dead, or who cannot be found, or who has become incapable of giving evidence, or whose attendance cannot be procured without an amount of delay or expense which under the circumstances of the case appears to the Court unreasonable, are themselves relevant facts in the following cases:—\n(1) When it relates to cause of death.—When the statement is made by a person as to the cause of his death, or as to any of the circumstances of the transaction which resulted in his death, in cases in which the cause of that person\'s death comes into question (Dying Declaration)...',
    plain_explanation: 'Section 32(1) creates an exception to the rule against hearsay for dying declarations. A statement made by a deceased person regarding the cause of their death or circumstances of the transaction resulting in death is admissible without requiring contemporaneous expectation of death.',
    essential_ingredients: '1. Declinant must be dead.\n2. Cause of death must be in question.\n3. Statement relates to cause of death or circumstances of transaction resulting in death.\n4. Declinant must be in a fit state of mind at the time of making declaration.\n5. Admissible without oath or cross-examination (nemo moriturus praesumitur mentire).',
    exceptions: 'Tutored, prompted, or doubtful declarations lacking medical fitness certification require corroboration.',
    punishment_or_consequence: 'Can form the sole basis of conviction if found voluntary, reliable, and truthful (Sharad Birdhichand Sarda).'
  },
  {
    id: 3580, act_id: 13, section_number: '65B',
    section_title: 'Admissibility of electronic records (Mandatory Certificate rule)',
    legal_nature: 'Evidence / Admissibility', status: 'Repealed / Historical',
    commencement_date: '2000-10-17', amendment_status: 'Inserted by Information Technology Act, 2000; certificate held mandatory in Arjun Panditrao (2020); replaced by Section 63 BSA',
    source_name: 'The Indian Evidence Act, 1872 (Act No. 1 of 1872)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2188',
    statutory_text: '(1) Notwithstanding anything contained in this Act, any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media produced by a computer... shall be deemed to be also a document... and shall be admissible in any proceedings, without further proof or production of the original, as evidence of any contents of the original or of any fact stated therein of which direct evidence would be admissible.\n\n(2) Sets out computer system conditions (lawful control, regular feeding, proper operation).\n\n(4) In any proceedings where it is desired to give a statement in evidence by virtue of this section, a certificate doing any of the following things, that is to say,—\n(a) identifying the electronic record containing the statement and describing the manner in which it was produced;\n(b) giving such particulars of any device involved...\nand purporting to be signed by a person occupying a responsible official position in relation to the operation of the relevant device... shall be evidence of any matter stated in the certificate.',
    plain_explanation: 'Section 65B provides a special code for the admissibility of electronic records (secondary evidence such as printouts, CDs, hard drives, call detail records). In Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020), a three-judge bench of the Supreme Court affirmed that a certificate under Section 65B(4) is an indispensable, mandatory condition precedent for the admissibility of secondary electronic evidence.',
    essential_ingredients: '1. Overrides general evidence rules ("Notwithstanding anything contained in this Act").\n2. Applies to secondary electronic evidence (copies, printouts, stored media).\n3. Computer system conditions under sub-section (2) must be fulfilled.\n4. Mandatory Section 65B(4) Certificate: Signed by a responsible official in charge of the device, identifying the record and describing its production.\n5. Production of original device under Section 62 dispenses with the requirement of a 65B certificate.',
    exceptions: 'Where original primary electronic device itself is produced directly in court by the owner.',
    punishment_or_consequence: 'Secondary electronic evidence produced without mandatory 65B certificate is inadmissible in court.'
  },

  // ==========================================
  // BHARATIYA SAKSHYA ADHINIYAM, 2023 (Act 16)
  // ==========================================
  {
    id: 4606, act_id: 16, section_number: '23',
    section_title: 'Confession to police officer and discovery of fact',
    legal_nature: 'Evidence / Admissibility', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active; consolidates Section 25, 26, and 27 IEA',
    source_name: 'The Bharatiya Sakshya Adhiniyam, 2023 (Act No. 47 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    statutory_text: '(1) No confession made to a police officer shall be proved as against a person accused of any offence.\n\n(2) No confession made by any person whilst he is in the custody of a police officer, unless it be made in the immediate presence of a Magistrate, shall be proved as against such person:\n\nProvided that when any fact is deposed to as discovered in consequence of information received from a person accused of any offence, in the custody of a police officer, so much of such information, whether it amounts to a confession or not, as relates distinctly to the fact thereby discovered, may be proved.',
    plain_explanation: 'Section 23 BSA consolidates the prohibition of police confessions and codifies the discovery of fact doctrine, replacing Sections 25, 26, and 27 of the Indian Evidence Act.',
    essential_ingredients: '1. General bar on confessions made to police or in police custody.\n2. Proviso: Information distinctly leading to discovery of a material fact is admissible.\n3. Preserves the Pulukuri Kottaya confirmation-by-subsequent-facts doctrine.',
    exceptions: 'Confessions made in immediate presence of Magistrate; discovery of fact under proviso.',
    punishment_or_consequence: 'Portion distinctly leading to discovery is admissible evidence.'
  },
  {
    id: 4609, act_id: 16, section_number: '26',
    section_title: 'Cases in which statement of relevant fact by person who is dead or cannot be found is relevant (Dying Declaration)',
    legal_nature: 'Evidence / Admissibility', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active; replaces Section 32(1) IEA',
    source_name: 'The Bharatiya Sakshya Adhiniyam, 2023 (Act No. 47 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    statutory_text: 'Statements, written or verbal, of relevant facts made by a person who is dead, or who cannot be found... are themselves relevant facts in the following cases:—\n(a) When it relates to cause of death.—When the statement is made by a person as to the cause of his death, or as to any of the circumstances of the transaction which resulted in his death, in cases in which the cause of that person\'s death comes into question...',
    plain_explanation: 'Section 26(a) BSA preserves the dying declaration exception from Section 32(1) of the Indian Evidence Act.',
    essential_ingredients: '1. Statement made by deceased regarding cause of death or transaction resulting in death.\n2. Admissible without requirement of expecting death at the time of statement.\n3. Fit state of mind must be established.',
    exceptions: 'Tutored or doubtful statements.',
    punishment_or_consequence: 'Substantive evidence capable of supporting conviction.'
  },
  {
    id: 4646, act_id: 16, section_number: '63',
    section_title: 'Admissibility of electronic records and Certificate standards',
    legal_nature: 'Evidence / Admissibility', status: 'Active',
    commencement_date: '2024-07-01', amendment_status: 'Active landmark evidentiary reform; modernises Section 65B IEA with standardised Schedule Certificate',
    source_name: 'The Bharatiya Sakshya Adhiniyam, 2023 (Act No. 47 of 2023)',
    source_url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    statutory_text: '(1) Notwithstanding anything contained in this Adhiniyam, any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media or each digital and electronic code produced by a computer or communication device... shall be deemed to be also a document...\n\n(4) In any proceedings where it is desired to give a statement in evidence by virtue of this section, a certificate doing any of the following things, that is to say,—\n(a) identifying the electronic record containing the statement and describing the manner in which it was produced;\n(b) giving such particulars of any device involved...\nand purporting to be signed by a person in charge of the computer or communication device and an expert (shall be submitted for admission of such electronic record in the form specified in the Schedule).',
    plain_explanation: 'Section 63 BSA fundamentally updates the admissibility of electronic records under Indian evidence law, expanding the definition to modern communication devices, smartphones, cloud data, and digital codes, and introducing a formal statutory certificate format prescribed in the Schedule to the Adhiniyam.',
    essential_ingredients: '1. Overrides general evidence rules ("Notwithstanding anything contained in this Adhiniyam").\n2. Expanded scope: Covers communication devices, smartphones, servers, cloud, digital codes.\n3. Mandatory Certificate under sub-section (4) in the format prescribed in the Schedule.\n4. Dual signatory framework: Signed by the person in charge of the device and an expert where required.',
    exceptions: 'Production of primary original storage device directly.',
    punishment_or_consequence: 'Mandatory statutory condition for admissibility; electronic records without certificate are inadmissible.'
  }
];

// Enrich each record with formatted section_text
const enriched = cohort1.map(rec => {
  const parts = [
    `[OFFICIAL STATUTORY TEXT]\n${rec.statutory_text}`,
    `\n[PLAIN-LANGUAGE LEGAL EXPLANATION]\n${rec.plain_explanation}`,
    `\n[ESSENTIAL INGREDIENTS & PRINCIPLES]\n${rec.essential_ingredients}`
  ];

  if (rec.exceptions) {
    parts.push(`\n[EXCEPTIONS & DEFENCES]\n${rec.exceptions}`);
  }

  if (rec.punishment_or_consequence) {
    parts.push(`\n[LEGAL CONSEQUENCE & PUNISHMENT]\n${rec.punishment_or_consequence}`);
  }

  if (rec.amendment_status) {
    parts.push(`\n[AMENDMENT & JUDICIAL STATUS]\n${rec.amendment_status}`);
  }

  parts.push(`\n[OFFICIAL CITATION & SOURCE]\nSource: ${rec.source_name}\nOfficial Portal: ${rec.source_url}\nCommencement Date: ${rec.commencement_date || 'N/A'}`);

  return {
    ...rec,
    formatted_section_text: parts.join('\n')
  };
});

const outPath = path.join(__dirname, '../data/verified_sections_cohort1.json');
fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2), 'utf8');
console.log(`Generated Cohort 1 verified records: ${enriched.length} records saved to ${outPath}`);
