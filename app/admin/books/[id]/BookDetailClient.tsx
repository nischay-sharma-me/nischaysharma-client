'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Book, Page, booksService } from '@/services/books.service';
import { Button } from '@/components/ui/Button';
import AdminLoading from '@/app/admin/loading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BookDetailClientProps {
  bookId: string;
}

export default function BookDetailClient({ bookId }: BookDetailClientProps) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'preview' | 'edit'>('preview');

  useEffect(() => {
    fetchBookData();
  }, [bookId]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const [bookRes, pagesRes] = await Promise.all([
        booksService.getBook(bookId, token),
        booksService.getBookPages(bookId, token)
      ]);

      if (bookRes.success) setBook(bookRes.data);
      if (pagesRes.success) setPages(pagesRes.data);
    } catch (err) {
      console.error('Error fetching book details:', err);
      alert('Failed to load book data');
      router.push('/admin/books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLoading />;
  if (!book) return <div style={{ padding: '4rem', textAlign: 'center' }}>Book not found</div>;

  return (
    <div className="book-detail">
      <header className="dashboard__header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg-primary)', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <button 
            onClick={() => router.push('/admin/books')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <i className="ph ph-arrow-left" style={{ fontSize: '1.25rem' }} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{book.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button 
              variant={activeView === 'preview' ? 'primary' : 'secondary'} 
              onClick={() => setActiveView('preview')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
            >
              Preview
            </Button>
            <Button 
              variant={activeView === 'edit' ? 'primary' : 'secondary'} 
              onClick={() => alert('Editor coming soon!')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
            >
              Edit Manuscript
            </Button>
          </div>
        </div>
      </header>

      <div className="book-preview" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Book Header */}
        <section className="book-preview__cover" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          {book.coverImage && (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              style={{ width: '100%', maxWidth: '400px', borderRadius: '0.5rem', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            />
          )}
          <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.3em', opacity: 0.4, marginBottom: '1rem' }}>
            {book.type === 'book' ? 'Threaded Collection' : 'Technical Paper'}
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            {book.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#737373', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {book.description}
          </p>
        </section>

        {/* Table of Contents (Simplified) */}
        <section className="book-preview__toc" style={{ marginBottom: '6rem', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
           <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Contents</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {book.chapters?.map((chapter, idx) => (
               <div key={chapter.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <span style={{ opacity: 0.3, fontVariantNumeric: 'tabular-nums' }}>{String(idx + 1).padStart(2, '0')}</span>
                   <span style={{ fontWeight: 600 }}>{chapter.title}</span>
                 </div>
                 <div style={{ borderBottom: '1px dotted #ccc', flex: 1, margin: '0 1rem' }}></div>
                 <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>PAGE {idx + 1}</span>
               </div>
             ))}
           </div>
        </section>

        {/* Chapters and Pages */}
        <div className="book-preview__content">
          {book.chapters?.map((chapter, cIdx) => {
            const chapterPages = pages.filter(p => p.chapterId === chapter.id);
            
            return (
              <section key={chapter.id} style={{ marginBottom: '8rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                     Chapter {cIdx + 1}
                   </span>
                   <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>
                     {chapter.title}
                   </h2>
                </div>

                <div className="prose">
                  {chapterPages.length > 0 ? (
                    chapterPages.map((page) => (
                      <div key={page.id} style={{ marginBottom: '2rem' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {page.content}
                        </ReactMarkdown>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', background: '#fafafa', borderRadius: '0.5rem', border: '1px dashed #eee', textAlign: 'center', color: '#a3a3a3', fontSize: '0.875rem' }}>
                      No content generated for this chapter yet.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .prose h1 { font-size: 2rem; margin-bottom: 1.5rem; font-weight: 800; }
        .prose h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; }
        .prose p { margin-bottom: 1.25rem; line-height: 1.8; color: #333; font-size: 1.05rem; }
        .prose ul, .prose ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; line-height: 1.6; }
        .prose code { background: #f4f4f4; padding: 0.2rem 0.4rem; borderRadius: 4px; font-size: 0.9em; }
        .prose pre { background: #111; color: #fff; padding: 1.5rem; borderRadius: 0.5rem; overflow-x: auto; margin: 2rem 0; }
        .prose img { max-width: 100%; borderRadius: 0.5rem; margin: 2rem 0; }
        .prose blockquote { border-left: 4px solid #eee; padding-left: 1.5rem; font-style: italic; color: #666; margin: 2rem 0; }
      `}</style>
    </div>
  );
}
