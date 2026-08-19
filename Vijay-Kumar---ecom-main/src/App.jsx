import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PageLoader from './components/PageLoader';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function ScrollAndRevealHandler() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Setup IntersectionObserver for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once revealed to prevent hiding issues
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    // Observe all elements with reveal classes
    // We wait a small tick to ensure React has fully committed the DOM
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
      revealElements.forEach(el => observer.observe(el));
    }, 150);

    // Cleanup observer on unmount/route change
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <ScrollAndRevealHandler />
        <Header />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <Footer />
        <Chatbot />
      </Router>
    </StoreProvider>
  );
}

export default App;
