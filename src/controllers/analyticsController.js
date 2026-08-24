const analyticsService = require('../services/analyticsService');
const { AppError } = require('../middleware/errorHandler');

exports.createMetric = async (req, res, next) => {
  try {
    const saved = await analyticsService.saveMetric(req.body);
    res.status(201).json({
      success: true,
      message: 'Metric saved successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const result = await analyticsService.getMetrics(req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getStats(req.query);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const services = await analyticsService.getServiceSummary();
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};
