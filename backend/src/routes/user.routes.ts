import { Router } from 'express';
import { getAllUsers, getSingleUser, updateUserRole } from '../controllers/user.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect, restrictTo('admin')); // All user routes = admin only

router.get('/',        getAllUsers);
router.get('/:id',     getSingleUser);
router.patch('/:id',   updateUserRole); // Only role change

export default router;