import React, { useEffect, useState } from 'react';

const SITE_ORIGIN = 'https://lobbyingandlaw.com';

const galleryImages = Array.from({ length: 15 }, (_, index) => {
  const number = index + 1;
  return {
    number: String(number).padStart(2, '0'),
    src: `/images/gallery/image_${number}.jpeg`,
    remoteSrc: `${SITE_ORIGIN}/images/gallery/image_${number}.jpeg`,
    alt: `Lobbying and The Law gallery image ${number}`,
  };
});

function LogoBrand({ href = '/', onClick }) {
  return (
    <a className="brand" href={href} onClick={onClick} aria-label="Lobbying and The Law home">
      <span className="brand-logo-wrap">
        <img className="brand-logo" src="/images/logo.png" alt="Lobbying and The Law logo" />
      </span>
      <span>
        <strong>LOBBYING THE LAW</strong>
        <em>Bangladesh Company Limited</em>
      </span>
    </a>
  );
}

function GalleryImage({ image, className = '', ...props }) {
  const [src, setSrc] = useState(image.src);
  return (
    <img
      className={className}
      src={src}
      alt={image.alt}
      onError={() => {
        if (src !== image.remoteSrc) setSrc(image.remoteSrc);
      }}
      {...props}
    />
  );
}

function Gallery() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { items.forEach((el) => el.classList.add('is-visible')); return undefined; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach((el) => observer.observe(el));
    const onScroll = () => {
      const y = window.scrollY || 0;
      document.querySelector('.topbar')?.classList.toggle('scrolled', y > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    document.title = 'Gallery | Lobbying and The Law';
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') setActiveIndex((value) => (value + 1) % galleryImages.length);
      if (event.key === 'ArrowLeft') setActiveIndex((value) => (value - 1 + galleryImages.length) % galleryImages.length);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  const closeMenu = () => { setMenuOpen(false); setServicesOpen(false); };

  return (
    <div className="site-shell gallery-shell">
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <LogoBrand onClick={closeMenu} />

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="gallery-main-nav"
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="gallery-main-nav" className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <a href="/#home" onClick={closeMenu}>Home</a>
          <a href="/about" onClick={closeMenu}>About</a>
          <div className={`nav-dropdown ${servicesOpen ? 'open' : ''}`}>
            <button className="nav-drop-trigger" type="button" onClick={() => setServicesOpen((v) => !v)} aria-expanded={servicesOpen}>Services <span className="dropdown-caret">⌄</span></button>
            <div className="nav-dropdown-menu">
              <a href="/llca" onClick={closeMenu}><span>01</span>LLCA</a>
              <a href="/ll-cure" onClick={closeMenu}><span>02</span>LL-CURE</a>
              <a href="/lobbying" onClick={closeMenu}><span>03</span>Lobbying</a>
            </div>
          </div>
          <a href="/#team" onClick={closeMenu}>Team</a>
          <a className="nav-active" href="/gallery" onClick={closeMenu}>Gallery</a>
          <a href="/#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-cta" href="/#contact" onClick={closeMenu}>Get in touch <span>↗</span></a>
        </nav>
      </header>

      <main>
        <section className="gallery-hero section-pad" data-reveal="up">
          <div className="section-kicker">06 / GALLERY</div>
          <div className="gallery-hero-grid">
            <div>
              <h1>Moments from<br /><span>the work.</span></h1>
            </div>
            <div>
              <p>Selected moments from Lobbying and The Law — meetings, field visits, professional gatherings and the people behind the work.</p>
              <div className="gallery-count"><strong>{galleryImages.length}</strong><span>published gallery images</span></div>
            </div>
          </div>
        </section>

        <section className="gallery-section section-pad" aria-label="Gallery images" data-reveal="up">
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <button
                className={`gallery-card gallery-card-${index + 1}`} data-reveal="scale"
                type="button"
                key={image.src}
                onClick={() => setActiveIndex(index)}
                aria-label={`Open gallery image ${image.number}`}
              >
                <span className="gallery-card-media">
                  <GalleryImage image={image} loading={index < 4 ? 'eager' : 'lazy'} />
                  <span className="gallery-card-shade" />
                  <span className="gallery-card-meta"><span>{image.number}</span><span>OPEN ↗</span></span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer id="top" className="footer">
        <LogoBrand href="/" />
        <div className="footer-note">© {new Date().getFullYear()} Lobbying and The Law (Bangladesh) Company Limited</div>
        <div className="footer-links"><a href="#top">Top ↑</a><a href="/">Home</a><a href={SITE_ORIGIN} target="_blank" rel="noreferrer">Live site ↗</a></div>
      </footer>

      {activeIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Gallery image ${galleryImages[activeIndex].number}`} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveIndex(null);
        }}>
          <button className="lightbox-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close image">×</button>
          <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => setActiveIndex((value) => (value - 1 + galleryImages.length) % galleryImages.length)} aria-label="Previous image">←</button>
          <figure className="lightbox-figure">
            <GalleryImage image={galleryImages[activeIndex]} />
            <figcaption><span>{galleryImages[activeIndex].number} / {galleryImages.length}</span><span>Lobbying and The Law</span></figcaption>
          </figure>
          <button className="lightbox-arrow lightbox-next" type="button" onClick={() => setActiveIndex((value) => (value + 1) % galleryImages.length)} aria-label="Next image">→</button>
        </div>
      )}
    </div>
  );
}

export default Gallery;
