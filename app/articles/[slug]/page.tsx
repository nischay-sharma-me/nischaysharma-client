import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { articlesService, Article } from '@/services/articles.service';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicArticleView({ params }: PageProps) {
  const { slug } = await params;
  let article: Article | null = null;
  let error = '';

  try {
    const response = await articlesService.getArticleBySlug(slug);
    if (response.success) {
      article = response.data;
    } else {
      error = 'Article not found';
    }
  } catch (err: any) {
    console.error('Error fetching article:', err);
    error = err.message || 'Failed to load article';
  }

  if (error || !article) {
    return (
      <div className="article-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', height: '100vh' }}>
        <h2 className="article-view__title" style={{ color: '#000' }}>{error || 'Article not found'}</h2>
        <Link href="/" className="article-view__back-btn">
          Back to Stories
        </Link>
      </div>
    );
  }

  const getCoverImage = () => {
    if (article?.backgroundImage) return article.backgroundImage;
    const match = article?.content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : '/architectural-concrete-monument.png';
  };

  return (
    <div className="article-view">
      <header className="article-view__hero">
        <Image 
          src={getCoverImage()} 
          alt={article.title} 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="article-view__hero-content">
          <h1 className="article-view__title">{article.title}</h1>
          <div className="article-view__meta">
            <span>By Nischay Sharma</span>
            <span className="dot" />
            <span>{new Date(article.publishedAt || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <main className="article-view__main">
        {article.description && (
          <p className="article-view__description">{article.description}</p>
        )}
        
        <div 
          className="article-view__content" 
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />

        <footer className="article-view__footer">
          <Link href="/" className="article-view__back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Explore More Stories
          </Link>
        </footer>
      </main>
    </div>
  );
}
