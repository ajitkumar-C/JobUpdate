import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, CheckSquare, BookOpen, Key, GraduationCap, Folder, ShieldCheck, FileSpreadsheet, AlertCircle } from 'lucide-react';
import type { JobPost, Category } from '../types';

interface CategoryGridProps {
  jobs: JobPost[];
  categories: Category[];
  onJobClick: (id: string) => void;
  onCategorySelect?: (id: string | null) => void;
  isSingleColumnView?: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  jobs, 
  categories, 
  onJobClick,
  onCategorySelect,
  isSingleColumnView = false
}) => {
  const [visibleCount, setVisibleCount] = useState(15);

  // Reset pagination count when category selection changes
  useEffect(() => {
    setVisibleCount(15);
  }, [categories]);
  // Map category names/ids to representative Lucide icons
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'latest jobs':
        return <Briefcase size={18} />;
      case 'admit card':
        return <Calendar size={18} />;
      case 'result':
        return <CheckSquare size={18} />;
      case 'syllabus':
        return <BookOpen size={18} />;
      case 'answer key':
        return <Key size={18} />;
      case 'admission':
        return <GraduationCap size={18} />;
      case 'certificate':
        return <ShieldCheck size={18} />;
      case 'outsourcing / offline jobs':
      case 'outsourcing/offline jobs':
        return <FileSpreadsheet size={18} />;
      case 'important':
        return <AlertCircle size={18} />;
      default:
        return <Folder size={18} />;
    }
  };

  // Map category names to CSS classes for specific header colors
  const getCategoryClass = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'latest jobs':
        return 'jobs-col';
      case 'admit card':
        return 'admit-col';
      case 'result':
        return 'result-col';
      case 'syllabus':
        return 'syllabus-col';
      case 'answer key':
        return 'answer-col';
      case 'admission':
        return 'admission-col';
      case 'certificate':
        return 'certificate-col';
      case 'outsourcing / offline jobs':
      case 'outsourcing/offline jobs':
        return 'offline-col';
      case 'important':
        return 'important-col';
      default:
        return 'custom-col';
    }
  };



  // Helper to determine if a job is new (posted within the last 7 days)
  const isNewPost = (postDate: string) => {
    const postTime = new Date(postDate).getTime();
    const currentTime = new Date().getTime();
    const diffDays = (currentTime - postTime) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className={`category-columns-grid ${categories.length === 1 ? 'single-column-view' : ''}`}>
      {categories.map((category) => {
        // Filter jobs by category
        const categoryJobs = jobs
          .filter((job) => job.category.toLowerCase() === category.name.toLowerCase())
          .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());

        // Slice jobs: 8 for grid layout, visibleCount (initially 15) for single view
        const displayedJobs = isSingleColumnView 
          ? categoryJobs.slice(0, visibleCount) 
          : categoryJobs.slice(0, 8);

        return (
          <div
            key={category.id}
            className={`category-column ${getCategoryClass(category.name)}`}
          >
            <div className="category-column-header">
              <span className="category-column-title">
                {getCategoryIcon(category.name)}
                {category.name}
              </span>
              <span className="category-column-count">{categoryJobs.length}</span>
            </div>

            <ul className="category-column-list">
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job) => (
                  <li key={job.id} className="category-column-item">
                    <div
                      className="category-column-item-link"
                      onClick={() => onJobClick(job.id)}
                    >
                      <span className="category-column-item-title">
                        {job.title}
                        {isNewPost(job.postDate) && (
                          <span className="badge-new" style={{ marginLeft: '0.4rem' }}>
                            New
                          </span>
                        )}
                      </span>
                      <div className="category-column-item-meta">
                        <span>Posted: {job.postDate}</span>
                        {job.status === 'expired' && (
                          <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Closed</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="empty-col-message">No active updates in this category.</div>
              )}
            </ul>

            {/* View More button at the bottom of the card, only in grid view */}
            {!isSingleColumnView && onCategorySelect && (
              <div 
                className="category-column-more"
                onClick={() => { onCategorySelect(category.id); window.scrollTo(0, 0); }}
              >
                View More...
              </div>
            )}

            {/* Load More button at the bottom of the column page, only in single column page view */}
            {isSingleColumnView && categoryJobs.length > visibleCount && (
              <div 
                className="category-column-more load-more-btn"
                onClick={() => setVisibleCount(prev => prev + 15)}
                style={{ background: 'var(--bg-primary)', fontWeight: 800 }}
              >
                Load More Posts (Showing {displayedJobs.length} of {categoryJobs.length}) ↓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
