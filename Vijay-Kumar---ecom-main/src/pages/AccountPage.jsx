import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, formatPrice, getProduct } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function AccountPage() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout, login, showToast, orders, wishlist, updateUser } = useStore();
  const [activeTab, setActiveTab] = useState('orders');

  // OTP Login State
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setOtpSent(true);
    showToast('Verification OTP code sent successfully!', 'success');
  };

  const handleOtpInput = (index, value, e) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 5) otpRefs.current[index + 1].focus();
    else if (e.key === 'Backspace' && index > 0) otpRefs.current[index - 1].focus();
  };

  const handleVerifyOTP = () => {
    if (otp.join('') === '123456') {
      login(phone);
      setOtpSent(false);
      setPhone('');
      setOtp(['', '', '', '', '', '']);
    } else {
      showToast('Invalid verification code. Use 123456.', 'error');
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUser({ name: profileName, email: profileEmail });
    showToast('Profile updated successfully!', 'success');
  };

  // Re-use invoice logic from CheckoutPage by navigating there or implementing a simpler view if needed
  // For now, redirecting to a print view or simply showing toast since full html2pdf requires the hidden template
  const downloadInvoice = (order) => {
    showToast('To download invoice, please view order confirmation page. (PDF generation in Account tab coming soon)', 'info');
  };

  if (!isLoggedIn()) {
    return (
      <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-4xl)' }}>
        <div style={{ maxWidth: 450, margin: '0 auto', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-gray-100)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: '50%', background: 'var(--color-ivory)', color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: '1rem' }}>
              <i className="fas fa-user-lock"></i>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign In</h1>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>Access your orders, wishlist, and exclusive offers.</p>
          </div>

          {!otpSent ? (
            <div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Mobile Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ padding: '0.6rem 0.75rem', border: '1.5px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', background: 'var(--color-gray-50)' }}>+91</span>
                  <input type="tel" className="form-input" placeholder="Enter 10-digit number" style={{ marginBottom: 0 }} maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <button onClick={handleSendOTP} className="btn btn-gold btn-full btn-lg">Send Secure OTP</button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-sm)' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Enter 6-Digit OTP</label>
                  <button onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'var(--color-gold-dark)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Change Number</button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginBottom: 'var(--space-sm)' }}>Demo OTP is <strong style={{ color: 'var(--color-dark)' }}>123456</strong></p>
                <div className="otp-container" style={{ marginBottom: 'var(--space-lg)' }}>
                  {otp.map((digit, idx) => (
                    <input key={idx} type="text" className="otp-box" maxLength={1} value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value, e)}
                      onKeyUp={(e) => handleOtpInput(idx, e.target.value, e)}
                      ref={el => otpRefs.current[idx] = el}
                    />
                  ))}
                </div>
                <button onClick={handleVerifyOTP} className="btn btn-gold btn-full btn-lg">Verify &amp; Sign In</button>
                <button onClick={() => showToast('New code sent!', 'success')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-dark)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, marginTop: 'var(--space-md)', display: 'block', textAlign: 'center', width: '100%' }}>Resend Code</button>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <span className="current">My Account</span>
      </div>

      <div id="account-layout-grid">
        {/* Sidebar */}
        <div className="account-sidebar-card">
          <div className="account-profile-header">
            <div className="profile-avatar" style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-ivory)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem auto', flexShrink: 0 }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <i className="far fa-user"></i>}
            </div>
            <div className="account-profile-header-info">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{currentUser.name || 'Valued Customer'}</h3>
              <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: 0 }}>{currentUser.phone}</p>
            </div>
          </div>

          <div className="account-nav-list">
            <button onClick={() => setActiveTab('orders')} className={`btn ${activeTab === 'orders' ? 'btn-gold' : 'btn-outline'} btn-sm account-nav-btn`}>
              <i className="fas fa-box-open" style={{ width: 20 }}></i> My Orders
            </button>
            <button onClick={() => setActiveTab('wishlist')} className={`btn ${activeTab === 'wishlist' ? 'btn-gold' : 'btn-outline'} btn-sm account-nav-btn`}>
              <i className="far fa-heart" style={{ width: 20 }}></i> Wishlist ({wishlist.length})
            </button>
            <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-gold' : 'btn-outline'} btn-sm account-nav-btn`}>
              <i className="far fa-user-circle" style={{ width: 20 }}></i> Profile Settings
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm account-nav-btn" style={{ color: 'var(--color-red)' }}>
              <i className="fas fa-sign-out-alt" style={{ width: 20 }}></i> Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="account-content-card">
          
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Order History</h2>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <i className="fas fa-box-open" style={{ fontSize: '3rem', color: 'var(--color-gray-300)', marginBottom: '1rem' }}></i>
                  <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="btn btn-outline-gold">Start Shopping</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  {orders.map((order, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <div className="order-history-header">
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Order Placed</p>
                          <p style={{ fontWeight: 600 }}>{order.date}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Total Amount</p>
                          <p style={{ fontWeight: 600, color: 'var(--color-gold-dark)' }}>{formatPrice(order.total)}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Order #</p>
                          <p style={{ fontWeight: 600 }}>{order.id}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <button onClick={() => downloadInvoice(order)} className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem' }}>
                            <i className="fas fa-file-pdf" style={{ marginRight: 6, color: 'var(--color-gold-dark)' }}></i> Invoice
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-green)', fontWeight: 600 }}>
                          <i className={order.statusIcon}></i> {order.status}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {order.items.map((item, i) => {
                            const p = item.product;
                            if(!p) return null;
                            const price = item.options?.price || p.price;
                            return (
                              <div key={i} className="order-history-item">
                                <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                                <div className="order-history-item-details">
                                  <Link to={`/product?id=${p.id}`} style={{ fontWeight: 600, color: 'var(--color-dark)', display: 'block', marginBottom: '0.2rem' }}>{p.name}</Link>
                                  {item.options?.wearType && item.options.wearType !== 'Loose' && <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>Mounted as {item.options.wearType} ({item.options.metal})</div>}
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.2rem' }}>Qty: {item.qty}</div>
                                </div>
                                <div className="order-history-item-price">{formatPrice(price * item.qty)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <i className="far fa-heart" style={{ fontSize: '3rem', color: 'var(--color-gray-300)', marginBottom: '1rem' }}></i>
                  <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.5rem' }}>Your wishlist is empty.</p>
                  <Link to="/shop" className="btn btn-outline-gold">Explore Collection</Link>
                </div>
              ) : (
                <div className="product-grid">
                  {wishlist.map(id => {
                    const p = getProduct(id);
                    return p ? <ProductCard key={id} product={p} /> : null;
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Profile Settings</h2>
              <form onSubmit={handleProfileSave} style={{ maxWidth: 500 }}>
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Mobile Number</label>
                  <input type="text" className="form-input" value={currentUser.phone} disabled style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)' }} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)', marginTop: '0.3rem' }}>Phone number cannot be changed as it is your login ID.</p>
                </div>
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Raj Patel" value={profileName} onChange={e => setProfileName(e.target.value)} />
                </div>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="e.g. raj@example.com" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-gold">Save Changes</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
