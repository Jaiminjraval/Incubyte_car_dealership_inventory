import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { updateVehicle, getVehicles } from '../services/vehicleAPI';
import VehicleForm from '../components/VehicleForm';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        // Find vehicle data. Could be optimized by fetching single vehicle,
        // but for now we search all.
        const response = await getVehicles();
        const found = response.data.find(v => v._id === id);
        if (found) {
          setVehicle(found);
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        setError('Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleData();
  }, [id]);

  const handleSubmit = async (vehicleData) => {
    setSaving(true);
    setError('');
    try {
      const response = await updateVehicle(id, vehicleData);
      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update vehicle');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="empty-state">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/" className="btn-primary" style={{ width: 'auto' }}>Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="form-page-content">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem', padding: '0.5rem 1rem' }}>
            <ChevronLeft size={18} />
            <span>Back to Inventory</span>
          </Link>
          <h1>Edit Vehicle</h1>
          <p>Update details for {vehicle.make} {vehicle.model}.</p>
        </div>
      </div>
      
      <VehicleForm 
        initialData={vehicle}
        onSubmit={handleSubmit} 
        loading={saving} 
        error={error} 
      />
    </div>
  );
};

export default EditVehicle;
