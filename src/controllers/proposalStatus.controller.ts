import { ProposalStatusService } from '@/services/proposalStatus.service';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { Response } from 'express';

export class ProposalStatusController {
    static async getByProposalId(req: AuthenticatedRequest, res: Response) {

        const { proposalId } = req.params;
        
        if (!proposalId) {
            
            return res.status(400).json({
                status: 'error',
                message: 'Id proposal wajib diisi'
            });
        
        }

        try {

            const data = await ProposalStatusService.getByProposalId(proposalId);
            res.status(200).json({
                status: 'success',
                message: 'Data status proposal berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data status proposal' });
        
        }
        
    }
}