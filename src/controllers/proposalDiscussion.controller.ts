import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { ProposalDiscussionService } from '@/services/proposalDiscussion.service';
import { Response } from 'express';
import Validator from 'fastest-validator';
import { ProposalService } from '@/services/proposal.service';
import { empty } from '@prisma/client/runtime/client';

export class ProposalDiscussionController {
    static async create(req: AuthenticatedRequest, res: Response) {

        const { proposalId } = req.params;

        const { message } = req.body;

        const { userId } = req.payload!;

        if (!proposalId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id proposal wajib diisi'
            });
        }

        const v = new Validator();

        const schema = {
            message: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ message });

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

            const discussionExist = await ProposalDiscussionService.getByProposalIdAndUserId(proposalId, userId); 

            if (discussionExist.length >= 5) {
                return res.status(400).json({
                    status: "error",
                    message: "Anda telah mencapai batas maksimum diskusi untuk proposal ini"
                });
            }

            const data = await ProposalDiscussionService.create({ proposalId, userId, message });

            res.status(201).json({
                status: 'success',
                message: 'Data diskusi proposal berhasil ditambahkan',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menambahkan data diskusi proposal'
            });
        }
    }

    static async getOneById(req: AuthenticatedRequest, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const data = await ProposalDiscussionService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data diskusi proposal berhasil didapatkan',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data diskusi proposal'
            });
        }
    }

    static async getByProposalId(req: AuthenticatedRequest, res: Response) {

        const { proposalId } = req.params;

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        if (!proposalId) {
            return res.status(400).json({
                status: 'error',
                message: 'Id proposal wajib diisi'
            });
        }

        try {

            const data = await ProposalDiscussionService.getByProposalId(proposalId, search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data diskusi proposal berhasil didapatkan',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data diskusi proposal'
            });
        }
    }

    static async update(req: AuthenticatedRequest, res: Response) {

        const { id } = req.params;

        const { message } = req.body;

        const { userId } = req.payload!;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const v = new Validator();

            const schema = {
                message: { type: "string", optional: true, empty: false }
            };

            const check = v.compile(schema);

            const validationResponse = check({ message });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const proposalDiscussionExist = await ProposalDiscussionService.getOneById(id);

            if (!proposalDiscussionExist) {
                return res.status(404).json({
                    status: "error",
                    message: "Diskusi proposal tidak ditemukan"
                });
            }

            if (proposalDiscussionExist.userId !== userId) {
                return res.status(403).json({
                    status: "error",
                    message: "Anda tidak memiliki akses untuk mengubah data diskusi proposal ini"
                });
            }

            const data = await ProposalDiscussionService.update(id, { message });

            res.status(200).json({
                status: 'success',
                message: 'Data diskusi proposal berhasil diubah',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengubah data diskusi proposal'
            });
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response) {

        const { id } = req.params;

        const { userId } = req.payload!;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const proposalDiscussionExist = await ProposalDiscussionService.getOneById(id);

            if (!proposalDiscussionExist) {
                return res.status(404).json({
                    status: "error",
                    message: "Diskusi proposal tidak ditemukan"
                });
            }

            if (proposalDiscussionExist.userId !== userId) {
                return res.status(403).json({
                    status: "error",
                    message: "Anda tidak memiliki akses untuk menghapus data diskusi proposal ini"
                });
            }

            const data = await ProposalDiscussionService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data diskusi proposal berhasil dihapus',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus data diskusi proposal'
            });
        }
    }
}