import { Router } from 'express';
import { userRouter } from './user.routes';
import { permissionRouter } from './permission.routes';
import { roleRouter } from './role.routes';

export const router = Router();
router.use('/users', userRouter);
router.use('/permissions', permissionRouter);
router.use('/roles', roleRouter);
