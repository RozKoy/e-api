import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.post('/', UserController.create);
userRouter.post('/register', UserController.register);
userRouter.get('/', UserController.getAll);
userRouter.get('/:id', UserController.getOneById);
userRouter.put('/:id', UserController.update);
userRouter.delete('/:id', UserController.delete);