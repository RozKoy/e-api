import { Router } from 'express';
import { ProposalController } from '../controllers/proposal.controller';
import { upload } from "@/libs/multer";
import { authorization } from '@/middlewares/authorization';

export const proposalRouter = Router();

proposalRouter.post('/', upload.single('file'), ProposalController.create);
proposalRouter.post('/import', authorization('Impor Proposal'), upload.single('file'), ProposalController.import);
proposalRouter.get('/export', authorization('Ekspor Proposal'), ProposalController.export);
proposalRouter.get('/', ProposalController.getAll);
proposalRouter.get('/:id', ProposalController.getOneById);
proposalRouter.put('/:id', upload.single('file'), ProposalController.update);
proposalRouter.delete('/:id', ProposalController.delete);