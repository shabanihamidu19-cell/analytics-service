const express = require('express');
const router = express.Router();
const {
  createMetric,
  getMetrics,
  getStats
} = require('../controllers/analyticsController');

router.post('/', createMetric);
router.get('/', getMetrics);
router.get('/stats', getStats);

module.exports = router;
