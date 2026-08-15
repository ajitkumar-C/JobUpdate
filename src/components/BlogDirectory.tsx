import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';

export interface BlogPostMeta {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: 'Defense' | 'Exams' | 'Career Guide';
  author: string;
  publishedDate: string;
  readTime: string;
  keywords: string[];
}

interface BlogDirectoryProps {
  onSelectPost: (id: string) => void;
}

export const BlogDirectory: React.FC<BlogDirectoryProps> = ({ onSelectPost }) => {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'Defense' | 'Exams' | 'Career Guide'>('all');

  const categories: ('all' | 'Defense' | 'Exams' | 'Career Guide')[] = ['all', 'Defense', 'Exams', 'Career Guide'];

  useEffect(() => {
    setLoading(true);
    fetch('/blog/posts-index.json')
      .then(res => res.json())
      .then((data: BlogPostMeta[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(post => {
    const matchCat = activeCategory === 'all' || post.category === activeCategory;
    const matchSearch = !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="blog-dir-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="blog-hero-inner">
          <span className="blog-badge">✍️ Sarkari Aavedan Blog</span>
          <h1 className="blog-title">Career Guides & Exam Strategies</h1>
          <p className="blog-desc">
            Deep dive articles compiled by our expert team. Find detailed entry paths for Indian Defense (Army, Navy, Air Force),
            syllabus updates, competitive exam roadmaps, and preparation techniques.
          </p>

          {/* Search bar */}
          <div className="blog-search-bar">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search guides, exams, or keywords..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="blog-search-input"
            />
          </div>
        </div>
      </div>

      <div className="blog-body">
        {/* Category Filters */}
        <div className="blog-category-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`blog-chip ${activeCategory === cat ? 'blog-chip-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="state-loading" style={{ padding: '4rem 0' }}>
            <div className="state-loading-spinner" style={{ borderTopColor: '#1565C0' }} />
            <p>Loading career guides...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="blog-empty">
            No articles match your search criteria. Try using different keywords.
          </div>
        ) : (
          <div className="blog-grid">
            {filtered.map(post => (
              <article
                key={post.id}
                className="blog-card"
                onClick={() => onSelectPost(post.id)}
              >
                {post.image && (
                  <div className="blog-card-image-wrapper">
                    <img src={post.image} alt={post.title} className="blog-card-image" />
                  </div>
                )}
                
                <div className="blog-card-content-box">
                  <div className="blog-card-header">
                    <span className={`blog-card-badge blog-badge-${post.category.toLowerCase().replace(' ', '-')}`}>
                      {post.category}
                    </span>
                    <span className="blog-card-readtime">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-summary">{post.summary}</p>

                  <div className="blog-card-meta">
                    <span>
                      <Calendar size={12} /> {post.publishedDate}
                    </span>
                    <span>
                      <User size={12} /> By {post.author.split(' ')[0]}
                    </span>
                  </div>

                  <div className="blog-card-footer">
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDirectory;
