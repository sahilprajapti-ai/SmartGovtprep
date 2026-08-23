// ==========================================
// SmartGovtPrep - Comprehensive Data Store (Current & Target Future Exams 2026 - 2030)
// ==========================================

const EXAM_CATEGORIES = [
  { id: 'all', name: 'All Exams', icon: 'fa-globe', count: 48 },
  { id: 'upsc', name: 'UPSC', icon: 'fa-landmark', count: 12, badge: 'National' },
  { id: 'gpsc', name: 'GPSC (Gujarat)', icon: 'fa-shield-halved', count: 14, badge: 'State Special' },
  { id: 'ssc', name: 'SSC', icon: 'fa-briefcase', count: 10, badge: 'Central' },
  { id: 'banking', name: 'Banking & IBPS', icon: 'fa-building-columns', count: 12, badge: 'Top Recruiter' },
  { id: 'railway', name: 'Railway (RRB)', icon: 'fa-train', count: 8, badge: 'Mega Vacancy' },
  { id: 'police', name: 'Police Bharti', icon: 'fa-user-shield', count: 10, badge: 'High Demand' },
  { id: 'teaching', name: 'Teaching (TET/TAT)', icon: 'fa-graduation-cap', count: 8, badge: 'State & Central' },
  { id: 'defense', name: 'Defense (NDA/CDS)', icon: 'fa-jet-fighter', count: 6, badge: 'Armed Forces' }
];

