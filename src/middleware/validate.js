const Joi = require('joi');
const { AppError } = require('./errorHandler');

const createMetricSchema = Joi.object({
  service: Joi.string().trim().min(2).max(80).required(),
  metric: Joi.string()
    .valid('request_count', 'error_rate', 'response_time', 'custom')
    .required(),
  value: Joi.number().required(),
  timestamp: Joi.date().iso().optional(),
  metadata: Joi.object().default({})
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new AppError(message, 400));
  }

  req.body = value;
  next();
};

module.exports = {
  validateCreateMetric: validate(createMetricSchema)
};
