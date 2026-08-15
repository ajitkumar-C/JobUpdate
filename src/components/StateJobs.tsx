import React, { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Briefcase, Building2, FileText, Globe, X } from 'lucide-react';
import { getStateConfig } from '../config/states';

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

// ─── Detail Panel Component ───────────────────────────────────────────────────

const JobDetailPanel: React.FC<{ job: StateJob; stateCode: string; accentColor: string; accentDark: string; onClose: () => void }> = ({
  job, stateCode: _stateCode, accentColor, accentDark, onClose
}) => {
  const isMH = false; // Forced English for clean UX
  // Determine which links are available
  const hasOfficialSite = !!job.officialWebsite;
  const hasNotification = !!job.notificationLink;
  const hasApplyOnline  = !!job.applyOnlineLink;
  const hasAnyLink = hasOfficialSite || hasNotification || hasApplyOnline;

  return (
    <div className="state-detail-overlay" onClick={onClose}>
      <div className="state-detail-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="state-detail-header" style={{ borderBottom: `3px solid ${accentColor}` }}>
          <button className="state-detail-back" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
          <div className="state-detail-badges">
            <span className="state-detail-cat" style={{ color: accentColor, background: `${accentColor}18` }}>
              {job.categoryIcon} {job.category}
            </span>
            <span className="state-detail-district">
              <MapPin size={12} /> {job.district}
            </span>
            {job.vacancies && (
              <span className="state-detail-vacancies" style={{ color: '#1B5E20', background: 'rgba(27,94,32,0.08)' }}>
                <Briefcase size={12} /> {job.vacancies} Posts
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="state-detail-body">
          {/* Title */}
          <h2 className="state-detail-title">{job.title}</h2>

          {/* Category Subtitle */}
          {isMH && <p className="state-detail-marathi">{job.categoryMarathi}</p>}

          {/* Short info */}
          {job.shortInfo && (
            <div className="state-detail-info">
              <p>{job.shortInfo}</p>
            </div>
          )}

          {/* Key details row */}
          <div className="state-detail-meta">
            {job.lastDate && (
              <div className="state-detail-meta-item">
                <span className="state-detail-meta-label">📅 Last Date</span>
                <span className="state-detail-meta-value" style={{ color: 'var(--danger, #dc2626)', fontWeight: 700 }}>
                  {job.lastDate}
                </span>
              </div>
            )}
            <div className="state-detail-meta-item">
              <span className="state-detail-meta-label">📍 District / Location</span>
              <span className="state-detail-meta-value">{job.district}, {isMH ? 'Maharashtra' : job.state}</span>
            </div>
            <div className="state-detail-meta-item">
              <span className="state-detail-meta-label">🗓️ Job Posted on</span>
              <span className="state-detail-meta-value">{job.scrapedAt}</span>
            </div>
          </div>

          {/* Dynamic Dates Table Section */}
          {job.dates && job.dates.length > 0 && (
            <div className="state-detail-section">
              <h3 className="state-detail-section-title">📅 Important Dates</h3>
              <table className="state-detail-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {job.dates.map((d, index) => (
                    <tr key={index}>
                      <td>{d.event}</td>
                      <td>{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Dynamic Application Fees Section */}
          {job.fees && job.fees.length > 0 && (
            <div className="state-detail-section">
              <h3 className="state-detail-section-title">💳 Application Fees</h3>
              <table className="state-detail-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {job.fees.map((f, index) => (
                    <tr key={index}>
                      <td>{f.category}</td>
                      <td>{f.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Dynamic Vacancy Breakdown List */}
          {job.vacancyList && job.vacancyList.length > 0 && (
            <div className="state-detail-section">
              <h3 className="state-detail-section-title">📋 Vacancies & Post-Wise Eligibility</h3>
              <div className="state-detail-vacancies-list">
                {job.vacancyList.map((vac, index) => (
                  <div key={index} className="state-detail-vacancy-card">
                    <h4 className="state-detail-vacancy-postname">🏷️ {vac.postName}</h4>
                    <ul className="state-detail-vacancy-specs">
                      {vac.count && <li><strong>Total Posts:</strong> {vac.count}</li>}
                      {vac.qualification && <li><strong>Qualification:</strong> {vac.qualification}</li>}
                      {vac.ageLimit && <li><strong>Age Limit:</strong> {vac.ageLimit}</li>}
                      {vac.payScale && <li><strong>Pay Scale / Salary:</strong> {vac.payScale}</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic How to Apply Section */}
          {job.howToApply && job.howToApply.length > 0 && (
            <div className="state-detail-section">
              <h3 className="state-detail-section-title">✍️ How to Apply</h3>
              <ol className="state-detail-steps">
                {job.howToApply.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Official Links Section */}
          <div className="state-detail-links-section">
            <h3 className="state-detail-links-title">
              {isMH ? '🔗 Important Links / महत्त्वाचे दुवे' : '🔗 Important Links'}
            </h3>

            {hasAnyLink ? (
              <div className="state-detail-links-grid">
                {hasApplyOnline && (
                  <a
                    href={job.applyOnlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="state-link-btn state-link-btn-primary"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentDark})` }}
                  >
                    <ExternalLink size={15} />
                    <span>{isMH ? 'Apply Online / ऑनलाइन अर्ज' : 'Apply Online'}</span>
                  </a>
                )}
                {hasNotification && (
                  <a
                    href={job.notificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="state-link-btn state-link-btn-secondary"
                  >
                    <FileText size={15} />
                    <span>{isMH ? 'Official Notification / अधिकृत जाहिरात' : 'Official Notification'}</span>
                  </a>
                )}
                {hasOfficialSite && (
                  <a
                    href={job.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="state-link-btn state-link-btn-outline"
                  >
                    <Globe size={15} />
                    <span>{isMH ? 'Official Website / अधिकृत संकेतस्थळ' : 'Official Website'}</span>
                  </a>
                )}
              </div>
            ) : (
              <p className="state-detail-no-links">
                {isMH 
                  ? 'Official links will be available once the recruitment is officially announced. अधिकृत दुवे लवकरच उपलब्ध होतील.'
                  : 'Official links will be available once the recruitment is officially announced.'
                }
              </p>
            )}
          </div>

          {/* Trust badge */}
          <div className="state-detail-trust">
            <span>✍️ Compiled by Sarkari Aavedan Editorial Team</span>
            <span>✓ Verified against Official Government Sources</span>
          </div>
        </div>

        {/* Highlighted Close Button */}
        <div className="state-detail-footer-close">
          <button onClick={onClose} className="state-detail-close-btn">
            {isMH ? 'Close Details / बंद करा' : 'Close Details'}
          </button>
        </div>
      </div>
    </div>
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

        {/* Job Cards Grid */}
        {loading ? (
          <div className="state-loading">
            <div className="state-loading-spinner" style={{ borderTopColor: config.accentColor }} />
            <p>{isMH ? 'भरती जाहिराती लोड होत आहेत...' : 'Loading job openings...'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-empty">
            <p>{isMH ? 'कोणत्याही भरत्या सापडल्या नाहीत / No listings found.' : 'No job listings found.'}</p>
          </div>
        ) : (
          <div className="state-categories-container">
            {config.categories.filter(c => c.id !== 'all').map(cat => {
              const categoryJobs = filtered.filter(j => j.category === cat.id);
              if (categoryJobs.length === 0) return null;

              return (
                <div key={cat.id} className="state-category-group" style={{ marginBottom: '2.5rem' }}>
                  <h3 className="state-category-group-title" style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.5rem',
                    borderBottom: `2px solid ${config.accentColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: `${config.accentColor}18`,
                      color: config.accentColor,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      marginLeft: '0.25rem'
                    }}>{categoryJobs.length}</span>
                  </h3>

                  <div className="state-grid">
                    {categoryJobs.map(job => (
                      <article
                        key={job.id}
                        className="state-card"
                        onClick={() => setSelectedJob(job)}
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
                            onClick={e => { e.stopPropagation(); setSelectedJob(job); }}
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

      {/* Job Detail Panel (Modal) */}
      {selectedJob && (
        <JobDetailPanel
          job={selectedJob}
          stateCode={stateCode}
          accentColor={config.accentColor}
          accentDark={config.accentColorDark}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default StateJobs;
