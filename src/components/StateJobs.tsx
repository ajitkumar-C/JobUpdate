import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Printer, Calendar, IndianRupee, User, Info, Link2, 
  ExternalLink, Briefcase, MapPin, Award, CheckCircle2, 
  FileText, ShieldCheck, Sparkles, Building2
} from 'lucide-react';
import { getStateConfig } from '../config/states';
import { SOCIAL_LINKS } from '../config/social';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StateJob {
  id: string;
  title: string;
  shortInfo?: string;
  category: string;
  categoryIcon: string;
  categoryMarathi: string;
  district: string;
  vacancies: string | null;
  lastDate?: string;
  officialWebsite?: string;
  notificationLink?: string;
  applyOnlineLink?: string;
  state: string;
  stateCode: string;
  scrapedAt: string;
  // Deep-scraped parameters
  fees?: { category: string; fee: string }[];
  dates?: { event: string; date: string }[];
  vacancyList?: { postName: string; count: string; qualification: string; ageLimit: string; payScale: string }[];
  howToApply?: string[];
  ageLimit?: string;
}

interface StateJobsProps {
  stateCode: string;
}

// ─── Full Page State Job Detail Component ─────────────────────────────────────

const StateJobFullDetail: React.FC<{
  job: StateJob;
  allJobs: StateJob[];
  config: any;
  onSelectJob: (job: StateJob) => void;
  onBack: () => void;
}> = ({ job, allJobs, config, onSelectJob, onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [job]);

  const hasOfficialSite = !!job.officialWebsite;
  const hasNotification = !!job.notificationLink;
  const hasApplyOnline = !!job.applyOnlineLink;

  const handlePrint = () => {
    window.print();
  };

  const shareOnWhatsApp = () => {
    const jobUrl = window.location.href;
    const vacancyText = job.vacancies ? `\n📌 *Vacancies:* ${job.vacancies} Posts` : '';
    const dateText = job.lastDate ? `\n📅 *Last Date:* ${job.lastDate}` : '';
    const locText = `\n📍 *Location:* ${job.district}, ${job.state}`;
    
    const message = `🔥 *${job.state} Govt Job: ${job.title}*${vacancyText}${dateText}${locText}\n\n👉 *Full Details & Apply Links:* ${jobUrl}\n\n📲 *Join WhatsApp Channel:* ${SOCIAL_LINKS.whatsapp}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Find other jobs from this state (excluding current)
  const relatedJobs = allJobs.filter(j => j.id !== job.id).slice(0, 4);

  // Extract pay scale from vacancyList if present
  const payScale = job.vacancyList?.find(v => v.payScale)?.payScale || 'As per State Pay Rules';

  return (
    <article className="detail-card print-card">
      {/* Breadcrumb Navigation Bar */}
      <nav className="detail-breadcrumb-nav no-print" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        marginBottom: '1rem',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-secondary)',
        borderRadius: '6px',
        fontSize: '0.85rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
        >
          {config.name} Jobs
        </button>
        <span style={{ color: 'var(--text-muted)' }}>&raquo;</span>
        <span style={{
          background: `${config.accentColor}18`,
          color: config.accentColor,
          border: `1px solid ${config.accentColor}40`,
          borderRadius: '4px',
          padding: '0.15rem 0.5rem',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {job.category}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>&raquo;</span>
        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
          {job.title}
        </span>
      </nav>

      {/* Back and Action Bar */}
      <div className="detail-back-bar no-print">
        <button className="btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to {config.name} Listings</span>
        </button>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn-whatsapp-share" onClick={shareOnWhatsApp} title="Share on WhatsApp">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Share on WhatsApp</span>
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Details</span>
          </button>
        </div>
      </div>

      {/* Main Title Header */}
      <header>
        <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            background: `${config.accentColor}18`,
            border: `1.5px solid ${config.accentColor}40`,
            color: config.accentColor,
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            <span>{config.icon}</span>
            <span>{config.name} Govt Jobs</span>
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <span>{job.categoryIcon || '💼'}</span>
            <span>{job.category}</span>
          </span>
        </div>

        <h1 className="detail-title">{job.title}</h1>

        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <strong>Location:</strong> 
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{job.district}, {job.state}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Updated Date:</strong> <span>{job.scrapedAt}</span>
          </div>
          {job.lastDate && (
            <div className="detail-meta-item">
              <strong>Last Date to Apply:</strong> 
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{job.lastDate}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }} className="no-print">
          <span style={{ fontWeight: 500, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} /> Compiled by Sarkari Aavedan Editorial Team
          </span>
          <span style={{ fontWeight: 500, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Verified against Official {job.state} Government Portal
          </span>
        </div>
      </header>

      {/* ⚡ QUICK OVERVIEW BAR */}
      <section className="detail-overview-banner">
        <div className="overview-item">
          <div className="overview-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
            <Briefcase size={20} />
          </div>
          <div className="overview-text">
            <span className="overview-label">Total Openings</span>
            <strong className="overview-val">{job.vacancies ? `${job.vacancies} Posts` : 'Refer Notice'}</strong>
          </div>
        </div>

        <div className="overview-item">
          <div className="overview-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
            <IndianRupee size={20} />
          </div>
          <div className="overview-text">
            <span className="overview-label">Pay Scale / Salary</span>
            <strong className="overview-val">{payScale}</strong>
          </div>
        </div>

        <div className="overview-item">
          <div className="overview-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
            <Calendar size={20} />
          </div>
          <div className="overview-text">
            <span className="overview-label">Last Date to Apply</span>
            <strong className="overview-val" style={{ color: 'var(--danger)' }}>
              {job.lastDate || 'Refer Notice'}
            </strong>
          </div>
        </div>

        <div className="overview-item">
          <div className="overview-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#7c3aed' }}>
            <MapPin size={20} />
          </div>
          <div className="overview-text">
            <span className="overview-label">Job Location</span>
            <strong className="overview-val">{job.district}, {job.state}</strong>
          </div>
        </div>
      </section>

      {/* Short Information Section */}
      {job.shortInfo && (
        <section className="detail-short-info">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={16} /> Short Information:
          </h2>
          <p>{job.shortInfo}</p>
        </section>
      )}

      {/* Details Grid: Dates & Fees */}
      <div className="details-grid">
        {/* Important Dates Box */}
        <section className="detail-subcard">
          <div className="detail-subcard-header">
            <Calendar size={18} />
            <h2>Important Dates</h2>
          </div>
          <div className="detail-subcard-content">
            {job.dates && job.dates.length > 0 ? (
              job.dates.map((d, index) => (
                <div key={index} className="detail-list-row">
                  <span className="detail-list-label">{d.event}</span>
                  <span className="detail-list-value" style={d.event.toLowerCase().includes('last') ? { color: 'var(--danger)', fontWeight: 700 } : {}}>
                    {d.date}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="detail-list-row">
                  <span className="detail-list-label">Job Notification Date</span>
                  <span className="detail-list-value">{job.scrapedAt}</span>
                </div>
                {job.lastDate && (
                  <div className="detail-list-row">
                    <span className="detail-list-label">Last Date to Apply</span>
                    <span className="detail-list-value" style={{ color: 'var(--danger)', fontWeight: 700 }}>
                      {job.lastDate}
                    </span>
                  </div>
                )}
                <div className="detail-list-row">
                  <span className="detail-list-label">Exam / Interview Date</span>
                  <span className="detail-list-value">To be notified</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Application Fees Box */}
        <section className="detail-subcard">
          <div className="detail-subcard-header">
            <IndianRupee size={18} />
            <h2>Application Fee</h2>
          </div>
          <div className="detail-subcard-content">
            {job.fees && job.fees.length > 0 ? (
              job.fees.map((f, index) => (
                <div key={index} className="detail-list-row">
                  <span className="detail-list-label">{f.category}</span>
                  <span className="detail-list-value">{f.fee}</span>
                </div>
              ))
            ) : (
              <>
                <div className="detail-list-row">
                  <span className="detail-list-label">General / OBC / EWS</span>
                  <span className="detail-list-value">Refer to Notification</span>
                </div>
                <div className="detail-list-row">
                  <span className="detail-list-label">SC / ST / PwD / Reserved</span>
                  <span className="detail-list-value">Refer to Notification</span>
                </div>
                <div className="detail-list-row">
                  <span className="detail-list-label">Payment Mode</span>
                  <span className="detail-list-value">Online / Bank Challan</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Age Limit Box */}
        <section className="detail-subcard" style={{ gridColumn: 'span 2' }}>
          <div className="detail-subcard-header">
            <User size={18} />
            <h2>Age Limit & Relaxation Criteria</h2>
          </div>
          <div className="detail-subcard-content">
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <span className="detail-list-label">Age Criteria:</span>{' '}
                <strong className="detail-list-value" style={{ color: 'var(--primary)' }}>
                  {job.ageLimit || '18 – 38/40 Years (As per state guidelines)'}
                </strong>
              </div>
            </div>
            <div className="detail-age-relaxation">
              <strong>Age Relaxation:</strong> Upper age relaxation applies for SC, ST, OBC, PwD, and Ex-Servicemen as per {job.state} Government Reservation Rules.
            </div>
          </div>
        </section>
      </div>

      {/* Vacancy Details Table */}
      <section className="vacancy-table-container">
        <div className="section-title">
          <Info size={20} />
          <h2>Vacancy Details & Eligibility Criteria</h2>
        </div>
        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th style={{ minWidth: '180px' }}>Post Name / Designation</th>
                <th style={{ minWidth: '90px' }}>Total Posts</th>
                <th style={{ minWidth: '220px' }}>Educational Qualification & Age</th>
                <th style={{ minWidth: '130px' }}>Pay Scale / Remuneration</th>
              </tr>
            </thead>
            <tbody>
              {job.vacancyList && job.vacancyList.length > 0 ? (
                job.vacancyList.map((vac, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{vac.postName}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{vac.count || '—'}</td>
                    <td>
                      <div>{vac.qualification || 'Check official notification'}</div>
                      {vac.ageLimit && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Age: {vac.ageLimit}</div>}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{vac.payScale || 'As per rules'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{job.vacancies || 'Refer Notification'}</td>
                  <td>Refer to official notification details for eligibility criteria.</td>
                  <td>{payScale}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 🎯 SELECTION PROCESS */}
      <section className="selection-process-container">
        <div className="section-title">
          <Award size={20} />
          <h2>Selection Process & Examination Scheme</h2>
        </div>
        <div className="selection-steps-wrapper">
          <div className="selection-step-card">
            <div className="step-number-badge">Step 1</div>
            <div className="step-name">Online Application & Document Scrutiny</div>
          </div>
          <div className="selection-step-card">
            <div className="step-number-badge">Step 2</div>
            <div className="step-name">Written Examination / Screening Test / Merit List</div>
          </div>
          <div className="selection-step-card">
            <div className="step-number-badge">Step 3</div>
            <div className="step-name">Skill Test / Physical Test (If applicable)</div>
          </div>
          <div className="selection-step-card">
            <div className="step-number-badge">Step 4</div>
            <div className="step-name">Document Verification & Medical Fitness</div>
          </div>
        </div>
      </section>

      {/* 📝 HOW TO APPLY CHECKLIST */}
      <section className="how-to-apply-container">
        <div className="section-title">
          <FileText size={20} />
          <h2>How to Apply (Candidate Checklist)</h2>
        </div>
        <div className="checklist-card">
          <ul className="checklist-items">
            {job.howToApply && job.howToApply.length > 0 ? (
              job.howToApply.map((step, idx) => (
                <li key={idx} className="checklist-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>{step}</span>
                </li>
              ))
            ) : (
              <>
                <li className="checklist-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Check your eligibility and read the official recruitment notification carefully.</span>
                </li>
                <li className="checklist-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Visit the official department recruitment portal and click on the 'Apply Online' link.</span>
                </li>
                <li className="checklist-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Fill in all educational qualifications, contact information, and personal details accurately.</span>
                </li>
                <li className="checklist-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Upload required scanned documents, photographs, and signature in prescribed file sizes.</span>
                </li>
                <li className="checklist-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Pay the application fee (if applicable) and take a printout of the submitted confirmation form.</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </section>

      {/* Actionable Links Table */}
      <section className="links-subcard no-print">
        <div className="links-subcard-header">
          <Link2 size={18} />
          <h2>Important Links & Official Portals</h2>
        </div>
        <div className="links-subcard-body">
          {hasApplyOnline && (
            <div className="link-row">
              <span className="link-row-label">Apply Online Registration / Login Portal</span>
              <a
                href={job.applyOnlineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ background: `linear-gradient(135deg, ${config.accentColor}, ${config.accentColorDark})` }}
              >
                <span>Click Here to Apply</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {hasNotification && (
            <div className="link-row">
              <span className="link-row-label">Download Official Notification PDF</span>
              <a
                href={job.notificationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: 'var(--accent-orange)' }}
              >
                <span>Download PDF</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {hasOfficialSite && (
            <div className="link-row">
              <span className="link-row-label">Official Department Authority Website</span>
              <a
                href={job.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: 'var(--text-secondary)' }}
              >
                <span>Visit Official Portal</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Social Connect Links */}
          <div className="link-row" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid #10b981' }}>
            <span className="link-row-label" style={{ fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📢 Join Official Sarkari Channels
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: '#25D366', minWidth: '130px', padding: '0.4rem 0.85rem' }}
                title="Join our WhatsApp Channel"
              >
                <span>WhatsApp Channel</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: '#0088cc', minWidth: '120px', padding: '0.4rem 0.85rem' }}
                title="Join our Telegram Group"
              >
                <span>Telegram</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🌏 More Jobs in {config.name} Section */}
      {relatedJobs.length > 0 && (
        <div className="more-posts-container no-print" style={{ marginTop: '2.5rem' }}>
          <hr className="divider" style={{ margin: '2rem 0', borderColor: 'var(--border-color)', opacity: 0.2 }} />
          <h3 className="more-posts-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{config.icon}</span>
            <span>More Government Jobs in {config.name}</span>
          </h3>
          <div className="more-posts-table-wrapper">
            <table className="more-posts-table">
              <tbody>
                {relatedJobs.map((rj) => (
                  <tr 
                    key={rj.id} 
                    className="more-post-row" 
                    onClick={() => onSelectJob(rj)}
                  >
                    <td className="more-post-title-cell">
                      <div style={{ fontWeight: 600 }}>{rj.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                        <span>📍 {rj.district}</span>
                        {rj.vacancies && <span>💼 {rj.vacancies} Posts</span>}
                        {rj.lastDate && <span>📅 Last: {rj.lastDate}</span>}
                      </div>
                    </td>
                    <td className="more-post-action-cell" style={{ color: config.accentColor }}>
                      View Details &rarr;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </article>
  );
};

// ─── Main StateJobs Component ─────────────────────────────────────────────────

export const StateJobs: React.FC<StateJobsProps> = ({ stateCode }) => {
  const config = getStateConfig(stateCode);
  const isMH = false; // Forced English for clean UX

  const [jobs, setJobs] = useState<StateJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<StateJob | null>(null);

  // Load state-specific JSON from /states/{stateCode}/scraped-jobs.json
  useEffect(() => {
    if (!config) return;
    setLoading(true);
    fetch(config.dataUrl)
      .then(r => r.json())
      .then((data: StateJob[]) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [stateCode]);

  if (!config) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        State <strong>{stateCode}</strong> is not configured yet.
      </div>
    );
  }

  // If a job is selected, render the FULL PAGE template instead of a modal popup!
  if (selectedJob) {
    return (
      <StateJobFullDetail
        job={selectedJob}
        allJobs={jobs}
        config={config}
        onSelectJob={(j) => {
          setSelectedJob(j);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBack={() => {
          setSelectedJob(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // Filter by category + search
  const filtered = jobs.filter(j => {
    const matchCat = activeCategory === 'all' || j.category === activeCategory;
    const matchSearch = !searchTerm ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Only show categories that appear in actual data
  const presentCategories = config.categories.filter(c =>
    c.id === 'all' || jobs.some(j => j.category === c.id)
  );

  return (
    <div className="state-jobs-page">

      {/* Hero Banner */}
      <div className="state-hero" style={{ background: config.heroGradient }}>
        <div className="state-hero-inner">
          <div className="state-hero-badge">🌏 {isMH ? config.nameLocal : config.name}</div>
          <h1 className="state-hero-title">
            {config.name} Govt Jobs 2026
            {isMH && <span className="state-hero-title-local">{config.nameLocal} सरकारी नोकऱ्या</span>}
          </h1>
          <p className="state-hero-desc">
            {isMH 
              ? config.seoDescription
              : `Find the latest government job notifications, admit cards, exam schedules and results in ${config.name} for 2026.`
            }
          </p>
          <div className="state-search-bar">
            <input
              type="text"
              placeholder={isMH ? `नोकरी शोधा / Search ${config.name} jobs, district...` : `Search ${config.name} jobs...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="state-search-input"
            />
          </div>
        </div>
      </div>

      <div className="state-body">
        {/* Category Filter Chips */}
        <div className="state-category-chips">
          {presentCategories.map(cat => (
            <button
              key={cat.id}
              className={`state-chip ${activeCategory === cat.id ? 'state-chip-active' : ''}`}
              style={activeCategory === cat.id ? {
                background: config.accentColor,
                borderColor: config.accentColor
              } : {}}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="state-stats-bar">
          <span>
            <strong>{filtered.length}</strong> listings
            {activeCategory !== 'all' && (
              <> in <strong>{presentCategories.find(c => c.id === activeCategory)?.label}</strong></>
            )}
          </span>
          <span className="state-stats-updated">Updated: {jobs[0]?.scrapedAt || '—'}</span>
        </div>

        {loading ? (
          <div className="state-loading">
            <div className="state-loading-spinner" style={{ borderTopColor: config.accentColor }} />
            <p>Loading {config.name} jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-empty">
            <p>No listings found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
            {searchTerm && (
              <button className="btn-outline" onClick={() => setSearchTerm('')}>Clear Search</button>
            )}
          </div>
        ) : (
          /* Grouped by category */
          <div className="state-sections">
            {presentCategories.filter(c => c.id !== 'all').map(cat => {
              const categoryJobs = filtered.filter(j => j.category === cat.id);
              if (categoryJobs.length === 0) return null;

              return (
                <div key={cat.id} className="state-category-section">
                  <h3 className="state-category-heading" style={{ borderLeftColor: config.accentColor }}>
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="state-count-pill" style={{
                      background: `${config.accentColor}18`,
                      color: config.accentColor
                    }}>{categoryJobs.length}</span>
                  </h3>

                  <div className="state-grid">
                    {categoryJobs.map(job => (
                      <article
                        key={job.id}
                        className="state-card"
                        onClick={() => {
                          setSelectedJob(job);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="state-card-top">
                          <span
                            className="state-card-cat-badge"
                            style={{ color: config.accentColor, background: `${config.accentColor}18` }}
                          >
                            {job.categoryIcon} {job.category}
                          </span>
                          {job.vacancies && (
                            <span className="state-card-vacancies">
                              <Briefcase size={11} /> {job.vacancies} Posts
                            </span>
                          )}
                        </div>

                        <h2 className="state-card-title">{job.title}</h2>

                        {job.shortInfo && (
                          <p className="state-card-short-info">{job.shortInfo}</p>
                        )}

                        <div className="state-card-meta">
                          <span className="state-card-meta-item">
                            <MapPin size={11} /> {job.district}
                          </span>
                          {isMH && (
                            <span className="state-card-meta-item">
                              <Building2 size={11} /> {job.categoryMarathi}
                            </span>
                          )}
                          {job.lastDate && (
                            <span className="state-card-meta-item" style={{ color: 'var(--danger, #dc2626)', fontWeight: 600 }}>
                              📅 Last: {job.lastDate}
                            </span>
                          )}
                        </div>

                        <div className="state-card-footer">
                          <button
                            className="state-view-btn"
                            style={{ background: `linear-gradient(135deg, ${config.accentColor}, ${config.accentColorDark})` }}
                            onClick={e => { 
                              e.stopPropagation(); 
                              setSelectedJob(job); 
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <span>{isMH ? 'View Details / तपशील पहा' : 'View Details'}</span>
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SEO Rich Content Section */}
        <section className="state-seo-section">
          <h2>{isMH ? `${config.name} सरकारी नोकऱ्या 2026 — ${config.name} Govt Jobs` : `${config.name} Government Jobs 2026`}</h2>
          <div className="state-seo-grid">
            {config.infoBlocks.map((block, i) => (
              <div key={i}>
                <h3>{block.title}</h3>
                <p>{block.body}</p>
              </div>
            ))}
          </div>
          <p className="state-seo-disclaimer">
            <strong>Disclaimer:</strong> Sarkari Aavedan aggregates public recruitment notifications.
            Always verify details on official government portals before applying.
            {isMH && ' आम्ही सरकारी जाहिरातींची माहिती एकत्रित करतो. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावर माहिती तपासा.'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default StateJobs;
