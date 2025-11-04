import { ProposalService } from '@/services/proposal.service';
import { ProposalVoteService } from '@/services/proposalVote.service';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { Response } from 'express';
import Validator from 'fastest-validator';

export class ProposalVoteController {

    static async vote(req: AuthenticatedRequest, res: Response) {

        const { proposalId } = req.params;

        const { userId } = req.payload!;

        if(!proposalId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id proposal wajib diisi'
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

            const proposalExist = await ProposalService.getOneById(proposalId);

            if (!proposalExist) {
                return res.status(404).json({
                    status: "error",
                    message: "Proposal tidak ditemukan"
                });
            }

            const voteExist = await ProposalVoteService.getOneByUserIdAndProposalId(userId, proposalId);

            if (voteExist) {
                
                if(voteExist.agree == agree) {
                    await ProposalVoteService.delete(voteExist.id);
                    return res.status(200).json({
                        status: 'success',
                        message: 'Proposal berhasil di unvote',
                    })
                }

                await ProposalVoteService.update(voteExist.id, { agree });

                return res.status(200).json({
                    status: 'success',
                    message: 'Proposal vote berhasil diubah',
                });
            }

            const data = await ProposalVoteService.create({ userId, proposalId, agree });

            res.status(201).json({
                status: 'success',
                message: 'Proposal berhasil di vote',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal vote proposal' });

        }
    }

}