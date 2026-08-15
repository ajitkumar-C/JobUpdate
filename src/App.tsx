import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { CategoryGrid } from './components/CategoryGrid';
import { JobDetails } from './components/JobDetails';
import { AdminPanel } from './components/AdminPanel';
import { MOCK_JOBS, DEFAULT_CATEGORIES } from './mockData';
import type { JobPost, Category } from './types';
import { Shield, Sparkles, X } from 'lucide-react';
import { AboutUs, ContactUs, Disclaimer, PrivacyPolicy } from './components/StaticPages';
import { StateDirectory } from './components/StateDirectory';
import { StateJobs } from './components/StateJobs';
import { updateSEO } from './utils/seo';
import { CategorySeoInfo } from './components/CategorySeoInfo';
import './App.css';
export const generateJobSlug = (title: string, category: string): string => {
  const cleanCategory = (category || 'job')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let titleSlug = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const words = titleSlug.split('-');
  const stopWords = new Set([
    'apply', 'online', 'for', 'post', 'posts', 'recruitment', 'form', 
    'registration', 'vacancy', 'vacancies', 'notification', 'alert', 
    'free', 'admit-card', 'result', 'syllabus', 'exam', 'admission',
    'certificate', 'outsourcing', 'offline', 'important', 'and', 'with', 
    'the', 'in', 'of', 'at', 'on', 'to', 'by', 'an', 'a', 'is'
  ]);

  const cleanWords = words.filter(w => w.length > 0 && !stopWords.has(w));
  const finalWords = cleanWords.slice(0, 6);

  const finalTitle = finalWords.length > 0 ? finalWords.join('-') : words.slice(0, 5).join('-');
  return `${cleanCategory}-${finalTitle}`;
};

