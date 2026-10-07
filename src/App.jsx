import React, { useEffect, useState } from 'react';
import Gallery from './Gallery';

const SITE_ORIGIN = 'https://lobbyingandlaw.com';
const WHATSAPP = '8809699800155';
const EMAIL = 'info@lobbyingandlaw.com';
const PHONE = '+880 9699 800 155';

function useSiteMotion() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      revealItems.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealItems.forEach((el) => observer.observe(el));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        document.documentElement.style.setProperty('--scroll-y', `${y}px`);
        document.querySelector('.topbar')?.classList.toggle('scrolled', y > 24);
        document.querySelector('.hero-visual')?.style.setProperty('--hero-parallax', `${Math.min(y * 0.07, 48)}px`);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const target = parseInt(String(value).replace(/\D/g, ''), 10);
    if (!Number.isFinite(target)) { setDisplay(String(value)); return undefined; }
    let frame = 0;
    let start;
    const duration = 1100;
    const tick = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display}{suffix}</>;
}

function LogoBrand({ href = '/', onClick }) {
  return (
    <a className="brand" href={href} onClick={onClick} aria-label="Lobbying and The Law home">
      <span className="brand-logo-wrap">
        <img className="brand-logo" src="/images/logo.png" alt="Lobbying and The Law logo" />
      </span>
      <span>
        <strong>LOBBYING &amp; THE LAW</strong>
        <em>Bangladesh Company Limited</em>
      </span>
    </a>
  );
}

function SiteHeader({ active = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeMenu = () => { setMenuOpen(false); setServicesOpen(false); };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="topbar">
      <LogoBrand onClick={closeMenu} />
      <button className="menu-button" type="button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-controls="main-nav" aria-label="Toggle navigation">
        <span /><span /><span />
      </button>
      <nav id="main-nav" className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        <a className={active === 'home' ? 'nav-active' : ''} href="/#home" onClick={closeMenu}>Home</a>
        <a className={active === 'about' ? 'nav-active' : ''} href="/about" onClick={closeMenu}>About</a>
        <div className={`nav-dropdown ${servicesOpen ? 'open' : ''}`}>
          <button className={active === 'services' ? 'nav-drop-trigger nav-active' : 'nav-drop-trigger'} type="button" onClick={() => setServicesOpen((v) => !v)} aria-expanded={servicesOpen}>
            Services <span className="dropdown-caret">⌄</span>
          </button>
          <div className="nav-dropdown-menu">
            <a href="/llca" onClick={closeMenu}><span>01</span>LLCA</a>
            <a href="/ll-cure" onClick={closeMenu}><span>02</span>LL-CURE</a>
            <a href="/lobbying" onClick={closeMenu}><span>03</span>Lobbying</a>
          </div>
        </div>
        <a href="/#team" onClick={closeMenu}>Team</a>
        <a className={active === 'gallery' ? 'nav-active' : ''} href="/gallery" onClick={closeMenu}>Gallery</a>
        <a href="/#contact" onClick={closeMenu}>Contact</a>
        <a className="nav-cta" href="/#contact" onClick={closeMenu}>Get in touch <span>↗</span></a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <LogoBrand href="/" />
      <div className="footer-note">© {new Date().getFullYear()} Lobbying and The Law (Bangladesh) Company Limited</div>
      <div className="footer-links"><a href="/#home">Top ↑</a><a href="/about">About</a><a href={SITE_ORIGIN} target="_blank" rel="noreferrer">Live site ↗</a></div>
    </footer>
  );
}

function PageShell({ active, children, className = '' }) {
  useSiteMotion();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className={`site-shell ${className}`}>
      <div className="grain" aria-hidden="true" />
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
      <a className="floating-contact" href="/#contact" aria-label="Jump to contact">CONTACT <span>↗</span></a>
    </div>
  );
}

const homeServices = [
  ['01', 'Legal & Court Lobbying', 'Strategic representation before courts, regulators and public institutions with a disciplined legal foundation.'],
  ['02', 'Government Relations', 'Policy engagement, regulatory navigation and stakeholder coordination for complex business matters.'],
  ['03', 'Tax & Procurement Support', 'Advisory around tax, auctions, procurement and bid-related matters in regulated environments.'],
  ['04', 'Finance & Loan Facilitation', 'Support for banking channels, capital access, loan structuring and financial issue resolution.'],
  ['05', 'Investment Facilitation', 'End-to-end support for FDI and local investment projects, approvals and strategic government touchpoints.'],
  ['06', 'International Dispute Support', 'Strategic dispute support involving cross-border buyers, sellers and commercial counterparties.'],
];

