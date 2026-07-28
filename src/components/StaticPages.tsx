import React, { useState } from 'react';
import { Mail, ShieldCheck, HelpCircle, FileText, Send, CheckCircle2 } from 'lucide-react';

// --- ABOUT US COMPONENT ---
export const AboutUs: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <HelpCircle size={32} style={{ color: 'var(--primary)' }} />
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>About Us / हमारे बारे में</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sarkari Aavedan - Your Trusted Job Update Partner</p>
        </div>
      </div>

      <div style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 500 }}>
          Welcome to <strong>Sarkari Aavedan (सरकारी आवेदन)</strong>, your number one source for all government job updates, exam results, admit cards, and admissions notifications in India.
        </p>

        <p>
          Founded in 2026, our mission is to simplify the job-seeking journey by providing fast, highly reliable, and direct updates. We aggregate notifications from central and state departments, public sector undertakings (PSUs), railways, banks, and defense institutions.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Why Choose Sarkari Aavedan?</h3>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Direct Links:</strong> We do not hold you back with nested redirects. Our buttons point directly to the official authority portals (e.g. UPSC, SSC, state service commissions) so you can register securely.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Configurable System:</strong> An intuitive dashboard that allows administrators to dynamically add, edit, or upload job items instantly via bulk JSON imports.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Responsive & Accessible:</strong> Designed with a modern, glassmorphic layout that scales beautifully across mobile devices, tablets, and desktops.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Ad-Free Experience Option:</strong> Providing lightweight, fast-loading pages that consume minimal data, optimized for slow networks.
          </li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Our Vision</h3>
        <p>
          To empower candidates across rural and urban sectors of India by bridging the gap between notifications and applications. We believe that access to employment information should be clean, direct, and completely free of charge.
        </p>
      </div>
    </div>
  );
};

// --- CONTACT US COMPONENT ---
export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API Submission
    setSubmitted(true);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <Mail size={32} style={{ color: 'var(--primary)' }} />
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Contact Us / संपर्क करें</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>We would love to hear from you</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }} className="contact-grid">
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 1rem 0', fontWeight: 700 }}>Get In Touch</h3>
          <p>
            Have queries regarding a job update, advertisement listings, or suggestions? Feel free to contact our support team.
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Email:</strong>
              <a href="mailto:ac962017@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                ac962017@gmail.com
              </a>
            </div>
            <div>
              <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Support Hours:</strong>
              <span>Monday - Saturday: 9:00 AM - 6:00 PM (IST)</span>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                Thank you for contacting us. We will get back to you within 24-48 hours.
              </p>
              <button className="btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Query subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

// --- DISCLAIMER COMPONENT ---
export const Disclaimer: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <ShieldCheck size={32} style={{ color: 'var(--warning)' }} />
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Disclaimer / अस्वीकरण</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Legal boundaries and information guidelines</p>
        </div>
      </div>

      <div style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.08)', 
          borderLeft: '4px solid var(--danger)', 
          padding: '1rem 1.5rem', 
          borderRadius: '4px',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          fontWeight: 500
        }}>
          Sarkari Aavedan (सरकारी आवेदन) is an independent private educational and informational resource. We are NOT associated, affiliated, or sponsored by any government department, public sector enterprise, or recruiting agency.
        </div>

        <p>
          The information contained in this website is for general information purposes only. While we endeavor to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Source of Information</h3>
        <p>
          All employment updates, recruitment tables, application deadlines, and exam results published on Sarkari Aavedan are sourced from the official notifications issued by the respective government organizations (via their official domains, e.g., `.gov.in`, `.nic.in`) or newspapers like Employment News (रोजगार समाचार). We always recommend that candidates cross-check the official guidelines and download the official notification PDF before submitting any fee or filling out forms.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Fees and Transactions</h3>
        <p>
          We do not charge any money for job application procedures, nor do we collect registration fees from candidates. We provide official hyperlinks directly pointing to the online registration gateways of the respective organizations. If any third party demands payment in the name of Sarkari Aavedan, please report it immediately.
        </p>
      </div>
    </div>
  );
};

// --- PRIVACY POLICY COMPONENT ---
export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <FileText size={32} style={{ color: 'var(--success)' }} />
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Privacy Policy / गोपनीयता नीति</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>How we handle cookies and candidate data</p>
        </div>
      </div>

      <div style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
        <p>
          At <strong>Sarkari Aavedan</strong>, accessible from our portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Sarkari Aavedan and how we use it.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Log Files</h3>
        <p>
          Sarkari Aavedan follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Cookies and Web Beacons</h3>
        <p>
          Like any other website, Sarkari Aavedan uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Third-Party Links</h3>
        <p>
          Our service redirects you to third-party government websites (e.g. state commissions, bank recruitment systems) when clicking "Apply Online" or "Visit Official Website". We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We strongly advise you to read the privacy policy of every site you visit.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>Consent</h3>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have questions regarding this policy, please reach out to us at <a href="mailto:ac962017@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>ac962017@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};
