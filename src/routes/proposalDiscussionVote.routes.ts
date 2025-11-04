import { Router } from 'express';
import { ProposalDiscussionVoteController } from '../controllers/proposalDiscussionVote.controller';

export const proposalDiscussionVoteRouter = Router();

proposalDiscussionVoteRouter.post('/vote/:proposalDiscussionId', ProposalDiscussionVoteController.vote);
proposalDiscussionVoteRouter.get('/count/:proposalDiscussionId', ProposalDiscussionVoteController.count);