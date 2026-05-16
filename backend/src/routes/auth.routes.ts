import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login',    loginValidator,    login);
router.post('/refresh',                     refresh);
router.post('/logout',   protect,           logout);
router.get('/me',        protect,           getMe);

export default router;