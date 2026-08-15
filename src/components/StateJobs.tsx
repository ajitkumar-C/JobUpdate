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
  // Official links extracted by deep scraper
  officialWebsite?: string;
  notificationLink?: string;
  applyOnlineLink?: string;
  // Meta
  state: string;
  stateCode: string;
  scrapedAt: string;
}

interface StateJobsProps {
  stateCode: string;
}

// ─── Detail Panel Component ───────────────────────────────────────────────────

const JobDetailPanel: React.FC<{ job: StateJob; accentColor: string; accentDark: string; onClose: () => void }> = ({
  job, accentColor, accentDark, onClose
}) => {
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

          {/* Marathi category */}
          <p className="state-detail-marathi">{job.categoryMarathi}</p>

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
              <span className="state-detail-meta-value">{job.district}, Maharashtra</span>
            </div>
            <div className="state-detail-meta-item">
              <span className="state-detail-meta-label">🗓️ Job Posted on</span>
              <span className="state-detail-meta-value">{job.scrapedAt}</span>
            </div>
          </div>

          {/* Official Links Section */}
          <div className="state-detail-links-section">
            <h3 className="state-detail-links-title">
              🔗 Important Links / महत्त्वाचे दुवे
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
                    <span>Apply Online / ऑनलाइन अर्ज</span>
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
                    <span>Official Notification / अधिकृत जाहिरात</span>
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
                    <span>Official Website / अधिकृत संकेतस्थळ</span>
                  </a>
                )}
              </div>
            ) : (
              <p className="state-detail-no-links">
                Official links will be available once the recruitment is officially announced.
                अधिकृत दुवे लवकरच उपलब्ध होतील.
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
            Close Details / बंद करा
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main StateJobs Component ─────────────────────────────────────────────────

export const StateJobs: React.FC<StateJobsProps> = ({ stateCode }) => {
  const config = getStateConfig(stateCode);

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
          <div className="state-hero-badge">🌏 {config.nameLocal}</div>
          <h1 className="state-hero-title">
            {config.name} Govt Jobs 2026
            <span className="state-hero-title-local">{config.nameLocal} सरकारी नोकऱ्या</span>
          </h1>
          <p className="state-hero-desc">{config.seoDescription}</p>
          <div className="state-search-bar">
            <input
              type="text"
              placeholder={`नोकरी शोधा / Search ${config.name} jobs, district...`}
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
            <p>भरती जाहिराती लोड होत आहेत...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-empty">
            <p>कोणत्याही भरत्या सापडल्या नाहीत / No listings found.</p>
          </div>
        ) : (
          <div className="state-grid">
            {filtered.map(job => (
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
                  <span className="state-card-meta-item">
                    <Building2 size={11} /> {job.categoryMarathi}
                  </span>
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
                    <span>View Details / तपशील पहा</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* SEO Rich Content Section */}
        <section className="state-seo-section">
          <h2>{config.name} सरकारी नोकऱ्या 2026 — {config.name} Govt Jobs</h2>
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
            आम्ही सरकारी जाहिरातींची माहिती एकत्रित करतो. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावर माहिती तपासा.
          </p>
        </section>
      </div>

      {/* Job Detail Panel (Modal) */}
      {selectedJob && (
        <JobDetailPanel
          job={selectedJob}
          accentColor={config.accentColor}
          accentDark={config.accentColorDark}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default StateJobs;
