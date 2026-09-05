import React from 'react';
import { Search, Sun, Moon, LayoutDashboard, UserCheck, Menu } from 'lucide-react';

interface HeaderProps {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onHomeClick: () => void;
  onLogoClick?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  showAdminButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isAdminMode,
  onToggleAdminMode,
  searchTerm,
  onSearchChange,
  onHomeClick,
  onLogoClick,
  theme,
  onToggleTheme,
  showAdminButton
}) => {
  return (
    <header className="header no-print">
      <div className="header-brand" onClick={onLogoClick || onHomeClick}>
        <div className="header-menu-toggle">
          <Menu size={20} />
        </div>
        <img src="/sarkariavedan_logo.jpg" alt="Sarkari Avedan Logo" className="header-logo" style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
        <div className="header-title-container">
          <h1 className="header-title" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, letterSpacing: '-0.5px' }}>SarkariAvedan<span style={{color: 'var(--primary-color)'}}>.info</span></h1>
          <span className="header-subtitle" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>India's Job Alerts</span>
        </div>
      </div>

      <div className="header-search">
        <Search className="header-search-icon" />
        <input
          type="text"
          placeholder="Search jobs, admit cards, results..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="header-controls">
        <button 
          className="btn-icon" 
          onClick={onToggleTheme} 
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {showAdminButton && (
          <button
            className={isAdminMode ? 'btn-primary' : 'btn-outline'}
            onClick={onToggleAdminMode}
            title={isAdminMode ? 'Go to User Portal' : 'Access Admin Dashboard'}
          >
            {isAdminMode ? (
              <>
                <UserCheck size={18} />
                <span>User Mode</span>
              </>
            ) : (
              <>
                <LayoutDashboard size={18} />
                <span>Admin Mode</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
