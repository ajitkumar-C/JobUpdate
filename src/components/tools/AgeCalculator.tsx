import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, ArrowLeft, Sparkles } from 'lucide-react';

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

interface EligibilityBracket {
  name: string;
  minAge: number;
  maxAge: number;
  exams: string;
}

const BRACKETS: EligibilityBracket[] = [
  { name: '18 to 25 Years', minAge: 18, maxAge: 25, exams: 'SSC GD Constable, Army Agniveer, MTS' },
  { name: '18 to 27 Years', minAge: 18, maxAge: 27, exams: 'SSC CHSL 10+2, Postal Assistant, DRDO Admin' },
  { name: '20 to 28 Years', minAge: 20, maxAge: 28, exams: 'SBI Clerk, IBPS Clerk, RRB Office Assistant' },
  { name: '20 to 30 Years', minAge: 20, maxAge: 30, exams: 'SSC CGL Inspector, Bank PO, SI in Delhi Police' },
  { name: '21 to 32 Years', minAge: 21, maxAge: 32, exams: 'UPSC IAS/IPS, State PCS, CDS (IMA/OTA)' },
  { name: '18 to 40 Years', minAge: 18, maxAge: 40, exams: 'State PSCs (UPSSSC, BSSC, MPSC, KGBV Teachers)' },
];

