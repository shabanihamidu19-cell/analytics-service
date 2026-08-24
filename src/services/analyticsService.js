const Metric = require('../models/Metric');
const logger = require('../utils/logger');

class AnalyticsService {
  async saveMetric(data) {
    const metric = await Metric.create(data);
    logger.debug('Metric saved', { service: data.service, metric: data.metric });
    return metric;
  }

  async getMetrics({ service, metric, from, to, limit = 100, page = 1 } = {}) {
    const query = {};

    if (service) query.service = service;
    if (metric) query.metric = metric;

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [data, total] = await Promise.all([
      Metric.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Metric.countDocuments(query)
    ]);

    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit) || 1
      }
    };
  }

  async getStats({ service, from, to } = {}) {
    const match = {};

    if (service) match.service = service;
    if (from || to) {
      match.timestamp = {};
      if (from) match.timestamp.$gte = new Date(from);
      if (to) match.timestamp.$lte = new Date(to);
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            service: '$service',
            metric: '$metric'
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          avgValue: { $avg: '$value' },
          minValue: { $min: '$value' },
          maxValue: { $max: '$value' },
          lastTimestamp: { $max: '$timestamp' }
        }
      },
      {
        $group: {
          _id: '$_id.service',
          metrics: {
            $push: {
              metric: '$_id.metric',
              count: '$count',
              total: { $round: ['$totalValue', 2] },
              avg: { $round: ['$avgValue', 2] },
              min: '$minValue',
              max: '$maxValue',
              lastSeen: '$lastTimestamp'
            }
          },
          totalDataPoints: { $sum: '$count' }
        }
      },
      {
        $project: {
          _id: 0,
          service: '$_id',
          totalDataPoints: 1,
          metrics: 1
        }
      },
      { $sort: { service: 1 } }
    ];

    const results = await Metric.aggregate(pipeline);

    // Enrich with derived KPIs (error %, etc.)
    return results.map((item) => {
      const requestMetric = item.metrics.find((m) => m.metric === 'request_count');
      const errorMetric = item.metrics.find((m) => m.metric === 'error_rate');
      const responseMetric = item.metrics.find((m) => m.metric === 'response_time');

      const totalRequests = requestMetric?.total || 0;
      const totalErrors = errorMetric?.total || 0;

      return {
        ...item,
        kpis: {
          totalRequests,
          totalErrors,
          errorPercentage:
            totalRequests > 0
              ? Number(((totalErrors / totalRequests) * 100).toFixed(2))
              : 0,
          avgResponseTime: responseMetric?.avg || null
        }
      };
    });
  }

  async getServiceSummary() {
    const pipeline = [
      {
        $group: {
          _id: '$service',
          lastSeen: { $max: '$timestamp' },
          dataPoints: { $sum: 1 }
        }
      },
      { $sort: { lastSeen: -1 } },
      {
        $project: {
          _id: 0,
          service: '$_id',
          lastSeen: 1,
          dataPoints: 1
        }
      }
    ];

    return Metric.aggregate(pipeline);
  }
}

module.exports = new AnalyticsService();
