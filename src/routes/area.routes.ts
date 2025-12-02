import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { authorization } from '@/middlewares/authorization';

export const areaRouter = Router();

// areaRouter.post('/', authorization('Buat Area'), AreaController.create);
areaRouter.get('/', authorization('Lihat Area'), AreaController.getAll);
areaRouter.get('/:id', authorization('Lihat Area'), AreaController.getOneById);
// areaRouter.put('/:id', authorization('Ubah Area'), AreaController.update);
// areaRouter.delete('/:id', authorization('Hapus Area'), AreaController.delete);