const UPCOMING_EXAMS = [
  // ----------------- Current Active / Ongoing Exams -----------------
  {
    id: 'gpsc-class12-2026',
    name: 'GPSC Gujarat Administrative Service Class 1 & 2 (2026)',
    year: '2026',
    phase: 'current',
    category: 'gpsc',
    conductingBody: 'Gujarat Public Service Commission',
    state: 'Gujarat',
    posts: 'Deputy Collector, DDO, ACP, Mamlatdar, Taluka Development Officer',
    vacancies: '388 Posts',
    appStart: '2026-09-01',
    appEnd: '2026-09-25',
    examDate: '2026-11-15',
    eligibility: 'Bachelor\'s Degree in any discipline from recognized university.',
    ageLimit: '20 - 35 Years (Relaxation as per Gujarat Govt rules)',
    status: 'Upcoming (Admit Card Soon)',
    officialUrl: 'https://gpsc.gujarat.gov.in',
    notificationPdf: 'GPSC_Class12_Advt_2026.pdf',
    featured: true,
    syllabusId: 'gpsc-class12',
    strategyTip: 'Focus 40% on Gujarat History/Culture + 30% Polity + 30% Timed CSAT Mini Mocks.'
  },
  {
    id: 'ssc-cgl-2026',
    name: 'SSC Combined Graduate Level (CGL) 2026',
    year: '2026',
    phase: 'current',
    category: 'ssc',
    conductingBody: 'Staff Selection Commission',
    state: 'All India',
    posts: 'Assistant Section Officer (ASO), Income Tax Inspector, GST Inspector, Auditor',
    vacancies: '17,727 Posts',
    appStart: '2026-06-24',
    appEnd: '2026-07-24',
    examDate: '2026-09-12',
    eligibility: 'Bachelor\'s Degree in any discipline from a recognized University.',
    ageLimit: '18 - 32 Years',
    status: 'Live Application (Tier-1 Imminent)',
    officialUrl: 'https://ssc.gov.in',
    notificationPdf: 'SSC_CGL_2026_Notification.pdf',
    featured: true,
    syllabusId: 'ssc-cgl',
    strategyTip: 'Daily 2 Full Mock Tests with speed drill in Quantitative & Reasoning.'
  },
  {
    id: 'sbi-po-2026',
    name: 'SBI Probationary Officer (PO) 2026',
    year: '2026',
    phase: 'current',
    category: 'banking',
    conductingBody: 'State Bank of India',
    state: 'All India',
    posts: 'Probationary Officer (Scale I)',
    vacancies: '2,000+ Posts',
    appStart: '2026-09-07',
    appEnd: '2026-09-27',
    examDate: '2026-11-28',
    eligibility: 'Graduation in any discipline from a recognized university.',
    ageLimit: '21 - 30 Years',
    status: 'Upcoming Notification',
    officialUrl: 'https://sbi.co.in/careers',
    notificationPdf: 'SBI_PO_2026_Recruitment.pdf',
    featured: true,
    syllabusId: 'sbi-po',
    strategyTip: 'Master 20-minute sectional speed + parallel case seating arrangements.'
  },
  {
    id: 'gujarat-police-2026',
    name: 'Gujarat Police Sub-Inspector (PSI) & Constable 2026',
    year: '2026',
    phase: 'current',
    category: 'police',
    conductingBody: 'Gujarat Police Recruitment Board (LRB/PSIRB)',
    state: 'Gujarat',
    posts: 'Unarmed PSI, Armed PSI, Unarmed Police Constable, Jail Sipahi',
    vacancies: '12,472 Posts',
    appStart: '2026-04-04',
    appEnd: '2026-04-30',
    examDate: '2026-10-05',
    eligibility: 'Constable: 12th Pass | PSI: Graduate in any discipline.',
    ageLimit: '18 - 33 Years (Constable) | 20 - 35 Years (PSI)',
    status: 'Physical Test Scheduled',
    officialUrl: 'https://ojas.gujarat.gov.in',
    notificationPdf: 'Gujarat_Police_Bharti_2026.pdf',
    featured: true,
    syllabusId: 'gujarat-police',
    strategyTip: 'Combine morning physical running (5km/1.6km) with evening Constitution & Law MCQs.'
  },
  {
    id: 'upsc-cse-2026',
    name: 'UPSC Civil Services Examination (CSE) 2026',
    year: '2026',
    phase: 'current',
    category: 'upsc',
    conductingBody: 'Union Public Service Commission',
    state: 'All India',
    posts: 'IAS, IPS, IFS, IRS, Central Services Group A & B',
    vacancies: '1,056 Posts',
    appStart: '2026-02-14',
    appEnd: '2026-03-05',
    examDate: '2026-05-24',
    eligibility: 'Graduation in any stream from recognized university.',
    ageLimit: '21 - 32 Years',
    status: 'Mains Stage Preparation',
    officialUrl: 'https://upsc.gov.in',
    notificationPdf: 'UPSC_CSE_2026_Notice.pdf',
    featured: true,
    syllabusId: 'upsc-cse',
    strategyTip: 'Daily answer writing of 2 GS questions + weekly essay test.'
  },

  // ----------------- Target Future Exams (2027 Calendar) -----------------
  {
    id: 'upsc-cse-2027',
    name: 'UPSC Civil Services Examination (CSE) 2027',
    year: '2027',
    phase: 'target-future',
    category: 'upsc',
    conductingBody: 'Union Public Service Commission',
    state: 'All India',
    posts: 'IAS, IPS, IFS, IRS, Group A & B Civil Services',
    vacancies: '1,150+ Posts (Estimated)',
    appStart: '2027-02-10',
    appEnd: '2027-03-02',
    examDate: '2027-05-23',
    eligibility: 'Bachelor\'s Degree in any discipline. Final year students eligible.',
    ageLimit: '21 - 32 Years',
    status: '2027 Foundation Target',
    officialUrl: 'https://upsc.gov.in',
    notificationPdf: 'UPSC_CSE_2027_Calendar.pdf',
    featured: true,
    syllabusId: 'upsc-cse',
    strategyTip: 'Target Stage: Complete Class 6-12 NCERTs + Optionals selection by Dec 2026.'
  },
  {
    id: 'gpsc-class12-2027',
    name: 'GPSC Gujarat Administrative Service Class 1 & 2 (2027 Cycle)',
    year: '2027',
    phase: 'target-future',
    category: 'gpsc',
    conductingBody: 'Gujarat Public Service Commission',
    state: 'Gujarat',
    posts: 'Deputy Collector, DDO, ACP, Mamlatdar, TDO, District Registrar',
    vacancies: '420 Posts',
    appStart: '2027-08-15',
    appEnd: '2027-09-10',
    examDate: '2027-10-17',
    eligibility: 'Graduation in any stream from recognized University.',
    ageLimit: '20 - 35 Years (+5 yrs Gujarat Govt relaxations)',
    status: '2027 Priority Target',
    officialUrl: 'https://gpsc.gujarat.gov.in',
    notificationPdf: 'GPSC_Calendar_2027.pdf',
    featured: true,
    syllabusId: 'gpsc-class12',
    strategyTip: 'Target Stage: Build Gujarat Heritage notes + GCERT textbooks + Gujarati grammar.'
  },
  {
    id: 'ssc-cgl-2027',
    name: 'SSC Combined Graduate Level (CGL) 2027',
    year: '2027',
    phase: 'target-future',
    category: 'ssc',
    conductingBody: 'Staff Selection Commission',
    state: 'All India',
    posts: 'ASO (CSS/MEA), Income Tax Inspector, GST Inspector, Preventive Officer',
    vacancies: '15,000+ Posts',
    appStart: '2027-06-15',
    appEnd: '2027-07-15',
    examDate: '2027-09-18',
    eligibility: 'Graduation from any recognized University.',
    ageLimit: '18 - 32 Years',
    status: '2027 Target Calendar',
    officialUrl: 'https://ssc.gov.in',
    notificationPdf: 'SSC_CGL_2027_Notice.pdf',
    featured: true,
    syllabusId: 'ssc-cgl',
    strategyTip: 'Target Stage: Finish basic arithmetic, advance math formulas & vocabulary roots.'
  },
  {
    id: 'gujarat-police-2027',
    name: 'Gujarat Police PSI & LRB Constable Bharti (2027)',
    year: '2027',
    phase: 'target-future',
    category: 'police',
    conductingBody: 'Gujarat Police Recruitment Board (PSIRB/LRB)',
    state: 'Gujarat',
    posts: 'Unarmed PSI, Armed PSI, Police Constable, Jail Guard, SRPF',
    vacancies: '10,500 Posts',
    appStart: '2027-04-10',
    appEnd: '2027-05-05',
    examDate: '2027-11-07',
    eligibility: '12th Pass for Constable | Graduate for PSI.',
    ageLimit: '18 - 33 Years (Constable) | 20 - 35 Years (PSI)',
    status: '2027 Future Target',
    officialUrl: 'https://ojas.gujarat.gov.in',
    notificationPdf: 'Gujarat_Police_Advt_2027.pdf',
    featured: true,
    syllabusId: 'gujarat-police',
    strategyTip: 'Target Stage: Physical fitness endurance build + Bharatiya Nyaya Sanhita (BNS) law reading.'
  },
  {
    id: 'sbi-po-2027',
    name: 'SBI Probationary Officer (PO) Recruitment 2027',
    year: '2027',
    phase: 'target-future',
    category: 'banking',
    conductingBody: 'State Bank of India',
    state: 'All India',
    posts: 'Probationary Officer (Scale I - Pan India)',
    vacancies: '2,200 Posts',
    appStart: '2027-09-05',
    appEnd: '2027-09-25',
    examDate: '2027-11-21',
    eligibility: 'Graduation in any discipline from recognized university.',
    ageLimit: '21 - 30 Years',
    status: '2027 Future Target',
    officialUrl: 'https://sbi.co.in/careers',
    notificationPdf: 'SBI_PO_2027_Notification.pdf',
    featured: false,
    syllabusId: 'sbi-po',
    strategyTip: 'Target Stage: Build calculation speed tricks & daily newspaper reading habit.'
  },
  {
    id: 'rrb-alp-2027',
    name: 'Railway RRB Assistant Loco Pilot (ALP) & Technician 2027',
    year: '2027',
    phase: 'target-future',
    category: 'railway',
    conductingBody: 'Railway Recruitment Control Board',
    state: 'All India',
    posts: 'Assistant Loco Pilot (ALP), Technician Grade I & III',
    vacancies: '18,799 Posts',
    appStart: '2027-03-01',
    appEnd: '2027-03-31',
    examDate: '2027-08-14',
    eligibility: 'Matriculation + ITI / Diploma in Engineering.',
    ageLimit: '18 - 33 Years',
    status: '2027 Mega Cycle',
    officialUrl: 'https://indianrailways.gov.in',
    notificationPdf: 'RRB_ALP_CEN_2027.pdf',
    featured: false,
    syllabusId: 'rrb-ntpc',
    strategyTip: 'Target Stage: Practice technical trade science & basic physics/mechanics.'
  },

  // ----------------- Target Future Exams (2028 - 2030 Vision) -----------------
  {
    id: 'upsc-cse-2028',
    name: 'UPSC Civil Services Examination (CSE) 2028',
    year: '2028',
    phase: 'target-future',
    category: 'upsc',
    conductingBody: 'UPSC New Delhi',
    state: 'All India',
    posts: 'IAS, IPS, IFS, IRS, Central Services',
    vacancies: '1,100+ Posts',
    appStart: '2028-02-16',
    appEnd: '2028-03-07',
    examDate: '2028-05-28',
    eligibility: 'Graduation in any stream from recognized university.',
    ageLimit: '21 - 32 Years',
    status: '2028 Long-Term Goal',
    officialUrl: 'https://upsc.gov.in',
    notificationPdf: 'UPSC_CSE_2028_Advance.pdf',
    featured: true,
    syllabusId: 'upsc-cse',
    strategyTip: 'Foundation Phase: Read standard textbooks (Laxmikanth, Spectrum, Ramesh Singh).'
  },
  {
    id: 'gpsc-class12-2028',
    name: 'GPSC Gujarat Administrative Service Class 1 & 2 (2028)',
    year: '2028',
    phase: 'target-future',
    category: 'gpsc',
    conductingBody: 'GPSC Gujarat',
    state: 'Gujarat',
    posts: 'Deputy Collector, Mamlatdar, TDO, Section Officer',
    vacancies: '450 Posts',
    appStart: '2028-08-20',
    appEnd: '2028-09-15',
    examDate: '2028-10-22',
    eligibility: 'Bachelor\'s Degree from recognized university.',
    ageLimit: '20 - 35 Years',
    status: '2028 Target',
    officialUrl: 'https://gpsc.gujarat.gov.in',
    notificationPdf: 'GPSC_Class12_2028.pdf',
    featured: true,
    syllabusId: 'gpsc-class12',
    strategyTip: 'Foundation Phase: State administration, District Collectorate structure & SER Gujarat data.'
  },
  {
    id: 'upsc-cse-2029',
    name: 'UPSC Civil Services Examination (CSE) 2029',
    year: '2029',
    phase: 'target-future',
    category: 'upsc',
    conductingBody: 'Union Public Service Commission',
    state: 'All India',
    posts: 'IAS, IPS, IFS, IRS, Central Civil Services',
    vacancies: '1,200+ Posts',
    appStart: '2029-02-15',
    appEnd: '2029-03-06',
    examDate: '2029-05-27',
    eligibility: 'Bachelor\'s Degree in any discipline from recognized university.',
    ageLimit: '21 - 32 Years',
    status: '2029 Strategic Vision',
    officialUrl: 'https://upsc.gov.in',
    notificationPdf: 'UPSC_CSE_2029_Advance.pdf',
    featured: true,
    syllabusId: 'upsc-cse',
    strategyTip: 'Vision Phase: Complete GS 1-4 syllabus notes + current affairs monthly compilation archive.'
  },
  {
    id: 'gpsc-class12-2029',
    name: 'GPSC Gujarat Administrative Service Class 1 & 2 (2029)',
    year: '2029',
    phase: 'target-future',
    category: 'gpsc',
    conductingBody: 'GPSC Gujarat',
    state: 'Gujarat',
    posts: 'Deputy Collector, DDO, ACP, Mamlatdar, TDO',
    vacancies: '480 Posts',
    appStart: '2029-08-18',
    appEnd: '2029-09-12',
    examDate: '2029-10-21',
    eligibility: 'Graduation in any stream from recognized University.',
    ageLimit: '20 - 35 Years',
    status: '2029 Vision Target',
    officialUrl: 'https://gpsc.gujarat.gov.in',
    notificationPdf: 'GPSC_Class12_2029.pdf',
    featured: true,
    syllabusId: 'gpsc-class12',
    strategyTip: 'Vision Phase: Advanced Gujarat economic development reports + public policy writing.'
  },
  {
    id: 'ssc-cgl-2029',
    name: 'SSC Combined Graduate Level (CGL) 2029',
    year: '2029',
    phase: 'target-future',
    category: 'ssc',
    conductingBody: 'Staff Selection Commission',
    state: 'All India',
    posts: 'ASO, Income Tax Inspector, GST Inspector, Central Excise',
    vacancies: '16,500+ Posts',
    appStart: '2029-06-18',
    appEnd: '2029-07-18',
    examDate: '2029-09-15',
    eligibility: 'Bachelor\'s Degree in any discipline.',
    ageLimit: '18 - 32 Years',
    status: '2029 Calendar Target',
    officialUrl: 'https://ssc.gov.in',
    notificationPdf: 'SSC_CGL_2029_Notice.pdf',
    featured: false,
    syllabusId: 'ssc-cgl',
    strategyTip: 'Vision Phase: Speed mathematics shortcuts + full comprehension drills.'
  },
  {
    id: 'upsc-cse-2030',
    name: 'UPSC Civil Services Examination (CSE) 2030 – India Vision',
    year: '2030',
    phase: 'target-future',
    category: 'upsc',
    conductingBody: 'Union Public Service Commission',
    state: 'All India',
    posts: 'IAS, IPS, IFS, IRS, Digital Governance & Administrative Services',
    vacancies: '1,250 Posts',
    appStart: '2030-02-14',
    appEnd: '2030-03-05',
    examDate: '2030-05-26',
    eligibility: 'Bachelor\'s Degree in any discipline from recognized university.',
    ageLimit: '21 - 32 Years',
    status: '2030 Strategic Career Vision',
    officialUrl: 'https://upsc.gov.in',
    notificationPdf: 'UPSC_Vision_2030.pdf',
    featured: true,
    syllabusId: 'upsc-cse',
    strategyTip: 'Vision Phase: Long-term career roadmap from college graduation towards top rank.'
  },
  {
    id: 'gpsc-class12-2030',
    name: 'GPSC Gujarat Administrative Service Class 1 & 2 (2030)',
    year: '2030',
    phase: 'target-future',
    category: 'gpsc',
    conductingBody: 'GPSC Gujarat',
    state: 'Gujarat',
    posts: 'Deputy Collector, Mamlatdar, TDO, Smart Cities Administration',
    vacancies: '500 Posts',
    appStart: '2030-08-10',
    appEnd: '2030-09-05',
    examDate: '2030-10-20',
    eligibility: 'Graduation from recognized University.',
    ageLimit: '20 - 35 Years',
    status: '2030 Vision Target',
    officialUrl: 'https://gpsc.gujarat.gov.in',
    notificationPdf: 'GPSC_Vision_2030.pdf',
    featured: true,
    syllabusId: 'gpsc-class12',
    strategyTip: 'Vision Phase: Smart governance, Dholera SIR & GIFT City administration case studies.'
  },
  {
    id: 'rrb-bullet-train-2030',
    name: 'High-Speed Rail (Bullet Train) & RRB Mega Recruitment 2030',
    year: '2030',
    phase: 'target-future',
    category: 'railway',
    conductingBody: 'National High Speed Rail Corporation (NHSRCL) / RRB',
    state: 'Gujarat & Maharashtra (Mumbai-Ahmedabad Corridor)',
    posts: 'Bullet Train Operations Officer, Station Controller, Signal Engineer, Track Supervisor',
    vacancies: '8,500 Posts',
    appStart: '2030-04-01',
    appEnd: '2030-04-30',
    examDate: '2030-08-18',
    eligibility: 'Diploma / Degree in Engineering or Graduation in any discipline.',
    ageLimit: '18 - 35 Years',
    status: '2030 Vision Project',
    officialUrl: 'https://nhsrcl.in',
    notificationPdf: 'Bullet_Train_Recruitment_2030.pdf',
    featured: true,
    syllabusId: 'rrb-ntpc',
    strategyTip: 'Technical & operational preparation for India\'s bullet train corridor.'
  }
];

