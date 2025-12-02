import { DashboardService } from '@/services/dashboard.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class DashboardController {

    static async getDashboardData(req: Request, res: Response) {

        const { year, areaId } = req.query as { year?: number, areaId?: string };
        
        try {

            const data = await DashboardService.getDashboardData(Number(year), areaId);

            return res.status(200).json({
                status: 'success',
                message: 'Data dashboard berhasil ditampilkan',
                data
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menampilkan data dashboard'
            });
        }
    }

}