const team = [
  ['BRIT Robin', 'Chairman', 'brit-robin.jpg'],
  ['Brigadier General S M Shamsul Salekin', 'Managing Director', 'brigadier-shamsul-salekin.jpg'],
  ['Md Rashed Ali', 'Director – Media and Communications', 'md-rashed-ali.jpg'],
  ['Md. Harun-Or-Rashid', 'Director – Government Affairs & Lobbying', 'md-harun-or-rashid.jpg'],
  ['Ramis Maliyat Sreonty', 'Director – Legal Technology & Research', 'ramis-maliyat-sreonty.jpg'],
  ['MD Fariduzzaman', 'Company Secretary', 'md-fariduzzaman.jpg'],
  ['Senior Advocate Alhaj Shah Md. Khasruzzaman', 'Adviser – International Arbitration & Litigation', 'shah-md-khasruzzaman.jpg'],
  ['A B M Ziauddin', 'Adviser – Government Affairs & Lobbying', 'abm-ziauddin.jpg'],
  ['Md. Ruhul Amin Khondker', 'Adviser – Judicial & Contractual Affairs', 'md-ruhul-amin-khondker.jpg'],
  ['Md. Abdur Rob Howlader', 'Adviser – Judicial Affairs', 'md-abdur-rob-howlader.jpg'],
  ['Dr. Md. Abdur Rahman', 'Adviser – Financial Remediation & Asset Recovery', 'dr-md-abdur-rahman.jpg'],
  ['Senior Advocate Mohammad Ali Azam', 'Adviser – Corporate & Regulatory Affairs', 'mohammad-ali-azam.jpg'],
  ['Mohammad Fakruddin Ahmed', 'Counsel – Government Affairs & Lobbying', 'mohammad-fakruddin-ahmed.jpg'],
  ['Mir Fakruddin', 'Counsel – Financial Remediation & Asset Recovery', 'mir-fakruddin.jpg'],
  ['Advocate Nahid Farzana Mukti', 'Counsel – Litigation & Dispute Resolution', 'nahid-farzana-mukti.jpg'],
  ['Advocate Ali Ahsan Mullah', 'Counsel – Corporate & Regulatory Affairs', 'ali-ahsan-mullah.jpg'],
  ['Barrister Wakid B Azad', 'Chief Communication Officer', 'wakid-b-azad.jpg'],
  ['Abdullah Kamal', 'Personal Officer to The Chairman', 'abdullah-kamal.jpg'],
  ['Nusrat Sharmin Mouri', 'Head of Human Resources & Administration', 'nusrat-sharmin-mouri.jpg'],
  ['Saydujjaman Shamim', 'Head of IT', 'saydujjaman-shamim.jpg'],
  ['Md. Masudur Rahman', 'Executive – Litigation Support & Legal Documentation', 'md-masudur-rahman.jpg'],
  ['Advocate Kamal Hossain Miah', 'Executive – Legal Documentation & Compliance', 'kamal-hossain-miah.jpg'],
  ['Tarun Kumar Biswas', 'Foreign Trade Operations Officer', 'tarun-kumar-biswas.jpg'],
  ['Ahammed Hossain Babu', 'Media Coordinator', 'ahammed-hossain-babu.jpg'],
  ['Mamonoor Rashid', 'Accounts Manager', 'mamonoor-rashid.jpg'],
  ['Amlan Ahmed Shampad', 'Business Development Officer', 'amlan-ahmed-shampad.jpg'],
  ['Md. Sulaiman', 'Executive, Case Management', 'md-sulaiman.jpg'],
  ['Jahidul Hoque Talukder', 'Executive – Legal Research & Drafting Support', 'jahidul-hoque-talukder.jpg'],
  ['Nur A Jannat', 'Executive – HR & Administration', 'nur-a-jannat.jpg'],
  ['Md Asaduzzaman', 'Senior Software Engineer', 'md-asaduzzaman.jpg'],
  ['Mohammad Rifat Hossain', 'Procurement Specialist – Tender & Compliance', 'mohammad-rifat-hossain.jpg'],
  ['Abdul Awal Elamdi', 'Research Associate', 'abdul-awal-elamdi.jpg'],
  ['Tasmim Jahan Neeha', 'Research Associate', 'tasmim-jahan-neeha.jpg'],
  ['S.M. Jamil Boktiar', 'Junior Full-Stack Developer', 'sm-jamil-boktiar.jpg'],
];

