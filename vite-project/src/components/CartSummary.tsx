import type { CartItem } from '../types.ts';

type CartSummaryProps = {
  cart: CartItem[];
  onUpdateQty: (id: number, change: number) => void;
  onRemove: (id: number) => void;
};

export default function CartSummary({ cart, onUpdateQty, onRemove }: CartSummaryProps) {
  const grandTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="cart-section">
      <h2>🛒 Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Add some products to get started!</p>
        </div>
      ) : (
        <>
          <div className="cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Subtotal</span>
            <span>Action</span>
          </div>
          
          {}
          {cart.map(item => (
            <div key={item.id} className="cart-row">
              <span className="cart-name">{item.name}</span>
              <span>₱{item.price.toFixed(2)}</span>
              <span className="cart-qty">
                <button onClick={() => onUpdateQty(item.id, -1)}>−</button>
                {item.cartQty}
                <button onClick={() => onUpdateQty(item.id, 1)}>+</button>
              </span>
              <strong>₱{item.subtotal.toFixed(2)}</strong>
              <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
            </div>
          ))}
          
          <div className="total-row">
            <h3>Total: <span>₱{grandTotal.toFixed(2)}</span></h3>
          </div>
        </>
      )}
    </div>
  );
}