const EXAM_SYLLABI = {
  'gpsc-class12': {
    name: 'GPSC Gujarat Administrative Service Class 1-2 (Comprehensive Syllabus)',
    overview: 'Selection consists of 3 stages: Prelims (400 Marks, Objective), Mains (900 Marks, Descriptive 6 Papers), and Personality Test / Interview (100 Marks). Covers Solanki history, Gujarat socio-economic review, GSDP, and state governance.',
    stages: [
      {
        stageName: 'Stage 1: Preliminary Examination (Objective - 400 Marks)',
        papers: [
          {
            title: 'General Studies Paper-1 (200 Questions, 200 Marks, 180 Min)',
            topics: [
              'History of India & Gujarat (Indus Valley to Modern Era, Solanki dynasty, Freedom Movement in Gujarat)',
              'Cultural Heritage of India and Gujarat (Folk Dances, Architecture, Fairs, Handicrafts, Garba, Stepwells)',
              'Indian Polity, Constitution & Governance (Preamble, Fundamental Rights, Directive Principles, Panchayati Raj, 73rd/74th Amendments)',
              'General Mental Ability (Logical Reasoning, Data Interpretation, Numbers, Percentages, Ratio & Proportion)'
            ]
          },
          {
            title: 'General Studies Paper-2 (200 Questions, 200 Marks, 180 Min)',
            topics: [
              'Indian Economy & Planning (GDP, Inflation, Union Budget, NITI Aayog, Gujarat Industrial Policy, GSDP)',
              'Geography of India and Gujarat (Physiography, Climate, Rivers - Narmada/Tapi, Minerals, Soil, Demographics)',
              'Science & Technology (Space - ISRO missions, Biotechnology, AI, Defense technology, Cyber security)',
              'Regional, National & International Current Affairs (Govt schemes, Summits, Awards, Sports, Vibrant Gujarat)'
            ]
          }
        ]
      },
      {
        stageName: 'Stage 2: Main Examination (Descriptive - 900 Marks, 6 Papers x 150 Marks)',
        papers: [
          { title: 'Paper 1: Gujarati Language (150 Marks, 3 Hours)', topics: ['Essay Writing, Letter Writing, Press Release, Translation (English to Gujarati), Grammar (Chhand, Alankar, Jodni, Samas, Rudhiprayog)'] },
          { title: 'Paper 2: English Language (150 Marks, 3 Hours)', topics: ['Essay Writing, Letter/Report Drafting, Precis Writing, Comprehension, Formal Speech, English Grammar & Vocabulary'] },
          { title: 'Paper 3: Essay (150 Marks, 3 Hours)', topics: ['3 Essays to be written from chosen themes: Socio-economic issues, Environment, Ethics, Technology, Gujarat Heritage'] },
          { title: 'Paper 4: General Studies-1 (150 Marks, 3 Hours)', topics: ['History of India & Cultural Heritage, Cultural Heritage of Gujarat, Geography of India & Gujarat'] },
          { title: 'Paper 5: General Studies-2 (150 Marks, 3 Hours)', topics: ['Indian Constitution, Public Administration, Ethics in Public Service, Governance & Accountability'] },
          { title: 'Paper 6: General Studies-3 (150 Marks, 3 Hours)', topics: ['Science & Technology, Indian Economy, Gujarat Economy, Current Events of Regional & Global Importance'] }
        ]
      },
      {
        stageName: 'Stage 3: Personality Test (Interview - 100 Marks)',
        papers: [
          { title: 'Personal Interview', topics: ['Assessment of candidate\'s analytical ability, situational judgment, leadership skills, knowledge of Gujarat administration & current issues.'] }
        ]
      }
    ]
  },
  'upsc-cse': {
    name: 'UPSC Civil Services Examination (CSE Syllabus & Pattern)',
    overview: '3 Tier process: Prelims (GS-1 & CSAT - 400 Marks), Mains (9 Descriptive Papers - 1750 Marks), and Personality Test (275 Marks). Total: 2025 Marks.',
    stages: [
      {
        stageName: 'Stage 1: Preliminary Exam (Objective - 400 Marks)',
        papers: [
          {
            title: 'Paper I: General Studies (100 Questions, 200 Marks, 2 Hours - Merit Counting)',
            topics: [
              'Current events of national and international importance',
              'History of India and Indian National Movement',
              'Indian and World Geography - Physical, Social, Economic Geography',
              'Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues',
              'Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics',
              'General issues on Environmental Ecology, Bio-diversity and Climate Change',
              'General Science and Space/Defense Technology'
            ]
          },
          {
            title: 'Paper II: CSAT (80 Questions, 200 Marks, 2 Hours - Qualifying with 33%)',
            topics: [
              'Reading Comprehension & Critical Reasoning',
              'Interpersonal skills including communication skills',
              'Logical reasoning and analytical ability',
              'Decision making and problem solving',
              'General mental ability & Basic numeracy (Class X level), Data interpretation'
            ]
          }
        ]
      },
      {
        stageName: 'Stage 2: Mains Exam (Descriptive - 1750 Marks)',
        papers: [
          { title: 'Qualifying Papers (A & B)', topics: ['Paper A: Indian Language (300 Marks - Qualifying 25%)', 'Paper B: English Language (300 Marks - Qualifying 25%)'] },
          { title: 'Merit Papers (7 Papers x 250 Marks = 1750 Marks)', topics: [
            'Paper I: Essay (250 Marks)',
            'Paper II: GS-1 (Indian Heritage & Culture, History & Geography of World and Society)',
            'Paper III: GS-2 (Governance, Constitution, Polity, Social Justice and International Relations)',
            'Paper IV: GS-3 (Technology, Economic Development, Bio-diversity, Environment, Security & Disaster Management)',
            'Paper V: GS-4 (Ethics, Integrity and Aptitude, Case Studies)',
            'Paper VI & VII: Optional Subject Paper 1 & 2 (250 Marks each)'
          ]}
        ]
      }
    ]
  },
  'ssc-cgl': {
    name: 'SSC Combined Graduate Level (CGL Syllabus & Pattern)',
    overview: 'Conducted in 2 Tiers: Tier-1 (Computer Based Qualifying / Merit Screening) and Tier-2 (Computer Based Final Merit Stage).',
    stages: [
      {
        stageName: 'Tier 1: Computer Based Test (100 Questions, 200 Marks, 60 Minutes)',
        papers: [
          {
            title: 'Tier 1 Sections (25 Qs each = 50 Marks each, Neg. Marking: 0.50)',
            topics: [
              'General Intelligence & Reasoning (Analogies, Series, Venn Diagrams, Syllogism, Blood Relations, Coding-Decoding)',
              'General Awareness (History, Culture, Geography, Economic Scene, General Policy & Scientific Research, Current Affairs)',
              'Quantitative Aptitude (Computation of Whole Numbers, Decimals, Fractions, Ratio, Average, Interest, Profit & Loss, Trigonometry, Geometry, Mensuration)',
              'English Comprehension (Spot the Error, Fill in Blanks, Synonyms/Antonyms, Idioms & Phrases, One-word substitution, Reading Comprehension)'
            ]
          }
        ]
      },
      {
        stageName: 'Tier 2: Detailed Computer Based Test (390 Marks + Qualifying Computer/Typing)',
        papers: [
          {
            title: 'Paper I (Compulsory for all posts - 2 Hours 15 Min)',
            topics: [
              'Section 1: Mathematical Abilities (30 Qs x 3 = 90 Marks) & Reasoning and General Intelligence (30 Qs x 3 = 90 Marks)',
              'Section 2: English Language and Comprehension (45 Qs x 3 = 135 Marks) & General Awareness (25 Qs x 3 = 75 Marks)',
              'Section 3: Computer Knowledge Module (20 Qs x 3 = 60 Marks, Qualifying) & Data Entry Speed Test (DEST, Qualifying)'
            ]
          }
        ]
      }
    ]
  },
  'sbi-po': {
    name: 'SBI & IBPS Probationary Officer (PO Syllabus & Pattern)',
    overview: '3 Stage Selection: Prelims (100 Marks), Mains (200 Marks Objective + 50 Marks Descriptive), and Psychometric Test / Group Discussion & Interview (50 Marks).',
    stages: [
      {
        stageName: 'Phase 1: Preliminary Examination (100 Marks, 60 Minutes)',
        papers: [
          {
            title: 'Sectional Timed Exam (20 mins each)',
            topics: [
              'English Language (30 Questions, 30 Marks, 20 Min - Reading Comprehension, Cloze Test, Para Jumbles, Error Spotting)',
              'Quantitative Aptitude (35 Questions, 35 Marks, 20 Min - Data Interpretation, Quadratic Equations, Number Series, Arithmetic Word Problems)',
              'Reasoning Ability (35 Questions, 35 Marks, 20 Min - Puzzles & Seating Arrangements, Syllogisms, Inequalities, Blood Relations, Direction Sense)'
            ]
          }
        ]
      },
      {
        stageName: 'Phase 2: Main Examination (250 Marks, 3.5 Hours)',
        papers: [
          {
            title: 'Objective (200 Marks) & Descriptive English (50 Marks)',
            topics: [
              'Reasoning & Computer Aptitude (40 Qs, 50 Marks, 50 Min)',
              'Data Analysis & Interpretation (30 Qs, 50 Marks, 45 Min)',
              'General/Economy/Banking Awareness (50 Qs, 60 Marks, 45 Min)',
              'English Language (35 Qs, 40 Marks, 40 Min)',
              'Descriptive Test: Letter Writing & Essay (2 Questions, 50 Marks, 30 Min)'
            ]
          }
        ]
      }
    ]
  },
  'gujarat-police': {
    name: 'Gujarat Police Sub-Inspector (PSI) & Constable Bharti Syllabus',
    overview: 'Combined physical and objective test process governed by LRB/PSIRB Gujarat under updated Bharatiya Nyaya Sanhita (BNS) law frameworks.',
    stages: [
      {
        stageName: 'Stage 1: Physical Efficiency Test (PET) & Physical Standard Test (PST)',
        papers: [
          {
            title: 'Running and Physical Standards (Qualifying)',
            topics: [
              'Male Candidates: 5000 Meters Run in max 25 Minutes',
              'Female Candidates: 1600 Meters Run in max 9 Minutes 30 Seconds',
              'Ex-Servicemen: 2400 Meters Run in max 12 Minutes 30 Seconds',
              'Height, Chest measurement, Weight standards check'
            ]
          }
        ]
      },
      {
        stageName: 'Stage 2: Written Examination (Objective Paper 1 & 2 / 200-300 Marks)',
        papers: [
          {
            title: 'Written Syllabus Subjects',
            topics: [
              'General Studies, Gujarat History & Geography (30 Marks)',
              'Constitution of India, Police System & Fundamental Rights (25 Marks)',
              'Reasoning & Numerical Ability (30 Marks)',
              'Gujarati Language, Grammar & Comprehension (20 Marks)',
              'English Language Basics (15 Marks)',
              'Current Affairs & Science/Tech (20 Marks)',
              'Special Legal enactments / Bharatiya Nyaya Sanhita (BNS) & BNSS provisions for PSI'
            ]
          }
        ]
      }
    ]
  }
};

