'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const newsItems = [
  { id: 1, headline: 'The Future of Web Development', summary: 'Exploring new paradigms in React and Next.js for 2026.', href: '/' },
  { id: 2, headline: 'Mastering Framer Motion', summary: 'How to create buttery smooth animations that feel native.', href: '/about' },
  { id: 3, headline: 'System Architecture 101', summary: 'Building scalable and resilient systems from scratch.', href: '/docs' },
  { id: 4, headline: 'The Art of UI/UX', summary: 'Why design matters more than ever in backend heavy applications.', href: '/#skills' },
  { id: 5, headline: 'Engineering Leadership', summary: 'Lessons learned from leading high performance teams.', href: '/#blogs' },
  { id: 6, headline: 'Database Deep Dive', summary: 'Understanding NoSQL vs SQL trade-offs in modern apps.', href: '/#contact' },
  { id: 7, headline: 'Open Source Journey', summary: 'How contributing to open source accelerates your career.', href: '/' },
  { id: 8, headline: 'Beyond the Code', summary: 'The soft skills every senior developer needs to succeed.', href: '/about' },
];

export default function Menu({ isOpen, onClose }: MenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="menu"
        >
          <div className="menu__container">
            <header className="menu__header">
              <h1 className="menu__title">The Daily Digital</h1>
              <div className="menu__meta">
                <span>Vol. I — No. 001</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>Price: Free</span>
              </div>
            </header>

            <nav className="menu__articles">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="menu__article"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="menu__article-link"
                  >
                    <div className="menu__article-image">
                      <span className="menu__article-placeholder">Image {item.id}</span>
                    </div>
                    <div className="menu__article-body">
                      <h2 className="menu__article-headline">{item.headline}</h2>
                      <p className="menu__article-summary">{item.summary}</p>
                      <span className="menu__article-more">Read More &rarr;</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="menu__footer">
            <div className="menu__socials">
              {['Instagram', 'LinkedIn', 'Twitter'].map((social) => (
                <a key={social} href="#" className="menu__social-link">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}