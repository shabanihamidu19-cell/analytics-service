const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
      index: true
    },
    metric: {
      type: String,
      required: true,
      enum: ['request_count', 'error_rate', 'response_time', 'custom']
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
  { timestamps: true }
);

// Compound index for common queries
metricSchema.index({ service: 1, timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);