const DAILY_CURRENT_AFFAIRS = [
  {
    id: 'ca-1',
    date: '2026-08-23',
    category: 'Gujarat',
    categoryBadge: 'Gujarat State',
    title: 'Gujarat Semiconductor Mission Phase-II: Micron, Tata & Foxconn Units to Scale 100K Wafers/Month by 2027',
    summary: 'Gujarat government announced the expansion roadmap of Dholera Special Investment Region (SIR) and Sanand Semiconductor Parks, targeting full-scale commercial wafer output ahead of 2027 global supply commitments.',
    keyPoints: [
      'Location: Dholera Smart City & Sanand Electronics Cluster.',
      'Scheme: Gujarat Semiconductor Policy 2022-2027 (Extended roadmap towards 2030).',
      'Exam Relevance: GPSC GS-2/GS-3 Economy & Industry, Gujarat Current Affairs.'
    ],
    quiz: {
      question: 'Under which policy was the Dholera semiconductor fabrication facility initiated?',
      options: ['Gujarat Semiconductor Policy 2022-2027', 'Gujarat Electronics Policy 2020', 'National Tech Mission 2024', 'Dholera Industrial Act 2018'],
      correctIndex: 0
    }
  },
  {
    id: 'ca-2',
    date: '2026-08-23',
    category: 'National',
    categoryBadge: 'National News',
    title: 'ISRO Chandrayaan-4 & Gaganyaan Manned Lunar Prep: Advanced Docking Modules Tested for 2027-2028 Launch',
    summary: 'The Indian Space Research Organisation (ISRO) successfully completed high-altitude docking simulations and long-duration cryogenic engine tests for the upcoming Chandrayaan-4 sample return mission scheduled for 2027-2028.',
    keyPoints: [
      'Engine: CE-20 Upgraded Cryogenic with 22-tonne thrust.',
      'Mission Goal: Lunar sample retrieval & Human Spaceflight Gaganyaan orbital tests.',
      'Exam Relevance: UPSC Prelims Science & Tech, SSC CGL General Science, GPSC Paper 2.'
    ],
    quiz: {
      question: 'Where is the ISRO Propulsion Complex (IPRC) located?',
      options: ['Sriharikota, AP', 'Mahendragiri, Tamil Nadu', 'Thumba, Kerala', 'Bengaluru, Karnataka'],
      correctIndex: 1
    }
  },
  {
    id: 'ca-3',
    date: '2026-08-23',
    category: 'Economy',
    categoryBadge: 'Economy & Banking',
    title: 'RBI Vision 2030: Cross-Border CBDC Linkages & 100% Interoperable QR Payments Across Asia',
    summary: 'Reserve Bank of India outlined its Financial Inclusion and Central Bank Digital Currency (CBDC) Roadmap leading to 2030, emphasizing seamless real-time cross-border settlements with ASEAN and GCC nations.',
    keyPoints: [
      'Framework: Digital Rupee (e₹) Programmability & Cross-Border Nexus.',
      'Target: 500 Million active CBDC wallets by 2028-2030.',
      'Exam Relevance: Banking Awareness (SBI/IBPS PO), UPSC GS-3 Monetary Policy.'
    ],
    quiz: {
      question: 'What is the sovereign digital currency issued by the Reserve Bank of India called?',
      options: ['CryptoRupee', 'Digital Rupee (e₹)', 'Bharat Coin', 'DigiPay India'],
      correctIndex: 1
    }
  },
  {
    id: 'ca-4',
    date: '2026-08-22',
    category: 'International',
    categoryBadge: 'Global Affairs',
    title: 'India-ASEAN Strategic Roadmap 2027-2030: Maritime Trade Corridors & Digital Public Infrastructure',
    summary: 'External Affairs Ministry representatives and ASEAN delegates concluded talks focusing on Indo-Pacific maritime safety, UPI-PayNow digital payment linkages, and Free Trade Agreement (AITIGA) modernization.',
    keyPoints: [
      'Headquarters of ASEAN: Jakarta, Indonesia.',
      'India\'s policy framework: Act East Policy & Indo-Pacific Oceans Initiative (IPOI).',
      'Exam Relevance: UPSC GS-2 International Relations, GPSC Mains GS-2.'
    ],
    quiz: {
      question: 'Where is the Secretariat of ASEAN located?',
      options: ['Singapore', 'Bangkok, Thailand', 'Jakarta, Indonesia', 'Manila, Philippines'],
      correctIndex: 2
    }
  },
  {
    id: 'ca-5',
    date: '2026-08-22',
    category: 'Science',
    categoryBadge: 'Science & Environment',
    title: 'India Achieves 210 GW Renewable Milestone: Sets 500 GW Non-Fossil Target for COP30 by 2030',
    summary: 'Ministry of New & Renewable Energy (MNRE) reported that total installed solar, wind, and green hydrogen capacity is on track to cross 500 GW before 2030 under the Panchamrit Climate Commitment.',
    keyPoints: [
      'Panchamrit Goal: 500 GW non-fossil capacity by 2030, Net Zero by 2070.',
      'Top solar producing state: Rajasthan, followed by Gujarat (leading in rooftop solar).',
      'Exam Relevance: UPSC GS-3 Environment, SSC CGL GK, State PCS.'
    ],
    quiz: {
      question: 'What is India\'s target year for achieving 500 GW Non-Fossil Renewable Energy Capacity?',
      options: ['2026', '2028', '2030', '2047'],
      correctIndex: 2
    }
  }
];

