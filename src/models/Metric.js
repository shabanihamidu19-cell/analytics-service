const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    metric: {
      type: String,
      required: true,
      enum: ['request_count', 'error_rate', 'response_time', 'custom'],
      index: true
    },
    value: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    // TTL index can be added later for automatic retention
  }
);

// Compound indexes for common query patterns
metricSchema.index({ service: 1, timestamp: -1 });
metricSchema.index({ service: 1, metric: 1, timestamp: -1 });
metricSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);
