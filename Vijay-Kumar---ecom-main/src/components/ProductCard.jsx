import { useNavigate } from 'react-router-dom';
import { useStore, formatPrice, getDiscount, generateStars } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlistItem, isInWishlist, addToCart, getCartItemQty } = useStore();
  const discount = getDiscount(product);
  const inWish = isInWishlist(product.id);
  const qty = getCartItemQty(product.id);
  const stars = generateStars(product.rating);

  return (
    <div className="product-card reveal" data-id={product.id}>
      <div className="product-card-image" onClick={() => navigate(`/product?id=${product.id}`)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-card-badge">{product.badge}</span>}
        {qty > 0 && <span className="product-card-badge" style={{ background: 'var(--color-gold)' }}>In Bag ({qty})</span>}
        <button
          className={`product-card-wishlist ${inWish ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlistItem(product.id, e); }}
        >
          <i className={`${inWish ? 'fas' : 'far'} fa-heart`}></i>
        </button>
        <button
          className="product-card-quick-add"
          onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="product-card-info" onClick={() => navigate(`/product?id=${product.id}`)}>
        <div className="product-card-rating" dangerouslySetInnerHTML={{ __html: stars + `<span>(${product.reviews})</span>` }}></div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{product.desc}</p>
        <p className="product-card-price">
          <span className="current">{formatPrice(product.price)}</span>
          {discount > 0 && (
            <span className="discount-info">
              <span className="original">{formatPrice(product.mrp)}</span>
              <span className="discount">{discount}% off</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