const MOCK_QUESTION_BANK = [
  {
    id: 'q1',
    subject: 'Polity & Constitution',
    examCategory: 'upsc',
    difficulty: 'Medium',
    question: 'Which Article of the Indian Constitution is described by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution"?',
    options: [
      'Article 14 - Right to Equality',
      'Article 19 - Freedom of Speech',
      'Article 21 - Protection of Life and Personal Liberty',
      'Article 32 - Right to Constitutional Remedies'
    ],
    correctIndex: 3,
    explanation: 'Dr. B.R. Ambedkar termed Article 32 (Right to Constitutional Remedies) as the "Heart and Soul" of the Constitution because it guarantees the enforcement of Fundamental Rights via writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari) issued directly by the Supreme Court.',
    hint: 'This article empowers the Supreme Court to issue 5 types of writs for the enforcement of Fundamental Rights.'
  },
  {
    id: 'q2',
    subject: 'Gujarat History & Heritage',
    examCategory: 'gpsc',
    difficulty: 'Medium',
    question: 'Which Solanki ruler constructed the world-renowned "Rani ki Vav" (Queen\'s Stepwell) at Patan, Gujarat?',
    options: [
      'Mulraj I',
      'Siddhraj Jaisinh',
      'Queen Udayamati (in memory of King Bhimdev I)',
      'Kumarapala'
    ],
    correctIndex: 2,
    explanation: 'Rani ki Vav was commissioned by Queen Udayamati around 1063 AD in memory of her husband King Bhimdev I of the Solanki (Chalukya) dynasty. It was declared a UNESCO World Heritage Site in 2014 and is featured on the ₹100 banknote.',
    hint: 'It is a 7-storied subterranean stepped corridor built in Maru-Gurjara architectural style.'
  },
  {
    id: 'q3',
    subject: 'Indian Economy & Vision 2030',
    examCategory: 'upsc',
    difficulty: 'Hard',
    question: 'When the Reserve Bank of India increases the "Repo Rate", what is the immediate expected effect on the economy?',
    options: [
      'Commercial banks increase lending to public at lower interest rates',
      'Money supply in the economy increases sharply',
      'Borrowing costs for commercial banks increase, leading to higher lending rates and contraction in liquidity to curb inflation',
      'The value of the Indian Rupee depreciates immediately against all currencies'
    ],
    correctIndex: 2,
    explanation: 'Repo rate is the rate at which RBI lends short-term funds to commercial banks against government securities. An increase in Repo Rate makes borrowing expensive for banks, which pass on higher interest rates to borrowers, thereby reducing credit flow and moderating demand-pull inflation.',
    hint: 'Think about contractionary monetary policy used during inflationary pressure.'
  },
  {
    id: 'q4',
    subject: 'Quantitative Aptitude',
    examCategory: 'ssc',
    difficulty: 'Easy',
    question: 'A shopkeeper marks an article 40% above the cost price and gives a discount of 20% on the marked price. What is his net profit percentage?',
    options: [
      '12%',
      '15%',
      '20%',
      '22%'
    ],
    correctIndex: 0,
    explanation: 'Let Cost Price (CP) = 100.\nMarked Price (MP) = 100 + 40 = 140.\nDiscount = 20% of 140 = 28.\nSelling Price (SP) = 140 - 28 = 112.\nNet Profit = SP - CP = 112 - 100 = 12% profit.\nShortcut formula: Net % = a + b + (ab/100) = +40 - 20 + ((40 * -20)/100) = 20 - 8 = 12%.',
    hint: 'Use the successive change formula: x + y + (xy/100) where x = +40 and y = -20.'
  },
  {
    id: 'q5',
    subject: 'Reasoning & Mental Ability',
    examCategory: 'banking',
    difficulty: 'Medium',
    question: 'In a certain code language, if "GOVERNMENT" is coded as "71522518141351420" (alphabet positions), what will be the code for "CIVIL"?',
    options: [
      '3922912',
      '31022912',
      '3921912',
      '39221012'
    ],
    correctIndex: 0,
    explanation: 'Let us check letter ranks: C = 3, I = 9, V = 22, I = 9, L = 12. Combining them gives 3922912.',
    hint: 'A=1, B=2, C=3 ... I=9 ... V=22 ... L=12.'
  },
  {
    id: 'q6',
    subject: 'General Science & Environment',
    examCategory: 'ssc',
    difficulty: 'Easy',
    question: 'Which gas is primarily responsible for the greenhouse effect and global warming due to human emissions?',
    options: [
      'Oxygen (O2)',
      'Carbon Dioxide (CO2)',
      'Nitrogen (N2)',
      'Argon (Ar)'
    ],
    correctIndex: 1,
    explanation: 'Carbon Dioxide (CO2), along with Methane (CH4), Water Vapor, and Nitrous Oxide (N2O), traps infrared radiation emitted from the Earth\'s surface, creating the enhanced greenhouse effect.',
    hint: 'Combustion of fossil fuels primarily releases this gas.'
  },
  {
    id: 'q7',
    subject: 'Gujarat Geography & Economy',
    examCategory: 'gpsc',
    difficulty: 'Medium',
    question: 'Which district of Gujarat has the longest coastline in the state?',
    options: [
      'Bhavnagar',
      'Kutch',
      'Jamnagar',
      'Gir Somnath'
    ],
    correctIndex: 1,
    explanation: 'Kutch district possesses the longest coastline in Gujarat (and India for a single district) with over 406 km of coastal strip, hosting major ports such as Kandla (Deendayal Port) and Mundra.',
    hint: 'It is also the largest district in India by geographical area.'
  },
  {
    id: 'q8',
    subject: 'Banking & Financial Awareness',
    examCategory: 'banking',
    difficulty: 'Medium',
    question: 'What does "CTS" stand for in the Indian banking clearance mechanism?',
    options: [
      'Cash Transfer System',
      'Cheque Truncation System',
      'Credit Token Security',
      'Core Transaction Software'
    ],
    correctIndex: 1,
    explanation: 'Cheque Truncation System (CTS) is an electronic cheque clearing system initiated by the RBI wherein digital images and MICR data of cheques are transmitted instead of physical movements.',
    hint: 'It transformed physical paper cheque clearances into fast electronic digital clearing.'
  },
  {
    id: 'q9',
    subject: 'Police Administration & Law Basics',
    examCategory: 'police',
    difficulty: 'Medium',
    question: 'Under the Bharatiya Nyaya Sanhita (BNS) / Constitution Article 22, what is the maximum duration a person arrested without warrant can be detained in police custody before producing in front of a Magistrate?',
    options: [
      '12 Hours',
      '24 Hours (excluding travel time)',
      '48 Hours',
      '72 Hours'
    ],
    correctIndex: 1,
    explanation: 'Under Article 22(2) of the Constitution and BNSS/CrPC Section 57, every person arrested and detained in custody must be produced before the nearest Magistrate within a period of twenty-four hours of such arrest, excluding the time necessary for the journey.',
    hint: 'This is a constitutional guarantee under Article 22.'
  },
  {
    id: 'q10',
    subject: 'Teaching Aptitude & Pedagogy',
    examCategory: 'teaching',
    difficulty: 'Easy',
    question: 'According to the National Education Policy (NEP) 2020, what is the new pedagogical curricular structure replacing the 10+2 system?',
    options: [
      '5 + 3 + 3 + 4',
      '5 + 4 + 3 + 2',
      '4 + 4 + 3 + 3',
      '3 + 3 + 4 + 5'
    ],
    correctIndex: 0,
    explanation: 'NEP 2020 replaced the 10+2 structure with a 5+3+3+4 design corresponding to ages 3-8 (Foundational), 8-11 (Preparatory), 11-14 (Middle), and 14-18 (Secondary).',
    hint: 'It starts with 5 years of foundational learning including 3 years of Anganwadi / Pre-school.'
  }
];

