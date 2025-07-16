const { ZodError } = require('zod');

const validateWithZod = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    next(err);
  }
};

module.exports = validateWithZod; 