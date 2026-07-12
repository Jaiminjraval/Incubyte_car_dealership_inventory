import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { createVehicle } from '../services/vehicleAPI';
import VehicleForm from '../components/VehicleForm';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (vehicleData) => {
    setLoading(true);
    setError('');
    try {
      const response = await createVehicle(vehicleData);
      if (response.success) {
        // Success handled by showing notification on dashboard or redirecting
        // We'll just redirect and assume the list fetches the new item
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create vehicle');
      setLoading(false);
    }
  };

  return (
    <div className="form-page-content">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem', padding: '0.5rem 1rem' }}>
            <ChevronLeft size={18} />
            <span>Back to Inventory</span>
          </Link>
          <h1>Add New Vehicle</h1>
          <p>Enter the details to add a new vehicle to the dealership inventory.</p>
        </div>
      </div>
      
      <VehicleForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default AddVehicle;
