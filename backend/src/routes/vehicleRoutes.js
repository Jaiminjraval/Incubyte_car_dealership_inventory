import express from 'express';
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { vehicleValidator, vehicleUpdateValidator, vehicleRestockValidator } from '../validators/vehicleValidator.js';

const router = express.Router();

// Apply protect middleware to all vehicle routes
router.use(protect);

router
  .route('/')
  .get(getVehicles)
  .post(authorize('admin'), vehicleValidator, createVehicle);

router
  .route('/search')
  .get(searchVehicles);

router
  .route('/:id')
  .get(getVehicle)
  .put(authorize('admin'), vehicleUpdateValidator, updateVehicle)
  .delete(authorize('admin'), deleteVehicle);

router
  .route('/:id/purchase')
  .post(purchaseVehicle);

router
  .route('/:id/restock')
  .post(authorize('admin'), vehicleRestockValidator, restockVehicle);

export default router;
