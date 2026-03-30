'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types/article';
import { Button } from '@/components/ui/Button';

interface ArticlesIndexClientProps {
  initialArticles: Article[];
}

const ITEMS_PER_PAGE = 12;

export default function ArticlesIndexClient({ 
  initialArticles, 
}: ArticlesIndexClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Derive unique tags from initialArticles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialArticles.forEach(article => {
      article.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialArticles]);

  // Local filtering logic
  const filteredArticles = useMemo(() => {
    return initialArticles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || article.tags?.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [initialArticles, searchQuery, selectedTag]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  // Local pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCoverImage = (article: Article) => {
    if (article.backgroundImage) return article.backgroundImage;
    if (!article.content) return '/architectural-concrete-monument.png';
    const match = article.content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : '/architectural-concrete-monument.png';
  };

  return (
    <div className="articles-index">
      <header className="articles-index__header">
        <div className="articles-index__header-content">
          <h1 className="articles-index__title">The Digital Anthology</h1>
          <p className="articles-index__subtitle">
            Explore {initialArticles.length} curated technical stories and digital narratives.
          </p>
          
          <div className="articles-index__controls">
            <div className="articles-index__search-wrapper">
              <i className="ph ph-magnifying-glass articles-index__search-icon" />
              <input 
                type="text"
                placeholder="Search stories..."
                className="articles-index__search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {allTags.length > 0 && (
              <div className="articles-index__tags">
                <button 
                  className={`articles-index__tag ${!selectedTag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    className={`articles-index__tag ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="articles-index__container">
        {paginatedArticles.length > 0 ? (
          <>
            <div className="articles-index__grid">
              {paginatedArticles.map((article) => (
                <Link 
                  href={`/articles/${article.slug}`} 
                  key={article.id}
                  className="articles-index__card"
                >
                  <div className="articles-index__card-image">
                    <Image 
                      src={getCoverImage(article)} 
                      alt={article.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="articles-index__card-content">
                    <div className="articles-index__card-meta">
                      <span>
                        {article.publishedAt 
                          ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Recent Story'
                        }
                      </span>
                    </div>
                    <h3 className="articles-index__card-title">{article.title}</h3>
                    <p className="articles-index__card-excerpt">
                      {article.description || "Read more about this curated story..."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="articles-index__pagination">
                <Button 
                  variant="secondary" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <div className="articles-index__page-info">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="secondary" 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="articles-index__empty">
            <i className="ph ph-detective" style={{ fontSize: '3rem', opacity: 0.2 }} />
            <h3>No matches found</h3>
            <p>We couldn&apos;t find any stories matching your current filters.</p>
            <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedTag(null); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      <footer className="articles-index__footer">
        <div className="articles-index__footer-content">
          <p>© {new Date().getFullYear()} NISCHAY SHARMA. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
