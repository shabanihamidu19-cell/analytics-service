const analyticsService = require('../services/analyticsService');

exports.createMetric = async (req, res) => {
  try {
    const { service, metric, value, metadata } = req.body;

    if (!service || !metric || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'service, metric and value are required'
      });
    }

    const saved = await analyticsService.saveMetric({
      service,
      metric,
      value: Number(value),
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to save metric' });
  }
};

exports.getMetrics = async (req, res) => {
  try {
    const metrics = await analyticsService.getMetrics(req.query);
    res.json({ success: true, count: metrics.length, data: metrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await analyticsService.getStats(req.query);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
