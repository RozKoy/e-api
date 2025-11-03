import { Router } from 'express';
import { RolePermissionController } from '../controllers/rolePermission.controller';

export const rolePermissionRouter = Router();

rolePermissionRouter.post('/assign-many/:roleId', RolePermissionController.assignMany);
rolePermissionRouter.post('/assign/:roleId', RolePermissionController.assign);
rolePermissionRouter.get('/', RolePermissionController.getAll);
rolePermissionRouter.delete('/:id', RolePermissionController.delete);