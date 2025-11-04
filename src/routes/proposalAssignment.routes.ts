import { Router } from 'express';
import { ProposalAssingmentController } from '../controllers/proposalAssingment.controller';

export const proposalAssignmentRouter = Router();

proposalAssignmentRouter.post('/assign', ProposalAssingmentController.assign);