import { Router } from 'express';
import { ProposalController } from '../controllers/proposal.controller';
import { upload } from "@/libs/multer";
import { authorization } from '@/middlewares/authorization';

export const proposalRouter = Router();

proposalRouter.post('/', authorization('Buat Proposal'), upload.single('file'), ProposalController.create);
proposalRouter.post('/import', authorization('Impor Proposal'), upload.single('file'), ProposalController.import);
proposalRouter.get('/export', authorization('Ekspor Proposal'), ProposalController.export);
proposalRouter.get('/', authorization('Lihat Proposal'), ProposalController.getAll);
proposalRouter.get('/:id', authorization('Lihat Detail Proposal'), ProposalController.getOneById);
proposalRouter.put('/:id', authorization('Ubah Proposal'), upload.single('file'), ProposalController.update);
proposalRouter.delete('/:id', authorization('Hapus Proposal'), ProposalController.delete);