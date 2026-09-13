import React, { useEffect } from 'react';
import { ArrowLeft, Printer, Calendar, IndianRupee, User, Info, Link2, ExternalLink } from 'lucide-react';
import type { JobPost } from '../types';
import { updateSEO } from '../utils/seo';
import { SOCIAL_LINKS } from '../config/social';

interface JobDetailsProps {
  job: JobPost;
  allJobs?: JobPost[];
  onNavigateToJob?: (jobId: string) => void;
  onBack: () => void;
  onNavigateToCategory?: (categorySlug: string) => void;
}

const getCategoryDetails = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('answer key') || cat.includes('key')) {
    return {
      icon: '🗝️',
      nameHindi: 'उत्तर कुंजी',
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.08)',
      border: 'rgba(124, 58, 237, 0.25)',
      slug: 'answer-key',
      primaryLabel: 'Check Answer Key / Response Sheet'
    };
  }
  if (cat.includes('syllabus')) {
    return {
      icon: '📚',
      nameHindi: 'पाठ्यक्रम',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
      border: 'rgba(2, 132, 199, 0.25)',
      slug: 'syllabus',
      primaryLabel: 'Download Syllabus / Exam Scheme'
    };
  }
  if (cat.includes('admission')) {
    return {
      icon: '🎓',
      nameHindi: 'प्रवेश',
      color: '#ea580c',
      bg: 'rgba(234, 88, 12, 0.08)',
      border: 'rgba(234, 88, 12, 0.25)',
      slug: 'admission',
      primaryLabel: 'Online Admission Registration'
    };
  }
  if (cat.includes('certificate')) {
    return {
      icon: '📜',
      nameHindi: 'प्रमाण पत्र सत्यापन',
      color: '#db2777',
      bg: 'rgba(219, 39, 119, 0.08)',
      border: 'rgba(219, 39, 119, 0.25)',
      slug: 'certificate',
      primaryLabel: 'Verify Certificate Online'
    };
  }
  if (cat.includes('outsource') || cat.includes('offline')) {
    return {
      icon: '💼',
      nameHindi: 'आउटसोर्सिंग / ऑफलाइन',
      color: '#0d9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      border: 'rgba(13, 148, 136, 0.25)',
      slug: 'outsourcing-offline',
      primaryLabel: 'Download Offline Application Form'
    };
  }
  if (cat.includes('important')) {
    return {
      icon: '⚠️',
      nameHindi: 'महत्वपूर्ण सूचना',
      color: '#e11d48',
      bg: 'rgba(225, 29, 72, 0.08)',
      border: 'rgba(225, 29, 72, 0.25)',
      slug: 'important',
      primaryLabel: 'Direct Portal / Notice Link'
    };
  }
  if (cat.includes('admit') || cat.includes('card')) {
    return {
      icon: '🛡️',
      nameHindi: 'प्रवेश पत्र',
      color: '#2563eb',
      bg: 'rgba(37, 99, 235, 0.08)',
      border: 'rgba(37, 99, 235, 0.25)',
      slug: 'admit-card',
      primaryLabel: 'Download Admit Card / Hall Ticket'
    };
  }
  if (cat.includes('result')) {
    return {
      icon: '🏆',
      nameHindi: 'परीक्षा परिणाम',
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.08)',
      border: 'rgba(22, 163, 74, 0.25)',
      slug: 'result',
      primaryLabel: 'Download Merit List / Check Result'
    };
  }
  return {
    icon: '📝',
    nameHindi: 'नवीनतम नौकरी',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.08)',
    border: 'rgba(217, 119, 6, 0.25)',
    slug: 'latest-jobs',
    primaryLabel: 'Apply Online Registration / Login'
  };
};

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  allJobs = [],
  onNavigateToJob,
  onBack,
  onNavigateToCategory
}) => {
  const catDetails = getCategoryDetails(job.category);

  // Update SEO and Schema when job details component mounts or when job changes
  useEffect(() => {
    updateSEO(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Clean up SEO when unmounted (resets back to homepage SEO)
    return () => {
      updateSEO(undefined);
    };
  }, [job]);

  // Find next 3-4 posts in same category (wrapping around)
  const categoryJobs = allJobs.filter(j => j.category === job.category);
  const currentIdx = categoryJobs.findIndex(j => j.id === job.id);
  const nextJobs: JobPost[] = [];
  if (categoryJobs.length > 1 && currentIdx !== -1) {
    const limit = Math.min(4, categoryJobs.length - 1);
    for (let i = 1; i <= limit; i++) {
      const nextIdx = (currentIdx + i) % categoryJobs.length;
      nextJobs.push(categoryJobs[nextIdx]);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const shareOnWhatsApp = () => {
    const jobUrl = window.location.href;
    const totalPosts = job.vacancies && job.vacancies.length > 0 
      ? job.vacancies.map(v => v.totalPost).filter(Boolean).join(', ')
      : '';
    const vacancyText = totalPosts ? `\n📌 *Total Vacancies:* ${totalPosts}` : '';
    const lastDateText = job.applicationLastDate ? `\n📅 *Last Date:* ${job.applicationLastDate}` : '';
    const feeText = job.fees?.generalObc ? `\n💰 *Fee (Gen/OBC):* ${job.fees.generalObc}` : '';
    
    const message = `🔥 *Govt Update [${job.category}]: ${job.title}*${vacancyText}${lastDateText}${feeText}\n\n👉 *Full Details:* ${jobUrl}\n\n📲 *Join WhatsApp Channel:* ${SOCIAL_LINKS.whatsapp}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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
          Home
        </button>
        <span style={{ color: 'var(--text-muted)' }}>&raquo;</span>
        <button
          onClick={() => onNavigateToCategory ? onNavigateToCategory(catDetails.slug) : onBack()}
          style={{
            background: catDetails.bg,
            color: catDetails.color,
            border: `1px solid ${catDetails.border}`,
            borderRadius: '4px',
            padding: '0.15rem 0.5rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          title={`View all ${job.category} listings`}
        >
          <span>{catDetails.icon}</span>
          <span>{job.category}</span>
        </button>
        <span style={{ color: 'var(--text-muted)' }}>&raquo;</span>
        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
          {job.title}
        </span>
      </nav>

      {/* Navigation Header */}
      <div className="detail-back-bar no-print">
        <button className="btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
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

      {/* Main Title Banner */}
      <header>
        {/* Prominent Section Badge */}
        <div style={{ marginBottom: '0.75rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.95rem',
              borderRadius: '999px',
              background: catDetails.bg,
              border: `1.5px solid ${catDetails.border}`,
              color: catDetails.color,
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{catDetails.icon}</span>
            <span>Section: {job.category}</span>
            <span style={{ opacity: 0.75, fontWeight: 600 }}>({catDetails.nameHindi})</span>
          </span>
        </div>

        <h1 className="detail-title">{job.title}</h1>
        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <strong>Section / Category:</strong> 
            <span style={{ color: catDetails.color, fontWeight: 700 }}>{job.category}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Posted Date:</strong> <span>{job.postDate}</span>
          </div>
          {job.status === 'expired' && (
            <div className="detail-meta-item" style={{ color: 'var(--danger)', fontWeight: 700 }}>
              <span>APPLICATION CLOSED</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }} className="no-print">
          <span style={{ fontWeight: 500, color: 'var(--primary)' }}>✍️ Compiled by Sarkari Aavedan Editorial Team</span>
          <span style={{ fontWeight: 500, color: '#10b981' }}>✓ Verified against Official Government Bulletins</span>
        </div>
      </header>

      {/* Short Information Section */}
      <section className="detail-short-info">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Short Information:</h2>
        <p>{job.shortInfo}</p>
      </section>

      {/* Key Details Grid */}
      <div className="details-grid">
        {/* Important Dates Box */}
        <section className="detail-subcard">
          <div className="detail-subcard-header">
            <Calendar size={18} />
            <h2>Important Dates</h2>
          </div>
          <div className="detail-subcard-content">
            <div className="detail-list-row">
              <span className="detail-list-label">Application Start Date</span>
              <span className="detail-list-value">{job.applicationStart || 'N/A'}</span>
            </div>
            <div className="detail-list-row">
              <span className="detail-list-label">Last Date to Apply</span>
              <span className="detail-list-value" style={{ color: 'var(--danger)' }}>
                {job.applicationLastDate || 'N/A'}
              </span>
            </div>
            <div className="detail-list-row">
              <span className="detail-list-label">Last Date to Pay Exam Fee</span>
              <span className="detail-list-value">{job.feeLastDate || 'N/A'}</span>
            </div>
            <div className="detail-list-row">
              <span className="detail-list-label">Exam Date</span>
              <span className="detail-list-value">{job.examDate || 'To be notified'}</span>
            </div>
            <div className="detail-list-row">
              <span className="detail-list-label">Admit Card Available</span>
              <span className="detail-list-value">{job.admitCardDate || 'To be notified'}</span>
            </div>
            {job.resultDate && (
              <div className="detail-list-row">
                <span className="detail-list-label">Result Declaration</span>
                <span className="detail-list-value" style={{ color: 'var(--success)' }}>
                  {job.resultDate}
                </span>
              </div>
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
            <div className="detail-list-row">
              <span className="detail-list-label">General / OBC / EWS</span>
              <span className="detail-list-value">{job.fees.generalObc || 'Rs. 0/-'}</span>
            </div>
            <div className="detail-list-row">
              <span className="detail-list-label">SC / ST / PH</span>
              <span className="detail-list-value">{job.fees.scStPh || 'Rs. 0/-'}</span>
            </div>
            {job.fees.female && (
              <div className="detail-list-row">
                <span className="detail-list-label">Female Candidates (All Categories)</span>
                <span className="detail-list-value">{job.fees.female}</span>
              </div>
            )}
            {job.fees.paymentMode && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Payment Mode:</strong> {job.fees.paymentMode}
              </div>
            )}
          </div>
        </section>

        {/* Age Limit Box */}
        <section className="detail-subcard" style={{ gridColumn: 'span 2' }}>
          <div className="detail-subcard-header">
            <User size={18} />
            <h2>Age Limit (As on specified date)</h2>
          </div>
          <div className="detail-subcard-content">
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {job.ageLimit.min && (
                <div>
                  <span className="detail-list-label">Minimum Age:</span>{' '}
                  <strong className="detail-list-value">{job.ageLimit.min}</strong>
                </div>
              )}
              {job.ageLimit.max && (
                <div>
                  <span className="detail-list-label">Maximum Age:</span>{' '}
                  <strong className="detail-list-value">{job.ageLimit.max}</strong>
                </div>
              )}
            </div>
            {job.ageLimit.relaxationText && (
              <div className="detail-age-relaxation">
                <strong>Age Relaxation:</strong> {job.ageLimit.relaxationText}
              </div>
            )}
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
                <th>Post Name / Department</th>
                <th>Total Vacancies</th>
                <th>Eligibility Details</th>
              </tr>
            </thead>
            <tbody>
              {job.vacancies.map((vacancy, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{vacancy.postName}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{vacancy.totalPost}</td>
                  <td>{vacancy.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Actionable Links Table */}
      <section className="links-subcard no-print">
        <div className="links-subcard-header">
          <Link2 size={18} />
          <h2>Important Links for Candidates</h2>
        </div>
        <div className="links-subcard-body">
          {/* Primary Section Action link */}
          {job.importantLinks.applyOnline && job.status === 'active' && (
            <div className="link-row">
              <span className="link-row-label">{catDetails.primaryLabel}</span>
              <a
                href={job.importantLinks.applyOnline}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
              >
                <span>Click Here</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Download Notification link */}
          {job.importantLinks.downloadNotification && (
            <div className="link-row">
              <span className="link-row-label">Download Official Notification PDF</span>
              <a
                href={job.importantLinks.downloadNotification}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: 'var(--accent-orange)' }}
              >
                <span>Download</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Syllabus link */}
          {job.importantLinks.syllabusUrl && (
            <div className="link-row">
              <span className="link-row-label">Download Detailed Exam Syllabus</span>
              <a
                href={job.importantLinks.syllabusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: 'var(--info)' }}
              >
                <span>View Syllabus</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Admit Card link */}
          {job.importantLinks.admitCardUrl && (
            <div className="link-row">
              <span className="link-row-label">Download Exam Admit Card / Hall Ticket</span>
              <a
                href={job.importantLinks.admitCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: 'var(--warning)', color: '#000 !important' }}
              >
                <span>Download Admit Card</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Result link */}
          {job.importantLinks.resultUrl && (
            <div className="link-row">
              <span className="link-row-label">Check Written Exam Result / Scorecard</span>
              <a
                href={job.importantLinks.resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: 'var(--success)' }}
              >
                <span>Check Result</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Official Website link */}
          <div className="link-row">
            <span className="link-row-label">Official Authority Website</span>
            <a
              href={job.importantLinks.officialWebsite || 'https://google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link-action"
              style={{ backgroundColor: 'var(--text-secondary)' }}
            >
              <span>Visit Website</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Social Connect Links */}
          <div className="link-row" style={{ backgroundColor: '#f0f4f8', borderLeft: '4px solid #10b981' }}>
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
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: '#1877F2', minWidth: '110px', padding: '0.4rem 0.85rem' }}
                title="Follow our Facebook Page"
              >
                <span>Facebook</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', minWidth: '110px', padding: '0.4rem 0.85rem' }}
                title="Follow us on Instagram"
              >
                <span>Instagram</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation - More posts in same category */}
      {nextJobs.length > 0 && onNavigateToJob && (
        <div className="more-posts-container no-print">
          <hr className="divider" style={{ margin: '2rem 0', borderColor: 'var(--border-color)', opacity: 0.2 }} />
          <h3 className="more-posts-header">More in {job.category}</h3>
          <div className="more-posts-table-wrapper">
            <table className="more-posts-table">
              <tbody>
                {nextJobs.map((nextJob) => (
                  <tr 
                    key={nextJob.id} 
                    className="more-post-row" 
                    onClick={() => onNavigateToJob(nextJob.id)}
                  >
                    <td className="more-post-title-cell">
                      {nextJob.title}
                    </td>
                    <td className="more-post-action-cell">
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