const PREVIOUS_YEAR_PAPERS = [
  {
    id: 'pyq-1',
    exam: 'GPSC Class 1-2 Prelims',
    year: '2024 - 2026',
    paper: 'General Studies Paper-1 & 2 (Solved with Master Key)',
    language: 'Gujarati & English',
    fileSize: '4.8 MB',
    downloadUrl: '#download-gpsc-2026'
  },
  {
    id: 'pyq-2',
    exam: 'UPSC Civil Services Prelims',
    year: '2024 - 2026',
    paper: 'GS-1 & CSAT with Official Answer Keys & Explanations',
    language: 'English & Hindi',
    fileSize: '5.2 MB',
    downloadUrl: '#download-upsc-2026'
  },
  {
    id: 'pyq-3',
    exam: 'SSC CGL Tier-1',
    year: '2024 - 2026 All Shifts',
    paper: 'Shift-wise Question Bank (Quantitative, Reasoning, English, GK)',
    language: 'Bilingual',
    fileSize: '8.4 MB',
    downloadUrl: '#download-ssc-2026'
  },
  {
    id: 'pyq-4',
    exam: 'Gujarat Police PSI & Constable',
    year: '2022 - 2026',
    paper: 'Previous 5 Years Question Papers with Master Keys',
    language: 'Gujarati',
    fileSize: '3.6 MB',
    downloadUrl: '#download-police-pyq'
  },
  {
    id: 'pyq-5',
    exam: 'SBI PO & IBPS PO Prelims',
    year: '2024 - 2026',
    paper: 'Memory-Based Papers with Step-by-Step Solutions',
    language: 'English',
    fileSize: '6.1 MB',
    downloadUrl: '#download-bank-pyq'
  }
];

