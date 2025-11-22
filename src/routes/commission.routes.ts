import { Router } from 'express';
import { CommissionController } from '../controllers/commission.controller';
import { authorization } from '@/middlewares/authorization';

export const commissionRouter = Router();

commissionRouter.post('/', authorization('Buat Komisi'), CommissionController.create);
commissionRouter.get('/', authorization('Lihat Komisi'), CommissionController.getAll);
commissionRouter.get('/:id', authorization('Lihat Komisi'), CommissionController.getOneById);
commissionRouter.put('/:id', authorization('Ubah Komisi'), CommissionController.update);
commissionRouter.delete('/:id', authorization('Hapus Komisi'), CommissionController.delete);