import { Router } from 'express';
import { ProposalStatusController } from '@/controllers/proposalStatus.controller';

export const proposalStatusRouter = Router();

proposalStatusRouter.get('/:proposalId', ProposalStatusController.getByProposalId);