const OFFICIAL_PORTAL_DIRECTORY = [
  { name: 'OJAS Gujarat Portal', url: 'https://ojas.gujarat.gov.in', description: 'Gujarat State Online Job Application System for Class 1, 2, 3 recruitment.' },
  { name: 'GPSC Official Portal', url: 'https://gpsc.gujarat.gov.in', description: 'Gujarat Public Service Commission notifications, calendars (2026-2030), and result scorecards.' },
  { name: 'UPSC Portal', url: 'https://upsc.gov.in', description: 'Union Public Service Commission notifications, exam calendars, e-Admit Cards, and keys.' },
  { name: 'SSC Portal', url: 'https://ssc.gov.in', description: 'Staff Selection Commission central recruitment notices and candidate dashboard.' },
  { name: 'IBPS Online', url: 'https://ibps.in', description: 'Institute of Banking Personnel Selection for PO, Clerk, SO, and RRB recruitments.' },
  { name: 'Railway RRB Portal', url: 'https://rrcb.gov.in', description: 'Railway Recruitment Control Board mega vacancy notifications and admit cards.' }
];

const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['article 32', 'remedies', 'heart and soul', 'writs'],
    answer: `### 🏛️ Article 32: Right to Constitutional Remedies
Dr. B.R. Ambedkar famously called **Article 32** the *"very soul of the Constitution and the very heart of it"*.

#### 🔍 Key Takeaways for Current & Target Exams:
1. **Supreme Court's Power:** Under Article 32, citizens can directly approach the Supreme Court if any of their Fundamental Rights (Part III) are violated.
2. **5 Types of Writs:**
   - **Habeas Corpus:** "To have the body of" (Release illegal detention).
   - **Mandamus:** "We Command" (Direct public official/body to perform statutory duty).
   - **Prohibition:** "To forbid" (Higher court stops lower court from exceeding jurisdiction).
   - **Certiorari:** "To be certified" (Quash order of lower tribunal lacking jurisdiction).
   - **Quo-Warranto:** "By what authority?" (Inquire into legality of public office claim).
3. **High Court comparison:** High Courts issue writs under **Article 226** (which has even wider jurisdiction covering legal rights too).`
  },
  {
    keywords: ['time and work', 'trick', 'math', 'quant', 'shortcut', 'pipes'],
    answer: `### ⚡ Quantitative Aptitude: Time & Work Master Trick (LCM Method)

Forget lengthy 1/x fractions! Use the **Total Work = LCM of Days** method.

#### 📝 Example:
*A can do a work in 12 days, B can do it in 15 days. How many days together?*

1. **Find LCM of 12 and 15:**
   - Total Work = 60 units
2. **Calculate Daily Efficiency (Units/day):**
   - Efficiency of A = 60 / 12 = 5 units/day
   - Efficiency of B = 60 / 15 = 4 units/day
3. **Combined Efficiency:**
   - Combined = 5 + 4 = 9 units/day
4. **Days required together:**
   - Days = 60 / 9 = 20 / 3 = 6.67 days!

> 💡 **Pro Tip:** This works seamlessly for pipes & cisterns (negative efficiency for drain pipes) and wages distribution!`
  },
  {
    keywords: ['gujarat', 'schemes', 'dholera', 'solanki', 'heritage', 'current', '2027', '2030'],
    answer: `### 🦁 Important Gujarat Govt Schemes & 2026-2030 Vision (GPSC / Gujarat Police)

#### 1. Flagship Initiatives (2026-2030):
- **Gujarat Semiconductor Policy 2022-2027 & Extension:** India's first dedicated semiconductor city at Dholera SIR (Micron, Tata Electronics, Foxconn).
- **Vibrant Gujarat Global Summit Vision 2030:** Focus on Green Hydrogen, Renewable Energy Hubs (Kutch 30 GW Hybrid Park), and GIFT City financial expansion.
- **Mumbai-Ahmedabad High-Speed Rail Corridor:** Bullet Train stations at Surat, Vadodara, Anand, Ahmedabad.
- **Mukhyamantri Kisan Sahay Yojana (MKSY):** Zero-premium disaster compensation for farmers.
- **NAMO Lakshmi & NAMO Saraswati Schemes:** Direct financial aid for female students in Class 9-12.

#### 2. Static GK Essentials:
- **Longest Coastline:** 1,600 km (Kutch district has 406 km).
- **First Capital of Gujarat (1960):** Ahmedabad (shifted to Gandhinagar in 1970).
- **Father of Gujarat Heritage Architecture:** Siddharaj Jaisinh & King Bhimdev I (Solanki Golden Era).`
  },
  {
    keywords: ['upsc mains', 'gs2', 'gs3', 'answer writing', 'strategy'],
    answer: `### ✍️ High-Scoring UPSC / GPSC Mains Answer Writing Framework

To score **10-12+ marks** in a 15-marker question:

1. **Introduction (15-20% space):**
   - Define the key term or quote recent data / committee (e.g. NITI Aayog report, RBI bulletin, Supreme Court verdict).
2. **Body (70% space - Categorize into Sub-headings):**
   - **Socio-Economic Dimensions:** Impact on vulnerable sections, GDP, poverty.
   - **Constitutional & Legal Angle:** Relevant Articles, Statutory frameworks.
   - **Challenges & Roadblocks:** Infrastructure deficit, regulatory hurdles, fiscal constraints.
   - *Use small flowcharts, maps, or SWOT boxes to break monotony!*
3. **Way Forward & Conclusion (15% space):**
   - Provide solution-oriented measures (Best practices, SDG targets, Tech interventions).
   - End on an optimistic, national development vision.`
  }
];

