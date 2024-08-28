import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 60, // Duration in seconds
});

export default rateLimiter;
