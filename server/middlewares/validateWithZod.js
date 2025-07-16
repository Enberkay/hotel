const { ZodError } = require('zod');

const validateWithZod = (schema, source = 'body') => (req, res, next) => {
  try {
    let data;
    if (source === 'body') data = req.body;
    else if (source === 'query') data = req.query;
    else if (source === 'params') data = req.params;
    else data = req.body;
    req.validated = schema.parse(data);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    next(err);
  }
};

module.exports = validateWithZod; 