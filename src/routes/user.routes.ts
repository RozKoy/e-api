import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authorization } from '@/middlewares/authorization';

export const userRouter = Router();

userRouter.post('/', authorization('Buat Pengguna'), UserController.create);
userRouter.get('/', authorization('Lihat Pengguna'), UserController.getAll);
userRouter.get('/profile', UserController.profile);
userRouter.get('/:id', authorization('Lihat Pengguna'), UserController.getOneById);
userRouter.put('/:id', authorization('Ubah Pengguna'), UserController.update);
userRouter.delete('/:id', authorization('Hapus Pengguna'), UserController.delete);