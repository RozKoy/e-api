import { PermissionService } from '@/services/permission.service';
import { Request, Response } from 'express';

export class PermissionController {
  static async getAll(req: Request, res: Response) {

    try {

      const data = await PermissionService.getAll();

      res.status(200).json({
        status: 'success',
        message: 'Data permission berhasil didapatkan',
        data
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        status: 'error',
        message: 'Gagal mendapatkan data permission'
      });

    }
  }

}