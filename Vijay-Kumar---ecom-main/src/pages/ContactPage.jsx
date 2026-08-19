import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatbotKnowledge } from '../data/products';
import { useStore } from '../context/StoreContext';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get('subject') || '';
  const { showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: subjectParam, message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Your message has been sent successfully. Our team will contact you soon!', 'success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <main style={{ paddingBottom: 'var(--space-4xl)' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-dark)', color: 'var(--color-white)', padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--color-gray-300)' }}>We are here to assist you with all your gemstone and jewelry needs.</p>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-3xl)' }}>
          
          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-dark)' }}>Get in Touch</h2>
            <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Whether you need help selecting a gemstone, tracking an order, or booking a free astrological consultation, our experts are just a call or message away.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-ivory)', color: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-location-dot"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>Flagship Store &amp; Office</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', lineHeight: 1.5 }}>{chatbotKnowledge.address}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-ivory)', color: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>Phone &amp; WhatsApp</h4>
                  <a href={`tel:${chatbotKnowledge.phone.replace(/ /g,'')}`} style={{ fontSize: '0.85rem', color: 'var(--color-dark)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>{chatbotKnowledge.phone}</a>
                  <a href={`https://wa.me/${chatbotKnowledge.phone.replace(/[+ ]/g,'')}?text=Hi`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-dark)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><i className="fab fa-whatsapp"></i> Chat on WhatsApp</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-ivory)', color: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>Email Support</h4>
                  <a href={`mailto:${chatbotKnowledge.email}`} style={{ fontSize: '0.85rem', color: 'var(--color-dark)', fontWeight: 600 }}>{chatbotKnowledge.email}</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-ivory)', color: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>Business Hours</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)' }}>{chatbotKnowledge.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-gray-100)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: '1rem' }}>Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Your Name *</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input type="tel" className="form-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Subject Line</label>
                <select className="form-select" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option value="">General Inquiry</option>
                  <option value="Astrological Consultation">Astrological Consultation</option>
                  <option value="Bespoke Customization">Bespoke Customization</option>
                  <option value="Order Tracking">Order Tracking</option>
                  <option value="Return / Exchange">Return / Exchange</option>
                </select>
              </div>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Your Message *</label>
                <textarea className="form-input" rows="5" required style={{ fontFamily: 'var(--font-sans)', resize: 'vertical' }} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-gold btn-full btn-lg">Submit Request <i className="fas fa-paper-plane" style={{ marginLeft: 8 }}></i></button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
