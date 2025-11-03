import { Router } from 'express';
import { FractionController } from '../controllers/fraction.controller';
import { upload } from "@/libs/multer";

export const fractionRouter = Router();

fractionRouter.post('/', upload.single('image'), FractionController.create);
fractionRouter.get('/', FractionController.getAll);
fractionRouter.get('/:id', FractionController.getOneById);
fractionRouter.put('/:id', upload.single('image'), FractionController.update);
fractionRouter.delete('/:id', FractionController.delete);