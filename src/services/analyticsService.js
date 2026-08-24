const Metric = require('../models/Metric');

class AnalyticsService {
  async saveMetric(data) {
    const metric = new Metric(data);
    return await metric.save();
  }

  async getMetrics({ service, from, to, limit = 100 }) {
    const query = {};
    if (service) query.service = service;
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    return await Metric.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();
  }

  async getStats({ service, from, to }) {
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
          _id: '$service',
          totalRequests: {
            $sum: {
              $cond: [{ $eq: ['$metric', 'request_count'] }, '$value', 0]
            }
          },
          totalErrors: {
            $sum: {
              $cond: [{ $eq: ['$metric', 'error_rate'] }, '$value', 0]
            }
          },
          avgResponseTime: {
            $avg: {
              $cond: [{ $eq: ['$metric', 'response_time'] }, '$value', null]
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          service: '$_id',
          totalRequests: 1,
          totalErrors: 1,
          errorPercentage: {
            $cond: [
              { $eq: ['$totalRequests', 0] },
              0,
              { $multiply: [{ $divide: ['$totalErrors', '$totalRequests'] }, 100] }
            ]
          },
          avgResponseTime: { $round: ['$avgResponseTime', 2] },
          totalMetrics: '$count'
        }
      },
      { $sort: { service: 1 } }
    ];

    return await Metric.aggregate(pipeline);
  }
}

module.exports = new AnalyticsService();
