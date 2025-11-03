import { Router } from 'express';
import { userRouter } from './user.routes';
import { permissionRouter } from './permission.routes';
import { roleRouter } from './role.routes';
import { rolePermissionRouter } from './rolePermission.routes';
import { userProfileRoutes } from './userProfile.routes';
import { areaRouter } from './area.routes';

export const router = Router();
router.use('/users', userRouter);
router.use('/permissions', permissionRouter);
router.use('/roles', roleRouter);
router.use('/rolePermissions', rolePermissionRouter);
router.use('/userProfiles', userProfileRoutes);
router.use('/areas', areaRouter);
