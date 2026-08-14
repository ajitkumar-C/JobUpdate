/**
 * src/config/states.ts
 * 
 * Central state registry. Adding a new state = add one block here + create its scraper.
 * The StateJobs component reads from this config automatically.
 */

export interface StateConfig {
  code: string;                // e.g. 'mh'
  name: string;                // e.g. 'Maharashtra'
  nameLocal: string;           // Local language name e.g. 'महाराष्ट्र'
  dataUrl: string;             // Path to state-specific scraped JSON
  heroGradient: string;        // CSS gradient for hero banner
  accentColor: string;         // Primary accent color for cards/buttons
  accentColorDark: string;     // Darker shade for hover states
  seoDescription: string;      // Meta description for the state page
  seoKeywords: string;         // Meta keywords for the state page
  categories: StateCategory[]; // Job categories specific to this state
  infoBlocks: StateInfoBlock[]; // SEO content blocks at the bottom
}

export interface StateCategory {
  id: string;         // Matches job.category value in JSON
  label: string;      // Bilingual display label
  icon: string;       // Emoji icon
}

export interface StateInfoBlock {
  title: string;
  body: string;
}

// ============================================================
//  STATE REGISTRY — Add new states below
// ============================================================
export const STATES_CONFIG: Record<string, StateConfig> = {

  mh: {
    code: 'mh',
    name: 'Maharashtra',
    nameLocal: 'महाराष्ट्र',
    dataUrl: '/states/mh/scraped-jobs.json',
    heroGradient: 'linear-gradient(135deg, #FF6F00 0%, #E65100 40%, #1B5E20 100%)',
    accentColor: '#FF6F00',
    accentColorDark: '#E65100',
    seoDescription: 'Maharashtra government job alerts — MPSC, Police Bharti, NHM, ZP 2026. महाराष्ट्र सरकारी नोकरी. Find all state-specific recruitments on Sarkari Aavedan.',
    seoKeywords: 'Maharashtra sarkari naukri, MPSC bharti 2026, Maharashtra police recruitment, NHM Maharashtra jobs, ZP teacher bharti, anganwadi recruitment Maharashtra',
    categories: [
      { id: 'all',                      label: 'सर्व / All',             icon: '🌏' },
      { id: 'MPSC Jobs',                label: 'MPSC भरती',              icon: '🏛️' },
      { id: 'Maharashtra Police Jobs',  label: 'पोलीस भरती',             icon: '🛡️' },
      { id: 'Teaching Jobs',            label: 'शिक्षक भरती',            icon: '📚' },
      { id: 'Medical & Health Jobs',    label: 'आरोग्य नोकऱ्या',         icon: '🏥' },
      { id: 'Engineering Jobs',         label: 'अभियांत्रिकी',           icon: '⚙️' },
      { id: 'Anganwadi Jobs',           label: 'अंगणवाडी',               icon: '👶' },
      { id: 'Bank Jobs',                label: 'बँक नोकऱ्या',            icon: '🏦' },
      { id: 'Railway Jobs',             label: 'रेल्वे भरती',            icon: '🚂' },
      { id: 'Defence Jobs',             label: 'संरक्षण',                icon: '🎖️' },
      { id: 'Research & University Jobs',label: 'संशोधन / विद्यापीठ',   icon: '🔬' },
      { id: 'Central Government Jobs',  label: 'केंद्र सरकार',           icon: '🏢' },
      { id: 'MH Govt Jobs',             label: 'MH सरकारी',              icon: '🌏' },
    ],
    infoBlocks: [
      {
        title: '🏛️ MPSC Recruitment 2026 (एमपीएससी भरती)',
        body: 'MPSC Group 1 covers 100+ Class A/B posts (Deputy Collector, DSP, Tahsildar). Group 2 includes 800+ posts (PSI, STI, ASO). Selection: Prelims (GS + CSAT) → Mains → Interview. Visit mpsc.gov.in for official syllabus.'
      },
      {
        title: '🛡️ Maharashtra Police Bharti 2026',
        body: 'Constable & PSI bharti released via SLPRB. Selection: Written Exam → PMT → PET → Medical. Age: General 18–28 yrs | SC/ST +5 | OBC/VJNT +3. Visit mahapolice.gov.in.'
      },
      {
        title: '🏥 NHM Maharashtra 2026 (आरोग्य नोकऱ्या)',
        body: 'NHM offers Staff Nurse, ANM, CHO, Lab Technician, Medical Officer posts across all 36 districts. Apply at nhmmaharashtra.gov.in.'
      },
      {
        title: '📚 ZP Teacher Bharti 2026 (शिक्षक भरती)',
        body: 'Zilla Parishad recruits Primary & Upper Primary teachers via ZPTC. TET/CTET qualification required. Apply at respective district ZP website or mahazp.in.'
      }
    ]
  },

  // ─── Future state example (uncomment and fill to add UP) ───────────────
  // up: {
  //   code: 'up',
  //   name: 'Uttar Pradesh',
  //   nameLocal: 'उत्तर प्रदेश',
  //   dataUrl: '/states/up/scraped-jobs.json',
  //   heroGradient: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 60%, #4CAF50 100%)',
  //   accentColor: '#1565C0',
  //   accentColorDark: '#0D47A1',
  //   seoDescription: 'Uttar Pradesh sarkari naukri 2026 — UPPSC, UP Police, UPSSSC recruitment.',
  //   seoKeywords: 'UP sarkari naukri, UPPSC bharti 2026, UP police recruitment, UPSSSC jobs',
  //   categories: [ ... ],
  //   infoBlocks: [ ... ]
  // },

};

/** Helper: get all registered state codes */
export const getStateCodes = () => Object.keys(STATES_CONFIG);

/** Helper: get config for a state, or null */
export const getStateConfig = (code: string): StateConfig | null =>
  STATES_CONFIG[code] ?? null;
