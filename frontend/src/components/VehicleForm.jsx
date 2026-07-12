import React, { useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

const VehicleForm = ({ onSubmit, initialData, loading, error }) => {
  const [formData, setFormData] = useState({
    make: initialData?.make || '',
    model: initialData?.model || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    quantity: initialData?.quantity || ''
  });
  
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    
    // Client-side validation
    if (!formData.make || !formData.model || !formData.category || !formData.price || !formData.quantity) {
      setValidationError('All fields are required');
      return;
    }
    
    const price = Number(formData.price);
    const quantity = Number(formData.quantity);
    
    if (price < 0) {
      setValidationError('Price cannot be negative');
      return;
    }
    
    if (quantity < 0 || !Number.isInteger(quantity)) {
      setValidationError('Quantity must be a positive integer');
      return;
    }
    
    onSubmit({
      ...formData,
      price,
      quantity
    });
  };

  return (
    <div className="vehicle-form-container glass-panel">
      <div className="vehicle-image-placeholder">
        <Camera size={48} color="var(--text-secondary)" opacity={0.5} />
        <span>Vehicle Image Upload (Coming Soon)</span>
      </div>
      
      <form onSubmit={handleSubmit} className="vehicle-form">
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="e.g. Toyota"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. Camry"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category" 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
          >
            <option value="" disabled>Select a category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Van">Van</option>
          </select>
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Initial Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0"
            />
          </div>
        </div>
        
        {(error || validationError) && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{validationError || error}</span>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
