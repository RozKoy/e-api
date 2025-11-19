import { Router } from 'express';
import { ProposalStatusController } from '@/controllers/proposalStatus.controller';
import { authorization } from '@/middlewares/authorization';

export const proposalStatusRouter = Router();

proposalStatusRouter.get('/:proposalId', authorization('Lihat Proposal'), ProposalStatusController.getByProposalId);