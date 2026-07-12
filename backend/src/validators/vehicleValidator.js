import { check } from 'express-validator';

export const vehicleValidator = [
  check('make', 'Make is required').not().isEmpty(),
  check('model', 'Model is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('quantity', 'Quantity must be a positive integer').isInt({ min: 0 })
];

export const vehicleUpdateValidator = [
  check('make', 'Make cannot be empty').optional().not().isEmpty(),
  check('model', 'Model cannot be empty').optional().not().isEmpty(),
  check('category', 'Category cannot be empty').optional().not().isEmpty(),
  check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
  check('quantity', 'Quantity must be a positive integer').optional().isInt({ min: 0 })
];

export const vehicleRestockValidator = [
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0')
];
