import { Router } from 'express';
import { ProposalController } from '../controllers/proposal.controller';
import { upload } from "@/libs/multer";

export const proposalRouter = Router();

proposalRouter.post('/', upload.single('file'), ProposalController.create);
proposalRouter.get('/', ProposalController.getAll);
proposalRouter.get('/:id', ProposalController.getOneById);
proposalRouter.put('/:id', upload.single('file'), ProposalController.update);
proposalRouter.delete('/:id', ProposalController.delete);