import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', protect, getMe);

export default router;