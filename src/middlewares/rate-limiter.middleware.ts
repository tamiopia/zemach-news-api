import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { Success: false, Message: 'Too many requests.', Object: null, Errors: ['Rate limit exceeded.'] }
});

export const readLogLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1, // Limit each IP to 1 request per window for the same article
  keyGenerator: (req, res) => {
    return `${ipKeyGenerator(req, res)}_${req.params.id}`;
  },
  message: { Success: false, Message: 'Too many reads in a short time.', Object: null, Errors: ['Rate limit exceeded.'] }
});
