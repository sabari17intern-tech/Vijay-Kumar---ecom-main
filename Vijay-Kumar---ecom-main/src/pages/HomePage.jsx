import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const navigate = useNavigate();
  // Gemstone Finder widget state — Step 1: birth month, Step 2: birth star, Step 3: result
  const [finderStep, setFinderStep] = useState(1);
  const [finderMonth, setFinderMonth] = useState('');
  const [finderStar, setFinderStar] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // 27 Vedic Nakshatras with their ruling planet (the 9-planet cycle repeats three times)
  const nakshatras = [
    { name: 'Ashwini', lord: 'Ketu' }, { name: 'Bharani', lord: 'Venus' }, { name: 'Krittika', lord: 'Sun' },
    { name: 'Rohini', lord: 'Moon' }, { name: 'Mrigashira', lord: 'Mars' }, { name: 'Ardra', lord: 'Rahu' },
    { name: 'Punarvasu', lord: 'Jupiter' }, { name: 'Pushya', lord: 'Saturn' }, { name: 'Ashlesha', lord: 'Mercury' },
    { name: 'Magha', lord: 'Ketu' }, { name: 'Purva Phalguni', lord: 'Venus' }, { name: 'Uttara Phalguni', lord: 'Sun' },
    { name: 'Hasta', lord: 'Moon' }, { name: 'Chitra', lord: 'Mars' }, { name: 'Swati', lord: 'Rahu' },
    { name: 'Vishakha', lord: 'Jupiter' }, { name: 'Anuradha', lord: 'Saturn' }, { name: 'Jyeshtha', lord: 'Mercury' },
    { name: 'Moola', lord: 'Ketu' }, { name: 'Purva Ashadha', lord: 'Venus' }, { name: 'Uttara Ashadha', lord: 'Sun' },
    { name: 'Shravana', lord: 'Moon' }, { name: 'Dhanishta', lord: 'Mars' }, { name: 'Shatabhisha', lord: 'Rahu' },
    { name: 'Purva Bhadrapada', lord: 'Jupiter' }, { name: 'Uttara Bhadrapada', lord: 'Saturn' }, { name: 'Revati', lord: 'Mercury' },
  ];

  const planetToGem = {
    Sun: 'Ruby', Moon: 'Pearl', Mars: 'Red Coral', Mercury: 'Emerald', Jupiter: 'Yellow Sapphire',
    Venus: 'Opal', Saturn: 'Blue Sapphire', Rahu: 'Hessonite', Ketu: 'Cats Eye',
  };

  const gemDetails = {
    'Yellow Sapphire': {
      tagName: 'Pukhraj', planet: 'Jupiter ♃', color: '#C89B00',
      benefits: [
        'Brings lasting wealth, wisdom & marital bliss — the most auspicious prosperity gem',
        'Best for Sagittarius & Pisces born; strongly effective for Nov & Mar birth months',
      ],
      months: 'November · March',
    },
    'Blue Sapphire': {
      tagName: 'Neelam', planet: 'Saturn ♄', color: '#1B4FD8',
      benefits: [
        'Fastest-acting gem — delivers clarity, discipline & rapid material success',
        'Ideal for Capricorn & Aquarius; most potent for Jan, Feb & Dec birth months',
      ],
      months: 'January · February · December',
    },
    'Emerald': {
      tagName: 'Panna', planet: 'Mercury ☿', color: '#1A7A4A',
      benefits: [
        'Sharpens intellect, communication & business skill — beloved by writers & traders',
        'Best for Gemini & Virgo born; powerfully auspicious in May & August',
      ],
      months: 'May · August',
    },
    'Ruby': {
      tagName: 'Manik', planet: 'Sun ☉', color: '#C0150F',
      benefits: [
        'Ignites leadership, willpower & solar vitality — the "king of gemstones"',
        'Ideal for Leo & Aries born; wear in Jul–Aug for peak solar benefit',
      ],
      months: 'July · August',
    },
    'Opal': {
      tagName: 'Venus Gem', planet: 'Venus ♀', color: '#9B59B6',
      benefits: [
        'Attracts luxury, beauty, artistic talent & romantic harmony through Venus energy',
        'Best for Libra & Taurus born; auspicious for those born in April & October',
      ],
      months: 'April · October',
    },
    'Pearl': {
      tagName: 'Moti', planet: 'Moon ☽', color: '#7A9EB0',
      benefits: [
        'Calms emotions, eases anxiety & deepens intuition — the lunar serenity gem',
        'Perfect for Cancer born; most potent for those with Jun & Jul birth months',
      ],
      months: 'June · July',
    },
    'Red Coral': {
      tagName: 'Moonga', planet: 'Mars ♂', color: '#C0392B',
      benefits: [
        'Boosts physical stamina, courage & protects against enemies and mishaps',
        'Ideal for Aries & Scorpio born; peak power in Mar–Apr & Oct–Nov months',
      ],
      months: 'March · October',
    },
    'Hessonite': {
      tagName: 'Gomed', planet: 'Rahu ☊', color: '#B35A1F',
      benefits: [
        'Eliminates confusion, removes delays & channels Rahu\'s transformative energy',
        'Best for Aquarius & Aries born; strongly recommended for Jan–Feb birth months',
      ],
      months: 'January · February',
    },
    'Cats Eye': {
      tagName: 'Vaidoorya', planet: 'Ketu ☋', color: '#5A5A4A',
      benefits: [
        'Guards against hidden fears, sudden loss & accidents — Ketu\'s protective mystic gem',
        'Recommended for those running Ketu dasha or born under Ashwini, Magha & Moola stars',
      ],
      months: 'Ketu-ruled births',
    },
    'White Sapphire': {
      tagName: 'Safed Pukhraj', planet: 'Venus ♀', color: '#D9D9D9',
      benefits: [
        'Dazzling alternative to Diamond — channels Venus energy for wealth, beauty & luxury',
        'Best for Libra & Taurus born; highly recommended for April & October births',
      ],
      months: 'April · October',
    },
  };

  const resetFinder = () => {
    setFinderStep(1);
    setFinderMonth('');
    setFinderStar('');
  };

  const finderNakshatra = nakshatras.find((n) => n.name === finderStar);
  const finderGemName = finderNakshatra ? planetToGem[finderNakshatra.lord] : null;
  const finderGem = finderGemName ? gemDetails[finderGemName] : null;
  const finderWaMessage = `Hi VijayKumar Diamonds, I completed your Gemstone Finder (Born in ${finderMonth} under the ${finderStar} star). I would like a detailed astro / numerological consultation. Please guide me.`;
  const finderWaUrl = `https://wa.me/919092716427?text=${encodeURIComponent(finderWaMessage)}`;

  const featured = products
    .filter((p) => p.badge === 'Bestseller' || p.badge === 'Popular')
    .slice(0, 8);

  const scrollSlider = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const firstChild = container.querySelector('.featured-product-wrapper');
    const scrollAmount = firstChild
      ? firstChild.offsetWidth + 20
      : container.offsetWidth * 0.75;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  const sStyle = {
    width: '100%',
    padding: '0.8rem 2.5rem 0.8rem 1rem',
    border: '1.5px solid var(--color-gray-200)',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    background: 'var(--color-white)',
    color: 'var(--color-dark)',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage:
      "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%236B7280' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    cursor: 'pointer',
  };

  const lStyle = {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-gray-500)',
    marginBottom: '0.4rem',
  };

  const gemImages = {
    'Ruby': '/images/ruby.png',
    'Blue Sapphire': '/images/blue_sapphire.png',
    'Emerald': '/images/emerald.png',
    'Yellow Sapphire': '/images/yellow_sapphire.png',
    'Pearl': '/images/pearl.png',
    'Red Coral': '/images/coral.png',
    'Hessonite': '/images/hessonite.png',
    'Opal': '/images/opal.png',
    'Cats Eye': '/images/cats_eye.png',
  };

  const primaryBtnStyle = (disabled) => ({
    width: '100%',
    padding: '0.95rem',
    borderRadius: '0.5rem',
    background: disabled ? 'var(--color-gray-200)' : 'var(--color-dark)',
    color: disabled ? 'var(--color-gray-400)' : 'var(--color-white)',
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem',
    transition: 'background 0.2s',
  });

  const renderStepDots = () => (
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          style={{
            height: '3px',
            flex: 1,
            borderRadius: '2px',
            background: finderStep >= step ? 'var(--color-gold)' : 'var(--color-gray-200)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );

  const renderSearchWidget = () => (
    <div
      className="gemstone-search-widget"
      style={{
        background: 'var(--color-white)',
        borderRadius: '1.25rem',
        padding: '2rem 2.25rem 2.25rem',
        boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
        border: '1px solid rgba(212,175,55,0.2)',
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span
          style={{
            display: 'block',
            fontSize: '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            marginBottom: '0.4rem',
          }}
        >
          VK Finder
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-dark)',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {finderStep === 3 ? 'Your Gemstone Match' : 'Find Your Right Gemstone'}
        </h2>
      </div>

      {renderStepDots()}

      {/* Step 1 — Birth Month */}
      {finderStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={lStyle}>Step 1 of 2 &mdash; Your Birth Month</label>
            <select
              value={finderMonth}
              onChange={(e) => setFinderMonth(e.target.value)}
              style={sStyle}
            >
              <option value="">Select Birth Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={!finderMonth}
            onClick={() => finderMonth && setFinderStep(2)}
            style={primaryBtnStyle(!finderMonth)}
          >
            Continue <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}

      {/* Step 2 — Birth Star */}
      {finderStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={lStyle}>Step 2 of 2 &mdash; Your Birth Star (Nakshatra)</label>
            <select
              value={finderStar}
              onChange={(e) => setFinderStar(e.target.value)}
              style={sStyle}
            >
              <option value="">Select Birth Star</option>
              {nakshatras.map((n) => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => setFinderStep(1)}
              style={{
                padding: '0.95rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--color-white)',
                color: 'var(--color-dark)',
                border: '1.5px solid var(--color-gray-200)',
                cursor: 'pointer',
                fontSize: '0.7rem',
              }}
              aria-label="Back"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button
              type="button"
              disabled={!finderStar}
              onClick={() => finderStar && setFinderStep(3)}
              style={{ ...primaryBtnStyle(!finderStar), marginTop: 0 }}
            >
              Reveal My Gemstone <i className="fas fa-gem"></i>
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Result + WhatsApp CTA */}
      {finderStep === 3 && finderGem && finderGemName && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: '#FAF7F0',
              border: '1px solid rgba(212,175,55,0.25)',
              marginBottom: '1rem',
            }}
          >
            <img
              src={gemImages[finderGemName]}
              alt={finderGemName}
              style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0 }}
            />
            <div>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: finderGem.color }}>
                {finderGem.tagName} &middot; {finderGem.planet}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-dark)',
                  margin: '0.2rem 0 0',
                  lineHeight: 1.2,
                }}
              >
                {finderGemName}
              </h3>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {finderGem.benefits.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-gray-500)', lineHeight: 1.5 }}>
                <i className="fas fa-gem" style={{ color: 'var(--color-gold)', marginTop: '0.2rem', fontSize: '0.65rem', flexShrink: 0 }}></i>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <Link
            to={`/shop?cat=${encodeURIComponent(finderGemName)}`}
            className="btn btn-gold"
            style={{ width: '100%', textAlign: 'center', display: 'block', marginBottom: '1.25rem' }}
          >
            Shop {finderGemName}
          </Link>

          <div style={{ borderTop: '1.5px solid var(--color-gray-200)', paddingTop: '1.1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-gray-500)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
              Want a detailed astro / numerological consultation?
            </p>
            <a
              href={finderWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.85rem',
                borderRadius: '0.5rem',
                background: '#25D366',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: '1rem' }}></i>
              Talk to Our Expert
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={resetFinder}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gray-400)',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <Link
          to="/shop"
          style={{
            color: 'var(--color-gray-400)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textDecoration: 'none',
          }}
        >
          Browse full collection &rarr;
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-section hero-home-section" style={{ padding: 0, borderBottom: 'none' }}>

        {/* Image + overlays wrapper — absolute on desktop, flow on mobile */}
        <div className="hero-image-wrap">
          <div
            className="hero-bg hero-home-bg"
            style={{ backgroundImage: "url('/images/nine_gemstones_banner.png')" }}
          ></div>
          <div className="hero-home-overlay"></div>
          <div className="hero-overlay-bottom-blend"></div>

          {/* Desktop headline (hidden on mobile) */}
          <div className="hero-home-content">
            <div className="hero-home-text">
              <span className="hero-home-tagline">Since Generations</span>
              <h1 className="hero-home-headline" style={{ color: 'var(--color-dark)', textShadow: 'none' }}>Premium <em style={{ display: 'inline' }}>Diamonds</em> &amp; Gemstones</h1>
              <p className="hero-home-subtext" style={{ color: 'var(--color-gray-600)' }}>
                GIA &nbsp;·&nbsp; GRS &nbsp;·&nbsp; IGI Certified &nbsp;|&nbsp; BIS Hallmarked Gold
              </p>
              <div className="hero-home-actions">
                <Link to="/shop" className="btn btn-gold btn-lg">Shop Collection</Link>
                <Link to="/shop?type=gems" className="btn btn-white btn-lg">Loose Gemstones</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop floating widget — positioned absolute inside section */}
        <div className="hero-widget-overlay-desktop">{renderSearchWidget()}</div>

        {/* Mobile widget — inside the section, below the gem image */}
        <div className="hero-widget-in-section">{renderSearchWidget()}</div>

      </section>

      {/* ═══ GEM CIRCLES — SHOP BY GEMSTONE ═══ */}
      <section className="section reveal" id="gem-circles-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Collection</span>
            <h2 className="section-title">Shop by Gemstone</h2>
            <p className="section-subtitle">
              Sacred planetary gems — each chosen for its purity, provenance, and astrological power.
            </p>
            <div className="gold-line"></div>
          </div>
          <div className="gem-pundit-grid">
            {[
              { name: 'Yellow Sapphire', img: '/images/yellow_sapphire.png', desc: 'Divine Luck, Prosperity, Blissful Matrimony' },
              { name: 'Blue Sapphire', img: '/images/blue_sapphire.png', desc: 'Great Fame, Discipline, Reverses Misfortunes' },
              { name: 'Emerald', img: '/images/emerald.png', desc: 'Vocal Charm, Creativity, Success in Business' },
              { name: 'Ruby', img: '/images/ruby.png', desc: 'Great Health, Will Power, Fame & Reputation' },
              { name: 'Pearl', img: '/images/pearl.png', desc: 'Mental Strength, Fortune, Peace & Fulfillment' },
              { name: 'Red Coral', img: '/images/coral.png', desc: 'Averts Mishaps, Courage, Overall Strength' },
              { name: 'Hessonite', img: '/images/hessonite.png', desc: 'Pacifies Rahu, Popularity, Speculative Success' },
              { name: 'Cats Eye', img: '/images/cats_eye.png', desc: 'Guards against fears, Ketu\'s protective gem' }
            ].map((gem) => (
              <div
                key={gem.name}
                className="gem-pundit-card"
                onClick={() => navigate(`/shop?cat=${encodeURIComponent(gem.name)}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/shop?cat=${encodeURIComponent(gem.name)}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="gem-card-image-wrap">
                  <img src={gem.img} alt={gem.name} className="gem-card-img" />
                  <div className="gem-card-shadow"></div>
                </div>
                <h3 className="gem-card-name">
                  {gem.name.toUpperCase()}
                </h3>
                <p className="gem-card-benefit">{gem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY CARDS ═══ */}
      <section className="section bg-ivory reveal" id="category-cards-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Curated For You</span>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-subtitle">
              From loose certified gemstones to timeless fine jewelry — find exactly what you&apos;re
              looking for.
            </p>
            <div className="gold-line"></div>
          </div>
          <div className="category-scroll hide-scrollbar">
            <Link to="/shop?type=gems" className="category-card">
              <img src="/images/ruby.png" alt="Loose Gemstones" loading="lazy" />
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <h3>Loose Gemstones</h3>
                <p>Certified natural gems for astrology &amp; collection</p>
              </div>
            </Link>
            <Link to="/shop?type=jewelry" className="category-card">
              <img src="/images/ring.png" alt="Fine Jewelry" loading="lazy" />
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <h3>Fine Jewelry</h3>
                <p>Handcrafted rings, pendants &amp; necklaces in hallmarked gold</p>
              </div>
            </Link>
            <Link to="/shop?cat=Pearl" className="category-card">
              <img src="/images/pearl.png" alt="Precious Pearls" loading="lazy" />
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <h3>Precious Pearls</h3>
                <p>South Sea, Basra &amp; freshwater pearls of exceptional luster</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS — BESTSELLERS ═══ */}
      <section className="section reveal" id="bestsellers-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Most Loved</span>
            <h2 className="section-title">Bestsellers</h2>
            <p className="section-subtitle">
              Our customers&apos; favourites — certified, stunning, and ready to ship.
            </p>
            <div className="gold-line"></div>
          </div>
          <div className="slider-wrapper">
            <div
              className="product-grid hide-scrollbar featured-scroll"
              id="featured-products"
            >
              {featured.map((p) => (
                <div key={p.id} className="featured-product-wrapper">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <button
              className="slider-nav-btn prev-btn"
              onClick={() => scrollSlider('featured-products', -1)}
              aria-label="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="slider-nav-btn next-btn"
              onClick={() => scrollSlider('featured-products', 1)}
              aria-label="Next"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link to="/shop" className="btn btn-outline-gold btn-lg">
              View All Products <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section reveal" id="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Happy Customers</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              Trusted by thousands across India for quality, authenticity, and value.
            </p>
            <div className="gold-line"></div>
          </div>
          <div className="testimonial-scroll hide-scrollbar">
            {[
              {
                name: 'Priya Sharma',
                loc: 'Mumbai',
                initial: 'P',
                text: '"I purchased a Ceylon Blue Sapphire for my engagement ring and the quality exceeded all expectations. The GRS certificate gave me complete confidence. VijayKumar\'s team even helped me choose the perfect carat weight for my budget."',
              },
              {
                name: 'Rajesh Iyer',
                loc: 'Chennai',
                initial: 'R',
                text: '"Bought a Yellow Sapphire for astrological purposes. The gemologist spent 30 minutes explaining the differences between heated and unheated stones. Received a beautiful unheated Pukhraj with GIA certification. Truly professional service."',
              },
              {
                name: 'Anita Gupta',
                loc: 'Delhi',
                initial: 'A',
                text: '"I ordered a Bespoke Diamond Gold Ring as an anniversary gift. The packaging was luxurious, the diamonds sparkled beautifully, and it arrived two days early! My wife was absolutely thrilled. Will definitely shop again."',
              },
              {
                name: 'Karthik Nair',
                loc: 'Bangalore',
                initial: 'K',
                text: '"The Hessonite I received was exceptional quality — deep honey colour and eye-clean clarity. The certificate from a reputed lab gave me full confidence. VijayKumar is my go-to destination for astrological gemstones."',
              },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <i key={j} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 'var(--space-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-white)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <strong className="testimonial-author" style={{ display: 'block' }}>
                      {t.name}
                    </strong>
                    <span className="testimonial-location">{t.loc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER / INNER CIRCLE ═══ */}
      <section className="newsletter-section section reveal" id="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div>
              <span
                className="section-label"
                style={{ color: 'var(--color-gold)', textAlign: 'left' }}
              >
                Exclusive Access
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  color: 'var(--color-white)',
                  margin: '0.5rem 0 0.75rem',
                  lineHeight: 1.2,
                }}
              >
                Join the VK Inner Circle
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.8rem',
                  lineHeight: 1.75,
                  maxWidth: 400,
                }}
              >
                Early access to new collections, exclusive discounts &amp; expert gemstone insights
                delivered to your inbox.
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                const emailInput = e.target.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                  emailInput.value = '';
                  alert('Thank you for subscribing! Welcome to the VK Inner Circle.');
                }
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn btn-gold">
                Subscribe
              </button>
            </form>
          </div>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '1.5rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            ✦ &nbsp; No spam. Unsubscribe anytime. &nbsp; ✦
          </p>
        </div>
      </section>

      {/* ═══ TRUST & AUTHENTICITY ═══ */}
      <section className="section reveal trust-section" id="authenticity-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Promise</span>
            <h2 className="section-title">100% Genuine. Every Time.</h2>
            <p className="section-subtitle">
              Every gemstone is ethically sourced, independently certified, and personally inspected
              by our master gemologists before it reaches your hands.
            </p>
            <div className="gold-line"></div>
          </div>

          <div className="trust-certs">
            {[
              { abbr: 'GIA', name: 'Gemological\nInstitute of America' },
              { abbr: 'GRS', name: 'Gem Research\nSwisslab' },
              { abbr: 'IGI', name: 'International\nGemological Institute' },
              { abbr: 'BIS', name: 'Bureau of Indian\nStandards — Hallmark' },
            ].map((cert) => (
              <div key={cert.abbr} className="trust-cert-badge">
                <span className="trust-cert-abbr">{cert.abbr}</span>
                <span className="trust-cert-name">{cert.name}</span>
              </div>
            ))}
          </div>

          <div className="trust-pillars">
            {[
              { icon: 'fas fa-gem',           title: 'Natural & Unenhanced',      body: "We clearly disclose if a gem is heated or treated. Unheated certified stones are specially tagged so you always know exactly what you're buying." },
              { icon: 'fas fa-certificate',    title: 'Third-Party Certified',     body: 'Every premium gemstone ships with an original certificate from GIA, GRS, or IGI — independent labs with no commercial interest in our inventory.' },
              { icon: 'fas fa-user-check',     title: 'Gemologist Inspected',      body: 'Each stone passes a rigorous physical inspection by our senior gemologists for colour, clarity, and treatment before being listed or dispatched.' },
              { icon: 'fas fa-shield-alt',     title: 'Insured & Secure Delivery', body: 'All orders above ₹50,000 are fully insured, tamper-proof sealed, and dispatched via tracked priority courier at no additional cost.' },
              { icon: 'fas fa-rotate-left',    title: 'Lifetime Exchange',         body: 'We offer lifetime exchange on all BIS hallmarked gold jewelry and buyback options on select certified gemstones. Your purchase is protected.' },
              { icon: 'fas fa-star-half-stroke', title: '5,000+ Happy Customers', body: 'Trusted by gemstone lovers and astrology practitioners across India. Every review on our site is from a verified purchaser.' },
            ].map((pillar) => (
              <div key={pillar.title} className="trust-pillar-card">
                <div className="trust-pillar-icon">
                  <i className={pillar.icon}></i>
                </div>
                <h3 className="trust-pillar-title">{pillar.title}</h3>
                <p className="trust-pillar-body">{pillar.body}</p>
              </div>
            ))}
          </div>

          <div className="trust-cta">
            <p className="trust-cta-quote">
              &ldquo;We have been trusted by gemstone lovers and astrology practitioners across India
              for generations. What you see is exactly what you receive — no substitutions, no surprises.&rdquo;
            </p>
            <Link to="/shop" className="btn btn-outline-gold btn-lg">
              Explore Our Certified Collection <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
