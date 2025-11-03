import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';

export const areaRouter = Router();

areaRouter.post('/', AreaController.create);
areaRouter.get('/', AreaController.getAll);
areaRouter.get('/:id', AreaController.getOneById);
areaRouter.put('/:id', AreaController.update);
areaRouter.delete('/:id', AreaController.delete);