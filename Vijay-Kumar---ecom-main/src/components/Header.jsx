import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore, formatPrice, getProduct, getOptionSummary, searchProducts } from '../context/StoreContext';
import { gemCategories, categoryImages } from '../data/products';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cart, wishlist, getCartCount, getCartSubtotal, getCartTotal, appliedPromo,
    updateCartQty, toggleWishlistItem, addToCart, applyPromoCode,
    isLoggedIn, currentUser
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [rashiDropdownOpen, setRashiDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const showFloats = isHome && scrollY < 400;

  const rashiRatnas = [
    { name: "Blue Sapphire", label: "Blue Sapphire (Neelam)", image: "/images/blue_sapphire.png" },
    { name: "Cats Eye", label: "Cats Eye", image: "/images/cats_eye.png" },
    { name: "Emerald", label: "Emerald (Panna Stone)", image: "/images/emerald.png" },
    { name: "Hessonite", label: "Hessonite (Gomed Stone)", image: "/images/hessonite.png" },
    { name: "Pearl", label: "Pearl (Moti)", image: "/images/pearl.png" },
    { name: "Ruby", label: "Ruby (Manik Stone)", image: "/images/ruby.png" },
    { name: "Red Coral", label: "Red Coral (Moonga)", image: "/images/coral.png" },
    { name: "White Sapphire", label: "White Sapphire", image: "/images/white_sapphire.png" },
    { name: "Yellow Sapphire", label: "Yellow Sapphire (Pukhraj Stone)", image: "/images/yellow_sapphire.png" }
  ];

  const currentPage = location.pathname === '/' ? 'index' : location.pathname.replace('/', '');
  const cartCount = getCartCount();
  const wishCount = wishlist.length;

  // Close sidebars on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCartSidebarOpen(false);
    setWishlistSidebarOpen(false);
  }, [location.pathname]);

  // Body overflow lock
  useEffect(() => {
    document.body.style.overflow =
      (mobileMenuOpen || searchOpen || cartSidebarOpen || wishlistSidebarOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, searchOpen, cartSidebarOpen, wishlistSidebarOpen]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    setSearchResults(searchProducts(q));
  }, []);

  const closeAllSidebars = () => {
    setCartSidebarOpen(false);
    setWishlistSidebarOpen(false);
  };

  const toggleCartSidebar = () => {
    const wasOpen = cartSidebarOpen;
    closeAllSidebars();
    if (!wasOpen) setCartSidebarOpen(true);
  };

  const toggleWishlistSidebar = () => {
    const wasOpen = wishlistSidebarOpen;
    closeAllSidebars();
    if (!wasOpen) setWishlistSidebarOpen(true);
  };

  const getPageTitle = (page) => {
    switch (page) {
      case 'shop': return 'Collection';
      case 'about': return 'Our Story';
      case 'contact': return 'Contact';
      case 'cart': return 'Shopping Bag';
      case 'checkout': return 'Checkout';
      case 'account': return 'My Account';
      case 'product': return 'Product Details';
      default: return 'VijayKumar';
    }
  };

  const goBackOrHome = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const subtotal = getCartSubtotal();
  const discountAmt = subtotal * appliedPromo;
  const total = getCartTotal();

  return (
    <>

      <header className={`main-header ${scrolled ? 'scrolled' : ''} ${isHome ? 'is-home' : ''}`} id="main-header">
        <div className="container">
          <div className="header-inner">
            {isHome ? (
              <button className="hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
                <span></span><span></span><span></span>
              </button>
            ) : (
              <button className="header-back-btn" onClick={goBackOrHome} aria-label="Back">
                <i className="fas fa-chevron-left"></i>
              </button>
            )}

            {isHome ? (
              <Link to="/" className="logo-link">
                <img src="/images/new logo.png" alt="VK Logo" className="logo-img" />
                <span className="header-brand-name" style={{ marginLeft: 0 }}>
                  VijayKumar
                  <small>Diamonds &amp; Gems</small>
                </span>
              </Link>
            ) : (
              <div className="subpage-header-title">{getPageTitle(currentPage)}</div>
            )}

            <nav className="desktop-nav">
              <div className="nav-item">
                <Link to="/shop" className={`nav-link ${currentPage === 'shop' ? 'active' : ''}`}>Gemstones</Link>
                <div className="nav-dropdown">
                  {gemCategories.map(c => (
                    <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`}>
                      <img src={categoryImages[c]} alt={c} /> {c}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/shop?cat=Rings" className="nav-link">Rings</Link>
              <Link to="/about" className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}>About</Link>
              <Link to="/contact" className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}>Contact</Link>
            </nav>

            <div className="header-icons">
              <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                <i className="fas fa-search"></i>
              </button>
              <button className="icon-btn desktop-only" onClick={() => navigate('/account')} aria-label="Account">
                <i className="far fa-user"></i>
              </button>
              <button className="icon-btn desktop-only" onClick={toggleWishlistSidebar} aria-label="Wishlist">
                <i className="far fa-heart"></i>
                <span className={`icon-badge ${wishCount > 0 ? 'visible' : ''}`}>{wishCount}</span>
              </button>
              <button className="icon-btn" onClick={toggleCartSidebar} aria-label="Cart">
                <i className="fas fa-shopping-bag"></i>
                <span className={`icon-badge ${cartCount > 0 ? 'visible' : ''}`}>{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <img src="/images/logo.png" alt="VK Logo" className="logo-img" style={{ height: '30px', width: 'auto', border: 'none', borderRadius: 0 }} />
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-dark)', letterSpacing: '0.05em' }}>VijayKumar</span>
          <button onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.3rem', color: 'var(--color-dark)', marginLeft: 'auto' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>Home</span><i className="fas fa-chevron-right"></i></Link>
          
          {/* Collapsible Dropdown for Precious Stones */}
          <div className={`mobile-nav-dropdown-wrap ${rashiDropdownOpen ? 'active' : ''}`}>
            <button 
              className="mobile-nav-link dropdown-toggle" 
              onClick={(e) => { e.preventDefault(); setRashiDropdownOpen(!rashiDropdownOpen); }}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', outline: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>Precious Stones</span>
              <i className="fas fa-chevron-down dropdown-chevron" style={{ transform: rashiDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}></i>
            </button>
            
            <div className={`mobile-nav-dropdown-content ${rashiDropdownOpen ? 'expanded' : ''}`}>
              {rashiRatnas.map((item) => (
                <Link 
                  key={item.name} 
                  to={`/shop?cat=${encodeURIComponent(item.name)}`}
                  className="mobile-nav-dropdown-item"
                  onClick={() => { setMobileMenuOpen(false); setRashiDropdownOpen(false); }}
                >
                  <img src={item.image} alt={item.label} className="dropdown-item-img" />
                  <span className="dropdown-item-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link to="/shop?type=gems" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>Gemstones</span><i className="fas fa-chevron-right"></i></Link>
          <Link to="/shop?cat=Rings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>Rings</span><i className="fas fa-chevron-right"></i></Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>About Us</span><i className="fas fa-chevron-right"></i></Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>Contact</span><i className="fas fa-chevron-right"></i></Link>
        </div>
        <div className="mobile-menu-footer">
          <button onClick={() => { setMobileMenuOpen(false); navigate('/account'); }} className="btn btn-primary btn-full">
            <i className="far fa-user"></i> <span>{isLoggedIn() ? 'My Account' : 'Sign In / Register'}</span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={`search-overlay ${searchOpen ? 'open' : ''}`}>
        <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}>
          <i className="fas fa-times"></i>
        </button>
        <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <div className="search-input-wrap">
            <i className="fas fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search gemstones, rings..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus={searchOpen}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '2rem', fontSize: '0.8rem' }}>No results found</p>
            )}
            {searchResults.length > 0 && (
              <div className="product-grid" style={{ gap: '0.75rem' }}>
                {searchResults.map(p => (
                  <Link
                    key={p.id}
                    to={`/product?id=${p.id}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s', border: '1px solid var(--color-gray-100)' }}
                  >
                    <img src={p.image} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} alt={p.name} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-dark)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)' }}>{p.category}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold-dark)', marginTop: '0.2rem' }}>{formatPrice(p.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${(cartSidebarOpen || wishlistSidebarOpen) ? 'open' : ''}`} onClick={closeAllSidebars}></div>

      {/* Cart Sidebar */}
      <div className={`sidebar ${cartSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Shopping Bag ({cartCount})</h2>
          <button className="sidebar-close" onClick={() => setCartSidebarOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="sidebar-body hide-scrollbar">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-gray-400)' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '2rem', opacity: 0.4, marginBottom: '1rem', display: 'block' }}></i>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Your bag is empty</p>
              <Link to="/shop" className="btn btn-outline" style={{ marginTop: '1.5rem', fontSize: '0.6rem' }} onClick={() => setCartSidebarOpen(false)}>Explore Shop</Link>
            </div>
          ) : (
            cart.map((c, index) => {
              const p = getProduct(c.id);
              if (!p) return null;
              const price = c.options && c.options.price ? c.options.price : p.price;
              const optionsSummary = getOptionSummary(c.options);
              return (
                <div className="cart-item" key={`${c.id}-${index}`}>
                  <div className="cart-item-img"><Link to={`/product?id=${p.id}`} onClick={() => setCartSidebarOpen(false)}><img src={p.image} alt={p.name} /></Link></div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{p.name}</div>
                    {optionsSummary && <div style={{ fontSize: '0.6rem', color: 'var(--color-gold-dark)', margin: '0.15rem 0', lineHeight: 1.2 }}>{optionsSummary}</div>}
                    <div className="cart-item-price">{formatPrice(price)}</div>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateCartQty(index, -1)}><i className="fas fa-minus"></i></button>
                      <span className="qty-value">{c.qty}</span>
                      <button className="qty-btn" onClick={() => updateCartQty(index, 1)}><i className="fas fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="sidebar-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gray-500)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{formatPrice(subtotal)}</span>
            </div>
            {appliedPromo > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--color-green)' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Discount</span>
                <span style={{ fontFamily: 'var(--font-serif)' }}>-{formatPrice(discountAmt)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-gray-200)', paddingTop: '0.5rem', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-full" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }} onClick={() => setCartSidebarOpen(false)}>Proceed to Checkout</Link>
            <Link to="/cart" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gray-500)' }} onClick={() => setCartSidebarOpen(false)}>View Full Cart</Link>
          </div>
        )}
      </div>

      {/* Wishlist Sidebar */}
      <div className={`sidebar ${wishlistSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2><i className="far fa-heart" style={{ color: 'var(--color-red)', marginRight: '0.5rem' }}></i>Wishlist</h2>
          <button className="sidebar-close" onClick={() => setWishlistSidebarOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="sidebar-body hide-scrollbar">
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-gray-400)' }}>
              <i className="far fa-heart" style={{ fontSize: '2rem', opacity: 0.4, marginBottom: '1rem', display: 'block' }}></i>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Your wishlist is empty</p>
            </div>
          ) : (
            wishlist.map(id => {
              const p = getProduct(id);
              if (!p) return null;
              return (
                <div className="cart-item" key={id}>
                  <div className="cart-item-img"><Link to={`/product?id=${p.id}`} onClick={() => setWishlistSidebarOpen(false)}><img src={p.image} alt={p.name} /></Link></div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{p.name}</div>
                    <div className="cart-item-price">{formatPrice(p.price)}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button onClick={() => { addToCart(p.id); toggleWishlistItem(p.id); }} className="btn btn-primary btn-sm" style={{ fontSize: '0.55rem', padding: '0.35rem 0.75rem' }}>Move to Bag</button>
                      <button onClick={() => toggleWishlistItem(p.id)} className="btn btn-sm" style={{ fontSize: '0.55rem', padding: '0.35rem 0.75rem', color: 'var(--color-red)', border: '1px solid var(--color-gray-200)' }}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" id="mobile-bottom-nav">
        <Link to="/" className={`bottom-nav-item ${currentPage === 'index' ? 'active' : ''}`}><i className="fas fa-home"></i><span>Home</span></Link>
        <Link to="/shop" className={`bottom-nav-item ${currentPage === 'shop' ? 'active' : ''}`}><i className="fas fa-gem"></i><span>Shop</span></Link>
        <button className="bottom-nav-item" onClick={toggleWishlistSidebar}>
          <i className="far fa-heart"></i><span>Wishlist</span>
          <span className={`bottom-nav-badge ${wishCount > 0 ? 'visible' : ''}`}>{wishCount}</span>
        </button>
        <button className="bottom-nav-item" onClick={() => navigate('/account')}><i className="far fa-user"></i><span>Account</span></button>
      </nav>

      {/* Floating Cart Bar (Zepto-style) */}
      {cartCount > 0 && currentPage !== 'cart' && currentPage !== 'checkout' && (
        <div className="zepto-cart-bar visible" onClick={toggleCartSidebar}>
          <div className="zepto-cart-bar-left">
            <div className="zepto-cart-bar-icon-wrap">
              <i className="fas fa-shopping-bag"></i>
              <span className="zepto-cart-bar-badge">{cartCount}</span>
            </div>
            <div className="zepto-cart-bar-info">
              <span className="zepto-cart-bar-count">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
              <span className="zepto-cart-bar-total">{formatPrice(total)}</span>
            </div>
          </div>
          <div className="zepto-cart-bar-right">
            View Bag <i className="fas fa-arrow-right"></i>
          </div>
        </div>
      )}

      {/* Floating contact icons (WhatsApp & Call) */}
      {isHome && (
        <>
          <a href="tel:+919842239007" className={`float-phone ${showFloats ? 'show' : 'hide'}`} aria-label="Call Us">
            <i className="fas fa-phone"></i>
          </a>
          <a href="https://wa.me/919842239007" className={`float-whatsapp ${showFloats ? 'show' : 'hide'}`} aria-label="WhatsApp Chat" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
          </a>
        </>
      )}
    </>
  );
}

function ToastContainer() {
  const { toasts } = useStore();
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map(t => {
        const icon = t.type === 'success' ? <i className="fas fa-check-circle" style={{ color: 'var(--color-gold)' }}></i> :
          t.type === 'error' ? <i className="fas fa-exclamation-circle"></i> :
          <i className="fas fa-info-circle" style={{ color: 'var(--color-gold)' }}></i>;
        return (
          <div key={t.id} className={`toast ${t.type} show`}>
            {icon} {t.msg}
          </div>
        );
      })}
    </div>
  );
}