const officeLocations = [
  ['Bangladesh', '39 West Tejturi Bazar, Farmgate, Dhaka-1215'],
  ['UK', '27 South Rise Way, London SE 18 7PG'],
  ['USA', '82-11, 37th Ave, Heritage Tower, Jackson Heights, NYC'],
];

function TeamImage({ filename, name, index }) {
  const [src, setSrc] = useState(`/images/team/${filename}`);
  return <img src={src} alt={name} loading={index > 7 ? 'lazy' : 'eager'} onError={() => setSrc(`${SITE_ORIGIN}/images/team/${filename}`)} />;
}

function HomePage() {
  const [sent, setSent] = useState(false);
  useEffect(() => { document.title = 'Lobbying and The Law | Influence with Integrity'; }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Website enquiry from ${form.get('name') || 'a website visitor'}`);
    const body = encodeURIComponent(`Name: ${form.get('name') || ''}\nEmail: ${form.get('email') || ''}\nPhone: ${form.get('phone') || ''}\n\n${form.get('message') || ''}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <PageShell active="home">
      <section id="home" className="hero section-pad">
        <div className="hero-copy" data-reveal="left">
          <div className="eyebrow"><span /> PUBLIC AFFAIRS • LEGAL ADVISORY • BANGLADESH</div>
          <h1>Influence with <span>Integrity,</span><br />Reform with <span>Purpose.</span></h1>
          <p>Lobbying and The Law combines legal mastery, strategic advocacy, government relations and research to help clients navigate consequential matters with clarity and confidence.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#contact">Start a conversation <span>↗</span></a>
            <a className="text-link" href="/about">Discover the company <span>→</span></a>
          </div>
          <div className="hero-statline">
            <div><strong><AnimatedCounter value="2001" /></strong><span>Established</span></div>
            <div><strong>20+</strong><span>Years of experience</span></div>
            <div><strong>360°</strong><span>Integrated support</span></div>
          </div>
        </div>
        <div className="hero-visual" data-reveal="scale">
          <div className="image-frame">
            <img src="/images/hero-banner.jpeg" alt="Government and legal architecture" />
            <div className="hero-fallback" aria-hidden="true"><span>PUBLIC AFFAIRS</span><strong>LAW • POLICY • GOVERNMENT</strong></div>
            <div className="image-caption"><span>01</span><span>Strategic advocacy rooted in law</span></div>
          </div>
          <div className="seal">L&amp;L<br /><small>EST. 2001</small></div>
        </div>
      </section>

      <section className="intro section-pad split-section" data-reveal="up">
        <div className="section-kicker">01 / COMPANY AT A GLANCE</div>
        <div>
          <p className="lead-quote">“A structured, legitimate framework for influence — built around professionalism, lawful advocacy, and national interest.”</p>
          <div className="two-col-copy">
            <p>Lobbying and The Law is the pioneering lobbying and law limited company in Bangladesh. Established in 2001 and incorporated as a limited company in 2009 under the Companies Act 1994 (RJSC), we have spent over two decades redefining the landscape of legal services and strategic advocacy in the country.</p>
            <p>We have successfully managed thousands of matters across the Judge Court, High Court, and Appellate Division, while building trusted working relationships across business, government, finance, media and professional communities.</p>
          </div>
          <a className="text-link inline-link" href="/about">Read the full About Us page <span>↗</span></a>
        </div>
      </section>

      <section id="services" className="services section-pad" data-reveal="up">
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">02 / SERVICES</div>
            <h2>Three focused programs.<br /><span>One strategic platform.</span></h2>
          </div>
          <p>Our flagship initiatives connect ADR, business turnaround research and government-facing lobbying with legal strategy and commercial insight.</p>
        </div>
        <div className="service-grid featured-service-grid">
          <a className="service-card service-card-featured" href="/llca" data-reveal="up">
            <div className="service-number">01</div><div className="service-body"><span className="service-label">FLAGSHIP PROGRAM</span><h3>LLCA</h3><p>Lobbying and the Law Center for ADR — a specialized Alternative Dispute Resolution platform with five dedicated panels.</p><div className="tag-row"><span>ADR</span><span>5 Panels</span><span>Conciliation</span></div></div><span className="service-arrow">↗</span>
          </a>
          <a className="service-card service-card-featured" href="/ll-cure" data-reveal="up">
            <div className="service-number">02</div><div className="service-body"><span className="service-label">BUSINESS TURNAROUND</span><h3>LL-CURE</h3><p>Lobbying and the Law Company Turnover Research Zone Ecosystem — dedicated to curative legal strategy and business restructuring.</p><div className="tag-row"><span>Restructuring</span><span>Research</span><span>Recovery</span></div></div><span className="service-arrow">↗</span>
          </a>
          <a className="service-card service-card-featured" href="/lobbying" data-reveal="up">
            <div className="service-number">03</div><div className="service-body"><span className="service-label">PUBLIC AFFAIRS</span><h3>Lobbying</h3><p>Lawful strategic engagement with government, regulators, policymakers and institutional stakeholders to move complex matters forward.</p><div className="tag-row"><span>Government</span><span>Policy</span><span>Advocacy</span></div></div><span className="service-arrow">↗</span>
          </a>
        </div>
        <div className="service-grid secondary-services">
          {homeServices.slice(0, 3).map(([no, title, text]) => <article className="mini-service" data-reveal="up" key={no}><span>{no}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>

      <section className="distinction section-pad" data-reveal="up">
        <div className="section-kicker">03 / WHY CHOOSE US</div>
        <div className="distinction-head"><h2>What sets us <span>apart.</span></h2><p>We do not just practice law; we shape solutions across legal, public affairs and business decision-making.</p></div>
        <div className="distinction-grid">
          {[
            ['01','Pioneering legal + lobbying platform','A long-standing multidisciplinary model in Bangladesh.'],
            ['02','Thousands of matters handled','Experience across Judge Court, High Court and Appellate Division.'],
            ['03','Government-facing insight','Deep exposure to regulatory and institutional decision-making.'],
            ['04','Senior cross-sector professionals','Legal, defence, policing, banking, finance, media and corporate expertise.'],
            ['05','Research-led delivery','Dedicated research, media, assessment and valuation capabilities.'],
            ['06','Client-focused execution','Solutions built around the commercial and legal realities of each mandate.'],
          ].map(([num, title, subtitle]) => <div className="distinction-item" data-reveal="up" key={num}><span>{num}</span><div><h3>{title}</h3><p>{subtitle}</p></div></div>)}
        </div>
      </section>

      <section id="team" className="team section-pad" data-reveal="up">
        <div className="section-kicker">04 / OUR PEOPLE</div>
        <div className="section-heading-row team-heading"><div><h2>People who move<br /><span>complex matters forward.</span></h2></div><p>Our multidisciplinary team brings together legal, government affairs, finance, media, research, technology and business expertise.</p></div>
        <div className="team-grid">
          {team.map(([name, role, filename], index) => <article className="team-card" data-reveal="up" key={name}><div className="portrait-wrap"><TeamImage filename={filename} name={name} index={index} /><span className="portrait-index">{String(index + 1).padStart(2, '0')}</span></div><div className="team-info"><h3>{name}</h3><p>{role}</p></div></article>)}
        </div>
      </section>

      <section className="offices section-pad" data-reveal="up">
        <div className="section-kicker">04.5 / GLOBAL PRESENCE</div>
        <div className="office-grid"><div><h2>Three offices.<br /><span>One integrated desk.</span></h2><p>Connect with the same integrated legal, policy and government-affairs workflow from Bangladesh, the United Kingdom or the United States.</p></div><div className="office-list">{officeLocations.map(([region, address]) => <div className="office-card" data-reveal="up" key={region}><span>{region}</span><strong>{address}</strong></div>)}</div></div>
      </section>

      <section id="contact" className="contact section-pad" data-reveal="up">
        <div className="contact-card">
          <div className="contact-copy" data-reveal="left"><div className="section-kicker">05 / START A CONVERSATION</div><h2>Bring the hard<br /><span>matter.</span></h2><p>Tell us what needs moving. Our team will route your enquiry to the right legal, policy, ADR or government-affairs desk.</p><a className="whatsapp" href={`https://wa.me/${WHATSAPP}?text=Hello%20Lobbying%20and%20The%20Law`} target="_blank" rel="noreferrer"><span className="whatsapp-icon">◔</span> Contact via WhatsApp <span>↗</span></a><div className="locations">{officeLocations.map(([region, address]) => <div key={region}><span>{region}</span><strong>{address}</strong></div>)}</div><div className="direct-contact"><a href="tel:+8809699800155">{PHONE}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div>
          <form className="contact-form" data-reveal="right" onSubmit={handleSubmit}><label>Your Name<input required name="name" placeholder="Full name" /></label><div className="form-row"><label>Email<input required type="email" name="email" placeholder="you@company.com" /></label><label>Phone number<input name="phone" placeholder="+880 ..." /></label></div><label>Your message<textarea required name="message" rows="6" placeholder="What can we help you navigate?" /></label><button className="button button-dark form-button" type="submit">Get in touch <span>↗</span></button>{sent && <p className="form-note">Your email app should open with the enquiry pre-filled.</p>}</form>
        </div>
      </section>
    </PageShell>
  );
}

function AboutPage() {
  useEffect(() => { document.title = 'About Us | Lobbying and The Law'; }, []);
  return <PageShell active="about" className="inner-page about-page">
    <section className="inner-hero section-pad" data-reveal="up">
      <div className="section-kicker">01 / ABOUT US</div>
      <div className="inner-hero-grid"><div><h1>Legal intelligence.<br /><span>Strategic influence.</span></h1></div><div className="inner-hero-copy"><p>Over two decades at the intersection of law, government relations, business and public affairs in Bangladesh.</p><div className="hero-statline"><div><strong>2001</strong><span>Established</span></div><div><strong>2009</strong><span>RJSC incorporation</span></div><div><strong>20+</strong><span>Years of experience</span></div></div></div></div>
      <div className="inner-hero-media"><img src="/images/hero-banner.jpeg" alt="Classical civic architecture representing law and institutions" /><span>01 / LOBBYING &amp; THE LAW</span></div>
    </section>

    <section className="about-content section-pad" data-reveal="up"><div className="section-kicker">02 / OUR STORY</div><div className="about-main-grid"><article><h2>About <span>Us</span></h2><p>Lobbying and the Law is the pioneering lobbying and law limited company in Bangladesh. Established in 2001 and incorporated as a limited company in 2009 under the Companies Act 1994 (RJSC), we have spent over two decades redefining the landscape of legal services and strategic advocacy in the country.</p><p>Throughout our long and distinguished journey, we have successfully managed thousands of cases across the Judge Court, High Court, and the Appellate Division. We bridge the gap between complex legal frameworks, government relations, and business interests, serving as a trusted partner for corporations, financial institutions, and individuals alike.</p></article><aside className="about-image-stack"><img src="/images/gallery/image_4.jpeg" alt="Professional meeting and institutional engagement" /><div className="image-note"><strong>Law × Government × Business</strong><span>One integrated advisory platform</span></div></aside></div></section>

    <section className="program-overview section-pad" data-reveal="up"><div className="section-kicker">03 / FLAGSHIP INITIATIVES</div><div className="section-heading-row"><div><h2>Three programs.<br /><span>One integrated mission.</span></h2></div><p>Specialized programs designed to solve disputes, stabilize enterprises and navigate policy-sensitive environments.</p></div><div className="program-overview-grid"><a href="/llca" className="overview-card"><span>01</span><div><h3>LLCA</h3><p>Lobbying and the Law Center for ADR.</p></div><b>↗</b></a><a href="/ll-cure" className="overview-card"><span>02</span><div><h3>LL-CURE</h3><p>Lobbying and the Law Company Turnover Research Zone Ecosystem.</p></div><b>↗</b></a><a href="/lobbying" className="overview-card"><span>03</span><div><h3>Lobbying</h3><p>Lawful, strategic public affairs and government engagement.</p></div><b>↗</b></a></div></section>

    <section className="service-detail-section section-pad" data-reveal="up"><div className="section-kicker">04 / COMPREHENSIVE SERVICES</div><div className="content-columns"><div><h2>Strategic &amp; Legal <span>Advocacy</span></h2><p><strong>Business &amp; Court Lobbying:</strong> Strategic representation before courts, regulatory bodies, and government entities.</p><p><strong>Trade Advocacy:</strong> Specialized lobbying for oil, export and import operations.</p><p><strong>Taxation &amp; Procurement:</strong> Expert intervention in taxation, auctions, procurement and bids.</p></div><div><h2>Financial &amp; Investment <span>Support</span></h2><p><strong>Finance &amp; Loan Lobbying:</strong> Securing capital, navigating banking channels, and facilitating loan structuring.</p><p><strong>Investment Facilitation:</strong> End-to-end guidance for Foreign Direct Investment (FDI) and local investments.</p><p><strong>International Trade Disputes:</strong> Dispute resolution and advocacy involving cross-border conflicts with foreign buyers and sellers.</p></div></div></section>

    <section className="strength-section section-pad" data-reveal="up"><div className="section-kicker">05 / OUR CORE STRENGTHS</div><div className="strength-grid"><div><h2>People, networks,<br /><span>and specialist desks.</span></h2><p>Our greatest asset is our elite, multidisciplinary team of experts. We combine top-tier legal intellect with powerful bureaucratic and corporate network equity to deliver results.</p></div><div className="strength-list">{['Retired Defense & Law Enforcement Leadership','Ex-Bureaucrats & Policymakers','Financial & Banking Veterans','Elite Legal Minds','Financial & Corporate Experts','Specialized Infrastructure'].map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><strong>{item}</strong><p>{['Retired Army Generals and top-level retired Police Officers (IGP, Addl. IGP, DIG).','Former Government Secretaries with deep regulatory insight.','Former Managing Directors (MD) and Deputy Managing Directors (DMD) of leading banks.','Senior Advocates, Barristers, and accomplished NGO Leaders.','More than five Chartered Accountants (CA/FCA) and seasoned HR experts.','In-house data-driven R&D, Media, and Assessment & Valuation teams for business restructuring.'][i]}</p></div>)}</div></div></section>

    <section className="why-choose section-pad" data-reveal="up"><div className="why-card"><div><div className="section-kicker">06 / WHY CHOOSE US?</div><h2>We do not just practice law;<br /><span>we shape solutions.</span></h2></div><p>Whether you are navigating a high-stakes corporate dispute, seeking regulatory approval, or restructuring your enterprise, our legal mastery and multidisciplinary network are designed to protect your interests and move the matter forward.</p></div></section>
  </PageShell>;
}

const panelData = [
  { id: 'Panel-1', members: ['BRIT Robin','S.M. Ferdous','Md. Jalal Hossain, FCA','Adv. Manzurul Haque','Brig. Gen. Shamsul Salekin','Md. Rashed Ali','Md. Aliar Rahman Sobuj'] },
  { id: 'Panel-2', members: ['Sheikh Md. Hyder','Md. Shah Alam, FCA','Adv. Mahibullah Tamim','ADR panel member — name to be confirmed','Adv. Md. Ali Azam'] },
  { id: 'Panel-3', members: ['Dr. Bashir Ahmed','Md. Khalidul Alam, FCA','Adv. Md. Ali Ahsan','ADR panel member — name to be confirmed','Md. Younus Ali'] },
  { id: 'Panel-4', members: ['Panel roster to be announced', 'Specialist ADR professionals', 'Commercial dispute practitioners'] },
  { id: 'Panel-5', members: ['Panel roster to be announced', 'Sector-specific ADR professionals', 'Commercial and institutional dispute practitioners'] },
];

function LLCAPage() {
  useEffect(() => { document.title = 'LLCA | Lobbying and the Law Center for ADR'; }, []);
  return <PageShell active="services" className="inner-page llca-page">
    <section className="inner-hero program-hero section-pad" data-reveal="up"><div className="section-kicker">01 / LLCA</div><div className="inner-hero-grid"><div><h1>Resolve disputes<br /><span>with structure.</span></h1></div><div className="inner-hero-copy"><p><strong>LLCA</strong> — Lobbying and the Law Center for ADR (Alternative Dispute Resolution).</p><p>Our specialized ADR platform is designed to help parties move from conflict to resolution through focused panels, professional conciliation and commercially aware dispute strategy.</p></div></div><div className="program-banner-image"><img src="/images/gallery/image_12.jpeg" alt="Professional discussion and dispute resolution setting" /><div><span>5</span><strong>ADR PANELS</strong></div></div></section>

    <section className="llca-principles section-pad" data-reveal="up"><div className="section-kicker">02 / ADR FRAMEWORK</div><div className="section-heading-row"><div><h2>Five specialized <span>panels.</span></h2></div><p>Panels are structured around different dispute relationships and can support B2B, P2P, B2G, Business-to-Bank and Person-to-Bank matters.</p></div><div className="adr-segment-grid">{[['B2B','Business-to-Business'],['P2P','Person-to-Person'],['B2G','Business-to-Government'],['B2B / BANK','Business-to-Bank'],['P2B / BANK','Person-to-Bank']].map(([code,label],i)=><div key={code}><span>{String(i+1).padStart(2,'0')}</span><strong>{code}</strong><p>{label}</p></div>)}</div></section>

    <section className="panel-section section-pad" data-reveal="up"><div className="section-kicker">03 / ADR PANELS</div><div className="panel-grid">{panelData.map((panel) => <article className="panel-card" key={panel.id}><div className="panel-card-top"><span>{panel.id}</span><b>ADR</b></div><h3>Conciliation Panel</h3><div className="panel-members">{panel.members.map((member, i) => <div key={`${panel.id}-${member}`}><span>{String(i+1).padStart(2,'0')}</span><p>{member}</p></div>)}</div><div className="panel-footer">Specialist dispute resolution desk <span>↗</span></div></article>)}</div></section>

    <section className="llca-process section-pad" data-reveal="up"><div className="section-kicker">04 / HOW LLCA WORKS</div><div className="process-grid">{[['01','Intake','Understand the dispute, parties, documents and desired outcome.'],['02','Panel Matching','Direct the matter to the most appropriate ADR panel and specialists.'],['03','Conciliation','Facilitate structured dialogue, options and commercially practical settlement pathways.'],['04','Resolution','Document agreed outcomes and move the matter toward closure with clarity.']].map(([n,t,d])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>

    <section className="cta-section section-pad" data-reveal="up"><div className="program-cta"><div><div className="section-kicker">05 / START AN ADR MATTER</div><h2>Turn a dispute into a <span>decision.</span></h2></div><a className="button button-dark" href="/#contact">Discuss your matter <span>↗</span></a></div></section>
  </PageShell>;
}

function LLCurePage() {
  useEffect(() => { document.title = 'LL-CURE | Lobbying and The Law'; }, []);
  const pillars = [
    ['01','Curative Legal Strategy','Diagnose legal bottlenecks, exposure and unresolved matters, then build practical cure pathways.'],
    ['02','Business Restructuring','Support restructuring, governance redesign and operational realignment for stressed enterprises.'],
    ['03','Turnover & Research','Build research-led interventions around commercial performance, stakeholder expectations and market realities.'],
    ['04','Recovery Ecosystem','Coordinate legal, finance, banking, public affairs and business resources around a common recovery plan.'],
  ];
  return <PageShell active="services" className="inner-page llcure-page">
    <section className="inner-hero program-hero section-pad" data-reveal="up"><div className="section-kicker">01 / LL-CURE</div><div className="inner-hero-grid"><div><h1>Research.<br /><span>Restructure. Recover.</span></h1></div><div className="inner-hero-copy"><p><strong>LL-CURE</strong> — Lobbying and the Law Company Turnover Research Zone Ecosystem.</p><p>A dedicated program designed to provide curative legal strategies, corporate restructuring and comprehensive business turnaround solutions.</p></div></div><div className="program-banner-image"><img src="/images/gallery/image_9.jpeg" alt="Business meeting representing restructuring and strategic planning" /><div><span>CURE</span><strong>BUSINESS TURNAROUND</strong></div></div></section>
    <section className="llcure-pillars section-pad" data-reveal="up"><div className="section-kicker">02 / THE ECOSYSTEM</div><div className="pillar-grid">{pillars.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section className="service-detail-section section-pad" data-reveal="up"><div className="section-kicker">03 / WHAT WE DELIVER</div><div className="content-columns"><div><h2>Turnaround <span>architecture</span></h2><p>We map ownership, finance, contracts, disputes, regulation, operations and stakeholder dependencies so that legal strategy serves commercial recovery.</p><p>From a single unresolved legal problem to a broader enterprise restructuring mandate, LL-CURE is built to coordinate the moving parts.</p></div><div><h2>Research-led <span>decision support</span></h2><p>Our R&amp;D approach brings together document review, market intelligence, legal analysis, financial perspectives and stakeholder mapping to support executive decisions.</p><p>The objective is a practical cure plan — not merely another report.</p></div></div></section>
    <section className="llcure-roadmap section-pad" data-reveal="up"><div className="section-kicker">04 / TURNAROUND ROADMAP</div><div className="roadmap">{[['Diagnose','Identify the legal, financial and operational pressure points.'],['Prioritize','Separate urgent risks from structural issues and quick wins.'],['Design','Build a sequenced cure, restructuring or recovery plan.'],['Execute','Coordinate the relevant legal, business, finance and stakeholder actions.'],['Review','Measure progress and recalibrate the plan as conditions change.']].map(([t,d],i)=><div key={t}><span>{String(i+1).padStart(2,'0')}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
    <section className="cta-section section-pad" data-reveal="up"><div className="program-cta"><div><div className="section-kicker">05 / BUSINESS CURE DESK</div><h2>When the business is under pressure,<br /><span>strategy matters.</span></h2></div><a className="button button-dark" href="/#contact">Talk to LL-CURE <span>↗</span></a></div></section>
  </PageShell>;
}

function LobbyingPage() {
  useEffect(() => { document.title = 'Lobbying | Lobbying and The Law'; }, []);
  const areas = [
    ['01','Government Relations','Structured, lawful engagement with ministries, agencies, regulators and institutional stakeholders.'],
    ['02','Policy Advocacy','Evidence-led support for policy dialogue, regulatory reform and industry representation.'],
    ['03','Regulatory Navigation','Strategic guidance around approvals, licences, permissions and complex administrative pathways.'],
    ['04','Business & Court Lobbying','Integrated representation where legal disputes intersect with public institutions and commercial interests.'],
    ['05','Tax & Procurement','Support around taxation, auctions, procurement, bids and regulated commercial processes.'],
    ['06','Investment & Trade','FDI and local investment facilitation, export/import advocacy and cross-border business matters.'],
  ];
  return <PageShell active="services" className="inner-page lobbying-page">
    <section className="inner-hero program-hero section-pad" data-reveal="up"><div className="section-kicker">01 / LOBBYING</div><div className="inner-hero-grid"><div><h1>Move complex matters<br /><span>with lawful influence.</span></h1></div><div className="inner-hero-copy"><p>Lobbying is strategic engagement. Done professionally, it connects evidence, legal understanding, institutional process and stakeholder communication.</p><p>Our approach is built around lawful representation, policy intelligence, reputation and disciplined execution.</p></div></div><div className="program-banner-image"><img src="/images/hero-banner.jpeg" alt="Institutional architecture representing government relations" /><div><span>L&amp;L</span><strong>PUBLIC AFFAIRS</strong></div></div></section>
    <section className="lobbying-ethos section-pad" data-reveal="up"><div className="section-heading-row"><div><div className="section-kicker">02 / OUR APPROACH</div><h2>Influence with <span>integrity.</span></h2></div><p>We connect legal analysis, policy context, stakeholder strategy, communications and commercial realities without losing sight of lawful process.</p></div><div className="ethos-grid"><div><span>01</span><strong>Evidence first</strong><p>Every engagement starts with facts, documents, law and the client’s actual objective.</p></div><div><span>02</span><strong>Process aware</strong><p>We understand that government outcomes depend on institutions, procedures and timing.</p></div><div><span>03</span><strong>Stakeholder smart</strong><p>We map the decision-makers and affected stakeholders who can materially shape an outcome.</p></div><div><span>04</span><strong>Lawful execution</strong><p>Our model is designed around professional representation, transparency and legitimate advocacy.</p></div></div></section>
    <section className="lobbying-areas section-pad" data-reveal="up"><div className="section-kicker">03 / LOBBYING SERVICES</div><div className="lobbying-area-grid">{areas.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article>)}</div></section>
    <section className="service-detail-section section-pad" data-reveal="up"><div className="section-kicker">04 / WHO WE SUPPORT</div><div className="client-sector-grid"><div><h2>For <span>business</span></h2><p>Corporations, financial institutions, investors, project sponsors, regulated enterprises and businesses facing high-value government or regulatory interfaces.</p></div><div><h2>For <span>institutions</span></h2><p>Organizations that need structured stakeholder engagement, policy communication, regulatory navigation or support around complex public-interest matters.</p></div><div><h2>For <span>decision-makers</span></h2><p>Executives and boards who need concise strategic intelligence, legal context and an integrated plan for consequential matters.</p></div></div></section>
    <section className="cta-section section-pad" data-reveal="up"><div className="program-cta"><div><div className="section-kicker">05 / GOVERNMENT-FACING ADVISORY</div><h2>Bring the matter.<br /><span>We build the strategy.</span></h2></div><a className="button button-dark" href="/#contact">Discuss lobbying support <span>↗</span></a></div></section>
  </PageShell>;
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/gallery') return <Gallery />;
  if (path === '/about') return <AboutPage />;
  if (path === '/llca') return <LLCAPage />;
  if (path === '/ll-cure') return <LLCurePage />;
  if (path === '/lobbying') return <LobbyingPage />;
  return <HomePage />;
}

export default App;
