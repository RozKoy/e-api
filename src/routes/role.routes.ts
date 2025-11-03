import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

export const roleRouter = Router();

roleRouter.post('/', RoleController.create);
roleRouter.get('/', RoleController.getAll);
roleRouter.get('/:id', RoleController.getOneById);
roleRouter.put('/:id', RoleController.update);
roleRouter.delete('/:id', RoleController.delete);