import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products, gemCategories, jewelryCategories, categoryImages } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'All';
  const typeParam = searchParams.get('type') || 'All';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const caratParam = searchParams.get('carat') || '';
  const priceParam = searchParams.get('price') || '';
  const purposeParam = searchParams.get('purpose') || '';

  const [currentCategory, setCurrentCategory] = useState(catParam);
  const [currentTypeFilter] = useState(typeParam);
  const [currentSort, setCurrentSort] = useState('Recommended');
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => { setCurrentCategory(catParam); }, [catParam]);

  const pageTitle = useMemo(() => {
    if (currentTypeFilter === 'gems') return 'Certified Loose Gemstones';
    if (currentTypeFilter === 'jewelry') return 'Handcrafted Fine Jewelry';
    return 'Our Collection';
  }, [currentTypeFilter]);

  const categoriesToRender = useMemo(() => {
    if (currentTypeFilter === 'jewelry') return jewelryCategories;
    if (currentTypeFilter === 'gems') return gemCategories;
    return [...gemCategories, ...jewelryCategories];
  }, [currentTypeFilter]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      if (currentTypeFilter === 'gems' && (p.isRing || p.category === 'Rings')) return false;
      if (currentTypeFilter === 'jewelry' && !p.isRing && p.category !== 'Rings') return false;
      
      if (currentCategory !== 'All') {
        if (currentCategory === 'Rings') {
          if (p.category !== 'Rings' && !p.isRing) return false;
        } else {
          if (p.category !== currentCategory) return false;
        }
      }
      
      // Purpose Filter
      if (purposeParam) {
        const allowedGems = {
          'Career & Business Growth': ['Yellow Sapphire', 'Emerald'],
          'Health & Vitality': ['Ruby', 'Red Coral'],
          'Marriage & Love Life': ['Yellow Sapphire', 'Pearl'],
          'Mental Peace & Focus': ['Pearl', 'Emerald'],
          'Protection & Luck': ['Hessonite', 'Opal']
        }[purposeParam] || [];
        if (allowedGems.length > 0 && !allowedGems.includes(p.category)) return false;
      }

      // Carat Filter
      if (caratParam) {
        const val = parseFloat(p.carat);
        if (caratParam === '1-3' && (isNaN(val) || val < 1.0 || val > 3.0)) return false;
        if (caratParam === '3-5' && (isNaN(val) || val < 3.0 || val > 5.0)) return false;
        if (caratParam === '5-7' && (isNaN(val) || val < 5.0 || val > 7.0)) return false;
        if (caratParam === '7+' && (isNaN(val) || val < 7.0)) return false;
      }

      // Price Filter
      if (priceParam) {
        if (priceParam === 'under-10000' && p.price >= 10000) return false;
        if (priceParam === '10000-50000' && (p.price < 10000 || p.price > 50000)) return false;
        if (priceParam === '50000-100000' && (p.price < 50000 || p.price > 100000)) return false;
        if (priceParam === 'above-100000' && p.price <= 100000) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) || (p.origin && p.origin.toLowerCase().includes(q));
      }
      return true;
    });

    if (currentSort === 'Price Low-High') result.sort((a, b) => a.price - b.price);
    else if (currentSort === 'Price High-Low') result.sort((a, b) => b.price - a.price);
    else if (currentSort === 'Highest Rated') result.sort((a, b) => b.rating - a.rating);
    else if (currentSort === 'Newest') result.sort((a, b) => b.id - a.id);
    else result.sort((a, b) => {
      const valA = (a.badge === 'Bestseller' ? 2 : a.badge === 'Popular' ? 1 : 0);
      const valB = (b.badge === 'Bestseller' ? 2 : b.badge === 'Popular' ? 1 : 0);
      return valB - valA;
    });

    return result;
  }, [currentCategory, currentTypeFilter, currentSort, searchQuery, caratParam, priceParam, purposeParam]);

  const toShow = filteredProducts.slice(0, visibleCount);

  const selectCategory = (cat) => {
    setCurrentCategory(cat);
    setVisibleCount(12);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        {currentCategory === 'All' ? (
          <span className="current">Shop</span>
        ) : (
          <><Link to="/shop">Shop</Link> <span>/</span> <span className="current">{currentCategory}</span></>
        )}
      </div>

      <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
        <span className="section-label">VK Catalog</span>
        <h1 className="section-title" style={{ fontSize: '2.25rem' }}>{pageTitle}</h1>
        <p className="section-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
          Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} certified items
        </p>
        <div className="gold-line" style={{ marginLeft: 0, marginTop: 'var(--space-sm)' }}></div>
      </div>

      {/* Gem Circles Filter */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="gem-circles hide-scrollbar">
          <div onClick={() => selectCategory('All')} className={`gem-circle ${currentCategory === 'All' ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
            <div className="gem-circle-img icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark)', color: 'var(--color-gold)', fontSize: '1.25rem' }}><i className="fas fa-th-large"></i></div>
            <span className="gem-circle-label">All</span>
          </div>
          {categoriesToRender.map(cat => (
            <div key={cat} onClick={() => selectCategory(cat)} className={`gem-circle ${currentCategory === cat ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
              <div className="gem-circle-img"><img src={categoryImages[cat] || '/images/ruby.png'} alt={cat} /></div>
              <span className="gem-circle-label">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gemstone Grid Selection when no category is active */}
      {currentCategory === 'All' && (
        <section style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Browse by Gemstone</h2>
            <p className="section-subtitle" style={{ textAlign: 'left', marginLeft: 0, fontSize: '0.85rem' }}>
              Select a gemstone to view its dedicated collection and astrological benefits.
            </p>
            <div className="gold-line" style={{ marginLeft: 0, marginTop: '0.5rem' }}></div>
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
                onClick={() => selectCategory(gem.name)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && selectCategory(gem.name)}
              >
                <div className="gem-card-image-wrap">
                  <img src={gem.img} alt={gem.name} className="gem-card-img" />
                  <div className="gem-card-shadow"></div>
                </div>
                <h3 className="gem-card-name" style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '0.95rem' }}>
                  {gem.name.toUpperCase()}
                </h3>
                <p className="gem-card-benefit" style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', lineHeight: '1.3' }}>{gem.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: 'var(--space-xl)', maxWidth: 500, position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)', fontSize: '0.85rem' }}></i>
        <input
          type="text" placeholder="Search gems, jewelry, categories, origin..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(12); }}
          style={{ width: '100%', padding: '0.7rem 1.5rem 0.7rem 2.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)' }}
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setVisibleCount(12); }} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', fontSize: '0.85rem' }}><i className="fas fa-times"></i></button>
        )}
      </div>

      {/* Active Filters Display */}
      {(caratParam || priceParam || purposeParam) && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-xl)', background: 'var(--color-white)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-200)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: 600 }}>Active Filters:</span>
          {purposeParam && (
            <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'var(--color-gray-100)', color: 'var(--color-dark)', borderRadius: '2rem', display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}>
              Purpose: {purposeParam}
            </span>
          )}
          {caratParam && (
            <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'var(--color-gray-100)', color: 'var(--color-dark)', borderRadius: '2rem', display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}>
              Carat: {caratParam}
            </span>
          )}
          {priceParam && (
            <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'var(--color-gray-100)', color: 'var(--color-dark)', borderRadius: '2rem', display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}>
              Price: {priceParam === 'under-10000' ? 'Under ₹10,000' : priceParam === '10000-50000' ? '₹10,000 - ₹50,000' : priceParam === '50000-100000' ? '₹50,000 - ₹1,00,000' : 'Above ₹1,00,000'}
            </span>
          )}
          <button 
            onClick={() => {
              const nextParams = {};
              if (currentCategory !== 'All') nextParams.cat = currentCategory;
              if (currentTypeFilter !== 'All') nextParams.type = currentTypeFilter;
              if (searchQuery) nextParams.search = searchQuery;
              setSearchParams(nextParams);
            }} 
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Filter & Sort Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justify: 'flex-end', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)' }}>Sort By:</label>
          <select className="form-select" value={currentSort} onChange={(e) => setCurrentSort(e.target.value)} style={{ padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', outline: 'none' }}>
            <option value="Recommended">Recommended</option>
            <option value="Price Low-High">Price: Low to High</option>
            <option value="Price High-Low">Price: High to Low</option>
            <option value="Highest Rated">Highest Rated</option>
            <option value="Newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--color-gray-500)' }}>
          <i className="fas fa-gem" style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.3, display: 'block', color: 'var(--color-gold)' }}></i>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>No Gemstones Found</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>We couldn't find any products matching your selection.</p>
          <button className="btn btn-gold btn-md" onClick={() => selectCategory('All')}>View All Collection</button>
        </div>
      ) : (
        <div className="product-grid">
          {toShow.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <button className="btn btn-outline-gold btn-lg" onClick={() => setVisibleCount(prev => prev + 8)}>
            Load More Products <i className="fas fa-chevron-down" style={{ marginLeft: 8 }}></i>
          </button>
        </div>
      )}

      {/* Gemstone Benefits Section */}
      {currentCategory !== 'All' && gemBenefits[currentCategory] && (
        <div className="gem-benefits-section" style={{
          marginTop: '4rem',
          background: 'var(--color-gray-50)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          border: '1px solid var(--color-gray-200)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'var(--color-dark)',
            marginBottom: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            <i className="fas fa-magic" style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}></i>
            Astrological Benefits of {currentCategory}
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {gemBenefits[currentCategory].map((benefit, idx) => (
              <li key={idx} style={{
                background: 'var(--color-white)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'var(--color-gray-100)',
                  color: 'var(--color-gold-dark)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-gray-600)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {benefit}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

const gemBenefits = {
  "Yellow Sapphire": [
    "Enhances wisdom, academic success, and overall prosperity by aligning with Jupiter's benevolent energy.",
    "Promotes spiritual growth, mental clarity, and marital bliss."
  ],
  "Blue Sapphire": [
    "Brings rapid professional growth, career breakthrough, and financial stability under Saturn's influence.",
    "Protects against negative energies, accidents, and mental confusion."
  ],
  "Emerald": [
    "Boosts communication skills, cognitive abilities, and intellect, making it ideal for business leaders and scholars.",
    "Promotes emotional healing, physical vitality, and creative expression."
  ],
  "Ruby": [
    "Boosts self-confidence, leadership qualities, and personal authority by drawing power from the Sun.",
    "Improves blood circulation, cardiac health, and vital energy levels."
  ],
  "Opal": [
    "Enhances artistic abilities, luxury, physical charm, and romantic compatibility under Venus.",
    "Helps in healing emotional trauma and balancing physical wellness."
  ],
  "Pearl": [
    "Calms the mind, pacifies anger, and relieves anxiety by balancing the lunar energies.",
    "Enhances emotional stability, skin health, and sleep quality."
  ],
  "Red Coral": [
    "Infuses courage, physical strength, and determination to overcome enemies and obstacles.",
    "Helps in clearing debts, resolving martial discord, and boosting immunity."
  ],
  "Hessonite": [
    "Clears confusion, enhances focus, and provides protection against sudden downfalls.",
    "Attracts speculatory wealth, fame, and success in research or tech sectors."
  ],
  "Cats Eye": [
    "Protects against hidden enemies, spiritual blockages, and sudden negative Ketu influences.",
    "Enhances intuitive abilities, spiritual awareness, and luck in speculative ventures."
  ],
  "White Sapphire": [
    "Attracts luxury, artistic success, and sophisticated wealth, acting as a powerful Venus alternative to diamond.",
    "Enhances beauty, charm, and harmony in marital and romantic relations."
  ]
};
