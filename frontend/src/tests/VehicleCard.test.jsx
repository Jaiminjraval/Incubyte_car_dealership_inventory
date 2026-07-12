import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import VehicleCard from '../components/VehicleCard';
import * as vehicleAPI from '../services/vehicleAPI';

vi.mock('../services/vehicleAPI', () => ({
  deleteVehicle: vi.fn(),
  purchaseVehicle: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

const mockVehicle = {
  _id: '1',
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5
};

describe('VehicleCard Component', () => {
  const mockUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCard = (role = 'user', vehicle = mockVehicle) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: { role }, loading: false }}>
          <VehicleCard vehicle={vehicle} onUpdate={mockUpdate} />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders vehicle details correctly', () => {
    renderCard();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
  });

  it('allows purchase when in stock', async () => {
    renderCard();
    
    // Using generic text matcher to avoid breaking on icons inside the button
    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).not.toBeDisabled();

    vehicleAPI.purchaseVehicle.mockResolvedValueOnce({ success: true });
    
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(vehicleAPI.purchaseVehicle).toHaveBeenCalledWith('1');
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  it('disables purchase button when out of stock', () => {
    renderCard('user', { ...mockVehicle, quantity: 0 });
    
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).toBeDisabled();
  });

  it('hides admin controls for standard users', () => {
    renderCard('user');
    
    // Check that Edit/Trash/Restock icons are not rendered. 
    // They don't have text, but they have Link/button roles or are missing entirely.
    // We can query by role or by assuming the number of buttons.
    expect(screen.queryByTitle(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle(/restock/i)).not.toBeInTheDocument();
  });

  it('shows admin controls for admins', () => {
    renderCard('admin');
    
    expect(screen.getByRole('button', { name: /edit vehicle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restock/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete vehicle/i })).toBeInTheDocument();
  });
});