export const App: React.FC = () => {
  // --- States ---
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'contact' | 'disclaimer' | 'privacy' | 'state-directory' | 'state-view'>('home');
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // --- Zero-Dependency Router Helper ---
  const navigateTo = (
    view: 'home' | 'about' | 'contact' | 'disclaimer' | 'privacy' | 'state-directory' | 'state-view',
    categoryCode: string | null,
    jobId: string | null,
    admin: boolean,
    stateCode: string | null = null
  ) => {
    setCurrentView(view);
    setSelectedCategoryCode(categoryCode);
    setSelectedJobId(jobId);
    setIsAdminMode(admin);
    setSelectedStateCode(stateCode);
    setIsDrawerOpen(false); // Close drawer if open

    let path = '/';
    if (admin) {
      path = '/admin';
    } else if (jobId) {
      path = `/job/${jobId}`;
    } else if (view === 'state-directory') {
      path = '/state-jobs';
    } else if (view === 'state-view' && stateCode) {
      path = `/state/${stateCode}`;
    } else if (view !== 'home') {
      path = `/${view}`;
    } else if (categoryCode) {
      path = `/${categoryCode}`;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  const handleRouting = () => {
    const rawPath = window.location.pathname.replace(/^\/|\/$/g, '');
    const segments = rawPath.split('/');

    if (segments[0] === 'admin') {
      setIsAdminMode(true);
      setCurrentView('home');
      setSelectedCategoryCode(null);
      setSelectedJobId(null);
      if (!isAuthorized) {
        setShowAuthModal(true);
      }
    } else if (segments[0] === 'job' && segments[1]) {
      setSelectedJobId(segments[1]);
      setIsAdminMode(false);
      setCurrentView('home');
      setSelectedCategoryCode(null);
    } else if (segments[0] === 'state' && segments[1]) {
      setCurrentView('state-view');
      setSelectedStateCode(segments[1]);
      setSelectedJobId(null);
      setSelectedCategoryCode(null);
      setIsAdminMode(false);
    } else if (segments[0] === 'state-jobs') {
      setCurrentView('state-directory');
      setSelectedStateCode(null);
      setSelectedJobId(null);
      setSelectedCategoryCode(null);
      setIsAdminMode(false);
    } else if (['about', 'contact', 'disclaimer', 'privacy'].includes(segments[0])) {
      setCurrentView(segments[0] as any);
      setSelectedStateCode(null);
      setSelectedJobId(null);
      setSelectedCategoryCode(null);
      setIsAdminMode(false);
    } else if (segments[0]) {
      const catExists = categories.some(c => c.id === segments[0]) || 
                         DEFAULT_CATEGORIES.some(c => c.id === segments[0]);
      if (catExists) {
        setSelectedCategoryCode(segments[0]);
        setCurrentView('home');
        setSelectedJobId(null);
        setIsAdminMode(false);
      } else {
        setCurrentView('home');
        setSelectedCategoryCode(null);
        setSelectedJobId(null);
        setIsAdminMode(false);
      }
    } else {
      setCurrentView('home');
      setSelectedCategoryCode(null);
      setSelectedJobId(null);
      setIsAdminMode(false);
    }
  };

  // --- Router Synchronization useEffect ---
  useEffect(() => {
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, [categories, isAuthorized]);

  // --- Dynamic Routing Initialization Hook ---
  useEffect(() => {
    if (categories.length > 0) {
      handleRouting();
    }
  }, [categories]);

  // --- SEO Injections Effect ---
  useEffect(() => {
    const activeCategory = categories.find(c => c.id === selectedCategoryCode);
    const categoryName = activeCategory ? activeCategory.name : null;
    const selectedJob = jobs.find(j => j.id === selectedJobId) || null;
    const seoView = currentView === 'home' ? null : currentView;

    updateSEO(selectedJob, categoryName, seoView);
  }, [selectedJobId, selectedCategoryCode, currentView, jobs, categories]);

  // --- Legacy Slug Redirect Support Hook ---
  useEffect(() => {
    if (selectedJobId && jobs.length > 0) {
      const exactMatch = jobs.find(j => j.id === selectedJobId);
      if (!exactMatch) {
        // Try token overlap fuzzy matching to gracefully redirect old long slugs to new simplified slugs
        const reqTokens = selectedJobId.toLowerCase().split('-');
        let bestMatch = null;
        let highestOverlapCount = 0;

        for (const job of jobs) {
          const jobTokens = job.id.toLowerCase().split('-');
          let overlapCount = 0;
          for (const t of jobTokens) {
            if (reqTokens.includes(t)) {
              overlapCount++;
            }
          }
          // Match on at least 3 key tokens to prevent wrong redirects
          if (overlapCount > highestOverlapCount && overlapCount >= 3) {
            highestOverlapCount = overlapCount;
            bestMatch = job;
          }
        }

        if (bestMatch) {
          console.log(`Redirecting legacy slug "${selectedJobId}" to new optimized slug "${bestMatch.id}"`);
          navigateTo('home', null, bestMatch.id, false);
        }
      }
    }
  }, [selectedJobId, jobs]);

  // --- Admin URL Trigger Listener ---
  useEffect(() => {
    const checkUrlForAdmin = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isParamAdmin = searchParams.get('admin') === 'true';
      const isHashAdmin = window.location.hash === '#admin';

      if (isParamAdmin || isHashAdmin) {
        setShowAdminButton(true);
        if (!isAuthorized && !isAdminMode) {
          setShowAuthModal(true);
        }
      }
    };

    checkUrlForAdmin();
    window.addEventListener('hashchange', checkUrlForAdmin);
    return () => window.removeEventListener('hashchange', checkUrlForAdmin);
  }, [isAuthorized, isAdminMode]);

  // --- Load Initial Data & Theme ---
  useEffect(() => {
    // Load Theme
    const savedTheme = localStorage.getItem('sr-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Helper to auto-sync categories based on jobs (filtering out "Defense" or "Defance" categories)
    const syncCategories = (loadedJobs: JobPost[]) => {
      const savedCategories = localStorage.getItem('sr-categories');
      const baseCats = savedCategories ? JSON.parse(savedCategories) as Category[] : DEFAULT_CATEGORIES;
      
      const filteredBaseCats = baseCats.filter(c => 
        !c.name.toLowerCase().includes('defen') && 
        !c.name.toLowerCase().includes('defan')
      );
      
      const jobCategories = Array.from(new Set(loadedJobs.map(j => j.category)))
        .filter(catName => 
          !catName.toLowerCase().includes('defen') && 
          !catName.toLowerCase().includes('defan')
        );
      
      const updatedCats = [...filteredBaseCats];
      let catChanged = baseCats.length !== filteredBaseCats.length;
      
      jobCategories.forEach(catName => {
        const exists = updatedCats.some(c => c.name.toLowerCase() === catName.toLowerCase());
        if (!exists) {
          updatedCats.push({
            id: catName.toLowerCase().replace(/\s+/g, '-'),
            name: catName
          });
          catChanged = true;
        }
      });
      
      setCategories(updatedCats);
      if (catChanged || !savedCategories) {
        localStorage.setItem('sr-categories', JSON.stringify(updatedCats));
      }
    };

    // Load Jobs from Fetch, LocalStorage, or Seed Data
    const loadData = async () => {
      let finalJobs: JobPost[] = [];
      try {
        const response = await fetch('/scraped-jobs.json');
        if (response.ok) {
          const fetchedJobs = await response.json();
          if (Array.isArray(fetchedJobs) && fetchedJobs.length > 0) {
            const savedJobsRaw = localStorage.getItem('sr-jobs');
            if (savedJobsRaw) {
              const savedJobs = JSON.parse(savedJobsRaw) as JobPost[];
              const fetchedTitles = new Set(fetchedJobs.map(j => j.title));
              const manualJobs = savedJobs.filter(j => !fetchedTitles.has(j.title));
              finalJobs = [...fetchedJobs, ...manualJobs];
            } else {
              finalJobs = fetchedJobs;
            }
          }
        }
      } catch (error) {
        console.warn('Could not fetch scraped-jobs.json, using local cache:', error);
      }

      if (finalJobs.length === 0) {
        const savedJobs = localStorage.getItem('sr-jobs');
        if (savedJobs) {
          finalJobs = JSON.parse(savedJobs);
        } else {
          finalJobs = MOCK_JOBS;
          localStorage.setItem('sr-jobs', JSON.stringify(MOCK_JOBS));
        }
      }

      // Filter out any jobs belonging to the "Defense" or "Defance" categories and sanitize legacy numeric IDs
      const cleanJobs = finalJobs.filter(j => 
        !j.category.toLowerCase().includes('defen') && 
        !j.category.toLowerCase().includes('defan')
      ).map(job => {
        // If job ID is missing OR has legacy numeric timestamp format (e.g. latest-jobs-1784429869619-11)
        if (!job.id || /-\d{10,}(-\d+)?$/.test(job.id)) {
          return {
            ...job,
            id: generateJobSlug(job.title, job.category)
          };
        }
        return job;
      });

      localStorage.setItem('sr-jobs', JSON.stringify(cleanJobs));
      setJobs(cleanJobs);
      syncCategories(cleanJobs);
    };

    loadData();
  }, []);

  // --- Save Changes to LocalStorage ---
  const saveJobsToStorage = (updatedJobs: JobPost[]) => {
    setJobs(updatedJobs);
    localStorage.setItem('sr-jobs', JSON.stringify(updatedJobs));
  };

  const saveCategoriesToStorage = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('sr-categories', JSON.stringify(updatedCategories));
  };

  // --- Theme Toggler ---
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('sr-theme', nextTheme);
  };

  // --- Admin Auth Action ---
  const handleToggleAdminMode = () => {
    if (isAdminMode) {
      // Toggle back to User Mode
      navigateTo('home', null, null, false);
    } else {
      // Trying to access Admin Mode
      if (isAuthorized) {
        navigateTo('home', null, null, true);
      } else {
        setShowAuthModal(true);
      }
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1DCTPOND#') {
      setIsAuthorized(true);
      setShowAuthModal(false);
      setPasswordInput('');
      navigateTo('home', null, null, true);
    } else {
      alert('Invalid Password!');
    }
  };

  // --- CRUD Operations ---
  const handleAddJob = (newJobData: Omit<JobPost, 'id'>) => {
    const newJob: JobPost = {
      ...newJobData,
      id: generateJobSlug(newJobData.title, newJobData.category)
    };
    const updatedJobs = [newJob, ...jobs];
    saveJobsToStorage(updatedJobs);
  };

  const handleImportJobs = (importedJobsData: Omit<JobPost, 'id'>[]) => {
    const newJobs: JobPost[] = importedJobsData.map((jobData) => ({
      ...jobData,
      id: generateJobSlug(jobData.title, jobData.category)
    }));

    // Detect new categories
    const newCategoriesToRegister: Category[] = [];
    const existingCategoryNames = new Set(categories.map((c) => c.name.toLowerCase()));

    newJobs.forEach((job) => {
      const catName = job.category;
      if (catName && !existingCategoryNames.has(catName.toLowerCase())) {
        const catId = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!newCategoriesToRegister.some((c) => c.name.toLowerCase() === catName.toLowerCase())) {
          newCategoriesToRegister.push({ id: catId, name: catName });
          existingCategoryNames.add(catName.toLowerCase());
        }
      }
    });

    if (newCategoriesToRegister.length > 0) {
      const updatedCategories = [...categories, ...newCategoriesToRegister];
      saveCategoriesToStorage(updatedCategories);
    }

    const updatedJobs = [...newJobs, ...jobs];
    saveJobsToStorage(updatedJobs);
  };

  const handleUpdateJob = (id: string, updatedFields: Partial<JobPost>) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, ...updatedFields } : job
    );
    saveJobsToStorage(updatedJobs);
  };

  const handleDeleteJob = (id: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    saveJobsToStorage(updatedJobs);
  };

  const handleAddCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: categoryName.toLowerCase().replace(/\s+/g, '-'),
      name: categoryName
    };
    const updatedCategories = [...categories, newCategory];
    saveCategoriesToStorage(updatedCategories);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== id);
    saveCategoriesToStorage(updatedCategories);
  };

  // --- Helper Navigations ---
  const handleJobClick = (id: string) => {
    navigateTo('home', null, id, false);
  };

  const handleHomeClick = () => {
    setSearchTerm('');
    navigateTo('home', null, null, false);
  };

  // --- Filtering ---
  // Filter jobs by global search term
  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.category.toLowerCase().includes(term) ||
      job.shortInfo.toLowerCase().includes(term) ||
      job.vacancies.some((v) => v.postName.toLowerCase().includes(term))
    );
  });

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Bar */}
      <Header
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onHomeClick={handleHomeClick}
        onLogoClick={() => setIsDrawerOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        showAdminButton={showAdminButton}
      />

      {/* Sub Navigation Bar for Categories */}
      {!isAdminMode && !selectedJobId && (
        <nav className="sub-nav no-print">
          <button
            className={`sub-nav-item ${currentView === 'home' && selectedCategoryCode === null ? 'active' : ''}`}
            onClick={() => { navigateTo('home', null, null, false); window.scrollTo(0, 0); }}
          >
            All Sections
          </button>
          
          {/* Latest Jobs Category */}
          {categories.filter(c => c.id === 'latest-jobs').map((cat) => (
            <button
              key={cat.id}
              className={`sub-nav-item ${currentView === 'home' && selectedCategoryCode === cat.id ? 'active' : ''}`}
              onClick={() => { navigateTo('home', cat.id, null, false); window.scrollTo(0, 0); }}
            >
              {cat.name}
            </button>
          ))}

          {/* State-Wise Jobs — Placed right after Latest Jobs */}
          <button
            className={`sub-nav-item sub-nav-state ${currentView === 'state-directory' || currentView === 'state-view' ? 'active' : ''}`}
            onClick={() => { navigateTo('state-directory', null, null, false); window.scrollTo(0, 0); }}
          >
            🌏 State Jobs
          </button>

          {/* Admit Card & Result Categories */}
          {categories.filter(c => ['admit-card', 'result'].includes(c.id)).map((cat) => (
            <button
              key={cat.id}
              className={`sub-nav-item ${currentView === 'home' && selectedCategoryCode === cat.id ? 'active' : ''}`}
              onClick={() => { navigateTo('home', cat.id, null, false); window.scrollTo(0, 0); }}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      )}


      {/* Breaking News Ticker */}
      <BreakingTicker jobs={jobs} onJobClick={handleJobClick} />

      {/* Core Body Container */}
      <div className="app-container flex-grow">
        {isAdminMode ? (
          /* Admin Dashboard Screen */
          <AdminPanel
            jobs={jobs}
            categories={categories}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onImportJobs={handleImportJobs}
          />
        ) : selectedJob ? (
          <JobDetails
            job={selectedJob}
            allJobs={jobs}
            onNavigateToJob={(id) => navigateTo('home', null, id, false)}
            onBack={handleHomeClick}
          />
        ) : currentView === 'about' ? (
          <AboutUs />
        ) : currentView === 'contact' ? (
          <ContactUs />
        ) : currentView === 'disclaimer' ? (
          <Disclaimer />
        ) : currentView === 'privacy' ? (
          <PrivacyPolicy />
        ) : currentView === 'state-directory' ? (
          <StateDirectory onSelectState={(code) => navigateTo('state-view', null, null, false, code)} />
        ) : currentView === 'state-view' && selectedStateCode ? (
          <StateJobs stateCode={selectedStateCode} />
        ) : (
          /* Consumer Dashboard Home Screen */
          <>

            {/* Main Category Columns Grid */}
            <main>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={22} style={{ color: 'var(--warning)' }} />
                  <span>
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest Examinations & Notifications'}
                  </span>
                </h2>
                {searchTerm && (
                  <button className="btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSearchTerm('')}>
                    Clear Search
                  </button>
                )}
              </div>
              <CategoryGrid
                jobs={filteredJobs}
                categories={
                  selectedCategoryCode
                    ? categories.filter(c => c.id === selectedCategoryCode)
                    : categories
                }
                onJobClick={handleJobClick}
                onCategorySelect={(id) => navigateTo('home', id, null, false)}
                isSingleColumnView={selectedCategoryCode !== null}
              />

              {!selectedCategoryCode && !searchTerm && (
                <section className="seo-home-info">
                  <h3>Sarkari Aavedan (सरकारी आवेदन) — Govt Jobs, Admit Cards & Results</h3>
                  <p>
                    <strong>Sarkari Aavedan (सरकारी आवेदन)</strong> is a dedicated portal designed to help job aspirants navigate through the complex world of competitive government examinations in India. We gather, verify, and present information regarding a wide range of job recruitments, entrance tests, call letters, exam keys, and results.
                  </p>
                  <p>
                    Our platform covers prominent central and state government recruitment boards, including the <strong>Union Public Service Commission (UPSC)</strong>, <strong>Staff Selection Commission (SSC)</strong>, <strong>Railway Recruitment Board (RRB)</strong>, <strong>Institute of Banking Personnel Selection (IBPS)</strong>, and individual state-level commissions like <strong>UPPSC, BPSC, MPPSC, and UKPSC</strong>.
                  </p>
                  
                  <h4>Bilingual Job Alerts & Essential Updates</h4>
                  <p>
                    We present job posts in a well-structured, print-ready, bilingual format (Hindi/English). Each vacancy specification card includes:
                  </p>
                  <ul>
                    <li><strong>Important Timelines:</strong> Critical dates such as application opening, last date to apply, exam schedule, and admit card release dates.</li>
                    <li><strong>Application Fee Details:</strong> Clean billing breakdown for General, OBC, EWS, SC, ST, and PH categories.</li>
                    <li><strong>Age Eligibility:</strong> Minimum and maximum age requirements, plus criteria for age relaxation.</li>
                    <li><strong>Vacancy Details:</strong> Clear tabular representations of posts, qualification criteria, and department allocations.</li>
                  </ul>
                  
                  <h4>Direct & Secure Redirects</h4>
                  <p>
                    Sarkari Aavedan values user safety and convenience. Unlike traditional portals that route traffic through commercial intermediate wrappers or third-party advertisements, we parse and automatically unwrap redirection links. This means every button on our detail pages takes you directly to the official government servers (e.g. upsc.gov.in, ssc.gov.in) to download notifications or apply online safely.
                  </p>
                </section>
              )}

              {/* Featured Sectors Row */}
              {!selectedCategoryCode && !searchTerm && (
                <section className="featured-sectors-section">
                  <h3 className="section-title-visual">Featured Recruitment Boards / प्रमुख भर्ती बोर्ड</h3>
                  <div className="sectors-grid">
                    <div className="sector-card">
                      <img src="/logos/upsc_logo.png" alt="UPSC Logo" className="sector-logo" />
                      <span className="sector-name">UPSC</span>
                      <span className="sector-desc">Union Public Service Commission</span>
                    </div>
                    <div className="sector-card">
                      <img src="/logos/defence_logo.png" alt="Defence Logo" className="sector-logo" />
                      <span className="sector-name">Indian Army</span>
                      <span className="sector-desc">Indian Defence Forces</span>
                    </div>
                    <div className="sector-card">
                      <img src="/logos/airforce_logo.png" alt="Air Force Logo" className="sector-logo" />
                      <span className="sector-name">Indian Air Force</span>
                      <span className="sector-desc">IAF Airmen Careers</span>
                    </div>
                    <div className="sector-card">
                      <img src="/logos/up_logo.png" alt="UP Govt Logo" className="sector-logo" />
                      <span className="sector-name">UP Government</span>
                      <span className="sector-desc">Uttar Pradesh Recruitments</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Category-Specific SEO Info Block */}
              {selectedCategoryCode && (
                <CategorySeoInfo categoryId={selectedCategoryCode} />
              )}
            </main>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer no-print">
        <div className="footer-links">
          <a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about', null, null, false); window.scrollTo(0, 0); }}>About Us</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact', null, null, false); window.scrollTo(0, 0); }}>Contact</a>
          <a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigateTo('disclaimer', null, null, false); window.scrollTo(0, 0); }}>Disclaimer</a>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy', null, null, false); window.scrollTo(0, 0); }}>Privacy Policy</a>
          <a href="/state-jobs" onClick={(e) => { e.preventDefault(); navigateTo('state-directory', null, null, false); window.scrollTo(0, 0); }}>🌏 State Jobs</a>
        </div>
        <p>© 2026 Sarkari Aavedan (सरकारी आवेदन). All Rights Reserved.</p>
        <p className="footer-tagline">
          Designed with 💙 for maximum speed, easy manageability, and search visibility.
        </p>
      </footer>

      {/* Admin Mode Passcode Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-container auth-modal">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} style={{ color: 'var(--primary)' }} />
                <span>Admin Portal Authorization</span>
              </h2>
              <button className="btn-icon" onClick={() => setShowAuthModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit}>
              <div className="modal-body">
                <p className="auth-desc">
                  Please enter the administrator access code to manage job updates, add listings, or edit categories.
                </p>
                <div className="form-group">
                  <label className="form-label">Administrator Passcode</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter admin passcode"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                    required
                  />

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar Drawer Panel */}
      {isDrawerOpen && (
        <div className="drawer-overlay no-print" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-brand">
                <div className="header-logo">SA</div>
                <div className="drawer-title-container" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="header-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>सरकारी आवेदन</span>
                  <span className="header-subtitle" style={{ fontSize: '0.7rem' }}>Sarkari Aavedan</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="drawer-body">
              <h3 className="drawer-section-title">Navigation Sections</h3>
              <ul className="drawer-list">
                <li>
                  <button 
                    className={`drawer-item ${selectedCategoryCode === null ? 'active' : ''}`}
                    onClick={() => {
                      navigateTo('home', null, null, false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    All Sections / होम
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`drawer-item ${selectedCategoryCode === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        navigateTo('home', cat.id, null, false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 className="drawer-section-title">State-Wise Jobs</h3>
                <ul className="drawer-list">
                  <li>
                    <button
                      className={`drawer-item ${currentView === 'state-directory' ? 'active' : ''}`}
                      onClick={() => { navigateTo('state-directory', null, null, false); window.scrollTo(0, 0); }}
                    >
                      🌏 All State Jobs
                    </button>
                  </li>
                  <li>
                    <button
                      className={`drawer-item ${currentView === 'state-view' && selectedStateCode === 'mh' ? 'active' : ''}`}
                      onClick={() => { navigateTo('state-view', null, null, false, 'mh'); window.scrollTo(0, 0); }}
                    >
                      🚩 Maharashtra Jobs
                    </button>
                  </li>
                  <li>
                    <button
                      className={`drawer-item ${currentView === 'state-view' && selectedStateCode === 'up' ? 'active' : ''}`}
                      onClick={() => { navigateTo('state-view', null, null, false, 'up'); window.scrollTo(0, 0); }}
                    >
                      🚩 Uttar Pradesh
                    </button>
                  </li>
                  <li>
                    <button
                      className={`drawer-item ${currentView === 'state-view' && selectedStateCode === 'bihar' ? 'active' : ''}`}
                      onClick={() => { navigateTo('state-view', null, null, false, 'bihar'); window.scrollTo(0, 0); }}
                    >
                      🚩 Bihar Jobs
                    </button>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 className="drawer-section-title">Information Pages</h3>
                <ul className="drawer-list">
                  <li>
                    <button className="drawer-item" onClick={() => { navigateTo('about', null, null, false); window.scrollTo(0, 0); }}>About Us</button>
                  </li>
                  <li>
                    <button className="drawer-item" onClick={() => { navigateTo('contact', null, null, false); window.scrollTo(0, 0); }}>Contact</button>
                  </li>
                  <li>
                    <button className="drawer-item" onClick={() => { navigateTo('disclaimer', null, null, false); window.scrollTo(0, 0); }}>Disclaimer</button>
                  </li>
                  <li>
                    <button className="drawer-item" onClick={() => { navigateTo('privacy', null, null, false); window.scrollTo(0, 0); }}>Privacy Policy</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
