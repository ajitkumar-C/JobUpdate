import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { JobPost } from '../types';

interface BreakingTickerProps {
  jobs: JobPost[];
  onJobClick: (id: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ jobs, onJobClick }) => {
  // Filter for active jobs, sort by date (most recent first), limit to 6
  const tickerJobs = [...jobs]
    .filter(job => job.status === 'active')
    .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())
    .slice(0, 6);

  if (tickerJobs.length === 0) return null;

  // Duplicate items to ensure smooth scrolling coverage for wider screens
  const doubledJobs = [...tickerJobs, ...tickerJobs];

  return (
    <div className="ticker-container no-print">
      <div className="ticker-label">
        <AlertCircle size={16} />
        <span>What's New</span>
      </div>
      <div className="ticker-marquee">
        <div className="ticker-content">
          {doubledJobs.map((job, idx) => (
            <span
              key={`${job.id}-${idx}`}
              className="ticker-item"
              onClick={() => onJobClick(job.id)}
            >
              {job.title}
              <span className="ticker-badge">{job.category}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
