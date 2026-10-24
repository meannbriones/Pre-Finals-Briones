import type { Product } from '../types.ts';

type ProductCardProps = {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const isLowStock = product.quantity < 5;

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-img" />
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="rating">
          {'★'.repeat(Math.floor(product.rating))}
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <p className="product-price">₱{product.price.toFixed(2)}</p>
        <p className={`stock-text ${isLowStock ? 'low-stock' : ''}`}>
          {isLowStock ? '⚠️ Low Stock — ' : ''}Available: {product.quantity}
        </p>
        
        <div className="card-buttons">
          <button className="btn-outline" onClick={() => onViewDetails(product)}>
            View Details
          </button>
          <button 
            className="btn-primary" 
            onClick={() => onAddToCart(product)}
            disabled={product.quantity <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}