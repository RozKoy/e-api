import { Router } from 'express';
import { UserAccessController } from '../controllers/userAccess.controller';

export const userAccessRouter = Router();

userAccessRouter.post('/', UserAccessController.create);
userAccessRouter.get('/', UserAccessController.getAll);
userAccessRouter.get('/user/:userId', UserAccessController.getByUserId);
userAccessRouter.get('/:id', UserAccessController.getOneById);
userAccessRouter.put('/:id', UserAccessController.update);
userAccessRouter.delete('/:id', UserAccessController.delete);