import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

let adminToken;
let userToken;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  const normalUser = await User.create({
    name: 'Normal User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  });

  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'password123'
  });
  
  // Extract token from cookie string (assuming 'token=...; Path=/; HttpOnly')
  adminToken = adminRes.headers['set-cookie'][0].split(';')[0];

  const userRes = await request(app).post('/api/auth/login').send({
    email: 'user@example.com',
    password: 'password123'
  });
  userToken = userRes.headers['set-cookie'][0].split(';')[0];
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Vehicle Endpoints', () => {
  const validVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 10
  };

  describe('POST /api/vehicles', () => {
    it('should create a new vehicle if user is admin', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Cookie', [adminToken])
        .send(validVehicle);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toBe(validVehicle.make);
      expect(res.body.data.quantity).toBe(10);
    });

    it('should fail to create vehicle if user is not admin', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Cookie', [userToken])
        .send(validVehicle);

      expect(res.statusCode).toBe(403);
    });

    it('should not create vehicle with invalid data', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Cookie', [adminToken])
        .send({ ...validVehicle, price: -100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should protect routes', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send(validVehicle);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/vehicles', () => {
    beforeEach(async () => {
      await Vehicle.create([
        validVehicle,
        { ...validVehicle, make: 'Honda', model: 'Civic' }
      ]);
    });

    it('should get all vehicles', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Cookie', [userToken]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await Vehicle.create([
        validVehicle, // Toyota Camry, Sedan, 25000
        { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 5 },
        { make: 'Ford', model: 'F-150', category: 'Truck', price: 40000, quantity: 2 },
        { make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 35000, quantity: 8 }
      ]);
    });

    it('should filter by make (regex)', async () => {
      const res = await request(app).get('/api/vehicles/search?make=hon').set('Cookie', [userToken]);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Honda');
    });

    it('should filter by generic search matching make or model', async () => {
      const res = await request(app).get('/api/vehicles/search?search=3').set('Cookie', [userToken]);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Tesla');

      const res2 = await request(app).get('/api/vehicles/search?search=toyota').set('Cookie', [userToken]);
      expect(res2.statusCode).toBe(200);
      expect(res2.body.data.length).toBe(1);
      expect(res2.body.data[0].make).toBe('Toyota');
    });

    it('should filter by category (exact)', async () => {
      const res = await request(app).get('/api/vehicles/search?category=Truck').set('Cookie', [userToken]);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Ford');
    });

    it('should filter by price range', async () => {
      const res = await request(app).get('/api/vehicles/search?minPrice=20000&maxPrice=30000').set('Cookie', [userToken]);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2); // Toyota and Honda
    });
    
    it('should combine multiple filters', async () => {
      const res = await request(app).get('/api/vehicles/search?category=Sedan&minPrice=30000').set('Cookie', [userToken]);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Tesla');
    });
  });

  describe('GET /api/vehicles/:id', () => {
    let vehicleId;
    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle);
      vehicleId = vehicle._id.toString();
    });

    it('should get a single vehicle', async () => {
      const res = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set('Cookie', [userToken]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toBe('Toyota');
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/vehicles/${fakeId}`)
        .set('Cookie', [userToken]);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    let vehicleId;
    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle);
      vehicleId = vehicle._id.toString();
    });

    it('should update vehicle if user is admin', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Cookie', [adminToken])
        .send({ price: 26000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(26000);
    });

    it('should fail to update vehicle if user is not admin', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Cookie', [userToken])
        .send({ price: 26000 });

      expect(res.statusCode).toBe(403);
    });

    it('should not update vehicle with invalid data', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Cookie', [adminToken])
        .send({ price: -100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for invalid vehicle ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/vehicles/${fakeId}`)
        .set('Cookie', [adminToken])
        .send({ price: 26000 });

      expect(res.statusCode).toBe(404);
    });

    it('should protect routes', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .send({ price: 26000 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    let vehicleId;
    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle);
      vehicleId = vehicle._id.toString();
    });

    it('should allow admin to delete vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Cookie', [adminToken]);

      expect(res.statusCode).toBe(204);
      
      const checkVehicle = await Vehicle.findById(vehicleId);
      expect(checkVehicle).toBeNull();
    });

    it('should prevent normal user from deleting', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Cookie', [userToken]);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    let vehicleId;
    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle); // quantity 10
      vehicleId = vehicle._id.toString();
    });

    it('should allow user to purchase and decrease quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Cookie', [userToken]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(9);
    });

    it('should fail if quantity is 0', async () => {
      await Vehicle.findByIdAndUpdate(vehicleId, { quantity: 0 });

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Cookie', [userToken]);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/out of stock/i);
    });

    it('should prevent unauthenticated access', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    let vehicleId;
    beforeEach(async () => {
      const vehicle = await Vehicle.create(validVehicle); // quantity 10
      vehicleId = vehicle._id.toString();
    });

    it('should allow admin to restock and increase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Cookie', [adminToken])
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(15);
    });

    it('should prevent normal user from restocking', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Cookie', [userToken])
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(403);
    });

    it('should fail if quantity is invalid', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Cookie', [adminToken])
        .send({ quantity: -5 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
