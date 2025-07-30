// api/middleware/validate.js
const { ZodError } = require('zod');

/**
 * Validate req.body against a Zod schema.
 */
function body(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  };
}

// Export the body middleware as the default function...
module.exports = body;
// ...and also expose it as .body for v.body(...) usage
module.exports.body = body;
