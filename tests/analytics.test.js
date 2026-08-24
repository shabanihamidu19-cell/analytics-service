const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Metric = require('../src/models/Metric');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
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

  test('POST /analytics - should reject invalid payload', async () => {
    const res = await request(app)
      .post('/analytics')
      .send({
        service: 'user-service'
        // missing metric and value
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /analytics/stats - should return aggregated stats with KPIs', async () => {
    await Metric.create([
      { service: 'user-service', metric: 'request_count', value: 100 },
      { service: 'user-service', metric: 'error_rate', value: 5 },
      { service: 'user-service', metric: 'response_time', value: 120 }
    ]);

    const res = await request(app).get('/analytics/stats');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].kpis.totalRequests).toBe(100);
    expect(res.body.data[0].kpis.errorPercentage).toBe(5);
  });

  test('GET /health - should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('analytics-service');
  });
});
