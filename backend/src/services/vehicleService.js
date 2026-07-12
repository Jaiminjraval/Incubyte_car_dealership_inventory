import Vehicle from '../models/Vehicle.js';
import AppError from '../utils/AppError.js';

export const createVehicleService = async (vehicleData) => {
  return await Vehicle.create(vehicleData);
};

export const getVehiclesService = async () => {
  return await Vehicle.find();
};

export const searchVehiclesService = async (query) => {
  const { search, make, model, category, minPrice, maxPrice } = query;
  const dbQuery = {};

  if (search) {
    dbQuery.$or = [
      { make: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } }
    ];
  } else {
    if (make) {
      dbQuery.make = { $regex: make, $options: 'i' };
    }
    if (model) {
      dbQuery.model = { $regex: model, $options: 'i' };
    }
  }
  
  if (category) {
    dbQuery.category = category;
  }
  
  if (minPrice || maxPrice) {
    dbQuery.price = {};
    if (minPrice) dbQuery.price.$gte = Number(minPrice);
    if (maxPrice) dbQuery.price.$lte = Number(maxPrice);
  }

  return await Vehicle.find(dbQuery);
};

export const getVehicleByIdService = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new AppError(`Vehicle not found with id of ${id}`, 404);
  }
  return vehicle;
};

export const updateVehicleService = async (id, vehicleData) => {
  const vehicle = await Vehicle.findByIdAndUpdate(id, vehicleData, {
    new: true,
    runValidators: true
  });
  if (!vehicle) {
    throw new AppError(`Vehicle not found with id of ${id}`, 404);
  }
  return vehicle;
};

export const deleteVehicleService = async (id) => {
  const vehicle = await Vehicle.findByIdAndDelete(id);
  if (!vehicle) {
    throw new AppError(`Vehicle not found with id of ${id}`, 404);
  }
  return vehicle;
};

export const purchaseVehicleService = async (id) => {
  // Use atomic update to ensure we don't go below 0, and we check quantity condition
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: id, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    // We need to check if the vehicle doesn't exist, or if it's just out of stock
    const existingVehicle = await Vehicle.findById(id);
    if (!existingVehicle) {
      throw new AppError(`Vehicle not found with id of ${id}`, 404);
    }
    throw new AppError('Vehicle is out of stock', 400);
  }

  return vehicle;
};

export const restockVehicleService = async (id, quantity) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    { $inc: { quantity: quantity } },
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    throw new AppError(`Vehicle not found with id of ${id}`, 404);
  }

  return vehicle;
};
