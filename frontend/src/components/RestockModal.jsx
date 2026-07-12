import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { restockVehicle } from '../services/vehicleAPI';

const RestockModal = ({ vehicle, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await restockVehicle(vehicle._id, quantity);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restock vehicle');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PackagePlus color="var(--accent-color)" />
            <h2>Restock Vehicle</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Add inventory for <strong>{vehicle.make} {vehicle.model}</strong>. Current stock is {vehicle.quantity}.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="quantity">Restock Amount</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || '')}
                required
              />
            </div>
            
            {error && <div className="auth-alert error" style={{ marginBottom: '1rem' }}>{error}</div>}
            
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Restock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestockModal;
