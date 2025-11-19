import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { authorization } from '@/middlewares/authorization';

export const permissionRouter = Router();

permissionRouter.get('/', authorization('Lihat Hak Akses'), PermissionController.getAll);