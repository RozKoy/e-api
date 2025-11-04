import { ProposalDiscussionService } from '@/services/proposalDiscussion.service';
import { ProposalDiscussionVoteService } from '@/services/proposalDiscussionVote.service';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { Response } from 'express';
import Validator from 'fastest-validator';

export class ProposalDiscussionVoteController {

    static async vote(req: AuthenticatedRequest, res: Response) {

        const { proposalDiscussionId } = req.params;

        const { userId } = req.payload!;

        if(!proposalDiscussionId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id diskusi proposal wajib diisi'
            });
        }

        const { agree } = req.body;

        const v = new Validator();

        const schema = {
            agree: { type: "boolean" }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ agree });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const proposalDiscussionExist = await ProposalDiscussionService.getOneById(proposalDiscussionId);

            if (!proposalDiscussionExist) {
                return res.status(404).json({
                    status: "error",
                    message: "Diskusi proposal tidak ditemukan"
                });
            }

            const voteExist = await ProposalDiscussionVoteService.getOneByUserIdAndProposalDiscussionId(userId, proposalDiscussionId);

            if (voteExist) {
                
                if(voteExist.agree == agree) {
                    await ProposalDiscussionVoteService.delete(voteExist.id);
                    return res.status(200).json({
                        status: 'success',
                        message: 'Diskusi proposal berhasil di unvote',
                    })
                }

                const data = await ProposalDiscussionVoteService.update(voteExist.id, { agree });

                return res.status(200).json({
                    status: 'success',
                    message: 'Vote diskusi proposal berhasil diubah',
                    data
                });
            }

            const data = await ProposalDiscussionVoteService.create({ userId, proposalDiscussionId, agree });

            res.status(201).json({
                status: 'success',
                message: 'Diskusi proposal berhasil di vote',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal vote diskusi proposal' });

        }
    }

    static async count(req: AuthenticatedRequest, res: Response) {
        const { proposalDiscussionId } = req.params;

        if(!proposalDiscussionId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id diskusi proposal wajib diisi'
            });
        }

        try {

            const proposalDiscussionExist = await ProposalDiscussionService.getOneById(proposalDiscussionId);

            if (!proposalDiscussionExist) {
                return res.status(404).json({
                    status: "error",
                    message: "Diskusi proposal tidak ditemukan"
                });
            }

            const data = await ProposalDiscussionVoteService.count(proposalDiscussionId);

            res.status(200).json({
                status: 'success',
                message: 'Data vote diskusi proposal berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data vote diskusi proposal' });

        }
    }

}