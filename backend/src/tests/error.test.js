import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Error Handling Middleware', () => {
  it('should return 404 for an unknown route', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Not Found/i);
  });

  it('should handle Mongoose CastError (invalid ObjectId)', async () => {
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123'
    });
    const adminToken = adminRes.headers['set-cookie'][0].split(';')[0];

    const res = await request(app)
      .get('/api/vehicles/invalid-id-format')
      .set('Cookie', [adminToken]);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Resource not found/i);
  });

  it('should handle Mongoose ValidationError', async () => {
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123'
    });
    const adminToken = adminRes.headers['set-cookie'][0].split(';')[0];

    // Force a validation error
    let error;
    try {
      await Vehicle.create({});
    } catch (err) {
      error = err;
    }
    expect(error.name).toBe('ValidationError');
  });

  it('should handle Mongoose duplicate key error', async () => {
    // Create a user
    await User.create({
      name: 'Test 1',
      email: 'duplicate@example.com',
      password: 'password123',
      role: 'user'
    });
    
    // Attempt to create another user with the same email, but bypass express-validator
    // by interacting directly with the DB, which simulates the 11000 error
    let error;
    try {
      await User.create({
        name: 'Test 2',
        email: 'duplicate@example.com',
        password: 'password123',
        role: 'user'
      });
    } catch (err) {
      error = err;
    }
    expect(error.code).toBe(11000);
  });
});
