import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, DollarSign, Package, ShoppingCart, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { purchaseVehicle, deleteVehicle } from '../services/vehicleAPI';
import { AuthContext } from '../context/AuthContext';
import RestockModal from './RestockModal';
import ConfirmModal from './ConfirmModal';

const VehicleCard = ({ vehicle, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRestock, setShowRestock] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await purchaseVehicle(vehicle._id);
      setSuccess('Purchased successfully!');
      if (onUpdate) {
        onUpdate();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRestockSuccess = () => {
    setShowRestock(false);
    setSuccess('Restocked successfully!');
    if (onUpdate) {
      onUpdate();
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteVehicle(vehicle._id);
      setShowDeleteConfirm(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete vehicle');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="vehicle-card glass-panel">
        <div className="vehicle-card-header">
          <span className="vehicle-make">{vehicle.make}</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className="vehicle-model">{vehicle.model}</h3>
            {user?.role === 'admin' && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button 
                  className="btn-icon" 
                  title="Edit Vehicle" 
                  onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="btn-icon" 
                  title="Restock" 
                  onClick={() => setShowRestock(true)}
                  style={{ color: 'var(--accent-color)' }}
                >
                  <PlusCircle size={20} />
                </button>
                <button 
                  className="btn-icon" 
                  title="Delete Vehicle" 
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ color: 'var(--error-color)' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="vehicle-card-body">
          <div className="vehicle-detail">
            <Tag size={16} className="detail-icon" />
            <span>{vehicle.category}</span>
          </div>
          <div className="vehicle-detail highlight">
            <DollarSign size={16} className="detail-icon" />
            <span className="price">{vehicle.price.toLocaleString()}</span>
          </div>
          <div className="vehicle-detail">
            <Package size={16} className="detail-icon" />
            <span className={vehicle.quantity === 0 ? 'out-of-stock' : ''}>
              {vehicle.quantity === 0 ? 'Out of stock' : `${vehicle.quantity} in stock`}
            </span>
          </div>
        </div>

        <div className="vehicle-card-actions" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button
            className="btn-primary"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            onClick={handlePurchase}
            disabled={loading || vehicle.quantity === 0}
          >
            <ShoppingCart size={18} />
            {loading ? 'Processing...' : 'Purchase'}
          </button>
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>{success}</p>}
        </div>
      </div>

      {showRestock && (
        <RestockModal 
          vehicle={vehicle} 
          onClose={() => setShowRestock(false)} 
          onSuccess={handleRestockSuccess} 
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete the ${vehicle.make} ${vehicle.model}? This action cannot be undone.`}
        loading={isDeleting}
        error={deleteError}
        confirmText="Delete"
        isDanger={true}
      />
    </>
  );
};

export default VehicleCard;
