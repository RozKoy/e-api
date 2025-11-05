import { NotificationService } from '@/services/notification.service';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { Response } from 'express';

export class NotificationController {
    static async getByUserId(req: AuthenticatedRequest, res: Response) {

        const { userId } = req.payload!;
        
        if (!userId) {
            
            return res.status(400).json({
                status: 'error',
                message: 'userId wajib diisi'
            });
        
        }

        try {

            const data = await NotificationService.getByUserId(userId);
            res.status(200).json({
                status: 'success',
                message: 'Data notifikasi berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data notifikasi' });
        
        }
        
    }
}