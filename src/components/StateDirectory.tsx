import React, { useState } from 'react';
import { STATES_CONFIG } from '../config/states';
import { Search, ArrowRight } from 'lucide-react';

interface StateDirectoryProps {
  onSelectState: (code: string) => void;
}

export const StateDirectory: React.FC<StateDirectoryProps> = ({ onSelectState }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const statesList = Object.values(STATES_CONFIG);

  const filtered = statesList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="state-dir-page">
      {/* Hero Header */}
      <div className="state-dir-hero">
        <div className="state-dir-hero-inner">
          <span className="state-dir-badge">🌏 India State-Wise Recruitment</span>
          <h1 className="state-dir-title">
            State Government Jobs 2026
            <span className="state-dir-title-sub">Find active recruitments state-wise</span>
          </h1>
          <p className="state-dir-desc">
            Direct access to official recruitment boards across 33 States and Union Territories. 
            MPSC, UPPSC, BPSC, Police Bharti, Zilla Parishad, Teacher, and Paramedical jobs.
          </p>

          {/* Search bar */}
          <div className="state-dir-search">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search state (e.g. Maharashtra, Bihar, Delhi...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="state-dir-search-input"
            />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="state-dir-body">
        <h2 className="state-dir-section-title">
          📍 Select State
        </h2>

        {filtered.length === 0 ? (
          <div className="state-dir-empty">
            No states match your search.
          </div>
        ) : (
          <div className="state-dir-grid">
            {filtered.map(state => (
              <div
                key={state.code}
                className="state-dir-card"
                onClick={() => onSelectState(state.code)}
                style={{ '--card-gradient': state.heroGradient } as React.CSSProperties}
              >
                <div className="state-dir-card-header">
                  <span className="state-dir-card-flag">🌏</span>
                  <div className="state-dir-card-names">
                    <span className="state-dir-card-name-local">{state.name}</span>
                  </div>
                </div>
                
                <div className="state-dir-card-body">
                  <p className="state-dir-card-desc">
                    Find active exams, admit cards, and results of {state.name} departments.
                  </p>
                </div>

                <div className="state-dir-card-footer" style={{ color: state.accentColor }}>
                  <span>View Jobs</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StateDirectory;
