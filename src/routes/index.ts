import { Router } from 'express';
import { userRouter } from './user.routes';
import { permissionRouter } from './permission.routes';
import { roleRouter } from './role.routes';
import { rolePermissionRouter } from './rolePermission.routes';
import { userProfileRoutes } from './userProfile.routes';
import { areaRouter } from './area.routes';
import { fractionRouter } from './fraction.routes';
import { userAccessRouter } from './userAccess.routes';

export const router = Router();
router.use('/users', userRouter);
router.use('/permissions', permissionRouter);
router.use('/roles', roleRouter);
router.use('/rolePermissions', rolePermissionRouter);
router.use('/userProfiles', userProfileRoutes);
router.use('/areas', areaRouter);
router.use('/fractions', fractionRouter);
router.use('/userAccesses', userAccessRouter);
