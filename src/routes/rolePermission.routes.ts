import { Router } from 'express';
import { RolePermissionController } from '../controllers/rolePermission.controller';
import { authorization } from '@/middlewares/authorization';

export const rolePermissionRouter = Router();

rolePermissionRouter.post('/assign-many/:roleId', authorization('Tambah Hak Akses Peran'), RolePermissionController.assignMany);
rolePermissionRouter.post('/assign/:roleId', authorization('Tambah Hak Akses Peran'), RolePermissionController.assign);
rolePermissionRouter.get('/', authorization('Lihat Hak Akses Peran'), RolePermissionController.getAll);
rolePermissionRouter.delete('/:id', authorization('Hapus Hak Akses Peran'), RolePermissionController.delete);