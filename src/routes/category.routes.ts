import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authorization } from '@/middlewares/authorization';

export const categoryRouter = Router();

categoryRouter.post('/', authorization('Buat Kategori'), CategoryController.create);
categoryRouter.get('/', authorization('Lihat Kategori'), CategoryController.getAll);
categoryRouter.get('/:id', authorization('Lihat Detail Kategori'), CategoryController.getOneById);
categoryRouter.put('/:id', authorization('Ubah Kategori'), CategoryController.update);
categoryRouter.delete('/:id', authorization('Hapus Kategori'), CategoryController.delete);