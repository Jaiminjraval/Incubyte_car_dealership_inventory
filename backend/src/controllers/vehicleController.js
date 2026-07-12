import { validationResult } from 'express-validator';
import {
  createVehicleService,
  getVehiclesService,
  searchVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
  purchaseVehicleService,
  restockVehicleService
} from '../services/vehicleService.js';

export const createVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const vehicle = await createVehicleService(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await getVehiclesService();
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const searchVehicles = async (req, res, next) => {
  try {
    const vehicles = await searchVehiclesService(req.query);
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await getVehicleByIdService(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const vehicle = await updateVehicleService(req.params.id, req.body);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    await deleteVehicleService(req.params.id);
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const purchaseVehicle = async (req, res, next) => {
  try {
    const vehicle = await purchaseVehicleService(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const restockVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const vehicle = await restockVehicleService(req.params.id, req.body.quantity);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};
