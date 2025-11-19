import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { NewsController } from '@/controllers/news.controller';
import { ProposalController } from '@/controllers/proposal.controller';

export const publicRouter = Router();

publicRouter.get('/areas/', AreaController.getAll);
publicRouter.get('/news/', NewsController.getAll);
publicRouter.get('/proposals', ProposalController.getAll);
publicRouter.get('/news/:id', NewsController.getOneById);
publicRouter.get('/proposals/:id', ProposalController.getOneById);