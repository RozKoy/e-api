import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { NewsController } from '@/controllers/news.controller';

export const publicRouter = Router();

publicRouter.get('/areas/', AreaController.getAll);
publicRouter.get('/news/', NewsController.getAll);
publicRouter.get('/news/:id', NewsController.getOneById);