import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products, gemCategories, metalPrices } from '../data/products';
import { useStore, formatPrice, getDiscount, generateStars, getProduct } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const product = getProduct(productId);
  const { addToCart, toggleWishlistItem, isInWishlist, addToRecentlyViewed, recentlyViewed, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('description');
  const [wearType, setWearType] = useState('Ring');
  const [selectedMetal, setSelectedMetal] = useState('');
  const [ringSize, setRingSize] = useState('');
  const [engravingText, setEngravingText] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [selectedStone, setSelectedStone] = useState(product ? product.category : 'Ruby');
  const [selectedCarat, setSelectedCarat] = useState(product ? parseFloat(product.carat) : 3);
  
  // Track the active product ID so we know when to reset the image
  const [activeProductId, setActiveProductId] = useState(product?.id);
  const [currentImage, setCurrentImage] = useState(product ? product.image : '');

  // Reset image immediately when navigating to a new product
  if (product && product.id !== activeProductId) {
    setActiveProductId(product.id);
    setCurrentImage(product.image);
    setSelectedStone(product.category);
    setSelectedCarat(parseFloat(product.carat) || 3);
  }

  useEffect(() => {
    if (product) {
      setSelectedStone(product.category);
      setSelectedCarat(parseFloat(product.carat) || 3);
      setCurrentImage(product.image);
    }
  }, [product?.id]);

  const checkPincode = () => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const delDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      setDeliveryResult({ success: true, message: `Estimated delivery by ${delDate}` });
    } else {
      setDeliveryResult({ success: false, message: 'Invalid PIN code.' });
    }
  };

  useEffect(() => {
    if (productId) {
      addToRecentlyViewed(productId);
    }
    window.scrollTo(0, 0);
  }, [productId, addToRecentlyViewed]);

  if (!product) {
    return (
      <main className="container" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)', textAlign: 'center' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '1rem' }}></i>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-gray-500)', margin: '1rem 0' }}>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn btn-gold">Browse Collection</Link>
      </main>
    );
  }

  const discount = getDiscount(product);
  const stars = generateStars(product.rating);
  const isCustomizable = product.isCustomBuilder;
  const isRing = product.category === 'Rings' || (product.isRing && !product.isCustomBuilder);
  const inWish = isInWishlist(product.id);

  // Price calculation
  let mountingPrice = 0;
  if (isCustomizable && wearType !== 'Loose' && selectedMetal) {
    mountingPrice = metalPrices[wearType]?.[selectedMetal] || 0;
  }
  
  const pricePerCaratMap = {
    "Ruby": 58730, "Blue Sapphire": 59659, "Emerald": 103508, "Yellow Sapphire": 22619,
    "Pearl": 3500, "Red Coral": 3294, "Hessonite": 3103, "Opal": 22058, "Cats Eye": 8235, "White Sapphire": 30645
  };

  const finalPrice = isCustomizable
    ? Math.round((selectedCarat * (pricePerCaratMap[selectedStone] || 30000)) + mountingPrice)
    : product.price + mountingPrice;

  const handleAddToCart = () => {
    const options = isCustomizable ? {
      stone: selectedStone,
      carat: selectedCarat,
      wearType: wearType === 'Loose' ? 'Ring' : wearType,
      metal: selectedMetal,
      size: wearType === 'Ring' ? ringSize : null,
      engraving: engravingText || null,
      price: finalPrice
    } : isRing ? { size: ringSize || null, price: product.price } : null;

    if (isCustomizable && !selectedMetal) {
      showToast('Please select a metal type', 'error');
      return;
    }
    if ((isCustomizable && wearType === 'Ring' || isRing) && !ringSize) {
      showToast('Please select a ring size', 'error');
      return;
    }

    addToCart(product.id, 1, options);
  };

  // Related products
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);
  const recentProducts = recentlyViewed.filter(id => id !== product.id).map(getProduct).filter(Boolean).slice(0, 6);

  return (
    <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/shop">Shop</Link> <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(product.category)}`}>{product.category}</Link> <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Product Detail Grid */}
      <div className="product-detail-grid">
        {/* Left: Image Gallery */}
        <div className="product-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="product-main-image" style={{ position: 'relative', width: '100%', minHeight: '350px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-gray-200)' }}>
            <img src={currentImage || product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'all 0.3s ease' }} id="main-product-img" />
            {product.badge && <span className="product-card-badge" style={{ top: '1rem', left: '1rem', fontSize: '0.7rem', padding: '0.25rem 0.75rem' }}>{product.badge}</span>}
            <button className={`product-card-wishlist ${inWish ? 'active' : ''}`} onClick={(e) => toggleWishlistItem(product.id, e)} style={{ position: 'absolute', top: '1rem', right: '1rem', width: 36, height: 36 }}>
              <i className={`${inWish ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          </div>
          
          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
              {product.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImage(img)}
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    border: (currentImage || product.image) === img ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-200)', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    flexShrink: 0,
                    background: 'var(--color-gray-50)',
                    padding: '4px'
                  }}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="product-info-panel">
          <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', marginBottom: '0.3rem', display: 'block' }}>{product.category} · {product.cert}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark)', margin: '0 0 0.5rem 0' }}>{product.name}</h1>

          <div className="product-card-rating" style={{ marginBottom: '0.75rem' }} dangerouslySetInnerHTML={{ __html: stars + `<span style="margin-left:0.5rem;font-weight:600">${product.rating}</span><span style="color:var(--color-gray-400);margin-left:0.25rem">(${product.reviews} reviews)</span>` }}></div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>{product.desc}</p>

          {/* Transparent Pricing Breakdown */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-dark)' }}>{formatPrice(finalPrice)}</span>
              {discount > 0 && (
                <>
                  <span style={{ fontSize: '1.2rem', color: 'var(--color-gray-400)', textDecoration: 'line-through' }}>{formatPrice(product.mrp + mountingPrice)}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-green)', background: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>{discount}% OFF</span>
                </>
              )}
            </div>
            
            <div className="emi-preview">
              <i className="fas fa-credit-card"></i> EMI starts at {formatPrice(Math.round(finalPrice / 12))}/month. 
            </div>

            <div className="pricing-breakdown">
              <div className="pricing-row">
                <span>Gemstone Price</span>
                <span>{formatPrice(product.price)}</span>
              </div>
              {mountingPrice > 0 && (
                <div className="pricing-row">
                  <span>{selectedMetal} ({wearType} Mounting)</span>
                  <span>{formatPrice(mountingPrice)}</span>
                </div>
              )}
              <div className="pricing-row total">
                <span>Total Amount (Inclusive of GST)</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Pincode */}
          <div style={{ marginBottom: 'var(--space-xl)', background: 'var(--color-white)', padding: '1rem', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark)', display: 'block' }}>
              <i className="fas fa-truck" style={{ color: 'var(--color-gold)', marginRight: '6px' }}></i>
              Check Delivery Estimate
            </label>
            <div className="pincode-checker">
              <input type="text" placeholder="Enter Delivery Pincode" maxLength="6" value={pincode} onChange={e => setPincode(e.target.value)} />
              <button onClick={checkPincode}>Check</button>
            </div>
            {deliveryResult && (
              <div className={`pincode-result ${deliveryResult.success ? 'success' : 'error'}`}>
                <i className={`fas fa-${deliveryResult.success ? 'check-circle' : 'exclamation-circle'}`}></i> {deliveryResult.message}
              </div>
            )}
          </div>

          {/* Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: 'var(--space-xl)' }}>
            {[
              { label: 'Carat', value: product.carat },
              { label: 'Origin', value: product.origin },
              { label: 'Cut', value: product.cut },
              { label: 'Color', value: product.color },
              { label: 'Clarity', value: product.clarity },
              { label: 'Treatment', value: product.treatment },
            ].map((spec, i) => (
              <div key={i} style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', marginBottom: '0.15rem' }}>{spec.label}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-dark)' }}>{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Customization - Gemstones */}
          {isCustomizable && (
            <div style={{ marginBottom: 'var(--space-xl)', border: '1.5px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Customize Your Stone</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.35rem' }}>Select Stone</label>
                  <select className="form-select" value={selectedStone} onChange={(e) => setSelectedStone(e.target.value)} style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 2.2rem 0.4rem 0.75rem' }}>
                    {gemCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.35rem' }}>Carat Weight</label>
                  <select className="form-select" value={selectedCarat} onChange={(e) => setSelectedCarat(parseFloat(e.target.value))} style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 2.2rem 0.4rem 0.75rem' }}>
                    {[2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8].map(c => (
                      <option key={c} value={c}>{c} Carats</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.35rem' }}>How would you like it?</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Ring', 'Pendant'].map(type => (
                    <button key={type} onClick={() => { setWearType(type); setSelectedMetal(''); setRingSize(''); }}
                      className={`btn btn-sm ${wearType === type ? 'btn-gold' : 'btn-outline'}`}
                      style={{ fontSize: '0.7rem', padding: '0.4rem 1rem' }}>{`In ${type}`}</button>
                  ))}
                </div>
              </div>
              {wearType !== 'Loose' && (
                <>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.35rem' }}>Metal Type</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {Object.keys(metalPrices[wearType] || {}).map(metal => (
                        <button key={metal} onClick={() => setSelectedMetal(metal)}
                          className={`btn btn-sm ${selectedMetal === metal ? 'btn-gold' : 'btn-outline'}`}
                          style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>
                          {metal} (+{formatPrice(metalPrices[wearType][metal])})
                        </button>
                      ))}
                    </div>
                  </div>
                  {wearType === 'Ring' && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.35rem' }}>Ring Size</label>
                      <select className="form-select" value={ringSize} onChange={(e) => setRingSize(e.target.value)} style={{ maxWidth: 200, fontSize: '0.8rem', padding: '0.4rem 2.2rem 0.4rem 0.75rem' }}>
                        <option value="">Select Size</option>
                        {[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Ring size for Rings category */}
          {isRing && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.35rem' }}>Ring Size</label>
              <select className="form-select" value={ringSize} onChange={(e) => setRingSize(e.target.value)} style={{ maxWidth: 200, fontSize: '0.8rem', padding: '0.4rem 2.2rem 0.4rem 0.75rem' }}>
                <option value="">Select Size</option>
                {[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
            <button className="btn btn-gold btn-lg" style={{ flex: 2 }} onClick={handleAddToCart}>
              <i className="fas fa-shopping-bag" style={{ marginRight: 8 }}></i>Add to Bag
            </button>
            <button className={`btn ${inWish ? 'btn-outline' : 'btn-outline'} btn-lg`} style={{ flex: 1, color: inWish ? 'var(--color-red)' : '' }} onClick={(e) => toggleWishlistItem(product.id, e)}>
              <i className={`${inWish ? 'fas' : 'far'} fa-heart`} style={{ marginRight: 6 }}></i>{inWish ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Secondary CTA */}
          <a href={`https://wa.me/919092716427?text=Hi,%20I%20need%20a%20free%20astrological%20consultation%20for%20the%20${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn-astrologer">
              <i className="fab fa-whatsapp"></i> Talk to Expert Astrologer
            </button>
          </a>

          {/* Trust Badges */}
          <div className="trust-badges-row">
            <div className="trust-badge-item">
              <i className="fas fa-certificate" style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}></i>
              <div>
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Certified by</span>
                <span>{product.cert} Lab</span>
              </div>
            </div>
            <div className="trust-badge-item">
              <i className="fas fa-gem" style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}></i>
              <div>
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Guarantee</span>
                <span>100% Natural</span>
              </div>
            </div>
          </div>

          {/* Astrological Properties */}
          {product.astrology && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-om" style={{ color: 'var(--color-gold)' }}></i> Astrological Properties
              </h3>
              <div className="astrology-grid">
                <div className="astro-item">
                  <span className="astro-item-label">Ruling Planet</span>
                  <span className="astro-item-value">{product.astrology.planet}</span>
                </div>
                <div className="astro-item">
                  <span className="astro-item-label">Wearing Finger</span>
                  <span className="astro-item-value">{product.astrology.finger}</span>
                </div>
                <div className="astro-item">
                  <span className="astro-item-label">Wearing Day</span>
                  <span className="astro-item-value">{product.astrology.day}</span>
                </div>
                <div className="astro-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="astro-item-label">Vedic Mantra</span>
                  <span className="astro-item-value" style={{ fontStyle: 'italic', color: 'var(--color-gold-dark)' }}>"{product.astrology.mantra}"</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <section style={{ marginTop: 'var(--space-3xl)' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-gray-200)', marginBottom: 'var(--space-xl)' }}>
          {['description', 'specifications', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid var(--color-gold)' : '2px solid transparent', color: activeTab === tab ? 'var(--color-dark)' : 'var(--color-gray-500)', marginBottom: '-2px' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === 'description' && (
          <div style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--color-gray-600)' }}>
            <p>{product.desc}</p>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {product.details.map((d, i) => <li key={i} style={{ marginBottom: '0.3rem' }}>{d}</li>)}
            </ul>
          </div>
        )}
        {activeTab === 'specifications' && (
          <div style={{ maxWidth: 500 }}>
            {[
              ['Name', product.name], ['Category', product.category], ['Carat Weight', product.carat],
              ['Origin', product.origin], ['Cut / Shape', product.cut], ['Color', product.color],
              ['Clarity', product.clarity], ['Treatment', product.treatment], ['Certification', product.cert],
            ].map(([label, val], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--color-gray-100)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-gray-500)', fontWeight: 600 }}>{label}</span>
                <span style={{ color: 'var(--color-dark)', fontWeight: 700 }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'reviews' && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-gray-400)' }}>
            <i className="fas fa-star" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3, display: 'block', color: 'var(--color-gold)' }}></i>
            <p style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>{product.reviews} Verified Reviews</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Rating: {product.rating}/5 · Reviews coming soon</p>
          </div>
        )}
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ marginTop: 'var(--space-4xl)' }}>
          <div className="section-header">
            <span className="section-label">You May Also Like</span>
            <h2 className="section-title">Related Gemstones</h2>
            <div className="gold-line"></div>
          </div>
          <div className="product-grid hide-scrollbar featured-scroll">
            {related.map(p => (
              <div key={p.id} className="featured-product-wrapper"><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section style={{ marginTop: 'var(--space-3xl)' }}>
          <div className="section-header">
            <span className="section-label">Recently Browsed</span>
            <h2 className="section-title">Recently Viewed</h2>
            <div className="gold-line"></div>
          </div>
          <div className="product-grid hide-scrollbar featured-scroll">
            {recentProducts.map(p => (
              <div key={p.id} className="featured-product-wrapper"><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
