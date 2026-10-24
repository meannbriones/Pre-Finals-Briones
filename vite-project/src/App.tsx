import { useState } from 'react';

type ProductType = {
  id: number;
  image: string;
  name: string;
  category: string;
  description: string;
  specification: string;
  price: number;
  rating: number;
  stock: number;
};

type CartItemType = ProductType & {
  cartQty: number;
  subtotal: number;
};

type Page = 'products' | 'cart' | 'add-product' | 'details' | 'about' | 'contact';

const initialProducts: ProductType[] = [
  {
    id: 1,
    image: 'classic burger.jpeg',
    name: 'Classic Burger',
    category: 'Burgers',
    description: 'Juicy patty with fresh lettuce, tomato, and special sauce.',
    specification: 'patty, sesame bun, lettuce, tomato, cheese, sauc',
    price: 100.00,
    rating: 4.5,
    stock: 15
  },
  {
    id: 2,
    image: 'double cheese burger.jpeg',
    name: 'Double Cheese Burger',
    category: 'Burgers',
    description: 'Two beef patties loaded with melted cheddar cheese.',
    specification: 'Double beef patty, cheddar cheese, bun, pickles',
    price: 99.00,
    rating: 4.7,
    stock: 10
  },
  {
    id: 3,
    image: 'crispy chicken burger.jpeg',
    name: 'Crispy Chicken Burger',
    category: 'Burgers',
    description: 'Golden fried chicken fillet with mayo and fresh coleslaw.',
    specification: 'Chicken fillet, bun, mayo, coleslaw',
    price: 85.00,
    rating: 4.8,
    stock: 4
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('products');
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [modalProduct, setModalProduct] = useState<ProductType | null>(null);
  const [addQty, setAddQty] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    image: '',
    name: '',
    category: 'Burgers',
    description: '',
    specification: '',
    price: '',
    rating: '0',
    stock: '10'
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const grandTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const goToDetails = (product: ProductType) => {
    setSelectedProduct(product);
    setCurrentPage('details');
    setMobileMenuOpen(false);
  };

  const goToCart = () => {
    setCurrentPage('cart');
    setSelectedProduct(null);
    setModalProduct(null);
    setMobileMenuOpen(false);
  };

  const goToProducts = () => {
    setCurrentPage('products');
    setSelectedProduct(null);
    setModalProduct(null);
    setMobileMenuOpen(false);
  };

  const openAddModal = (product: ProductType) => {
    setModalProduct(product);
    setAddQty(1);
  };

  const confirmAddToCart = () => {
    if (!modalProduct || addQty < 1 || addQty > modalProduct.stock) return;
    
    setCart(prev => {
      const exists = prev.find(item => item.id === modalProduct.id);
      if (exists) {
        return prev.map(item =>
          item.id === modalProduct.id
            ? { ...item, cartQty: item.cartQty + addQty, subtotal: item.price * (item.cartQty + addQty) }
            : item
        );
      }
      return [...prev, { ...modalProduct, cartQty: addQty, subtotal: modalProduct.price * addQty }];
    });
    setModalProduct(null);
    setAddQty(1);
  };

  const updateCartQty = (id: number, change: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.cartQty + change;
          if (newQty <= 0) return null;
          return { ...item, cartQty: newQty, subtotal: item.price * newQty };
        }
        return item;
      }).filter(Boolean) as CartItemType[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert('🎉 Thank you for your order! Your order has been placed successfully.');
    setCart([]);
    setCurrentPage('products');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => { const next = {...prev}; delete next[name]; return next; });
    }
  };
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!newProduct.name.trim()) errors.name = 'Product Name is required';
    if (!newProduct.description.trim()) errors.description = 'Description is required';
    if (!newProduct.specification.trim()) errors.specification = 'Specification is required';
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) errors.price = 'Valid Price is required';
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) errors.stock = 'Valid Stock is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const productToAdd: ProductType = {
      id: newId,
      image: newProduct.image || `https://via.placeholder.com/300x200/fff/3a2b1e?text=New+Product+${newId}`,
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      specification: newProduct.specification,
      price: parseFloat(newProduct.price),
      rating: parseFloat(newProduct.rating) || 0,
      stock: parseInt(newProduct.stock) || 10
    };
    
    setProducts(prev => [...prev, productToAdd]);
    setNewProduct({
      image: '', name: '', category: 'Burgers', description: '',
      specification: '', price: '', rating: '0', stock: '10'
    });
    setFormErrors({});
    setCurrentPage('products');
  };

  return (
    <div className="app">
      {}
      <header className="header">
        <div className="container">
          <div className="nav-wrapper">
            {/* Logo - Left Side */}
            <a href="#" className="logo" onClick={goToProducts}>
              <span className="logo-icon">🍔</span>
              <span className="logo-text">TASTY BURGER</span>
            </a>
            <nav className="desktop-nav">
              <button 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => setCurrentPage('about')}
              >
                About
              </button>
              <button 
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => setCurrentPage('contact')}
              >
                Contact
              </button>
              <button 
                className={`nav-link add-prod-btn ${currentPage === 'add-product' ? 'active' : ''}`}
                onClick={() => setCurrentPage('add-product')}
              >
                ➕ Add Product
              </button>
              <button 
                className={`cart-nav-btn ${currentPage === 'cart' ? 'active' : ''}`}
                onClick={goToCart}
              >
                🛒 Cart <span className="cart-count">{cart.length}</span>
              </button>
            </nav>

            {}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>

          {}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <button 
                className={`mobile-link ${currentPage === 'products' ? 'active' : ''}`}
                onClick={goToProducts}
              >
                Home
              </button>
              <button 
                className={`mobile-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}
              >
                About
              </button>
              <button 
                className={`mobile-link ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }}
              >
                Contact
              </button>
              <button 
                className={`mobile-link ${currentPage === 'add-product' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('add-product'); setMobileMenuOpen(false); }}
              >
                ➕ Add Product
              </button>
              <button 
                className={`mobile-link cart-link ${currentPage === 'cart' ? 'active' : ''}`}
                onClick={goToCart}
              >
                🛒 Cart ({cart.length})
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {/* About Page */}
        {currentPage === 'about' && (
          <section className="page-section">
            <div className="container-narrow">
              <button className="back-btn" onClick={goToProducts}>← Back to Menu</button>
              <h1 className="page-title">🍔 About Us</h1>
              <div className="content-card">
                <p><strong>TASTY BURGER</strong> has been serving the most delicious and satisfying burgers since 2022. We believe that a great burger brings people together — made with fresh ingredients, grilled to perfection, and served with a smile.</p>
                <br />
                <p> <strong>Fresh Ingredients</strong> — We source only the freshest vegetables and premium beef patties daily.</p>
                <p> <strong>Grilled to Order</strong> — Every burger is cooked fresh when you order.</p>
                <p> <strong>Made with Love</strong> — We treat every customer like family.</p>
                <br />
                <p> <strong>Location:</strong> Barcelona, Sorsogon </p>
                <p> <strong>Hours:</strong> 8:00 AM — 10:00 PM, Daily</p>
              </div>
            </div>
          </section>
        )}

        {}
        {currentPage === 'contact' && (
          <section className="page-section">
            <div className="container-narrow">
              <button className="back-btn" onClick={goToProducts}>← Back to Menu</button>
              <h1 className="page-title">📞 Get in Touch</h1>
              <div className="content-card">
                <p><strong>We'd love to hear from you!</strong></p>
                <br />
                <p>📧 Email: ourtastyburger@gmail.com</p>
                <p>📱 Phone: +63 917 123 8797</p>
                <p>📍 Address: Barcelona, Sorsogon</p>
                <br />
                <p>📘 Facebook: @TastyBurgerSorsogon</p>
                <p>📸 Instagram: @tastyburger.ph</p>
              </div>
            </div>
          </section>
        )}
        {currentPage === 'add-product' && (
          <section className="page-section">
            <div className="container-narrow">
              <button className="back-btn" onClick={goToProducts}>← Back to Menu</button>
              <h1 className="page-title">➕ Add New Product</h1>
              <form onSubmit={handleAddProduct} className="form-card">
                <div className="form-group">
                  <label>Product Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    placeholder="Paste image link here"
                  />
                  {formErrors.image && <span className="error-text">{formErrors.image}</span>}
                </div>

                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₱) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                    {formErrors.price && <span className="error-text">{formErrors.price}</span>}
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      min="0"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                    />
                    {formErrors.stock && <span className="error-text">{formErrors.stock}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief product description..."
                  />
                  {formErrors.description && <span className="error-text">{formErrors.description}</span>}
                </div>

                <div className="form-group">
                  <label>What's Inside *</label>
                  <textarea
                    name="specification"
                    value={newProduct.specification}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List ingredients..."
                  />
                  {formErrors.specification && <span className="error-text">{formErrors.specification}</span>}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={goToProducts}>Cancel</button>
                  <button type="submit" className="btn-primary">Add Product</button>
                </div>
              </form>
            </div>
          </section>
        )}

        {}
        {currentPage === 'details' && selectedProduct && (
          <section className="page-section">
            <div className="container-narrow">
              <button className="back-btn" onClick={goToProducts}>← Back to Menu</button>
              <div className="detail-card">
                <div className="detail-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="detail-info">
                  <span className="detail-category">{selectedProduct.category}</span>
                  <h1 className="detail-name">{selectedProduct.name}</h1>
                  <div className="rating-row">
                    {'★'.repeat(Math.floor(selectedProduct.rating))}
                    <span>{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <p className="stock-info">📦 Available: <strong>{selectedProduct.stock}</strong> pcs</p>
                  <p className="detail-desc">{selectedProduct.description}</p>
                  <div className="ingredients-box">
                    <h4>📋 What's Inside</h4>
                    <p>{selectedProduct.specification}</p>
                  </div>
                  <p className="detail-price">₱{selectedProduct.price.toFixed(2)}</p>
                  
                  <div className="qty-row">
                    <label>Quantity:</label>
                    <div className="qty-controls">
                      <button 
                        onClick={() => setAddQty(Math.max(1, addQty - 1))}
                        disabled={addQty <= 1}
                      >−</button>
                      <input
                        type="number"
                        value={addQty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setAddQty(Math.min(Math.max(1, val), selectedProduct.stock));
                        }}
                        min={1}
                        max={selectedProduct.stock}
                      />
                      <button 
                        onClick={() => setAddQty(Math.min(selectedProduct.stock, addQty + 1))}
                        disabled={addQty >= selectedProduct.stock}
                      >+</button>
                    </div>
                  </div>
                  
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {
                      if (addQty < 1 || addQty > selectedProduct.stock) return;
                      setCart(prev => {
                        const exists = prev.find(item => item.id === selectedProduct.id);
                        if (exists) {
                          return prev.map(item =>
                            item.id === selectedProduct.id
                              ? { ...item, cartQty: item.cartQty + addQty, subtotal: item.price * (item.cartQty + addQty) }
                              : item
                          );
                        }
                        return [...prev, { ...selectedProduct, cartQty: addQty, subtotal: selectedProduct.price * addQty }];
                      });
                      setAddQty(1);
                      alert('✅ Added to cart!');
                    }}
                  >
                    🛒 Add to Cart — ₱{(selectedProduct.price * addQty).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {}
        {currentPage === 'cart' && (
          <section className="page-section">
            <div className="container">
              <button className="back-btn" onClick={goToProducts}>← Continue Shopping</button>
              <h1 className="page-title">🛒 Your Cart</h1>
              
              {cart.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-icon">🛒</p>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added anything yet</p>
                  <button className="btn-primary" onClick={goToProducts}>Start Shopping</button>
                </div>
              ) : (
                <div className="cart-layout">
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item-card">
                        <img src={item.image} alt={item.name} className="item-img" />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">₱{item.price.toFixed(2)}</p>
                          <div className="item-qty">
                            <button onClick={() => updateCartQty(item.id, -1)}>−</button>
                            <span>{item.cartQty}</span>
                            <button onClick={() => updateCartQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                        <div className="item-total">
                          <p>₱{item.subtotal.toFixed(2)}</p>
                          <button className="remove-item" onClick={() => removeFromCart(item.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>₱{grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>₱{grandTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                      ✅ CHECKOUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {}
        {currentPage === 'products' && (
          <section className="menu-section">
            <div className="container">
              <div className="menu-header">
                <h1 className="menu-title">OUR CRAZY BURGER</h1>
                <p className="menu-subtitle">Freshly made burgers just for you!</p>
              </div>

              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-card-img"
                    />
                    <div className="product-card-body">
                      <span className="product-category">{product.category}</span>
                      <h3 className="product-card-name">{product.name}</h3>
                      <div className="product-rating">
                        {'★'.repeat(Math.floor(product.rating))}
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                      <p className="product-card-price">₱{product.price.toFixed(2)}</p>
                      <div className="product-card-buttons">
                        <button className="btn-outline" onClick={() => goToDetails(product)}>Details</button>
                        <button className="btn-primary" onClick={() => openAddModal(product)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {}
      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalProduct(null)}>✕</button>
            
            <h2 className="modal-heading">Add to Cart</h2>
            <h3 className="modal-product-name">{modalProduct.name}</h3>
            <p className="modal-price">₱{modalProduct.price.toFixed(2)} each</p>
            <p className="modal-stock">📦 Available: <strong>{modalProduct.stock}</strong> pcs</p>
            
            <div className="modal-qty">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button 
                  onClick={() => setAddQty(Math.max(1, addQty - 1))}
                  disabled={addQty <= 1}
                >−</button>
                <input
                  type="number"
                  value={addQty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setAddQty(Math.min(Math.max(1, val), modalProduct.stock));
                  }}
                  min={1}
                  max={modalProduct.stock}
                />
                <button 
                  onClick={() => setAddQty(Math.min(modalProduct.stock, addQty + 1))}
                  disabled={addQty >= modalProduct.stock}
                >+</button>
              </div>
            </div>
            
            <p className="modal-total">Total: <strong>₱{(modalProduct.price * addQty).toFixed(2)}</strong></p>
            
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setModalProduct(null)}>Cancel</button>
              <button className="btn-primary" onClick={confirmAddToCart}>✅ Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}