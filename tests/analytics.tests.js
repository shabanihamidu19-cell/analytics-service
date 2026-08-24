const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Metric = require('../src/models/Metric');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Metric.deleteMany({});
});

describe('Analytics Service', () => {
  test('POST /analytics - should save a metric', async () => {
    const res = await request(app)
      .post('/analytics')
      .send({
        service: 'user-service',
        metric: 'request_count',
        value: 150,
        metadata: { endpoint: '/users' }
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.service).toBe('user-service');
  });

  test('GET /analytics/stats - should return aggregated stats', async () => {
    await Metric.create([
      { service: 'user-service', metric: 'request_count', value: 100 },
      { service: 'user-service', metric: 'error_rate', value: 5 },
      { service: 'user-service', metric: 'response_time', value: 120 }
    ]);

    const res = await request(app).get('/analytics/stats');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].totalRequests).toBe(100);
  });
});
