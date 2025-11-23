import { CommissionService } from '@/services/commission.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class CommissionController {

    static async create(req: Request, res: Response) {

        const { name } = req.body;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {

                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });

            }

            const commissionExist = await CommissionService.getOneByName(name);

            if (commissionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Komisi sudah ada'
                });
            }

            const data = await CommissionService.create({ name });

            return res.status(201).json({
                status: 'success',
                message: 'Data komisi berhasil ditambahkan',
                data
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal menambahkan data komisi' });
        }
    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await CommissionService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data komisi berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data komisi' });

        }
    }

    static async getOneById(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const data = await CommissionService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data komisi berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data komisi' });

        }
    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;
        const { name } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const commissionExist = await CommissionService.getOneById(id);

            if (!commissionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Komisi tidak ditemukan'
                });
            }

            const commissionNameExist = await CommissionService.getOneByName(name, id);

            if (commissionNameExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Komisi sudah terdaftar'
                });
            }

            const data = await CommissionService.update(id, { name });

            res.status(200).json({
                status: 'success',
                message: 'Data komisi berhasil diubah',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mengubah data komisi' });

        }
    }

    static async delete(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const commissionExist = await CommissionService.getOneById(id);

            if (!commissionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Komisi tidak ditemukan'
                });
            }

            const data = await CommissionService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data komisi berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal menghapus data komisi' });

        }
    }

}