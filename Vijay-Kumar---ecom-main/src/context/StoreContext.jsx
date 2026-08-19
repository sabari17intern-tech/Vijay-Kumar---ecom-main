import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { products, gemCategories } from '../data/products';

const StoreContext = createContext(null);

// ─── HELPERS ───
export function formatPrice(p) {
  return '₹' + p.toLocaleString('en-IN');
}

export function getProduct(id) {
  return products.find(p => String(p.id) === String(id));
}

export function getDiscount(product) {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

export function generateStars(rating) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    html += `<i class="fas fa-star ${i < Math.floor(rating) ? '' : 'empty'}"></i>`;
  }
  return html;
}

export function getOptionSummary(options) {
  if (!options) return '';
  let parts = [];
  
  if (options.stone) parts.push(`${options.stone} (${options.carat || ''} Carat)`);
  
  if (options.wearType) {
    if (options.wearType === 'Loose') {
      parts.push('Loose Gemstone');
    } else if (options.wearType === 'Ring') {
      parts.push(`Mounted in Ring (${options.metal || ''})`);
      if (options.size) parts.push(`Size: ${options.size}`);
    } else if (options.wearType === 'Pendant') {
      parts.push(`Mounted in Pendant (${options.metal || ''})`);
    }
  } else if (options.size) {
    parts.push(`Size: ${options.size}`);
  }
  return parts.join(' • ');
}

export function searchProducts(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    (p.origin && p.origin.toLowerCase().includes(q))
  );
}

// ─── PROVIDER ───
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('vk_cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('vk_wishlist')) || []);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('vk_user')) || null);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('vk_orders')) || []);
  const [recentlyViewed, setRecentlyViewed] = useState(() => JSON.parse(localStorage.getItem('vk_recent')) || []);
  const [appliedPromo, setAppliedPromo] = useState(() => parseFloat(localStorage.getItem('vk_promo')) || 0);
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('vk_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('vk_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('vk_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('vk_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('vk_recent', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('vk_promo', appliedPromo.toString()); }, [appliedPromo]);

  // ─── TOAST ───
  const showToast = useCallback((msg, type = 'info') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // ─── CART ───
  const addToCart = useCallback((id, qty = 1, options = null) => {
    const product = getProduct(id);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === id && JSON.stringify(c.options) === JSON.stringify(options));
      if (existing) {
        return prev.map(c =>
          (c.id === id && JSON.stringify(c.options) === JSON.stringify(options))
            ? { ...c, qty: c.qty + qty }
            : c
        );
      }
      return [...prev, { id, qty, options }];
    });
    showToast(product.name + ' added to bag', 'success');
  }, [showToast]);

  const removeFromCart = useCallback((index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateCartQty = useCallback((index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      if (index < 0 || index >= updated.length) return prev;
      updated[index] = { ...updated[index], qty: updated[index].qty + delta };
      if (updated[index].qty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      return updated;
    });
  }, []);

  const getCartCount = useCallback(() => {
    return cart.reduce((s, c) => s + c.qty, 0);
  }, [cart]);

  const getCartSubtotal = useCallback(() => {
    return cart.reduce((s, c) => {
      const p = getProduct(c.id);
      if (!p) return s;
      const price = c.options && c.options.price ? c.options.price : p.price;
      return s + (price * c.qty);
    }, 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    const sub = getCartSubtotal();
    const discount = sub * appliedPromo;
    return sub - discount;
  }, [getCartSubtotal, appliedPromo]);

  const isInCart = useCallback((id) => cart.some(c => c.id === id), [cart]);
  const getCartItemQty = useCallback((id) => {
    const c = cart.find(c => c.id === id);
    return c ? c.qty : 0;
  }, [cart]);

  // ─── PROMO ───
  const applyPromoCode = useCallback((code) => {
    const c = code.trim().toUpperCase();
    if (c === 'VK20') { setAppliedPromo(0.20); showToast('20% discount applied!', 'success'); return true; }
    if (c === 'VK10') { setAppliedPromo(0.10); showToast('10% discount applied!', 'success'); return true; }
    if (c === 'GEMS15') { setAppliedPromo(0.15); showToast('15% discount applied!', 'success'); return true; }
    setAppliedPromo(0);
    showToast('Invalid promo code', 'error');
    return false;
  }, [showToast]);

  // ─── WISHLIST ───
  const toggleWishlistItem = useCallback((id, event) => {
    if (event) event.stopPropagation();
    setWishlist(prev => {
      const idx = prev.indexOf(id);
      if (idx > -1) {
        showToast('Removed from wishlist');
        return prev.filter(w => w !== id);
      }
      showToast('Added to wishlist', 'success');
      return [...prev, id];
    });
  }, [showToast]);

  const isInWishlist = useCallback((id) => wishlist.includes(id), [wishlist]);

  // ─── AUTH ───
  const isLoggedIn = useCallback(() => currentUser !== null, [currentUser]);

  const login = useCallback((phone) => {
    const user = { phone: '+91 ' + phone, name: '', email: '' };
    setCurrentUser(user);
    showToast('Welcome! You are now signed in.', 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('vk_user');
    showToast('Signed out successfully');
  }, [showToast]);

  const updateUser = useCallback((updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  }, []);

  // ─── ORDERS ───
  const placeOrder = useCallback((addressData) => {
    const orderId = 'VK' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = cart.reduce((s, c) => {
      const p = getProduct(c.id);
      if (!p) return s;
      const price = c.options && c.options.price ? c.options.price : p.price;
      return s + (price * c.qty);
    }, 0);
    const discount = subtotal * appliedPromo;
    const shipping = subtotal >= 50000 ? 0 : 500;
    const gst = Math.round(subtotal * 0.03);
    const total = (subtotal - discount) + shipping + gst;

    const order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: cart.map(c => ({ ...c, product: getProduct(c.id) })),
      subtotal, discount, shipping, gst, total,
      address: addressData || {},
      status: 'Processing',
      statusIcon: 'fas fa-cog fa-spin'
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setAppliedPromo(0);
    return order;
  }, [cart, appliedPromo]);

  // ─── RECENTLY VIEWED ───
  const addToRecentlyViewed = useCallback((id) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(r => r !== id);
      const updated = [id, ...filtered];
      return updated.slice(0, 10);
    });
  }, []);

  const value = {
    // State
    cart, wishlist, currentUser, orders, recentlyViewed, appliedPromo, toasts,
    // Cart
    addToCart, removeFromCart, updateCartQty, getCartCount, getCartSubtotal, getCartTotal, isInCart, getCartItemQty,
    // Promo
    applyPromoCode,
    // Wishlist
    toggleWishlistItem, isInWishlist,
    // Auth
    isLoggedIn, login, logout, updateUser, setCurrentUser,
    // Orders
    placeOrder,
    // Recently viewed
    addToRecentlyViewed,
    // Toast
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}

export default StoreContext;
