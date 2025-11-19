import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { upload } from "@/libs/multer";
import { authorization } from '@/middlewares/authorization';

export const newsRouter = Router();

newsRouter.post('/', authorization('Buat Berita'), upload.single('image'), NewsController.create);
newsRouter.put('/:id', authorization('Ubah Berita'), upload.single('image'), NewsController.update);
newsRouter.delete('/:id', authorization('Hapus Berita'), NewsController.delete);