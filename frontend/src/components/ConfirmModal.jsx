import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  loading, 
  error,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isDanger && <AlertTriangle color="var(--error-color)" size={24} />}
            <h2 style={{ color: isDanger ? 'var(--error-color)' : 'var(--text-primary)', margin: 0 }}>
              {title}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose} disabled={loading} style={{ margin: '-0.5rem -0.5rem 0 0' }}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body" style={{ color: 'var(--text-secondary)' }}>
          <p>{message}</p>
        </div>
        
        {error && (
          <div className="auth-alert error" style={{ padding: '0.75rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>
            {error}
          </div>
        )}
        
        <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose} 
            disabled={loading}
            style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={onConfirm} 
            disabled={loading}
            style={{ 
              padding: '0.6rem 1.2rem', 
              background: isDanger ? 'var(--error-color)' : 'var(--accent-color)',
              minWidth: '100px'
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
