//import
const express = require("express")
const helmet = require('helmet');
const cors = require("cors")
const morgan = require("morgan")
const rateLimit = require('express-rate-limit');
const { readdirSync } = require("fs")
const security = require('./middlewares/security');
// const errorHandler = require('./middlewares/errorHandler'); // ไม่ได้ใช้
const logger = require('./utils/logger');

const app = express()
const port = process.env.PORT || 8001

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // ปรับ origin ตามความเหมาะสม
  credentials: true,
}));

// Logging middlewares
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// middleware
app.use(express.json({limit: "20mb"}))  // {limit: "20mb"} Allow ให้ server ของเราส่งข้อมูลได้เยอะๆ จะมีปัญญาตอนทำพวกรูปภาพ
security(app);

//  Routes, @ENDPOINT http://localhost:8000/api
readdirSync("./routes").map((item) => app.use("/api", require("./routes/" + item)))
// Error handler (ควรอยู่หลัง routes)
app.use((err, req, res, next) => {
  logger.error('Error: %s', err.stack || err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

//Server
app.listen(port,()=>{
    logger.info(`Server is running on port ${port}`)
})