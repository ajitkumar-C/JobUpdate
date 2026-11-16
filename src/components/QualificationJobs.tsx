import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, Calendar, IndianRupee, Briefcase, 
  Search, ExternalLink, ArrowRight, Share2, HelpCircle, 
  Clock, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { QUALIFICATIONS_CONFIG, type QualificationConfig } from '../config/qualifications';
import { SOCIAL_LINKS } from '../config/social';
import type { JobPost } from '../types';

interface QualificationJobsProps {
  slug: '10th-pass' | '12th-pass' | 'graduate';
  jobs: JobPost[];
  onNavigateToJob: (id: string) => void;
  onNavigateToQualification: (slug: '10th-pass' | '12th-pass' | 'graduate') => void;
  onNavigateHome: () => void;
}

export const QualificationJobs: React.FC<QualificationJobsProps> = ({
  slug,
  jobs,
  onNavigateToJob,
  onNavigateToQualification,
  onNavigateHome
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const config: QualificationConfig = QUALIFICATIONS_CONFIG[slug] || QUALIFICATIONS_CONFIG['10th-pass'];

  // Filter jobs from global database that match this qualification
  const matchingJobs = useMemo(() => {
    return jobs.filter(j => {
      const text = (
        (j.title || '') + ' ' + 
        (j.shortInfo || '') + ' ' + 
        (j.vacancies || []).map(v => (v.postName || '') + ' ' + (v.eligibility || '')).join(' ')
      );
      return config.regex.test(text);
    });
  }, [jobs, config]);

  // Further filter by search term and selected category tab
  const displayedJobs = useMemo(() => {
    return matchingJobs.filter(j => {
      const matchesSearch = searchTerm.trim() === '' || 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.shortInfo && j.shortInfo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || 
        j.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [matchingJobs, searchTerm, selectedCategory]);

  // Unique categories present in this qualification's matching jobs
  const categoriesPresent = useMemo(() => {
    const cats = new Set(matchingJobs.map(j => j.category));
    return Array.from(cats);
  }, [matchingJobs]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const shareOnWhatsApp = () => {
    const currentUrl = window.location.href;
    const message = `🔥 *${config.heroTitle}*\n\n📌 *Active Vacancies:* ${matchingJobs.length} Openings Found\n💰 *Salary:* As per 7th Pay Commission\n📅 *Exam Calendar & Apply Links:*\n👉 ${currentUrl}\n\n📲 *Join WhatsApp Alerts:* ${SOCIAL_LINKS.whatsapp}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="qualification-hub-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 0.5rem' }}>
      
      {/* ── Breadcrumb Navigation ── */}
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.45rem', 
        fontSize: '0.85rem', 
        color: 'var(--text-muted)', 
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={onNavigateHome}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
        >
          Home
        </button>
        <span>&raquo;</span>
        <span>Jobs by Qualification</span>
        <span>&raquo;</span>
        <strong style={{ color: 'var(--text-main)' }}>{config.shortName}</strong>
      </nav>

      {/* ── Qualification Switcher Tabs ── */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {(['10th-pass', '12th-pass', 'graduate'] as const).map(targetSlug => {
          const targetConfig = QUALIFICATIONS_CONFIG[targetSlug];
          const isActive = targetSlug === slug;
          return (
            <button
              key={targetSlug}
              onClick={() => onNavigateToQualification(targetSlug)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: isActive ? 'var(--primary)' : 'var(--card-bg)',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <GraduationCap size={16} />
              {targetConfig.shortName} Jobs
            </button>
          );
        })}
      </div>

      {/* ── Hero Header ── */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.25rem 0.6rem',
            borderRadius: '4px'
          }}>
            {config.badge}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Updated Daily | {config.qualificationLevel}
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
          fontWeight: 800,
          color: 'var(--text-main)',
          margin: '0.4rem 0 0.6rem 0',
          lineHeight: 1.3
        }}>
          {config.heroTitle}
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          margin: '0 0 1rem 0'
        }}>
          {config.heroSubtitle}
        </p>

        {/* Position Zero Direct Answer Snippet Box */}
        <div style={{
          background: 'var(--card-bg)',
          borderLeft: '4px solid var(--primary)',
          borderRadius: '4px',
          padding: '0.85rem 1rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-main)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span>Quick Summary for Applicants:</span>
          </div>
          {config.introSnippet}
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginTop: '1rem'
        }}>
          <div style={{ background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Verified Openings</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{matchingJobs.length} Openings</div>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Starting Pay Range</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>{config.salaryMatrix[0]?.inHandSalary || '₹25,000+'}</div>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>General Age Limit</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{config.ageCriteria.minAge.split(' ')[0]} – {config.ageCriteria.maxAge.split(' ')[0]} Yrs</div>
          </div>
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              onClick={shareOnWhatsApp}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <Share2 size={16} /> Share on WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* ── Active Jobs Section ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Active {config.shortName} Recruitments ({displayedJobs.length})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Live postings matched directly from official national and state circulars
            </span>
          </div>

          {/* Search Input */}
          <div style={{
            position: 'relative',
            minWidth: '240px',
            flex: '1 1 240px',
            maxWidth: '360px'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={`Filter ${config.shortName} jobs...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: selectedCategory === 'all' ? 700 : 500,
              background: selectedCategory === 'all' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: selectedCategory === 'all' ? '#fff' : 'var(--text-main)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            All Categories ({matchingJobs.length})
          </button>
          {categoriesPresent.map(cat => {
            const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
            const isSel = selectedCategory === catSlug;
            const count = matchingJobs.filter(j => j.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(catSlug)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: isSel ? 700 : 500,
                  background: isSel ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: isSel ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        {displayedJobs.length === 0 ? (
          <div style={{
            padding: '2.5rem 1rem',
            textAlign: 'center',
            background: 'var(--card-bg)',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px'
          }}>
            <Briefcase size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>No Active Openings Found</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No live postings matched your current search or category filter. Check the annual exam calendar below for upcoming recruitment dates.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '0.85rem'
          }}>
            {displayedJobs.map(job => (
              <article
                key={job.id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--primary)'
                    }}>
                      {job.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} /> {job.postDate}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.4,
                    color: 'var(--text-main)'
                  }}>
                    {job.title}
                  </h3>

                  {job.totalVacanciesCount && job.totalVacanciesCount !== 'Refer to Notification' && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      <strong>Total Vacancies:</strong> {job.totalVacanciesCount}
                    </div>
                  )}

                  {job.applicationLastDate && (
                    <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Last Date: {job.applicationLastDate}
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem'
                }}>
                  <button
                    onClick={() => onNavigateToJob(job.id)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    View Details <ArrowRight size={14} />
                  </button>

                  {job.importantLinks?.applyOnline && (
                    <a
                      href={job.importantLinks.applyOnline}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      Official Apply <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── Annual Recurring Exam Calendar (Evergreen Value) ── */}
      <section style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <Calendar size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Annual Recurring {config.shortName} Exam Timeline
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
          These major recruitment examinations are conducted on a fixed annual schedule by central commissions:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.65rem 0.75rem' }}>Exam Name</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Conducting Body</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Typical Window</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Avg. Posts</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Selection Mode</th>
              </tr>
            </thead>
            <tbody>
              {config.recurringExams.map((exam, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {exam.examName}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{exam.conductingBody}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#16a34a', fontWeight: 600 }}>{exam.typicalMonth}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{exam.approxVacancies}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exam.selectionMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 7th Pay Commission Salary Breakdown ── */}
      <section style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <IndianRupee size={20} style={{ color: '#16a34a' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Post-Wise Pay Scale & In-Hand Salary Matrix (7th CPC)
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
          Standard monthly bank-credit salary breakdown based on 53% Dearness Allowance (DA) and City Tier:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.65rem 0.75rem' }}>Role / Post</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Pay Matrix Level</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Basic Pay</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Est. In-Hand Monthly</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Applicable Allowances</th>
              </tr>
            </thead>
            <tbody>
              {config.salaryMatrix.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>{item.postRole}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{item.payLevel}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{item.basicPay}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#16a34a', fontWeight: 800 }}>{item.inHandSalary}</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.allowances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Age Limit & Selection Process Guidance ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}>
            Age Limits & Category Relaxations
          </h3>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
            <li><strong>Minimum Age:</strong> {config.ageCriteria.minAge}</li>
            <li><strong>Maximum Age:</strong> {config.ageCriteria.maxAge}</li>
            <li><strong>Category Relaxations:</strong> {config.ageCriteria.relaxations}</li>
            <li style={{ marginTop: '0.35rem', color: 'var(--text-muted)' }}><em>{config.ageCriteria.crucialDateNote}</em></li>
          </ul>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}>
            Selection Process Blueprint
          </h3>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
            {config.selectionOverview.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ Accordion Section (FAQPage Schema target) ── */}
      <section style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <HelpCircle size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Frequently Asked Questions ({config.shortName})
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
          Official eligibility guidelines, exam patterns, and qualification verification questions answered:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {config.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: isOpen ? 'var(--bg-secondary)' : 'var(--card-bg)',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--card-bg)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--text-main)',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Cross-linking Hubs ── */}
      <footer style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.25rem',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
          Explore Other Qualification Recruitment Hubs
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
          Browse government job vacancies filtered specifically by educational background:
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['10th-pass', '12th-pass', 'graduate'] as const).filter(s => s !== slug).map(otherSlug => (
            <button
              key={otherSlug}
              onClick={() => onNavigateToQualification(otherSlug)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {QUALIFICATIONS_CONFIG[otherSlug].name} &raquo;
            </button>
          ))}
          <button
            onClick={() => {
              window.location.href = '/state-jobs';
            }}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Explore 34 States Recruitment Directory &raquo;
          </button>
        </div>
      </footer>

    </div>
  );
};
