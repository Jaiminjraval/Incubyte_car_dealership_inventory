import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getVehicles, searchVehicles } from '../services/vehicleAPI';
import VehicleCard from '../components/VehicleCard';
import VehicleSkeleton from '../components/VehicleSkeleton';
import SearchFilterBar from '../components/SearchFilterBar';
import useDebounce from '../hooks/useDebounce';
import { Car, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  const debouncedFilters = useDebounce(filters, 500);

  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.search) params.set('search', debouncedFilters.search);
    if (debouncedFilters.category) params.set('category', debouncedFilters.category);
    if (debouncedFilters.minPrice) params.set('minPrice', debouncedFilters.minPrice);
    if (debouncedFilters.maxPrice) params.set('maxPrice', debouncedFilters.maxPrice);
    setSearchParams(params);

    fetchVehicles();
  }, [debouncedFilters, page]);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      const hasFilters = Object.values(debouncedFilters).some(v => v !== '');
      
      if (hasFilters) {
        const queryParams = { ...debouncedFilters };
        response = await searchVehicles(queryParams);
      } else {
        response = await getVehicles(page, limit);
      }

      if (response.success) {
        setVehicles(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Vehicle Inventory</h1>
          <p>Manage and view your current dealership stock.</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/add-vehicle" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Car size={18} />
            <span>New Vehicle</span>
          </Link>
        )}
      </div>
      
      <SearchFilterBar filters={filters} setFilters={setFilters} />

      {error && (
        <div className="auth-alert error" style={{ marginTop: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="vehicle-grid">
          {[...Array(8)].map((_, i) => (
            <VehicleSkeleton key={i} />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state glass-panel" style={{ marginTop: '1.5rem' }}>
          <Car size={48} color="var(--text-secondary)" />
          <h3>No Vehicles Found</h3>
          <p>Try adjusting your search filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="vehicle-grid" style={{ marginTop: '1.5rem' }}>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} onUpdate={fetchVehicles} />
          ))}
        </div>
      )}
      
      {!loading && vehicles.length > 0 && !Object.values(debouncedFilters).some(v => v !== '') && (
        <div className="pagination-wrapper">
          <button 
            className="btn-icon" 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="page-indicator">Page {page}</span>
          <button 
            className="btn-icon"
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Dashboard;
