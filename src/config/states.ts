/**
 * src/config/states.ts
 * 
 * Central state registry. Dynamic generation for 33 states in English.
 */

export interface StateConfig {
  code: string;                // e.g. 'mh'
  name: string;                // e.g. 'Maharashtra'
  nameLocal: string;           // Local language name (in English e.g. 'Maharashtra')
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

// ─── State Definitions ──────────────────────────────────────────

export const STATE_DETAILS: Record<string, { name: string; local: string; gradient?: string; accent?: string; darkAccent?: string }> = {
  an:           { name: 'Andaman & Nicobar',   local: 'Andaman & Nicobar' },
  arunachal:    { name: 'Arunachal Pradesh',   local: 'Arunachal Pradesh' },
  andhra:       { name: 'Andhra Pradesh',      local: 'Andhra Pradesh',      gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1b5e20 100%)', accent: '#1565c0', darkAccent: '#0d47a1' },
  assam:        { name: 'Assam',               local: 'Assam' },
  bihar:        { name: 'Bihar',               local: 'Bihar',              gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #ff6f00 100%)', accent: '#2e7d32', darkAccent: '#1b5e20' },
  chandigarh:   { name: 'Chandigarh',          local: 'Chandigarh' },
  chhattisgarh: { name: 'Chhattisgarh',        local: 'Chhattisgarh' },
  damandiu:     { name: 'Daman & Diu',         local: 'Daman & Diu' },
  dadar:        { name: 'Dadar & Nagar Haveli',local: 'Dadar & Nagar Haveli' },
  delhi:        { name: 'Delhi',               local: 'Delhi',             gradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #e65100 100%)', accent: '#0d47a1', darkAccent: '#0a3578' },
  goa:          { name: 'Goa',                 local: 'Goa' },
  gujarat:      { name: 'Gujarat',             local: 'Gujarat',             gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 50%, #1b5e20 100%)', accent: '#e65100', darkAccent: '#c43d00' },
  haryana:      { name: 'Haryana',             local: 'Haryana' },
  hp:           { name: 'Himachal Pradesh',    local: 'Himachal Pradesh' },
  jk:           { name: 'Jammu & Kashmir',     local: 'Jammu & Kashmir' },
  jharkhand:    { name: 'Jharkhand',           local: 'Jharkhand' },
  karnataka:    { name: 'Karnataka',           local: 'Karnataka',            gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 50%, #e65100 100%)', accent: '#4a148c', darkAccent: '#38006b' },
  kerala:       { name: 'Kerala',              local: 'Kerala',               gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #ffd600 100%)', accent: '#2e7d32', darkAccent: '#1b5e20' },
  mizoram:      { name: 'Mizoram',             local: 'Mizoram' },
  mp:           { name: 'Madhya Pradesh',      local: 'Madhya Pradesh',        gradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #4caf50 100%)', accent: '#0d47a1', darkAccent: '#083372' },
  mh:           { name: 'Maharashtra',         local: 'Maharashtra',          gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 40%, #1b5e20 100%)', accent: '#ff6f00', darkAccent: '#e65100' },
  manipur:      { name: 'Manipur',             local: 'Manipur' },
  megha:        { name: 'Meghalaya',           local: 'Meghalaya' },
  nagaland:     { name: 'Nagaland',            local: 'Nagaland' },
  odisha:       { name: 'Odisha',              local: 'Odisha',              gradient: 'linear-gradient(135deg, #0d47a1 0%, #00838f 50%, #2e7d32 100%)', accent: '#00838f', darkAccent: '#005662' },
  punjab:       { name: 'Punjab',              local: 'Punjab' },
  puducherry:   { name: 'Puducherry',          local: 'Puducherry' },
  rajasthan:    { name: 'Rajasthan',           local: 'Rajasthan',           gradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 50%, #ffd600 100%)', accent: '#bf360c', darkAccent: '#8e24aa' },
  sikkim:       { name: 'Sikkim',              local: 'Sikkim' },
  tamilnadu:    { name: 'Tamil Nadu',          local: 'Tamil Nadu',            gradient: 'linear-gradient(135deg, #00838f 0%, #006064 50%, #4caf50 100%)', accent: '#006064', darkAccent: '#00363a' },
  telangana:    { name: 'Telangana',           local: 'Telangana' },
  tripura:      { name: 'Tripura',             local: 'Tripura' },
  up:           { name: 'Uttar Pradesh',       local: 'Uttar Pradesh',        gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 50%, #1b5e20 100%)', accent: '#e65100', darkAccent: '#bf360c' },
  uttarakhand:  { name: 'Uttarakhand',         local: 'Uttarakhand' },
  wb:           { name: 'West Bengal',         local: 'West Bengal' }
};

// Default generic categories for state-wise listings in English
const DEFAULT_STATE_CATEGORIES = [
  { id: 'all', label: 'All Sections', icon: '🌏' },
  { id: 'Latest Jobs', label: 'Latest Jobs', icon: '📚' },
  { id: 'Admit Card', label: 'Admit Card', icon: '🛡️' },
  { id: 'Result', label: 'Result', icon: '🏆' },
  { id: 'Others', label: 'Others', icon: '🏢' }
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
    // State categories in English
    categories: code === 'mh' ? [
      { id: 'all',                      label: 'All Sections',            icon: '🌏' },
      { id: 'MPSC Jobs',                label: 'MPSC Jobs',               icon: '🏛️' },
      { id: 'Maharashtra Police Jobs',  label: 'Police Bharti',           icon: '🛡️' },
      { id: 'Teaching Jobs',            label: 'Teaching Jobs',           icon: '📚' },
      { id: 'Medical & Health Jobs',    label: 'Medical & Health Jobs',   icon: '🏥' },
      { id: 'Engineering Jobs',         label: 'Engineering Jobs',        icon: '⚙️' },
      { id: 'Anganwadi Jobs',           label: 'Anganwadi Jobs',          icon: '👶' },
      { id: 'Bank Jobs',                label: 'Bank Jobs',               icon: '🏦' },
      { id: 'Railway Jobs',             label: 'Railway Jobs',            icon: '🚂' },
      { id: 'Defence Jobs',             label: 'Defence Jobs',            icon: '🎖️' },
      { id: 'Research & University Jobs',label: 'Research & University',  icon: '🔬' },
      { id: 'Central Government Jobs',  label: 'Central Govt Jobs',       icon: '🏢' },
      { id: 'MH Govt Jobs',             label: 'State Govt Jobs',         icon: '🌏' }
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
