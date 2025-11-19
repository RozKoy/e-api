import { Router } from 'express';
import { ProposalAssingmentController } from '../controllers/proposalAssingment.controller';
import { authorization } from '@/middlewares/authorization';

export const proposalAssignmentRouter = Router();

proposalAssignmentRouter.post('/assign', authorization('Disposisi Proposal'), ProposalAssingmentController.assign);
proposalAssignmentRouter.post('/finish/:proposalId', authorization('Disposisi Proposal'), ProposalAssingmentController.finishAssignment);
proposalAssignmentRouter.get('/', authorization('Lihat Disposisi Proposal'), ProposalAssingmentController.getAll);
proposalAssignmentRouter.get('/:proposalId', authorization('Lihat Disposisi Proposal'), ProposalAssingmentController.getByProposalId);