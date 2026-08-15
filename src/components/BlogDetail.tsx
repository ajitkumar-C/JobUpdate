import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { updateSEO } from '../utils/seo';

interface BlogPostFull {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: 'Defense' | 'Exams' | 'Career Guide';
  author: string;
  publishedDate: string;
  readTime: string;
  keywords: string[];
  content: string;
}

interface BlogDetailProps {
  postId: string;
  onBack: () => void;
}

// Simple Custom Markdown-to-HTML parser for secure, dependency-free rendering
const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let tableHeader: React.ReactNode[] = [];
  let tableRows: React.ReactNode[][] = [];
  let inList = false;
  let inTable = false;
  let keyCounter = 0;

  const parseInlineMarkdown = (line: string, isTableCell = false): React.ReactNode => {
    // If it's a table cell and is purely a link: [Text](URL)
    const pureLinkMatch = /^\[(.*?)\]\((.*?)\)$/.exec(line.trim());
    if (pureLinkMatch && isTableCell) {
      const text = pureLinkMatch[1];
      const url = pureLinkMatch[2];
      let btnClass = 'blog-table-btn';
      const cleanText = text.toLowerCase();
      if (cleanText.includes('official website') || cleanText.includes('official site')) {
        btnClass += ' btn-blue';
      } else if (cleanText.includes('notification')) {
        btnClass += ' btn-orange';
      } else if (cleanText.includes('apply')) {
        btnClass += ' btn-green';
      } else if (cleanText.includes('admit')) {
        btnClass += ' btn-purple';
      } else if (cleanText.includes('result')) {
        btnClass += ' btn-red';
      } else {
        btnClass += ' btn-default';
      }
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={btnClass}
        >
          {text}
        </a>
      );
    }

    // Normal regex split to parse bold and links
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = line.split(regex);
    if (parts.length === 1 && !line.includes('**') && !line.includes('](')) {
      return line;
    }
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('[') && part.includes('](')) {
            const linkMatch = /^\[(.*?)\]\((.*?)\)$/.exec(part);
            if (linkMatch) {
              return (
                <a 
                  key={index} 
                  href={linkMatch[2]} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={isTableCell ? 'blog-table-btn btn-default' : 'blog-inline-link'}
                >
                  {linkMatch[1]}
                </a>
              );
            }
          }
          return part;
        })}
      </>
    );
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${keyCounter++}`} className="blog-content-list">{[...listItems]}</ul>);
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={`table-wrapper-${keyCounter++}`} className="blog-content-table-wrapper">
          <table className="blog-content-table">
            {tableHeader.length > 0 && <thead><tr>{tableHeader}</tr></thead>}
            {tableRows.length > 0 && (
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={`tr-${rIdx}`}>{row.map((cell, cIdx) => <td key={`td-${cIdx}`}>{cell}</td>)}</tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 1. Table handling
    if (line.startsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.split('|').slice(1, -1).map(c => parseInlineMarkdown(c.trim(), true));
      
      // Skip separator row: |---|---|
      if (line.includes('---')) {
        continue;
      }
      
      if (tableHeader.length === 0 && !lines[i - 1]?.trim().startsWith('|')) {
        tableHeader = cells.map((cell, idx) => <th key={`th-${idx}`}>{cell}</th>);
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      if (inTable) flushTable();
    }

    // 2. Horizontal Rule
    if (line === '---') {
      flushList();
      elements.push(<hr key={`hr-${keyCounter++}`} className="blog-content-hr" />);
      continue;
    }

    // 3. Headers
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={`h2-${keyCounter++}`} className="blog-content-h2">{parseInlineMarkdown(line.substring(3))}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={`h3-${keyCounter++}`} className="blog-content-h3">{parseInlineMarkdown(line.substring(4))}</h3>);
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      elements.push(<h4 key={`h4-${keyCounter++}`} className="blog-content-h4">{parseInlineMarkdown(line.substring(5))}</h4>);
      continue;
    }

    // 4. Bullet lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      listItems.push(<li key={`li-${keyCounter++}`}>{parseInlineMarkdown(line.substring(2))}</li>);
      continue;
    }

    // Empty line triggers flushing of lists/paragraphs
    if (line === '') {
      flushList();
      continue;
    }

    // 5. Paragraphs fallback
    if (!inList && !inTable) {
      elements.push(<p key={`p-${keyCounter++}`} className="blog-content-p">{parseInlineMarkdown(line)}</p>);
    }
  }

  flushList();
  flushTable();
  return elements;
};

export const BlogDetail: React.FC<BlogDetailProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    // Load full post
    fetch(`/blog/${postId}.json`)
      .then(res => res.json())
      .then((data: BlogPostFull) => {
        setPost(data);
        setLoading(false);
        updateSEO(null, null, 'blog-view', data);
      })
      .catch(() => setLoading(false));

    // Load related (fetch posts index to show recommendations)
    fetch('/blog/posts-index.json')
      .then(res => res.json())
      .then((data: any[]) => {
        setRelated(data.filter(p => p.id !== postId).slice(0, 3));
      })
      .catch(() => {});
  }, [postId]);

  if (loading) {
    return (
      <div className="blog-detail-page">
        <button onClick={onBack} className="blog-back-btn no-print">
          <ArrowLeft size={16} /> Back to Guides
        </button>
        <div className="state-loading" style={{ padding: '6rem 0' }}>
          <div className="state-loading-spinner" style={{ borderTopColor: '#1565C0' }} />
          <p>Loading article details...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Article not found. <button onClick={onBack} className="btn-link">Back to Blog</button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Back button */}
      <button onClick={onBack} className="blog-back-btn no-print">
        <ArrowLeft size={16} /> Back to Guides
      </button>

      <div className="blog-detail-container">
        {/* Main Content Column */}
        <main className="blog-detail-main">
          {/* Article Category & Time info */}
          <div className="blog-detail-header-meta">
            <span className={`blog-card-badge blog-badge-${post.category.toLowerCase().replace(' ', '-')}`}>
              {post.category}
            </span>
            <span className="blog-detail-readtime">
              <Clock size={13} /> {post.readTime}
            </span>
          </div>

          <h1 className="blog-detail-title">{post.title}</h1>

          {/* Author/Date Info row */}
          <div className="blog-detail-author-row">
            <div className="blog-author-avatar">✍️</div>
            <div className="blog-author-info">
              <span className="blog-author-name">{post.author}</span>
              <span className="blog-author-date">
                <Calendar size={11} /> Published on {post.publishedDate}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="blog-detail-featured-image-wrapper">
              <img src={post.image} alt={post.title} className="blog-detail-featured-image" />
            </div>
          )}

          {/* Divider */}
          <div className="blog-detail-divider" />

          {/* Parsed Body Content */}
          <div className="blog-detail-body-content">
            {renderMarkdown(post.content)}
          </div>

          {/* Keywords tags footer */}
          <div className="blog-detail-tags">
            <Tag size={13} />
            {post.keywords.map((word, index) => (
              <span key={index} className="blog-tag-chip">#{word}</span>
            ))}
          </div>
        </main>

        {/* Sidebar Column */}
        <aside className="blog-detail-sidebar no-print">
          <div className="blog-sidebar-card">
            <h3>📢 Editorial Info</h3>
            <p>
              This guide is verified by the Sarkari Aavedan team against official service websites (UPSC, Join Indian Army, Navy, Air Force)
              and latest bulletins. Keep visiting for regular updates.
            </p>
          </div>

          <div className="blog-sidebar-card">
            <h3>🔗 Recommended Guides</h3>
            <div className="blog-sidebar-related-list">
              {related.map(rel => (
                <div key={rel.id} className="blog-sidebar-related-item">
                  <span className="blog-related-cat">{rel.category}</span>
                  <a
                    href={`/blog/${rel.id}`}
                    onClick={(e) => { 
                      e.preventDefault(); 
                      // Dispatch simple event for routing click
                      const clickEvent = new CustomEvent('select-blog', { detail: rel.id });
                      window.dispatchEvent(clickEvent);
                      window.scrollTo(0, 0); 
                    }}
                  >
                    {rel.title}
                  </a>
                  <span className="blog-related-date">{rel.publishedDate}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
