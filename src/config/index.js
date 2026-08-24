require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics_db',
  nodeEnv: process.env.NODE_ENV || 'development'
};
