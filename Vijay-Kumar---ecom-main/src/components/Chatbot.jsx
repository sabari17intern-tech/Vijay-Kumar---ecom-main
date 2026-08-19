import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore, formatPrice, searchProducts, getDiscount, getProduct } from '../context/StoreContext';
import { products, allCategories, chatbotKnowledge } from '../data/products';

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function matches(words, keywords) {
  return keywords.some(keyword => words.includes(keyword));
}

function getChatbotResponse(msg) {
  const rawMsg = msg.toLowerCase().trim();
  const words = rawMsg.replace(/[^\w\s]/g, '').split(/\s+/);
  const whatsappUrl = "https://wa.me/919092716427?text=";
  const talkToExpertBtn = `<br><br><a href="${whatsappUrl}${encodeURIComponent("Hi VK Diamonds, I have a question about: " + msg)}" class="btn btn-gold btn-xs" target="_blank" style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.3rem 0.6rem;font-size:0.6rem;font-weight:700;letter-spacing:0.05em;cursor:pointer"><i class="fab fa-whatsapp"></i> Talk with Experts</a>`;

  if (matches(words, ['address','where','location','coimbatore','shop','store','visit','map','located','place','office']))
    return `Our office is at: <strong>${chatbotKnowledge.address}</strong>.<br>Open daily: 9 AM – 10 PM.`;
  if (matches(words, ['phone','call','contact','number','email','whatsapp','support','talk','helpline']))
    return `Concierge desk: 📞 <strong>${chatbotKnowledge.phone}</strong> | ✉️ <strong>${chatbotKnowledge.email}</strong>.${talkToExpertBtn}`;
  if (matches(words, ['hours','time','open','close','sunday','when','schedule']))
    return `We are open daily from <strong>9:00 AM to 10:00 PM</strong>, including Sundays.`;
  if (matches(words, ['astrology','astrological','chart','horoscope','consult','consultation','planet','vedic','remedy']))
    return `We offer Free Vedic Astrological consultations. Contact our experts to book:<br><br><a href="${whatsappUrl}${encodeURIComponent("Hi, I want a Free Astrological consultation for my birth chart.")}" class="btn btn-gold btn-xs" target="_blank" style="display:inline-flex;align-items:center;gap:0.35rem;cursor:pointer"><i class="fab fa-whatsapp"></i> Book Consult on WhatsApp</a>`;
  if (matches(words, ['cert','certificate','certification','real','fake','natural','gia','grs','igi','genuine','certified']))
    return `All our gemstones are 100% natural and come with lab certificates from GIA, GRS, or IGI.`;
  if (matches(words, ['ship','shipping','delivery','courier','deliver']))
    return `We provide free insured shipping across India. Delivery takes 3 to 5 business days.`;
  if (matches(words, ['return','refund','exchange','policy','replace','cancel']))
    return `We offer a 10-day return policy for items in unworn, original condition with certificates intact.`;
  if (matches(words, ['pay','payment','upi','card','cash','cod','credit']))
    return `We accept Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Bank Transfer. Cash on Delivery is also available.`;
  if (matches(words, ['hi','hello','hey','namaste','greetings','morning','evening']))
    return "Namaste! I am your VK virtual concierge. How can I help you find the perfect natural gemstone or jewelry piece today?";

  let matchedCategory = null;
  for (const cat of allCategories) { if (rawMsg.includes(cat.toLowerCase())) { matchedCategory = cat; break; } }
  if (rawMsg.includes('gomed') || rawMsg.includes('hessonite')) matchedCategory = 'Hessonite';
  if (rawMsg.includes('pukhraj') || rawMsg.includes('yellow sapphire')) matchedCategory = 'Yellow Sapphire';
  if (rawMsg.includes('neelam') || rawMsg.includes('blue sapphire')) matchedCategory = 'Blue Sapphire';
  if (rawMsg.includes('panna') || rawMsg.includes('emerald')) matchedCategory = 'Emerald';
  if (rawMsg.includes('moonga') || rawMsg.includes('coral')) matchedCategory = 'Red Coral';
  if (rawMsg.includes('moti') || rawMsg.includes('pearl')) matchedCategory = 'Pearl';

  let matchedProduct = null;
  for (const prod of products) { if (rawMsg.includes(prod.name.toLowerCase())) { matchedProduct = prod; break; } }

  if (matchedProduct) {
    const discount = getDiscount(matchedProduct);
    const discText = discount > 0 ? ` (${discount}% OFF)` : '';
    return `<strong>${matchedProduct.name}</strong> (${matchedProduct.category})<br>✦ Price: <strong>${formatPrice(matchedProduct.price)}</strong>${discText}<br>✦ Details: ${matchedProduct.carat ? matchedProduct.carat + ' Carat, ' : ''}${matchedProduct.origin || ''}${matchedProduct.cert ? ', ' + matchedProduct.cert + ' Cert' : ''}<br><br><a href="/product?id=${matchedProduct.id}" class="btn btn-outline btn-xs" style="font-size:0.6rem;padding:0.25rem 0.5rem;display:inline-block">View Page</a>`;
  }

  if (matchedCategory) {
    const catProds = products.filter(p => p.category === matchedCategory).slice(0, 3);
    const prodList = catProds.map(p => `• <a href="/product?id=${p.id}" style="color:var(--color-gold-dark);font-weight:600">${p.name}</a> - <strong>${formatPrice(p.price)}</strong>`).join('<br>');
    return `We have natural <strong>${matchedCategory}</strong> gemstones:<br><br>${prodList}<br><br><a href="/shop?cat=${encodeURIComponent(matchedCategory)}" style="color:var(--color-gold);text-decoration:underline">Browse Category</a>`;
  }

  // Price sorting / budget query
  if (matches(words, ['cheap', 'cheapest', 'budget', 'low price', 'affordable', 'under', 'price', 'cost', 'expensive'])) {
    const numbers = rawMsg.match(/\d+/g);
    let limit = 0;
    if (numbers && numbers.length > 0) limit = parseInt(numbers[0]);
    
    let filtered = products;
    if (limit > 0) {
      if (rawMsg.includes('k')) limit *= 1000;
      filtered = products.filter(p => p.price <= limit);
    }
    
    const sorted = [...filtered].sort((a, b) => a.price - b.price).slice(0, 3);
    if (sorted.length > 0) {
      const listText = sorted.map(p => `• <a href="/product?id=${p.id}" style="color:var(--color-gold-dark)">${p.name}</a> - <strong>${formatPrice(p.price)}</strong>`).join('<br>');
      return `Options ${limit > 0 ? 'under ' + formatPrice(limit) : 'available'}:<br><br>${listText}`;
    }
    return `We couldn't find items in that range. Browse our shop or contact us!${talkToExpertBtn}`;
  }

  if (matches(words, ['bestseller','best','popular','premium','rare','luxury'])) {
    const filtered = products.filter(p => p.badge === 'Bestseller' || p.badge === 'Premium' || p.badge === 'Rare').slice(0, 3);
    const listText = filtered.map(p => `• <a href="/product?id=${p.id}" style="color:var(--color-gold-dark)">${p.name}</a> - <strong>${formatPrice(p.price)}</strong>`).join('<br>');
    return `Here are some featured pieces:<br><br>${listText}`;
  }

  const sr = searchProducts(rawMsg);
  if (sr.length > 0) {
    const listText = sr.slice(0, 3).map(p => `• <a href="/product?id=${p.id}" style="color:var(--color-gold-dark)">${p.name}</a> - <strong>${formatPrice(p.price)}</strong>`).join('<br>');
    return `Matches for your search:<br><br>${listText}`;
  }

  return `I don't have the answer to that. Please chat with our expert gemologists on WhatsApp:${talkToExpertBtn}`;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'system', text: 'Namaste! I am your VijayKumar Diamonds virtual concierge. How can I assist you with our certified gemstones, fine jewelry, Vedic astrology consultations, or shipping today?' }
  ]);
  const [input, setInput] = useState('');
  const [showBadge, setShowBadge] = useState(true);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 const isHome = location.pathname === '/';
