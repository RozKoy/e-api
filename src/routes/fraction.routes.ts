import { Router } from 'express';
import { FractionController } from '../controllers/fraction.controller';
import { upload } from "@/libs/multer";
import { authorization } from '@/middlewares/authorization';

export const fractionRouter = Router();

fractionRouter.post('/', authorization('Buat Fraksi'), upload.single('image'), FractionController.create);
fractionRouter.get('/', authorization('Lihat Fraksi'), FractionController.getAll);
fractionRouter.get('/:id', authorization('Lihat Fraksi'), FractionController.getOneById);
fractionRouter.put('/:id', authorization('Ubah Fraksi'), upload.single('image'), FractionController.update);
fractionRouter.delete('/:id', authorization('Hapus Fraksi'), FractionController.delete);