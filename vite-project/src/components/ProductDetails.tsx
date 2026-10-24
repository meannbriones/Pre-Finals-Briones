import type { Product } from '../types.ts';

type ProductDetailsProps = {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductDetails({ product, onBack, onAddToCart }: ProductDetailsProps) {
  return (
    <div className="details-container">
      <button className="back-btn" onClick={onBack}>← Back to Products</button>
      
      <div className="details-card">
        <img src={product.image} alt={product.name} className="details-img" />
        
        <div className="details-info">
          <span className="product-category">{product.category}</span>
          <h2 className="product-name">{product.name}</h2>
          
          <div className="rating">
            {'★'.repeat(Math.floor(product.rating))}
            <span>{product.rating.toFixed(1)}</span>
          </div>
          
          <p className="details-desc">{product.description}</p>
          
          {product.specification && (
            <div className="specs-box">
              <h4>📋 Specifications</h4>
              <p>{product.specification}</p>
            </div>
          )}
          
          <div className="details-meta">
            <p className="product-price">₱{product.price.toFixed(2)}</p>
            <p className={`stock-text ${product.quantity < 5 ? 'low-stock' : ''}`}>
              {product.quantity < 5 ? '⚠️ ' : ''}In Stock: {product.quantity} pcs
            </p>
          </div>
          
          <button 
            className="btn-primary full-width"
            onClick={() => onAddToCart(product)}
            disabled={product.quantity <= 0}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
