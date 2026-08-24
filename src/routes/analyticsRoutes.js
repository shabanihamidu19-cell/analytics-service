const express = require('express');
const router = express.Router();
const {
  createMetric,
  getMetrics,
  getStats,
  getServices
} = require('../controllers/analyticsController');
const { validateCreateMetric } = require('../middleware/validate');

router.post('/', validateCreateMetric, createMetric);
router.get('/', getMetrics);
router.get('/stats', getStats);
router.get('/services', getServices);

module.exports = router;
