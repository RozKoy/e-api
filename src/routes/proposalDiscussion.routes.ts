import { Router } from 'express';
import { ProposalDiscussionController } from '../controllers/proposalDiscussion.controller';

export const proposalDiscussionRouter = Router();

proposalDiscussionRouter.post('/:proposalId', ProposalDiscussionController.create);
proposalDiscussionRouter.get('/proposal/:proposalId', ProposalDiscussionController.getByProposalId);
proposalDiscussionRouter.get('/:id', ProposalDiscussionController.getOneById);
proposalDiscussionRouter.put('/:id', ProposalDiscussionController.update);
proposalDiscussionRouter.delete('/:id', ProposalDiscussionController.delete);