const showFloat = isHome && scrollY < 400;

const scrollToBottom = () => {
  if (bodyRef.current) {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }
};

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { type: 'user', text: escapeHTML(text) }]);
    setInput('');
    setTyping(true);
    setTimeout(() => scrollToBottom(), 50);

    setTimeout(() => {
      const response = getChatbotResponse(text);
      setTyping(false);
      setMessages(prev => [...prev, { type: 'system', text: response }]);
      setTimeout(() => scrollToBottom(), 50);
    }, 800);
  }, []);

  return (
    <div id="vk-chatbot-root">
      <button className={`vk-chat-bubble ${showFloat ? 'show' : 'hide'}`} onClick={() => { setIsOpen(!isOpen); setShowBadge(false); }} aria-label="Open chat concierge">
        <i className="fas fa-comment-dots"></i>
        {showBadge && <span className="vk-chat-badge">1</span>}
      </button>

      <div className={`vk-chat-window ${isOpen ? 'open' : ''}`}>
        <div className="vk-chat-header">
          <div className="vk-chat-header-info">
            <div className="vk-chat-avatar">💎</div>
            <div>
              <h4>VK Concierge</h4>
              <span>Vedic Astrology & Gem Assistant</span>
            </div>
          </div>
          <button className="vk-chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat"><i className="fas fa-times"></i></button>
        </div>
        <div className="vk-chat-body" ref={bodyRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`vk-chat-msg ${msg.type}`}>
              <div className="vk-chat-msg-bubble" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
            </div>
          ))}
          {typing && (
            <div className="vk-chat-msg system">
              <div className="vk-chat-msg-bubble" style={{ padding: '0.35rem 0.65rem' }}>
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
        </div>
        <div className="vk-chat-chips">
          <button onClick={() => sendMessage('Free Astrology Consultation')}>Astrology Consultation</button>
          <button onClick={() => sendMessage('Do you have Ceylon Blue Sapphire?')}>Blue Sapphires</button>
          <button onClick={() => sendMessage('Where is your office located?')}>Office Location</button>
          <button onClick={() => sendMessage('What lab certificates do you provide?')}>Certifications</button>
        </div>
        <div className="vk-chat-footer">
          <input
            type="text"
            placeholder="Ask about gems, price, astrology..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          />
          <button onClick={() => sendMessage(input)} aria-label="Send message"><i className="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  );
}