interface AgeCalculatorProps {
  onBackToHome: () => void;
}

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({ onBackToHome }) => {
  // Default values
  const [dob, setDob] = useState<string>('2000-01-01');
  const [cutoffDate, setCutoffDate] = useState<string>('2026-08-01');
  const [category, setCategory] = useState<string>('gen');
  const [calculatedAge, setCalculatedAge] = useState<AgeBreakdown | null>(null);

  useEffect(() => {
    document.title = 'Sarkari Age Calculator Online (Govt Jobs Eligibility) | Sarkari Aavedan';
    window.scrollTo(0, 0);
  }, []);

  const calculateAgeDetails = (dobStr: string, cutoffStr: string): AgeBreakdown | null => {
    if (!dobStr || !cutoffStr) return null;

    const birth = new Date(dobStr);
    const target = new Date(cutoffStr);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  };

  useEffect(() => {
    setCalculatedAge(calculateAgeDetails(dob, cutoffDate));
  }, [dob, cutoffDate]);

  // Relaxation in years based on category
  const getCategoryRelaxation = (cat: string): number => {
    switch (cat) {
      case 'obc': return 3;
      case 'sc-st': return 5;
      case 'pwd-gen': return 10;
      case 'pwd-obc': return 13;
      case 'pwd-sc-st': return 15;
      default: return 0;
    }
  };

  const relaxationYears = getCategoryRelaxation(category);

  return (
    <div className="tool-container">
      {/* Top back navigation */}
      <div className="tool-back-bar no-print">
        <button className="btn-outline" onClick={onBackToHome}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <span className="tool-tag">Free 100% Client-Side Tool</span>
      </div>

      <header className="tool-header">
        <h1 className="tool-main-title">
          Sarkari Exam Age Calculator 2026
        </h1>
        <p className="tool-sub-title">
          Accurately calculate your age as on the official exam cutoff date (e.g., 01/08/2026 or 01/01/2026) with OBC, SC/ST, and PwD age relaxation rules for UPSC, SSC, Railways, and Bank exams.
        </p>
      </header>

      <div className="tool-grid">
        {/* Left Inputs */}
        <div className="tool-controls-card">
          <h2 className="tool-card-title">
            <Calendar size={18} />
            <span>Enter Your Dates</span>
          </h2>

          <div className="tool-form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              Your Date of Birth (DOB):
            </label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className="tool-date-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="tool-form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              Age Calculated As On (Cutoff Date):
            </label>
            <input 
              type="date" 
              value={cutoffDate} 
              onChange={(e) => setCutoffDate(e.target.value)} 
              className="tool-date-input"
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
              Check your official exam notification for the exact "as on" reference date.
            </small>
          </div>

          <div className="tool-form-group">
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              Select Reservation Category:
            </label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="tool-select-input"
            >
              <option value="gen">General / EWS (No Age Relaxation)</option>
              <option value="obc">OBC Non-Creamy Layer (+3 Years Relaxation)</option>
              <option value="sc-st">SC / ST (+5 Years Relaxation)</option>
              <option value="pwd-gen">PwD General / EWS (+10 Years)</option>
              <option value="pwd-obc">PwD OBC (+13 Years)</option>
              <option value="pwd-sc-st">PwD SC / ST (+15 Years)</option>
            </select>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="tool-preview-card">
          {calculatedAge ? (
            <div className="tool-age-result">
              <div className="tool-age-hero">
                <span className="tool-age-caption">Your Exact Age on {cutoffDate}:</span>
                <div className="tool-age-digits">
                  <div className="digit-box">
                    <span className="digit-num">{calculatedAge.years}</span>
                    <span className="digit-label">Years</span>
                  </div>
                  <div className="digit-box">
                    <span className="digit-num">{calculatedAge.months}</span>
                    <span className="digit-label">Months</span>
                  </div>
                  <div className="digit-box">
                    <span className="digit-num">{calculatedAge.days}</span>
                    <span className="digit-label">Days</span>
                  </div>
                </div>
                <div className="tool-age-total-days">
                  Total lifespan: <strong>{calculatedAge.totalDays.toLocaleString()}</strong> days
                </div>
              </div>

              {relaxationYears > 0 && (
                <div className="tool-relaxation-alert">
                  <Sparkles size={16} color="var(--primary)" />
                  <span>Category Relaxation Applied: <strong>+{relaxationYears} Years</strong> on upper age limits.</span>
                </div>
              )}

              {/* Eligibility Matrix */}
              <div className="tool-eligibility-matrix">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Government Exam Eligibility Checker
                </h3>
                <div className="tool-matrix-list">
                  {BRACKETS.map((b) => {
                    const effectiveMax = b.maxAge + relaxationYears;
                    const isUnder = calculatedAge.years < b.minAge;
                    const isOver = calculatedAge.years > effectiveMax || (calculatedAge.years === effectiveMax && (calculatedAge.months > 0 || calculatedAge.days > 0));
                    const isEligible = !isUnder && !isOver;

                    return (
                      <div key={b.name} className={`matrix-row ${isEligible ? 'eligible' : 'ineligible'}`}>
                        <div className="matrix-info">
                          <strong className="matrix-name">{b.name}</strong>
                          <span className="matrix-exams">{b.exams}</span>
                          {relaxationYears > 0 && (
                            <span className="matrix-rel-note">(Up to {effectiveMax} yrs with quota)</span>
                          )}
                        </div>
                        <div className="matrix-status">
                          {isEligible ? (
                            <span className="badge-eligible">
                              <CheckCircle2 size={14} /> Eligible
                            </span>
                          ) : isUnder ? (
                            <span className="badge-ineligible">Under-Age</span>
                          ) : (
                            <span className="badge-ineligible">
                              <XCircle size={14} /> Over-Age
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="tool-age-placeholder">
              <Calendar size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>Please enter valid dates on the left to calculate your age.</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Guidelines */}
      <section className="tool-seo-guide">
        <h2>Government Exam Age Calculation & Reservation Norms</h2>
        <div className="tool-guide-cards">
          <div className="tool-guide-card">
            <h3>How is "Age as on Date" Calculated?</h3>
            <p>
              Recruitment commissions (UPSC, SSC, IBPS, Railways) specify a fixed reference date (usually 1st January or 1st August of the exam year). Your age is evaluated strictly as of 23:59:59 hours on that date.
            </p>
          </div>
          <div className="tool-guide-card">
            <h3>Standard Central Government Age Relaxations</h3>
            <ul>
              <li><strong>SC / ST Candidates:</strong> 5 years upper age relaxation.</li>
              <li><strong>OBC (Non-Creamy Layer):</strong> 3 years upper age relaxation.</li>
              <li><strong>PwD Candidates:</strong> 10 years (General), 13 years (OBC), 15 years (SC/ST).</li>
              <li><strong>Ex-Servicemen:</strong> Period of military service + 3 years.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
