import React, { useEffect } from 'react';
import { ArrowLeft, Printer, Calendar, IndianRupee, User, Info, Link2, ExternalLink } from 'lucide-react';
import type { JobPost } from '../types';
import { updateSEO } from '../utils/seo';

interface JobDetailsProps {
  job: JobPost;
  allJobs?: JobPost[];
  onNavigateToJob?: (jobId: string) => void;
  onBack: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  allJobs = [],
  onNavigateToJob,
  onBack
}) => {
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

  return (
    <article className="detail-card print-card">
      {/* Navigation Header */}
      <div className="detail-back-bar no-print">
        <button className="btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <button className="btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          <span>Print Details</span>
        </button>
      </div>

      {/* Main Title Banner */}
      <header>
        <h1 className="detail-title">{job.title}</h1>
        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <strong>Category:</strong> 
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{job.category}</span>
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
          {/* Apply Online link */}
          {job.importantLinks.applyOnline && job.status === 'active' && (
            <div className="link-row">
              <span className="link-row-label">Apply Online Registration / Login</span>
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
          <div className="link-row" style={{ backgroundColor: '#f0f4f8', borderLeft: '4px solid #1877F2' }}>
            <span className="link-row-label" style={{ fontWeight: 700, color: '#1877F2', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📢 Join Our Official Channels
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://www.facebook.com/profile.php?id=61593405460663" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ backgroundColor: '#1877F2', minWidth: '120px', padding: '0.4rem 1rem' }}
                title="Join our Facebook Page"
              >
                <span>Facebook</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://www.instagram.com/sarkari__job_update/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-link-action"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', minWidth: '120px', padding: '0.4rem 1rem' }}
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
