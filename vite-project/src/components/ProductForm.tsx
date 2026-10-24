import { useState } from 'react';
import type { Product } from '../types.ts';

type ProductFormProps = {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
};

export default function ProductForm({ onAddProduct }: ProductFormProps) {
  const initialForm = {
    image: '',
    name: '',
    category: 'Burgers',
    description: '',
    specification: '',
    price: '',
    rating: '0',
    quantity: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const next = {...prev}; delete next[name]; return next; });
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.name.trim()) newErrors.name = 'Product Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid Price is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = 'Valid Quantity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onAddProduct({
      image: formData.image || `https://via.placeholder.com/300x200/fff/666?text=${encodeURIComponent(formData.name)}`,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      specification: formData.specification,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating) || 0,
      quantity: parseInt(formData.quantity)
    });
    
    setFormData(initialForm);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>➕ Add New Product</h2>

      <div className="form-group">
        <label>Product Image URL</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Optional" />
      </div>

      <div className="form-group">
        <label>Product Name *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Burgers">Burgers</option>
            <option value="Sandwiches">Sandwiches</option>
            <option value="Sides">Sides</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price (₱) *</label>
          <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Quantity *</label>
          <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="0" />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>
        <div className="form-group">
          <label>Rating (0-5)</label>
          <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Brief description..." />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Specifications / Ingredients</label>
        <textarea name="specification" value={formData.specification} onChange={handleChange} rows={2} placeholder="What's inside..." />
      </div>

      <button type="submit" className="btn-primary full-width">Add Product</button>
    </form>
  );
}