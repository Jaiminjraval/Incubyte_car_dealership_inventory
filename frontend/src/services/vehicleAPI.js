import api from './api';

export const getVehicles = async (page = 1, limit = 10) => {
  const response = await api.get(`/vehicles?page=${page}&limit=${limit}`);
  return response.data;
};

export const searchVehicles = async (queryParams) => {
  const params = new URLSearchParams(queryParams).toString();
  const response = await api.get(`/vehicles/search?${params}`);
  return response.data;
};

export const getVehicle = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

export const purchaseVehicle = async (id) => {
  const response = await api.post(`/vehicles/${id}/purchase`);
  return response.data;
};

export const restockVehicle = async (id, quantity) => {
  const response = await api.post(`/vehicles/${id}/restock`, { quantity });
  return response.data;
};
