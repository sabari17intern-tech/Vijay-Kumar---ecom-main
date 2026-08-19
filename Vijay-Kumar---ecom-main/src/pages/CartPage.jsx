import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatPrice, getProduct, getOptionSummary } from '../context/StoreContext';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, getCartSubtotal, getCartTotal, appliedPromo, applyPromoCode } = useStore();
  const [promoInput, setPromoInput] = useState('');

  const subtotal = getCartSubtotal();
  const discountAmt = subtotal * appliedPromo;
  const shipping = subtotal >= 50000 ? 0 : (cart.length > 0 ? 500 : 0);
  const gst = Math.round(subtotal * 0.03);
  const total = (subtotal - discountAmt) + shipping + gst;

  return (
    <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <span className="current">Shopping Bag</span>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', color: 'var(--color-gray-300)', marginBottom: '1.5rem', display: 'block' }}></i>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your bag is empty</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.5rem' }}>Explore our collection of certified natural gemstones and fine jewelry.</p>
          <Link to="/shop" className="btn btn-gold btn-lg">Start Shopping <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i></Link>
        </div>
      ) : (
        <div className="cart-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
          {/* Items List */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-lg)', borderBottom: '1.5px solid var(--color-gray-100)', paddingBottom: 'var(--space-sm)' }}>
              Your Bag ({cart.reduce((s, c) => s + c.qty, 0)} Items)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {cart.map((item, index) => {
                const p = getProduct(item.id);
                if (!p) return null;
                const price = item.options && item.options.price ? item.options.price : p.price;
                const optionsSummary = getOptionSummary(item.options);
                return (
                  <div key={index} style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-md)', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', background: 'var(--color-white)' }}>
                    <Link to={`/product?id=${p.id}`}>
                      <img src={p.image} alt={p.name} style={{ width: 90, height: 110, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                    </Link>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>{p.name}</h3>
                          {optionsSummary && <p style={{ fontSize: '0.7rem', color: 'var(--color-gold-dark)', marginBottom: '0.3rem' }}>{optionsSummary}</p>}
                          <p style={{ fontSize: '0.65rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.category} · {p.cert}</p>
                        </div>
                        <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', fontSize: '0.9rem' }} aria-label="Remove">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() => updateCartQty(index, -1)}><i className="fas fa-minus"></i></button>
                          <span className="qty-value">{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateCartQty(index, 1)}><i className="fas fa-plus"></i></button>
                        </div>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)' }}>{formatPrice(price * item.qty)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="checkout-summary-card" style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)', borderBottom: '1.5px solid var(--color-gray-100)', paddingBottom: 'var(--space-sm)' }}>Order Summary</h3>

              {/* Promo Code */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)' }}>
                <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo Code (VK20)" className="form-input" style={{ flex: 1, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', padding: '0.5rem 0.75rem', marginBottom: 0 }} />
                <button onClick={() => applyPromoCode(promoInput)} className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>Apply</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-gray-500)' }}>Subtotal</span><span style={{ fontWeight: 700 }}>{formatPrice(subtotal)}</span></div>
                {appliedPromo > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-green)' }}><span>Discount ({Math.round(appliedPromo * 100)}%)</span><span>-{formatPrice(discountAmt)}</span></div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-gray-500)' }}>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-gray-500)' }}>GST (3%)</span><span>{formatPrice(gst)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1.5px solid var(--color-gray-100)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                  <strong>Total</strong><strong style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>{formatPrice(total)}</strong>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-gold btn-full btn-lg">Proceed to Checkout <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i></Link>

              <div style={{ borderTop: '1px dashed var(--color-gray-200)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-shield-halved" style={{ color: 'var(--color-green)' }}></i><span>100% Certified by GIA, IGI & GRS</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-truck-fast" style={{ color: 'var(--color-gold)' }}></i><span>Free insured delivery across India</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-rotate" style={{ color: 'var(--color-gold)' }}></i><span>10-day hassle-free returns</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
