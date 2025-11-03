import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

export const categoryRouter = Router();

categoryRouter.post('/', CategoryController.create);
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOneById);
categoryRouter.put('/:id', CategoryController.update);
categoryRouter.delete('/:id', CategoryController.delete);