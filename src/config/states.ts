/**
 * src/config/states.ts
 * 
 * Central state registry. Dynamic generation for 33 states.
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

// ─── State Definitions & Local Names ──────────────────────────────────────────

export const STATE_DETAILS: Record<string, { name: string; local: string; gradient?: string; accent?: string; darkAccent?: string }> = {
  an:           { name: 'Andaman & Nicobar',   local: 'अंडमान व निकोबार' },
  arunachal:    { name: 'Arunachal Pradesh',   local: 'अरुणाचल प्रदेश' },
  andhra:       { name: 'Andhra Pradesh',      local: 'आंध्र प्रदेश',        gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1b5e20 100%)', accent: '#1565c0', darkAccent: '#0d47a1' },
  assam:        { name: 'Assam',               local: 'आसाम' },
  bihar:        { name: 'Bihar',               local: 'बिहार',              gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #ff6f00 100%)', accent: '#2e7d32', darkAccent: '#1b5e20' },
  chandigarh:   { name: 'Chandigarh',          local: 'चंडीगढ़' },
  chhattisgarh: { name: 'Chhattisgarh',        local: 'छत्तीसगढ़' },
  damandiu:     { name: 'Daman & Diu',         local: 'दमन आणि दीव' },
  dadar:        { name: 'Dadar & Nagar Haveli',local: 'दादरा व नगर हवेली' },
  delhi:        { name: 'Delhi',               local: 'दिल्ली',             gradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #e65100 100%)', accent: '#0d47a1', darkAccent: '#0a3578' },
  goa:          { name: 'Goa',                 local: 'गोवा' },
  gujarat:      { name: 'Gujarat',             local: 'गुजरात',             gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 50%, #1b5e20 100%)', accent: '#e65100', darkAccent: '#c43d00' },
  haryana:      { name: 'Haryana',             local: 'हरियाणा' },
  hp:           { name: 'Himachal Pradesh',    local: 'हिमाचल प्रदेश' },
  jk:           { name: 'Jammu & Kashmir',     local: 'जम्मू व काश्मीर' },
  jharkhand:    { name: 'Jharkhand',           local: 'झारखंड' },
  karnataka:    { name: 'Karnataka',           local: 'कर्नाटक',            gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 50%, #e65100 100%)', accent: '#4a148c', darkAccent: '#38006b' },
  kerala:       { name: 'Kerala',              local: 'केरल',               gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #ffd600 100%)', accent: '#2e7d32', darkAccent: '#1b5e20' },
  mizoram:      { name: 'Mizoram',             local: 'मिझोरम' },
  mp:           { name: 'Madhya Pradesh',      local: 'मध्य प्रदेश',        gradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #4caf50 100%)', accent: '#0d47a1', darkAccent: '#083372' },
  mh:           { name: 'Maharashtra',         local: 'महाराष्ट्र',          gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 40%, #1b5e20 100%)', accent: '#ff6f00', darkAccent: '#e65100' },
  manipur:      { name: 'Manipur',             local: 'मणीपूर' },
  megha:        { name: 'Meghalaya',           local: 'मेघालय' },
  nagaland:     { name: 'Nagaland',            local: 'नागालँड' },
  odisha:       { name: 'Odisha',              local: 'ओडिशा',              gradient: 'linear-gradient(135deg, #0d47a1 0%, #00838f 50%, #2e7d32 100%)', accent: '#00838f', darkAccent: '#005662' },
  punjab:       { name: 'Punjab',              local: 'पंजाब' },
  puducherry:   { name: 'Puducherry',          local: 'पुडुचेरी' },
  rajasthan:    { name: 'Rajasthan',           local: 'राजस्थान',           gradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 50%, #ffd600 100%)', accent: '#bf360c', darkAccent: '#8e24aa' },
  sikkim:       { name: 'Sikkim',              local: 'सिक्कीम' },
  tamilnadu:    { name: 'Tamil Nadu',          local: 'तमिळनाडू',            gradient: 'linear-gradient(135deg, #00838f 0%, #006064 50%, #4caf50 100%)', accent: '#006064', darkAccent: '#00363a' },
  telangana:    { name: 'Telangana',           local: 'तेलंगणा' },
  tripura:      { name: 'Tripura',             local: 'त्रिपुरा' },
  up:           { name: 'Uttar Pradesh',       local: 'उत्तर प्रदेश',        gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 50%, #1b5e20 100%)', accent: '#e65100', darkAccent: '#bf360c' },
  uttarakhand:  { name: 'Uttarakhand',         local: 'उत्तराखंड' },
  wb:           { name: 'West Bengal',         local: 'पश्चिम बंगाल' }
};

// Default generic categories for state-wise listings
const DEFAULT_STATE_CATEGORIES = [
  { id: 'all', label: 'सर्व / All', icon: '🌏' },
  { id: 'Latest Jobs', label: 'Latest Jobs', icon: '📚' },
  { id: 'Admit Card', label: 'Admit Card', icon: '🛡️' },
  { id: 'Result', label: 'Result', icon: '🏆' },
  { id: 'Others', label: 'इतर नोकऱ्या', icon: '🏢' }
];

// Fallback details if a state lacks custom overrides
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1b5e20 100%)';
const DEFAULT_ACCENT = '#1565c0';
const DEFAULT_DARK_ACCENT = '#0d47a1';

// Generate dynamic states configuration dictionary
export const STATES_CONFIG: Record<string, StateConfig> = {};

Object.entries(STATE_DETAILS).forEach(([code, details]) => {
  STATES_CONFIG[code] = {
    code,
    name: details.name,
    nameLocal: details.local,
    dataUrl: `/states/${code}/scraped-jobs.json`,
    heroGradient: details.gradient || DEFAULT_GRADIENT,
    accentColor: details.accent || DEFAULT_ACCENT,
    accentColorDark: details.darkAccent || DEFAULT_DARK_ACCENT,
    seoDescription: `${details.name} government job alerts — State Public Service Commission (PSC), Police Bharti, Health Department, and local municipal corporation recruitments in ${details.name} 2026.`,
    seoKeywords: `${details.name} sarkari naukri, ${details.name} recruitment 2026, ${details.name} govt jobs, state job alerts`,
    // If Maharashtra, keep MPSC specific categories. Otherwise use default category chips.
    categories: code === 'mh' ? [
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
      { id: 'MH Govt Jobs',             label: 'MH सरकारी',              icon: '🌏' }
    ] : DEFAULT_STATE_CATEGORIES,
    infoBlocks: [
      {
        title: `🏛️ State Recruitments in ${details.name}`,
        body: `Find the latest updates on state department recruitments, exams, and results for ${details.name} government job openings 2026. Verified from official state bulletins.`
      },
      {
        title: `📍 Local District Openings`,
        body: `Access district-wise notifications, municipal corporations vacancies, and contract-based openings in ${details.name}.`
      }
    ]
  };
});

/** Helper: get all registered state codes */
export const getStateCodes = () => Object.keys(STATES_CONFIG);

/** Helper: get config for a state, or null */
export const getStateConfig = (code: string): StateConfig | null =>
  STATES_CONFIG[code] ?? null;
