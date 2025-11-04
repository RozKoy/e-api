import { Router } from 'express';
import { ProposalVoteController } from '../controllers/proposalVote.controller';

export const proposalVoteRouter = Router();

proposalVoteRouter.post('/vote/:proposalId', ProposalVoteController.vote);
proposalVoteRouter.get('/count/:proposalId', ProposalVoteController.count);