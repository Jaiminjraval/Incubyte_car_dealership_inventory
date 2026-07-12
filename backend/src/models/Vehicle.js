import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Please add a make'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Please add a model'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number']
    },
    quantity: {
      type: Number,
      required: [true, 'Please add a quantity'],
      min: [0, 'Quantity must be a positive number'],
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
