import { Link } from 'react-router-dom';
import { gemCategories } from '../data/products';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>VijayKumar</h3>
            <p>Curators of certified natural gemstones and fine rings since generations. Every gem tells a story of trust, tradition, and timeless beauty.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Gemstones</h4>
            <ul>
              {gemCategories.map(c => (
                <li key={c}><Link to={`/shop?cat=${encodeURIComponent(c)}`}>{c}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Rings</h4>
            <ul>
              <li><Link to="/shop?cat=Rings">All Rings</Link></li>
              <li style={{ marginTop: '1rem' }}><Link to="/about"><strong>About Us</strong></Link></li>
              <li><Link to="/contact"><strong>Contact</strong></Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Concierge</h4>
            <ul>
              <li style={{ color: 'var(--color-gray-400)', fontSize: '0.7rem', marginBottom: '0.75rem' }}>Available Mon—Sun, 9AM — 10PM</li>
              <li><a href="tel:+919092716427" style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-gold)' }}>+91 90927 16427</a></li>
              <li><a href="mailto:info@vijaykumardiamonds.com">info@vijaykumardiamonds.com</a></li>
              <li style={{ marginTop: '1rem' }}><Link to="/account">My Account</Link></li>
              <li><Link to="/cart">Shopping Bag</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} VijayKumar Diamonds &amp; Gems. All Rights Reserved.</p>
          <p>Real Gems. Real Value. ✦ Crafted with Perfection.</p>
        </div>
      </div>
    </footer>
  );
}