// ==========================================
// Lifetime Government Exam Career Roadmap Store
// ==========================================
const LIFETIME_CAREER_ROADMAP = [
  {
    id: 'lr-gpsc-class12',
    stage: 'graduate',
    name: 'GPSC Gujarat Administrative Service Class 1 & 2',
    icon: 'fa-shield-halved',
    authority: 'Gujarat Public Service Commission',
    level: 'State Class 1 / Class 2 Gazetted',
    ageRange: '20 - 35 Years (+5 yrs Gujarat State Category Relaxation up to 40-45 yrs)',
    minAge: 20,
    maxAgeGeneral: 35,
    maxAgeRelaxed: 45,
    educationReq: ['graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'Deputy Collector, DDO, ACP, Mamlatdar, Taluka Development Officer (TDO)',
    salary: 'Level 10 / Level 8 (₹56,100 – ₹1,77,500 + DA & Govt Perks)',
    attempts: 'No fixed attempt limit until max age',
    badge: '👑 Premier State Service',
    highlights: '3-tier selection: Prelims MCQ -> Descriptive Mains (6 Papers) -> Interview'
  },
  {
    id: 'lr-upsc-cse',
    stage: 'graduate',
    name: 'UPSC Civil Services Examination (CSE)',
    icon: 'fa-landmark',
    authority: 'Union Public Service Commission (Central)',
    level: 'All India Service (Group A Gazetted)',
    ageRange: '21 - 32 Years (OBC: 35 yrs, SC/ST: 37 yrs, PwD: 42 yrs)',
    minAge: 21,
    maxAgeGeneral: 32,
    maxAgeRelaxed: 37,
    educationReq: ['graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'IAS (Collector/Secretary), IPS (SP/DGP), IFS (Diplomat), IRS (Tax Chief)',
    salary: 'Level 10 to Cabinet Secretary Level 18 (₹56,100 – ₹2,50,000)',
    attempts: 'General: 6 | OBC: 9 | SC/ST: Unlimited (till age)',
    badge: '🇮🇳 India\'s #1 Exam',
    highlights: 'Apex administrative leadership shaping national and international policies.'
  },
  {
    id: 'lr-ssc-cgl',
    stage: 'graduate',
    name: 'SSC Combined Graduate Level (CGL)',
    icon: 'fa-briefcase',
    authority: 'Staff Selection Commission (Central Ministries)',
    level: 'Central Group B & C Non-Gazetted / Gazetted',
    ageRange: '18 - 32 Years (Relaxable up to 35-37 for reserved)',
    minAge: 18,
    maxAgeGeneral: 32,
    maxAgeRelaxed: 37,
    educationReq: ['graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'ASO in Central Secretariat/MEA, Income Tax Inspector, GST Inspector, ED Officer',
    salary: 'Pay Level 4 to Level 8 (₹35,400 – ₹1,51,100)',
    attempts: 'Unlimited within age bracket',
    badge: '💼 Central Ministries',
    highlights: 'Tier 1 Objective -> Tier 2 In-depth Computer-Based Test (Math + Reasoning + English + GA + Computer)'
  },
  {
    id: 'lr-sbi-ibps-po',
    stage: 'graduate',
    name: 'SBI & IBPS Probationary Officer (PO)',
    icon: 'fa-building-columns',
    authority: 'State Bank of India / Public Sector Banks',
    level: 'Bank Scale-I Officer / Management Cadre',
    ageRange: '20 - 30 Years (OBC: 33 yrs, SC/ST: 35 yrs)',
    minAge: 20,
    maxAgeGeneral: 30,
    maxAgeRelaxed: 35,
    educationReq: ['graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'Probationary Officer -> Branch Manager -> Chief Manager -> DGM/CGM',
    salary: 'Basic ₹48,480+ (Gross CTC ~₹8.5 to 11 Lakhs/yr + leased accommodation)',
    attempts: 'General: 4 (SBI) | IBPS: Unlimited within age limit',
    badge: '🏦 Fast Banking Career',
    highlights: 'Fastest promotion cycle in Indian financial sector with annual recruitment cycles.'
  },
  {
    id: 'lr-police-psi',
    stage: 'graduate',
    name: 'Gujarat Police Sub-Inspector (PSI) / DySP',
    icon: 'fa-user-shield',
    authority: 'Gujarat Police Recruitment Board (PSIRB)',
    level: 'State Uniformed Police Officer (Class 2 / Class 3)',
    ageRange: '20 - 35 Years (Gujarat Category Relaxations up to 40)',
    minAge: 20,
    maxAgeGeneral: 35,
    maxAgeRelaxed: 40,
    educationReq: ['graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'Unarmed PSI, Armed PSI, Intelligence Officer, Jail Superintendent',
    salary: 'Pay Level 7 (₹39,900 – ₹1,26,600)',
    attempts: 'Unlimited within eligible age',
    badge: '👮 Uniform Prestige',
    highlights: 'Physical test + 200 Marks Objective test on Constitution, Law, General Studies & Reasoning.'
  },
  {
    id: 'lr-police-constable',
    stage: '12th',
    name: 'Gujarat Police Constable & Lokrakshak (LRB)',
    icon: 'fa-shield',
    authority: 'Gujarat Police LRB Board',
    level: 'State Armed/Unarmed Police Force (Class 3)',
    ageRange: '18 - 33 Years (Relaxations up to 38 yrs)',
    minAge: 18,
    maxAgeGeneral: 33,
    maxAgeRelaxed: 38,
    educationReq: ['12th', 'graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'Unarmed Constable, Armed Constable, SRPF Jawan, Jail Sepoy',
    salary: 'Fixed Pay 5 Years -> Level 2 (₹19,900 – ₹63,200)',
    attempts: 'Unlimited within age window',
    badge: '🏃 Early Career Start',
    highlights: 'Ideal entry point straight after 12th standard with fast in-service promotion to Head Constable / ASI.'
  },
  {
    id: 'lr-ssc-chsl',
    stage: '12th',
    name: 'SSC Combined Higher Secondary Level (CHSL)',
    icon: 'fa-id-card-clip',
    authority: 'Staff Selection Commission (Central)',
    level: 'Central Clerical & Assistant Cadre (Group C)',
    ageRange: '18 - 27 Years (Relaxable up to 32 yrs)',
    minAge: 18,
    maxAgeGeneral: 27,
    maxAgeRelaxed: 32,
    educationReq: ['12th', 'graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), Data Entry Operator (DEO)',
    salary: 'Pay Level 2 & 4 (₹19,900 – ₹81,100)',
    attempts: 'Unlimited within age bracket',
    badge: '🏛️ Central 12th Pass',
    highlights: 'Provides early central government posting with departmental exam routes to Inspector ranks.'
  },
  {
    id: 'lr-rrb-railway',
    stage: '12th',
    name: 'Railway RRB ALP, Technician & Group D',
    icon: 'fa-train-subway',
    authority: 'Railway Recruitment Control Board (RRB)',
    level: 'Indian Railways Operations & Technical (Group C)',
    ageRange: '18 - 33/36 Years',
    minAge: 18,
    maxAgeGeneral: 33,
    maxAgeRelaxed: 38,
    educationReq: ['12th', 'graduate', 'engineering', 'pg', 'law', 'bed'],
    posts: 'Assistant Loco Pilot, Technician, Track Maintainer, Assistant Pointsman',
    salary: 'Pay Level 1 & 2 (₹18,000 – ₹63,200 + Running & Overtime allowances)',
    attempts: 'Unlimited within age window',
    badge: '🚆 Mega Vacancy',
    highlights: 'Pan-India job security, medical healthcare, and Indian Railways travel passes.'
  },
  {
    id: 'lr-assistant-professor',
    stage: 'specialist',
    name: 'GSET / UGC-NET Assistant Professor & GES',
    icon: 'fa-graduation-cap',
    authority: 'Gujarat Higher Education Dept / UGC',
    level: 'State & Central Higher Education (Gazetted Class 2)',
    ageRange: '21 - 42 Years (+5 yrs Gujarat Govt relaxations up to 47)',
    minAge: 21,
    maxAgeGeneral: 42,
    maxAgeRelaxed: 47,
    educationReq: ['pg'],
    posts: 'Assistant Professor in Govt Colleges, Gujarat Educational Services (GES Class 2)',
    salary: 'Academic Level 10 (₹57,700 – ₹1,82,400)',
    attempts: 'No attempt limit',
    badge: '📚 Academic Cadre',
    highlights: 'Highest entry age window among government exams with 7th Pay Commission UGC pay scales.'
  },
  {
    id: 'lr-judicial-service',
    stage: 'specialist',
    name: 'Gujarat Judicial Service (Civil Judge)',
    icon: 'fa-scale-balanced',
    authority: 'High Court of Gujarat',
    level: 'State Judicial Officer (Subordinate Judiciary)',
    ageRange: '21 - 35 Years (Relaxable up to 38-40 for reserved & female)',
    minAge: 21,
    maxAgeGeneral: 35,
    maxAgeRelaxed: 40,
    educationReq: ['law'],
    posts: 'Civil Judge & Judicial Magistrate First Class (JMFC)',
    salary: 'Junior Civil Judge Scale (₹77,840 – ₹1,36,520)',
    attempts: 'Unlimited till maximum age',
    badge: '⚖️ Judicial Officer',
    highlights: 'Prestigious judicial career with direct pathway to District Judge & High Court Bench.'
  }
];

