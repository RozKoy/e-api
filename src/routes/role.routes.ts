import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { authorization } from '@/middlewares/authorization';

export const roleRouter = Router();

roleRouter.post('/', authorization('Buat Peran'), RoleController.create);
roleRouter.get('/', authorization('Lihat Peran'), RoleController.getAll);
roleRouter.get('/:id', authorization('Lihat Peran'), RoleController.getOneById);
roleRouter.put('/:id', authorization('Ubah Peran'), RoleController.update);
roleRouter.delete('/:id', authorization('Hapus Peran'), RoleController.delete);