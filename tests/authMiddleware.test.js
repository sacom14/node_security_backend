import { jest } from '@jest/globals';

const mockRateLimit = jest.fn();
jest.unstable_mockModule('express-rate-limit', () => ({
    default: mockRateLimit
}));

const originalEnv = process.env;

describe('Auth Middleware Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });
    
    describe('rate limiter functionality simulation', () => {
        test('should simulate rate limiter middleware behavior', async () => {
            // Set up environment variables
            process.env.WINDOW_MINUTES = '10';
            process.env.MAX_LOGIN_ATTEMPTS = '3';

            const mockMiddleware = jest.fn((req, res, next) => {
                if (req.simulateRateLimit) {
                    return res.status(429).json({
                        error: 'Too many login attempts, please try again later in 10 minutes.'
                    });
                }
                next();
            });

            mockRateLimit.mockReturnValue(mockMiddleware);

            jest.resetModules();
            
            jest.unstable_mockModule('express-rate-limit', () => ({
                default: mockRateLimit
            }));

            const { loginLimiter } = await import('../middlewares/authMiddleware.js');

            const req = { simulateRateLimit: false };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res)
            };
            const next = jest.fn();

            loginLimiter(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should simulate rate limit exceeded behavior', async () => {
            process.env.WINDOW_MINUTES = '5';
            process.env.MAX_LOGIN_ATTEMPTS = '2';

            const mockMiddleware = jest.fn((req, res, next) => {
                if (req.simulateRateLimit) {
                    return res.status(429).json({
                        error: 'Too many login attempts, please try again later in 5 minutes.'
                    });
                }
                next();
            });

            mockRateLimit.mockReturnValue(mockMiddleware);

            jest.resetModules();
            
            jest.unstable_mockModule('express-rate-limit', () => ({
                default: mockRateLimit
            }));

            const { loginLimiter } = await import('../middlewares/authMiddleware.js');

            const req = { simulateRateLimit: true };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res)
            };
            const next = jest.fn();

            loginLimiter(req, res, next);

            expect(res.status).toHaveBeenCalledWith(429);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Too many login attempts, please try again later in 5 minutes.'
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});