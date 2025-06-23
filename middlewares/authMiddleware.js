import rateLimit from "express-rate-limit";

const WINDOW_MINUTES = process.env.WINDOW_MINUTES;
const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS;

export const loginLimiter = rateLimit({
    windowMs: WINDOW_MINUTES * 60 * 1000,
    max: MAX_LOGIN_ATTEMPTS,
    message: {
        error: `Too many login attempts, please try again later in ${WINDOW_MINUTES} minutes.`
    },
});