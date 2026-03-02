'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Menu from '@/components/Menu';
import { articlesService, Article } from '@/services/articles.service';

const ArticleSection = ({ article, index }: { article: Article, index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring physics for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Visual effects: Stacking & Parallax
  const yOffset = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(smoothProgress, [0, 1], [100, -100]);

  const getCoverImage = (article: Article) => {
    if (article.backgroundImage) return article.backgroundImage;
    const match = article.content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : '/architectural-concrete-monument.png';
  };

  return (
    <section 
      ref={ref} 
      className="articles-parallax__section"
      style={{ zIndex: index + 2 }}
    >
      <motion.div style={{ y: yOffset, scale }} className="articles-parallax__bg">
        <img src={getCoverImage(article)} alt={article.title} />
      </motion.div>
      
      <motion.div 
        style={{ opacity, y: textY }} 
        className="articles-parallax__content"
      >
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="articles-parallax__eyebrow"
        >
          Curated Editorial
        </motion.span>
        
        <motion.h2 
          className="articles-parallax__title"
        >
          {article.title}
          <span>Perspective Series</span>
        </motion.h2>
        
        <motion.p 
          className="articles-parallax__description"
        >
          {article.description || "An in-depth exploration into the intersection of technology and human intuition, brought to you by the TaughtCode editorial team."}
        </motion.p>
        
        <div className="articles-parallax__footer">
          <a href={`/articles/${article.slug}`} className="articles-parallax__link">
            Open Journal
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <span className="articles-parallax__read-time">Volume 0{index + 1} — 12 Min Read</span>
        </div>
      </motion.div>
    </section>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articlesService.getTopArticles(10);
        if (response.success) {
          setArticles(response.data);
        } else {
          // If fallback fails on server, show clear message
          setError("Initializing digital library...");
        }
      } catch (err: any) {
        console.error('Error fetching articles:', err);
        setError("Synchronization in progress...");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="landing-container">
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 999, 
              backgroundColor: '#000', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '2rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#fff', 
                borderRadius: '50%' 
              }}
            />
            <div style={{ color: '#fff', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5em', textTransform: 'uppercase' }}>
              Synchronizing Anthology
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="articles-parallax">
        {/* --- Modern Hero Section --- */}
        <section className="landing" style={{ zIndex: 1 }}>
          <div className="landing__bg" />
          <header className="landing__header">
            <div className="landing__brand">NISCHAY SHARMA</div>
            <div className="landing__logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="landing__menu-btn">
              Explore Menu
            </button>
          </header>
          
          <section className="landing__hero">
            <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="landing__title">
                Digital<br />
                <span>Anthology</span>
              </h1>
              <p style={{ color: 'rgba(0,0,0,0.4)', marginTop: '2rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Curated by Nischay Sharma
              </p>
            </motion.div>
          </section>
          
          <footer className="landing__footer">
            <div className="landing__scroll-text">
              Begin Journey
            </div>
          </footer>
        </section>

        {/* --- Parallax Articles --- */}
        {error ? (
          <div className="flex h-screen items-center justify-center bg-black p-10 text-center">
            <div className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">{error}</div>
          </div>
        ) : (
          articles.map((article, index) => (
            <ArticleSection key={article.id} article={article} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
