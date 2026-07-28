import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Settings, FolderPlus, ListCollapse, Check, X, Upload, Download } from 'lucide-react';
import type { JobPost, Category, VacancyRow } from '../types';

interface AdminPanelProps {
  jobs: JobPost[];
  categories: Category[];
  onAddJob: (job: Omit<JobPost, 'id'>) => void;
  onUpdateJob: (id: string, job: Partial<JobPost>) => void;
  onDeleteJob: (id: string) => void;
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (id: string) => void;
  onImportJobs: (importedJobs: Omit<JobPost, 'id'>[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  jobs,
  categories,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddCategory,
  onDeleteCategory,
  onImportJobs
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);

  // New Category input
  const [newCatName, setNewCatName] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [shortInfo, setShortInfo] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [appStart, setAppStart] = useState('');
  const [appLast, setAppLast] = useState('');
  const [feeLast, setFeeLast] = useState('');
  const [examDate, setExamDate] = useState('');
  const [admitDate, setAdmitDate] = useState('');
  const [resultDate, setResultDate] = useState('');
  
  const [feeGen, setFeeGen] = useState('Rs. 0/-');
  const [feeSc, setFeeSc] = useState('Rs. 0/-');
  const [feeFemale, setFeeFemale] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [ageRelax, setAgeRelax] = useState('');
  
  const [vacancies, setVacancies] = useState<VacancyRow[]>([
    { postName: '', totalPost: '', eligibility: '' }
  ]);
  
  const [linkApply, setLinkApply] = useState('');
  const [linkNotification, setLinkNotification] = useState('');
  const [linkWebsite, setLinkWebsite] = useState('');
  const [linkSyllabus, setLinkSyllabus] = useState('');
  const [linkAdmit, setLinkAdmit] = useState('');
  const [linkResult, setLinkResult] = useState('');
  
  const [status, setStatus] = useState<'active' | 'expired'>('active');

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        const rawJobs = Array.isArray(parsed) ? parsed : [parsed];
        const validJobs: Omit<JobPost, 'id'>[] = [];

        for (let i = 0; i < rawJobs.length; i++) {
          const item = rawJobs[i];
          if (!item.title || !item.category || !item.shortInfo) {
            throw new Error(`Item at index ${i} is missing required fields (title, category, shortInfo).`);
          }

          const normalizedJob: Omit<JobPost, 'id'> = {
            title: String(item.title),
            category: String(item.category),
            postDate: String(item.postDate || new Date().toISOString().split('T')[0]),
            shortInfo: String(item.shortInfo),
            applicationStart: String(item.applicationStart || ''),
            applicationLastDate: String(item.applicationLastDate || ''),
            feeLastDate: String(item.feeLastDate || ''),
            examDate: String(item.examDate || ''),
            admitCardDate: String(item.admitCardDate || ''),
            resultDate: item.resultDate ? String(item.resultDate) : undefined,
            fees: {
              generalObc: String(item.fees?.generalObc || 'Rs. 0/-'),
              scStPh: String(item.fees?.scStPh || 'Rs. 0/-'),
              female: item.fees?.female ? String(item.fees.female) : undefined,
              paymentMode: item.fees?.paymentMode ? String(item.fees.paymentMode) : undefined
            },
            ageLimit: {
              min: item.ageLimit?.min ? String(item.ageLimit.min) : undefined,
              max: item.ageLimit?.max ? String(item.ageLimit.max) : undefined,
              relaxationText: item.ageLimit?.relaxationText ? String(item.ageLimit.relaxationText) : undefined
            },
            vacancies: Array.isArray(item.vacancies) && item.vacancies.length > 0
              ? item.vacancies.map((v: any) => ({
                  postName: String(v.postName || ''),
                  totalPost: String(v.totalPost || ''),
                  eligibility: String(v.eligibility || '')
                }))
              : [
                  {
                    postName: String(item.title),
                    totalPost: 'Details in Notification',
                    eligibility: 'See Eligibility Criteria'
                  }
                ],
            importantLinks: {
              applyOnline: item.importantLinks?.applyOnline ? String(item.importantLinks.applyOnline) : undefined,
              downloadNotification: item.importantLinks?.downloadNotification ? String(item.importantLinks.downloadNotification) : undefined,
              officialWebsite: item.importantLinks?.officialWebsite ? String(item.importantLinks.officialWebsite) : undefined,
              syllabusUrl: item.importantLinks?.syllabusUrl ? String(item.importantLinks.syllabusUrl) : undefined,
              admitCardUrl: item.importantLinks?.admitCardUrl ? String(item.importantLinks.admitCardUrl) : undefined,
              resultUrl: item.importantLinks?.resultUrl ? String(item.importantLinks.resultUrl) : undefined
            },
            status: item.status === 'expired' ? 'expired' : 'active'
          };
          validJobs.push(normalizedJob);
        }

        if (validJobs.length === 0) {
          alert('No valid jobs found in the JSON file.');
          return;
        }

        onImportJobs(validJobs);
        alert(`Successfully imported ${validJobs.length} job updates!`);
        e.target.value = '';
      } catch (err: any) {
        alert(`Failed to parse JSON file. Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setCategory(categories[0]?.name || '');
    setShortInfo('');
    setPostDate(new Date().toISOString().split('T')[0]);
    setAppStart('');
    setAppLast('');
    setFeeLast('');
    setExamDate('');
    setAdmitDate('');
    setResultDate('');
    setFeeGen('Rs. 0/-');
    setFeeSc('Rs. 0/-');
    setFeeFemale('');
    setPaymentMode('');
    setAgeMin('');
    setAgeMax('');
    setAgeRelax('');
    setVacancies([{ postName: '', totalPost: '', eligibility: '' }]);
    setLinkApply('');
    setLinkNotification('');
    setLinkWebsite('');
    setLinkSyllabus('');
    setLinkAdmit('');
    setLinkResult('');
    setStatus('active');
    setEditingJob(null);
  };

  // Open modal for editing
  const handleEditClick = (job: JobPost) => {
    setEditingJob(job);
    setTitle(job.title);
    setCategory(job.category);
    setShortInfo(job.shortInfo);
    setPostDate(job.postDate);
    setAppStart(job.applicationStart);
    setAppLast(job.applicationLastDate);
    setFeeLast(job.feeLastDate);
    setExamDate(job.examDate);
    setAdmitDate(job.admitCardDate);
    setResultDate(job.resultDate || '');
    setFeeGen(job.fees.generalObc);
    setFeeSc(job.fees.scStPh);
    setFeeFemale(job.fees.female || '');
    setPaymentMode(job.fees.paymentMode || '');
    setAgeMin(job.ageLimit.min || '');
    setAgeMax(job.ageLimit.max || '');
    setAgeRelax(job.ageLimit.relaxationText || '');
    setVacancies(job.vacancies.length > 0 ? job.vacancies : [{ postName: '', totalPost: '', eligibility: '' }]);
    setLinkApply(job.importantLinks.applyOnline || '');
    setLinkNotification(job.importantLinks.downloadNotification || '');
    setLinkWebsite(job.importantLinks.officialWebsite || '');
    setLinkSyllabus(job.importantLinks.syllabusUrl || '');
    setLinkAdmit(job.importantLinks.admitCardUrl || '');
    setLinkResult(job.importantLinks.resultUrl || '');
    setStatus(job.status);
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !shortInfo) {
      alert('Please fill out the Title, Category, and Short Info!');
      return;
    }

    // Filter out blank vacancy rows
    const cleanedVacancies = vacancies.filter(v => v.postName.trim() !== '');
    if (cleanedVacancies.length === 0) {
      cleanedVacancies.push({
        postName: title,
        totalPost: 'Details in Notification',
        eligibility: 'See Eligibility Criteria'
      });
    }

    const jobData = {
      title,
      category,
      postDate,
      shortInfo,
      applicationStart: appStart,
      applicationLastDate: appLast,
      feeLastDate: feeLast,
      examDate,
      admitCardDate: admitDate,
      resultDate: resultDate || undefined,
      fees: {
        generalObc: feeGen,
        scStPh: feeSc,
        female: feeFemale || undefined,
        paymentMode: paymentMode || undefined
      },
      ageLimit: {
        min: ageMin || undefined,
        max: ageMax || undefined,
        relaxationText: ageRelax || undefined
      },
      vacancies: cleanedVacancies,
      importantLinks: {
        applyOnline: linkApply || undefined,
        downloadNotification: linkNotification || undefined,
        officialWebsite: linkWebsite || undefined,
        syllabusUrl: linkSyllabus || undefined,
        admitCardUrl: linkAdmit || undefined,
        resultUrl: linkResult || undefined
      },
      status
    };

    if (editingJob) {
      onUpdateJob(editingJob.id, jobData);
    } else {
      onAddJob(jobData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Vacancy Row Handlers
  const handleAddVacancyRow = () => {
    setVacancies([...vacancies, { postName: '', totalPost: '', eligibility: '' }]);
  };

  const handleRemoveVacancyRow = (index: number) => {
    if (vacancies.length === 1) return;
    const newVacancies = vacancies.filter((_, i) => i !== index);
    setVacancies(newVacancies);
  };

  const handleVacancyChange = (index: number, field: keyof VacancyRow, value: string) => {
    const newVacancies = [...vacancies];
    newVacancies[index] = {
      ...newVacancies[index],
      [field]: value
    };
    setVacancies(newVacancies);
  };

  // Add Category Handler
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    // Check if category already exists
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === newCatName.trim().toLowerCase()
    );
    if (exists) {
      alert('Category already exists!');
      return;
    }

    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout app-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
          <Shield style={{ color: 'var(--primary)' }} size={20} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Admin Console</h2>
        </div>
        <button
          className={`admin-sidebar-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <ListCollapse size={18} />
          <span>Manage Posts</span>
        </button>
        <button
          className={`admin-sidebar-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <FolderPlus size={18} />
          <span>Manage Categories</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        {activeTab === 'posts' && (
          <div>
            <div className="admin-section-header">
              <h1 className="admin-title">Job Post Updates</h1>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label className="btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={16} />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleJsonImport}
                  />
                </label>
                <button
                  className="btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jobs, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", "scraped-jobs.json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                >
                  <Download size={16} />
                  <span>Export JSON</span>
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    resetForm();
                    setCategory(categories[0]?.name || '');
                    setIsModalOpen(true);
                  }}
                >
                  <Plus size={18} />
                  <span>Add Job Update</span>
                </button>
              </div>
            </div>

            <div className="admin-toolbar">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search job titles or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Post Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job.id}>
                        <td style={{ fontWeight: 600, maxWidth: '400px' }}>{job.title}</td>
                        <td>
                          <span
                            style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)'
                            }}
                          >
                            {job.category}
                          </span>
                        </td>
                        <td>{job.postDate}</td>
                        <td>
                          <span
                            style={{
                              color: job.status === 'active' ? 'var(--success)' : 'var(--danger)',
                              fontWeight: 700,
                              fontSize: '0.8rem'
                            }}
                          >
                            {job.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button
                            className="btn-action-sm edit"
                            onClick={() => handleEditClick(job)}
                            title="Edit Job Post"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-action-sm delete"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                                onDeleteJob(job.id);
                              }
                            }}
                            title="Delete Job Post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                        No job posts found. Click "Add Job Update" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h1 className="admin-title" style={{ marginBottom: '1.5rem' }}>
              Manage Portal Categories
            </h1>

            <div className="cat-manager-grid">
              {/* Add category form */}
              <div className="detail-subcard">
                <div className="detail-subcard-header">
                  <FolderPlus size={18} />
                  <h2>Add New Category</h2>
                </div>
                <form onSubmit={handleAddCategorySubmit} className="detail-subcard-content">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Creating a new category will add a new column dynamically on the user dashboard.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Scholarship, Admission"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: 'fit-content' }}>
                    <Plus size={16} />
                    <span>Create Category</span>
                  </button>
                </form>
              </div>

              {/* Category Listing */}
              <div className="detail-subcard">
                <div className="detail-subcard-header">
                  <Settings size={18} />
                  <h2>Current Columns</h2>
                </div>
                <div className="detail-subcard-content" style={{ padding: 0 }}>
                  <ul className="cat-list">
                    {categories.map((cat) => (
                      <li key={cat.id} className="cat-list-item">
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        <button
                          className="btn-action-sm delete"
                          onClick={() => {
                            if (confirm(`Deleting "${cat.name}" will remove it from the columns. Jobs in this category will remain, but will not show in columns. Proceed?`)) {
                              onDeleteCategory(cat.id);
                            }
                          }}
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h2>
              <button
                className="btn-icon"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Basic Details */}
                  <div className="form-group full-width">
                    <label className="form-label">Job Post Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. UPSC CSE Civil Services IAS/IFS 2026 Online Form"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Post Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Short Information *</label>
                    <textarea
                      className="form-control"
                      placeholder="Write a brief overview of the vacancy..."
                      value={shortInfo}
                      onChange={(e) => setShortInfo(e.target.value)}
                      required
                    />
                  </div>

                  {/* Dates Section */}
                  <span className="section-divider">Important Dates</span>

                  <div className="form-group">
                    <label className="form-label">Application Start Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2026-06-25"
                      value={appStart}
                      onChange={(e) => setAppStart(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Date to Apply</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2026-07-20"
                      value={appLast}
                      onChange={(e) => setAppLast(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fee Last Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2026-07-20"
                      value={feeLast}
                      onChange={(e) => setFeeLast(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Exam Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. October 2026"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admit Card Release Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. September 28, 2026"
                      value={admitDate}
                      onChange={(e) => setAdmitDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Result Declaration Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. November 2026"
                      value={resultDate}
                      onChange={(e) => setResultDate(e.target.value)}
                    />
                  </div>

                  {/* Fees Section */}
                  <span className="section-divider">Application Fees</span>

                  <div className="form-group">
                    <label className="form-label">General / OBC / EWS Fee</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rs. 100/-"
                      value={feeGen}
                      onChange={(e) => setFeeGen(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SC / ST / PH Fee</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rs. 0/-"
                      value={feeSc}
                      onChange={(e) => setFeeSc(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Female Candidate Fee</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rs. 0/- (Exempted)"
                      value={feeFemale}
                      onChange={(e) => setFeeFemale(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Mode Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Online Net Banking, Credit/Debit card"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                  </div>

                  {/* Age Limits */}
                  <span className="section-divider">Age Limit Criteria</span>

                  <div className="form-group">
                    <label className="form-label">Minimum Age</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 21 Years"
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maximum Age</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 32 Years"
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Age Relaxation Clause Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Age relaxation is applicable as per government recruitment rules."
                      value={ageRelax}
                      onChange={(e) => setAgeRelax(e.target.value)}
                    />
                  </div>

                  {/* Vacancies Dynamic Builder */}
                  <span className="section-divider">Vacancy Details Table</span>
                  <div className="form-group full-width">
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Add row(s) to define post names, vacancy numbers, and their specific qualification eligibility.
                    </p>
                    
                    {vacancies.map((vac, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'flex-start',
                          marginBottom: '0.75rem',
                          borderBottom: '1px solid var(--border-color)',
                          paddingBottom: '0.75rem'
                        }}
                      >
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Post Name (e.g. IAS officer)"
                            value={vac.postName}
                            onChange={(e) => handleVacancyChange(idx, 'postName', e.target.value)}
                          />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Total Posts (e.g. 1000)"
                            value={vac.totalPost}
                            onChange={(e) => handleVacancyChange(idx, 'totalPost', e.target.value)}
                          />
                        </div>
                        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <textarea
                            className="form-control"
                            style={{ minHeight: '38px', height: '38px' }}
                            placeholder="Eligibility Details (e.g. Degree in any stream)"
                            value={vac.eligibility}
                            onChange={(e) => handleVacancyChange(idx, 'eligibility', e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-action-sm delete"
                          style={{ marginTop: '3px' }}
                          onClick={() => handleRemoveVacancyRow(idx)}
                          disabled={vacancies.length === 1}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-outline"
                      style={{ width: 'fit-content', padding: '0.4rem 1rem' }}
                      onClick={handleAddVacancyRow}
                    >
                      <Plus size={14} />
                      <span>Add Post / Vacancy Row</span>
                    </button>
                  </div>

                  {/* Important Links */}
                  <span className="section-divider">Important Online Links</span>

                  <div className="form-group">
                    <label className="form-label">Apply Online Link</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={linkApply}
                      onChange={(e) => setLinkApply(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Download Official Notification URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={linkNotification}
                      onChange={(e) => setLinkNotification(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Official Authority Website</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={linkWebsite}
                      onChange={(e) => setLinkWebsite(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Syllabus PDF / Info URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={linkSyllabus}
                      onChange={(e) => setLinkSyllabus(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admit Card Link</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={linkAdmit}
                      onChange={(e) => setLinkAdmit(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Check Result Link</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={linkResult}
                      onChange={(e) => setLinkResult(e.target.value)}
                    />
                  </div>

                  <span className="section-divider">Post Settings</span>
                  
                  <div className="form-group">
                    <label className="form-label">Portal Status</label>
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'active' | 'expired')}
                    >
                      <option value="active">Active (Open for Application / Running)</option>
                      <option value="expired">Expired (Closed / Archive)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} />
                  <span>Save Post Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
