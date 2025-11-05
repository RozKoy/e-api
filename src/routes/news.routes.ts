import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { upload } from "@/libs/multer";

export const newsRouter = Router();

newsRouter.post('/', upload.single('image'), NewsController.create);
newsRouter.get('/', NewsController.getAll);
newsRouter.get('/:id', NewsController.getOneById);
newsRouter.put('/:id', upload.single('image'), NewsController.update);
newsRouter.delete('/:id', NewsController.delete);