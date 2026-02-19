import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { loginValidation, validate } from '../middleware/validation';

const router = Router();

router.post('/login', loginValidation, validate, AuthController.login);
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/logout', authenticate, AuthController.logout);

export default router;
