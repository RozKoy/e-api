import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';

export const permissionRouter = Router();

permissionRouter.get('/', PermissionController.getAll);