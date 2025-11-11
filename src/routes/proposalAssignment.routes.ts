import { Router } from 'express';
import { ProposalAssingmentController } from '../controllers/proposalAssingment.controller';

export const proposalAssignmentRouter = Router();

proposalAssignmentRouter.post('/assign', ProposalAssingmentController.assign);
proposalAssignmentRouter.post('/finish/:proposalId', ProposalAssingmentController.finishAssignment);
proposalAssignmentRouter.get('/', ProposalAssingmentController.getAll);
proposalAssignmentRouter.get('/:proposalId', ProposalAssingmentController.getByProposalId);