import { Router } from 'express';
import { UserAccessController } from '../controllers/userAccess.controller';
import { authorization } from '@/middlewares/authorization';

export const userAccessRouter = Router();

userAccessRouter.post('/', authorization('Buat Akses Pengguna'), UserAccessController.create);
userAccessRouter.get('/', authorization('Lihat Akses Pengguna'), UserAccessController.getAll);
userAccessRouter.get('/user/:userId', authorization('Lihat Akses Pengguna'), UserAccessController.getByUserId);
userAccessRouter.get('/:id', authorization('Lihat Detail Akses Pengguna'), UserAccessController.getOneById);
userAccessRouter.put('/:id', authorization('Ubah Akses Pengguna'), UserAccessController.update);
userAccessRouter.delete('/:id', authorization('Hapus Akses Pengguna'), UserAccessController.delete);