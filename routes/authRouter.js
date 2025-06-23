import express from 'express';
import {
    login,
    register,
    deleteCoordinator
} from '../controllers//authController.js';
import { loginLimiter } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',loginLimiter, login);
router.delete('/:id', deleteCoordinator);



export default router;