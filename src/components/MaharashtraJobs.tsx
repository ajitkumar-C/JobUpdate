/**
 * MaharashtraJobs.tsx
 * Thin wrapper — simply renders the generic StateJobs component with stateCode="mh".
 * All logic, data fetching, and UI lives in StateJobs.tsx + src/config/states.ts.
 *
 * To add a new state page (e.g. Rajasthan):
 *   1. Add 'rj' block to src/config/states.ts
 *   2. Create scripts/scrape-rajasthan.js → saves to public/states/rj/scraped-jobs.json
 *   3. Create RajasthanJobs.tsx: export const RajasthanJobs = () => <StateJobs stateCode="rj" />
 *   4. Add route in App.tsx: currentView === 'rajasthan' → <RajasthanJobs />
 */
import React from 'react';
import { StateJobs } from './StateJobs';

export const MaharashtraJobs: React.FC = () => <StateJobs stateCode="mh" />;
export default MaharashtraJobs;
