import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, formatPrice, getProduct, getOptionSummary } from '../context/StoreContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartSubtotal, getCartTotal, appliedPromo, currentUser, isLoggedIn, login, placeOrder, showToast } = useStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const [shippingAddress, setShippingAddress] = useState({
    fname: '', lname: '', email: '', phone: '', address: '', city: '', state: 'Tamil Nadu', pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = getCartSubtotal();
  const discountAmt = subtotal * appliedPromo;
  const shipping = subtotal >= 50000 ? 0 : (cart.length > 0 ? 500 : 0);
  const gst = Math.round(subtotal * 0.03);
  const total = getCartTotal() + shipping + gst;

  useEffect(() => {
    if (cart.length === 0 && currentStep !== 3) {
      showToast('Your cart is empty. Please add items to proceed.', 'error');
      navigate('/cart');
    }
  }, [cart, currentStep, navigate, showToast]);

  useEffect(() => {
    if (isLoggedIn() && currentUser) {
      setShippingAddress(prev => ({
        ...prev,
        phone: currentUser.phone ? currentUser.phone.replace('+91 ', '') : '',
        fname: currentUser.name ? currentUser.name.split(' ')[0] : '',
        lname: currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : '',
        email: currentUser.email || ''
      }));
    }
  }, [isLoggedIn, currentUser]);

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

    if (value.length === 1 && index < 5) {
      otpRefs.current[index + 1].focus();
    } else if (e.key === 'Backspace' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
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

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
      showToast('Please enter a valid UPI ID.', 'error');
      return;
    }

    const order = placeOrder(shippingAddress);
    setPlacedOrder(order);
    setCurrentStep(3);
  };

  const downloadInvoice = () => {
    if (!placedOrder) return;
    
    // Injecting html2pdf code directly here instead of using the old html method to avoid React state timing issues.
    // Ensure html2pdf is available globally via CDN in index.html
    if (window.html2pdf) {
      const element = document.getElementById('invoice-template-hidden');
      if(element) {
        element.style.display = 'block'; // Make it visible temporarily for rendering if needed, though usually not reqd for absolute positioned offscreen elements
        const opt = {
            margin:       0.3,
            filename:     'VK-Invoice-' + placedOrder.id + '.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2.5, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        showToast('Generating high-quality invoice PDF...', 'info');
        window.html2pdf().set(opt).from(element).save().then(() => {
          showToast('Invoice PDF downloaded successfully!', 'success');
        }).catch(err => {
          console.error(err);
          showToast('Error generating PDF.', 'error');
        }).finally(() => {
           // Hide again if needed
        });
      }
    } else {
      showToast('PDF generator not ready. Please try again.', 'error');
    }
  };

  function numberToWords(amount) {
    const words = {
        0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine',
        10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen',
        20: 'Twenty', 30: 'Thirty', 40: 'Forty', 50: 'Fifty', 60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety'
    };
    
    function convertLessThanThousand(num) {
        let temp = '';
        if (num >= 100) {
            temp += words[Math.floor(num / 100)] + ' Hundred ';
            num %= 100;
        }
        if (num > 0) {
            if (num < 20) {
                temp += words[num];
            } else {
                temp += words[Math.floor(num / 10) * 10];
                if (num % 10 > 0) {
                    temp += '-' + words[num % 10];
                }
            }
        }
        return temp.trim();
    }

    let num = Math.round(amount);
    if (num === 0) return 'Zero';
    
    let str = '';
    
    if (num >= 10000000) {
        str += convertLessThanThousand(Math.floor(num / 10000000)) + ' Crore ';
        num %= 10000000;
    }
    if (num >= 100000) {
        str += convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh ';
        num %= 100000;
    }
    if (num >= 1000) {
        str += convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand ';
        num %= 1000;
    }
    if (num > 0) {
        str += convertLessThanThousand(num);
    }
    
    return str.trim() + ' Rupees Only';
  }

  return (
    <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      {/* Progress Bar */}
      <div className="checkout-steps">
        <div className={`checkout-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="checkout-step-number">1</div>
          <span>Shipping</span>
        </div>
        <div className="checkout-step-line"></div>
        <div className={`checkout-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="checkout-step-number">2</div>
          <span>Payment</span>
        </div>
        <div className="checkout-step-line"></div>
        <div className={`checkout-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="checkout-step-number">3</div>
          <span>Confirm</span>
        </div>
      </div>

      <div className={currentStep === 3 ? "checkout-confirm-container" : "checkout-grid-container"}>
        
        {/* Left Column */}
        <div>
          {currentStep === 1 && (
            <div className="checkout-card" style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-sm)' }}>
              {!isLoggedIn() ? (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>Customer Identification</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginBottom: 'var(--space-lg)' }}>Please sign in using your mobile number for secure checkout and tracking.</p>
                  
                  <div style={{ maxWidth: 400, margin: '0 auto', padding: 'var(--space-md) 0' }}>
                    {!otpSent ? (
                      <div style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="form-label">Mobile Number</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ padding: '0.6rem 0.75rem', border: '1.5px solid var(--color-gray-200)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', background: 'var(--color-gray-50)' }}>+91</span>
                          <input type="tel" className="form-input" placeholder="Enter 10-digit number" style={{ marginBottom: 0 }} maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <button onClick={handleSendOTP} className="btn btn-gold btn-full" style={{ marginTop: 'var(--space-md)' }}>Send OTP Verification</button>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="form-label">Enter 6-Digit OTP</label>
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
                        <button onClick={handleVerifyOTP} className="btn btn-gold btn-full">Verify &amp; Continue</button>
                        <button onClick={() => showToast('New code sent!', 'success')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-dark)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, marginTop: 'var(--space-md)', display: 'block', textAlign: 'center', width: '100%' }}>Resend Code</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-lg)', borderBottom: '1.5px solid var(--color-gray-100)', paddingBottom: 'var(--space-sm)' }}>Delivery Details</h3>
                  <form onSubmit={handleShippingSubmit}>
                    <div className="form-grid-2">
                      <div><label className="form-label">First Name *</label><input type="text" className="form-input" required value={shippingAddress.fname} onChange={e => setShippingAddress({...shippingAddress, fname: e.target.value})} /></div>
                      <div><label className="form-label">Last Name *</label><input type="text" className="form-input" required value={shippingAddress.lname} onChange={e => setShippingAddress({...shippingAddress, lname: e.target.value})} /></div>
                    </div>
                    <div className="form-grid-2">
                      <div><label className="form-label">Email Address *</label><input type="email" className="form-input" required value={shippingAddress.email} onChange={e => setShippingAddress({...shippingAddress, email: e.target.value})} /></div>
                      <div><label className="form-label">Contact Phone *</label><input type="tel" className="form-input" readOnly value={shippingAddress.phone} /></div>
                    </div>
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <label className="form-label">Delivery Street Address *</label>
                      <textarea className="form-input" rows="3" placeholder="Apartment, building, street address" required style={{ fontFamily: 'var(--font-sans)' }} value={shippingAddress.address} onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}></textarea>
                    </div>
                    <div className="form-grid-3">
                      <div><label className="form-label">City *</label><input type="text" className="form-input" required value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} /></div>
                      <div>
                        <label className="form-label">State *</label>
                        <select className="form-select" required style={{ padding: '0.6rem 2.2rem 0.6rem 0.75rem', fontSize: '0.85rem' }} value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})}>
                          <option value="Maharashtra">Maharashtra</option><option value="Delhi">Delhi</option><option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option><option value="Telangana">Telangana</option><option value="Gujarat">Gujarat</option>
                          <option value="West Bengal">West Bengal</option><option value="Rajasthan">Rajasthan</option>
                        </select>
                      </div>
                      <div><label className="form-label">Pincode *</label><input type="text" className="form-input" maxLength={6} required value={shippingAddress.pincode} onChange={e => setShippingAddress({...shippingAddress, pincode: e.target.value})} /></div>
                    </div>
                    <button type="submit" className="btn btn-gold btn-lg btn-full">Continue to Payment <i className="fas fa-credit-card" style={{ marginLeft: 8 }}></i></button>
                  </form>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="checkout-card" style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-md)', borderBottom: '1.5px solid var(--color-gray-100)', paddingBottom: 'var(--space-sm)' }}>Choose Payment Mode</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                  <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-dark)' }}>Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Pay in cash or UPI upon delivery. Available across major pin codes.</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setPaymentMethod('upi')}>
                  <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-dark)' }}>Instant UPI (GPay, PhonePe, Paytm)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Scan QR code or enter your UPI ID for quick approval.</span>
                    {paymentMethod === 'upi' && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <input type="text" className="form-input" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" style={{ marginBottom: 0, maxWidth: 300 }} value={upiId} onChange={e => setUpiId(e.target.value)} onClick={e => e.stopPropagation()} />
                      </div>
                    )}
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                  <input type="radio" checked={paymentMethod === 'card'} readOnly />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-dark)' }}>Credit / Debit Card</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Visa, MasterCard, RuPay, and American Express. Fully encrypted.</span>
                    {paymentMethod === 'card' && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 350 }}>
                        <input type="text" className="form-input" placeholder="Cardholder Name" onClick={e => e.stopPropagation()} />
                        <input type="text" className="form-input" placeholder="16-Digit Card Number" maxLength={16} onClick={e => e.stopPropagation()} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input type="text" className="form-input" placeholder="MM/YY" maxLength={5} onClick={e => e.stopPropagation()} />
                          <input type="password" className="form-input" placeholder="CVV" maxLength={3} onClick={e => e.stopPropagation()} />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="checkout-actions">
                <button onClick={() => setCurrentStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Back to Shipping</button>
                <button onClick={handlePlaceOrder} className="btn btn-gold" style={{ flex: 2 }}>Place Insured Order <i className="fas fa-check" style={{ marginLeft: 8 }}></i></button>
              </div>
            </div>
          )}

          {currentStep === 3 && placedOrder && (
            <div className="checkout-card" style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto var(--space-lg) auto', border: '2px solid var(--color-green)' }}>
                <i className="fas fa-check"></i>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>Order Placed Successfully!</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-500)', marginBottom: 'var(--space-lg)' }}>Thank you for choosing VijayKumar Diamonds &amp; Gems. Your order is registered.</p>

              <div style={{ background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'inline-block', marginBottom: 'var(--space-xl)', textAlign: 'left', minWidth: 300 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}><span style={{ color: 'var(--color-gray-500)' }}>Order Number:</span><strong style={{ color: 'var(--color-dark)' }}>#{placedOrder.id}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}><span style={{ color: 'var(--color-gray-500)' }}>Delivery Estimate:</span><strong style={{ color: 'var(--color-dark)' }}>3—5 Business Days</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: 'var(--color-gray-500)' }}>Amount Paid:</span><strong style={{ color: 'var(--color-gold-dark)' }}>{formatPrice(placedOrder.total)}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/account" className="btn btn-gold">Track Order <i className="fas fa-location-dot" style={{ marginLeft: 8 }}></i></Link>
                <button onClick={downloadInvoice} className="btn btn-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold-dark)', background: 'var(--color-ivory)' }}><i className="fas fa-file-pdf" style={{ marginRight: 6 }}></i> Download Invoice PDF</button>
                <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        {currentStep !== 3 && (
          <div className="checkout-summary-card">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-md)', borderBottom: '1.5px solid var(--color-gray-100)', paddingBottom: 'var(--space-sm)' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: 'var(--space-md)', maxHeight: 200, overflowY: 'auto', borderBottom: '1.5px solid var(--color-gray-100)', paddingBottom: 'var(--space-md)' }}>
              {cart.map((item, index) => {
                const p = getProduct(item.id);
                if(!p) return null;
                const price = item.options && item.options.price ? item.options.price : p.price;
                return (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <img src={p.image} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} alt={p.name} />
                    <div style={{ flex: 1, fontSize: '0.75rem' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{p.name}</div>
                      {getOptionSummary(item.options) && <div style={{ fontSize: '0.6rem', color: 'var(--color-gold-dark)', marginTop: 2, lineHeight: 1.2 }}>{getOptionSummary(item.options)}</div>}
                      <div style={{ color: 'var(--color-gray-500)', marginTop: 2 }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold-dark)' }}>{formatPrice(price * item.qty)}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-gray-500)' }}>Subtotal</span><span style={{ fontWeight: 700 }}>{formatPrice(subtotal)}</span></div>
              {appliedPromo > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}><span>Discount</span><span>-{formatPrice(discountAmt)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-gray-500)' }}>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-gray-500)' }}>GST (3%)</span><span>{formatPrice(gst)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderTop: '1.5px solid var(--color-gray-100)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}><strong style={{ color: 'var(--color-dark)' }}>Total Price</strong><strong style={{ color: 'var(--color-gold-dark)' }}>{formatPrice(total)}</strong></div>
            </div>

            <div style={{ borderTop: '1px dashed var(--color-gray-200)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-shield-halved" style={{ color: 'var(--color-success)' }}></i> <span>100% Certified by GIA, IGI & GRS</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-gem" style={{ color: 'var(--color-gold)' }}></i> <span>BIS Hallmarked Gold purity guaranteed</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-truck-fast" style={{ color: 'var(--color-gold)' }}></i> <span>Transit Insured Delivery door-to-door</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="fas fa-lock" style={{ color: 'var(--color-dark)' }}></i> <span>Secure 256-bit Encrypted Checkout</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Invoice Template for PDF Generation */}
      {placedOrder && (
        <div style={{ position: 'absolute', left: -9999, top: -9999 }}>
          <div id="invoice-template-hidden" style={{ width: 790, padding: 40, background: '#ffffff', fontFamily: '"Outfit", "Inter", sans-serif', color: '#1a1a1a', lineHeight: 1.5, boxSizing: 'border-box' }}>
            {/* Invoice content mirroring html implementation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #b89c56', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                <div style={{ width: 55, height: 55, borderRadius: '50%', border: '1.5px solid #b89c56', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#b89c56', color: '#ffffff', fontWeight: 700, fontSize: '1.2rem', fontFamily: '"Playfair Display", serif' }}>VK</div>
                <div>
                  <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 5px 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>VijayKumar Diamonds &amp; Gems</h1>
                  <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>Venkatakrishna Street, Opposite Shanmuga Nursing Home, RS Puram</p>
                  <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>Coimbatore - 641002, Tamil Nadu, India</p>
                  <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>Phone: +91 90927 16427 | Email: info@vijaykumardiamonds.com</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', fontWeight: 700, color: '#b89c56', margin: '0 0 10px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tax Invoice</h2>
                <div style={{ fontSize: '0.8rem', color: '#555555' }}>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Invoice No:</strong> INV-2026-{placedOrder.id}</p>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Date:</strong> {placedOrder.date}</p>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Place of Supply:</strong> {placedOrder.address.state}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 25 }}>
              <div style={{ background: '#fcfbf7', border: '1px solid #f2edd9', borderRadius: 6, padding: 15 }}>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '0.9rem', fontWeight: 700, color: '#b89c56', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f2edd9', paddingBottom: 4 }}>Billed To</h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px 0' }}>{placedOrder.address.fname} {placedOrder.address.lname}</p>
                <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>Phone: +91 {placedOrder.address.phone}</p>
                <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>Email: {placedOrder.address.email}</p>
              </div>
              <div style={{ background: '#fcfbf7', border: '1px solid #f2edd9', borderRadius: 6, padding: 15 }}>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '0.9rem', fontWeight: 700, color: '#b89c56', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f2edd9', paddingBottom: 4 }}>Shipped To</h3>
                <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>{placedOrder.address.address}</p>
                <p style={{ fontSize: '0.8rem', color: '#555555', margin: '0 0 3px 0' }}>{placedOrder.address.city}, {placedOrder.address.state} - {placedOrder.address.pincode}</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 25, fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#b89c56', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700, width: 40, textAlign: 'center' }}>#</th>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700 }}>Description</th>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700, width: 80, textAlign: 'center' }}>HSN</th>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700, width: 80, textAlign: 'center' }}>Specs</th>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700, width: 50, textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700, width: 100, textAlign: 'right' }}>Rate</th>
                  <th style={{ padding: 10, border: '1px solid #b89c56', fontWeight: 700, width: 110, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {placedOrder.items.map((item, index) => {
                  const p = item.product;
                  const price = item.options && item.options.price ? item.options.price : p.price;
                  const hsn = (['Yellow Sapphire', 'Blue Sapphire', 'Emerald', 'Ruby', 'Opal', 'Pearl', 'Red Coral', 'Hessonite'].includes(p.category) && !p.isRing) ? '7103' : '7113';
                  let specs = '';
                  if (p.carat) specs += p.carat + ' Ct';
                  if (item.options && item.options.metal) specs += (specs ? ' | ' : '') + item.options.metal;
                  if (!specs) specs = 'Natural Stone';
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #f2edd9' }}>
                      <td style={{ padding: 10, border: '1px solid #f2edd9', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ padding: 10, border: '1px solid #f2edd9' }}>
                        <strong style={{ color: '#1a1a1a' }}>{p.name}</strong>
                        {item.options?.wearType && item.options.wearType !== 'Loose' && <div style={{ fontSize: '0.7rem', color: '#777777', marginTop: 2 }}>Mounted as: {item.options.wearType} ({item.options.metal})</div>}
                      </td>
                      <td style={{ padding: 10, border: '1px solid #f2edd9', textAlign: 'center' }}>{hsn}</td>
                      <td style={{ padding: 10, border: '1px solid #f2edd9', textAlign: 'center' }}>{specs}</td>
                      <td style={{ padding: 10, border: '1px solid #f2edd9', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: 10, border: '1px solid #f2edd9', textAlign: 'right' }}>₹{price.toLocaleString('en-IN')}</td>
                      <td style={{ padding: 10, border: '1px solid #f2edd9', textAlign: 'right' }}>₹{(price * item.qty).toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '50%', paddingRight: 20 }}>
                <p style={{ fontSize: '0.8rem', color: '#555555', marginBottom: 5 }}><strong>Amount in Words:</strong></p>
                <p style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600, fontStyle: 'italic', marginBottom: 20 }}>{numberToWords(placedOrder.total)}</p>
                <div style={{ padding: 15, background: '#fcfbf7', border: '1px solid #f2edd9', borderRadius: 6, fontSize: '0.75rem', color: '#555555' }}>
                  <strong>Declaration:</strong><br/>
                  We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. All gemstones are certified natural.
                </div>
              </div>
              <div style={{ width: '45%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <tbody>
                    <tr><td style={{ padding: '8px 0', color: '#555555' }}>Subtotal:</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{placedOrder.subtotal.toLocaleString('en-IN')}</td></tr>
                    {placedOrder.discount > 0 && <tr><td style={{ padding: '8px 0', color: '#555555' }}>Discount:</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#22c55e' }}>-₹{placedOrder.discount.toLocaleString('en-IN')}</td></tr>}
                    <tr><td style={{ padding: '8px 0', color: '#555555' }}>Taxable Amount:</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{(placedOrder.subtotal - placedOrder.discount).toLocaleString('en-IN')}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#555555' }}>GST (3%):</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹{placedOrder.gst.toLocaleString('en-IN')}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#555555' }}>Shipping &amp; Insurance:</td><td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{placedOrder.shipping === 0 ? 'Free' : `₹${placedOrder.shipping.toLocaleString('en-IN')}`}</td></tr>
                    <tr style={{ borderTop: '2px solid #b89c56', borderBottom: '2px double #b89c56' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>Invoice Total:</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#b89c56' }}>₹{placedOrder.total.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                  <p style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem', marginBottom: 5 }}>For VijayKumar Diamonds &amp; Gems</p>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(184, 156, 86, 0.3)', color: 'rgba(184, 156, 86, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', fontFamily: '"Playfair Display", serif', margin: '10px auto', letterSpacing: '0.05em' }}>VK GEMS</div>
                  <p style={{ color: '#555555', fontSize: '0.75rem' }}>Authorized Signatory</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </main>
  );
}
