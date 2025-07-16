const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

module.exports = (app) => {
  app.use(helmet())
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }))
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }))
} 