import { Router } from 'express';
import { PositionController } from '../controllers/position.controller';
import { authorization } from '@/middlewares/authorization';

export const positionRouter = Router();

positionRouter.post('/', authorization('Buat Posisi'), PositionController.create);
positionRouter.get('/', authorization('Lihat Posisi'), PositionController.getAll);
positionRouter.get('/:id', authorization('Lihat Posisi'), PositionController.getOneById);
positionRouter.put('/:id', authorization('Ubah Posisi'), PositionController.update);
positionRouter.delete('/:id', authorization('Hapus Posisi'), PositionController.delete);