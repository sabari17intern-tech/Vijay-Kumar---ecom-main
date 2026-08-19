import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useEffect(() => {
    // SEO setup
    document.title = "About Us | VijayKumar Diamonds & Gems";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Learn about VijayKumar Diamonds & Gems, a three-generation legacy of trust, purity, and Vedic astrological gemstones in Coimbatore.";
  }, []);

  return (
    <main style={{ paddingBottom: 'var(--space-4xl)' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('/images/hero.png')" }}></div>
        <div className="hero-overlay-dark"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 800, textAlign: 'center', margin: '0 auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem', display: 'block' }}>Our Legacy</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'var(--color-white)', lineHeight: 1.1, marginBottom: '1.5rem' }}>Three Generations of Trust &amp; Purity</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-200)', lineHeight: 1.6 }}>From the historic gemstone markets to a modern flagship experience, VijayKumar Diamonds &amp; Gems brings you uncompromised quality.</p>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="container" style={{ paddingTop: 'var(--space-4xl)' }}>
        <style>{`
          .about-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-3xl);
            align-items: center;
            margin-bottom: var(--space-4xl);
          }
          @media (min-width: 768px) {
            .about-grid {
              grid-template-columns: 1fr 1fr;
            }
            .about-grid.reverse .about-img-col {
              order: 2;
            }
            .about-grid.reverse .about-text-col {
              order: 1;
            }
          }
          .about-img-col {
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            background: var(--color-gray-50);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
          }
          .about-img-col img {
            width: 100%;
            height: auto;
            max-height: 500px;
            object-fit: cover;
          }
        `}</style>
        
        <div className="about-grid">
          <div className="about-text-col">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1rem' }}>The Beginning</h2>
            <div className="gold-line" style={{ marginLeft: 0, marginBottom: '1.5rem' }}></div>
            <p style={{ fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Founded decades ago in the bustling heart of the gem trade, VijayKumar began with a singular vision: to make certified, natural, and astrologically potent gemstones accessible to those who value purity.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.8 }}>
              Our founders traveled directly to the mines of Sri Lanka, Colombia, and Burma to handpick stones, completely bypassing the opaque middle-man layers. This direct sourcing allowed us to guarantee authenticity from the source itself.
            </p>
          </div>
          <div className="about-img-col">
            <img src="/images/nine_gemstones_banner.png" alt="Navaratna Gemstones Collection" style={{ objectFit: 'contain', padding: '1rem' }} />
          </div>
        </div>

        <div className="about-grid reverse">
          <div className="about-img-col">
            <img src="/images/necklace.png" alt="Exquisite Jewelry Craftsmanship" style={{ objectFit: 'contain', padding: '2rem' }} />
          </div>
          <div className="about-text-col">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1rem' }}>The Craftsmanship</h2>
            <div className="gold-line" style={{ marginLeft: 0, marginBottom: '1.5rem' }}></div>
            <p style={{ fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
              A fine gemstone demands a setting that matches its majesty. Our in-house karigars (artisans) bring generations of traditional gold-smithing techniques, combined with modern precision.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.8 }}>
              Every ring and pendant is cast in solid 18K or 22K gold, meticulously finished, and sent for rigorous BIS Hallmarking. We don't just sell jewelry; we craft heirlooms.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background: 'var(--color-ivory)', padding: 'var(--space-4xl) 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">Our Core Values</h2>
            <div className="gold-line"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
            {[
              { icon: 'fas fa-search', title: 'Absolute Transparency', desc: 'No hidden treatments or vague origins. What you see on the certificate is exactly what you get.' },
              { icon: 'fas fa-hand-holding-heart', title: 'Astrological Integrity', desc: 'We understand the sacred nature of Navaratna gems. Our stones are untouched by unethical treatments, ensuring maximum planetary resonance.' },
              { icon: 'fas fa-gem', title: 'Uncompromising Quality', desc: 'We reject 90% of the stones we evaluate. Only the gems with the finest color, clarity, and cut make it to our catalog.' },
            ].map((v, i) => (
              <div key={i} style={{ background: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <i className={v.icon} style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginBottom: '1.5rem' }}></i>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingTop: 'var(--space-4xl)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Ready to find your perfect gem?</h2>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>Browse our curated collection or speak to our gemologists today.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/shop" className="btn btn-gold btn-lg">Explore Collection</Link>
          <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
        </div>
      </section>
    </main>
  );
}
