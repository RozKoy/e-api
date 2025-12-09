import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { NewsController } from '@/controllers/news.controller';
import { ProposalController } from '@/controllers/proposal.controller';
import { UserController } from '@/controllers/user.controller';
import { CategoryController } from '@/controllers/category.controller';
import { ProposalVoteController } from '@/controllers/proposalVote.controller';
import { ProposalDiscussionController } from '@/controllers/proposalDiscussion.controller';

export const publicRouter = Router();

publicRouter.get('/areas/', AreaController.getAll);
publicRouter.get('/news/', NewsController.getAll);
publicRouter.get('/categories', CategoryController.getAll);
publicRouter.get('/proposals', ProposalController.getAll);
publicRouter.get('/proposals/year', ProposalController.getProposalYears);
publicRouter.get('/proposalVotes/count/:proposalId', ProposalVoteController.count);
publicRouter.get('/proposalDiscussions/proposal/:proposalId', ProposalDiscussionController.getByProposalId);
publicRouter.get('/proposalDiscussions/:id', ProposalDiscussionController.getOneById);
publicRouter.get('/users/', UserController.getAllPublic);
publicRouter.get('/users/structural', UserController.getStructural);
publicRouter.get('/news/:id', NewsController.getOneById);
publicRouter.get('/proposals/:id', ProposalController.getOneById);