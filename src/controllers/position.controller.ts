import { PosisionLevel, PositionCategory } from '@/generated/prisma/enums';
import { CommissionService } from '@/services/commission.service';
import { PositionService } from '@/services/positions.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class PositionController {
    static async create(req: Request, res: Response) {

        const { name, category, level, commissionId } = req.body;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string" },
                category: { type: "enum", values: Object.values(PositionCategory) },
                level: { type: "enum", values: Object.values(PosisionLevel) },
                commissionId: { type: "string", optional: true }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name, category, level, commissionId });

            if (validationResponse !== true) {

                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });

            }

            if (category == PositionCategory.komisi && !commissionId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Id komisi wajib diisi'
                });
            }

            if (commissionId) {
                const commissionExist = await CommissionService.getOneById(commissionId);

                if (!commissionExist) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Komisi tidak ditemukan'
                    });
                }
            }

            const positionExist = await PositionService.getOneByName(name);

            if (positionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Posisi sudah terdaftar'
                });
            }

            const data = await PositionService.create({ name, category, level, commissionId });

            return res.status(201).json({
                status: 'success',
                message: 'Data posisi berhasil ditambahkan',
                data
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal menambahkan data posisi' });
        }
    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit, category, level, commissionId } = req.query as { search?: string, page?: number, limit?: number, category?: PositionCategory, level?: PosisionLevel, commissionId?: string };

        try {

            const data = await PositionService.getAll(search, Number(page), Number(limit), category, level, commissionId);

            res.status(200).json({
                status: 'success',
                message: 'Data posisi berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data posisi' });

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

            const data = await PositionService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data posisi berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data posisi' });

        }
    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;
        const { name, category, level, commissionId } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string" },
                category: { type: "enum", values: Object.values(PositionCategory) },
                level: { type: "enum", values: Object.values(PosisionLevel) },
                commissionId: { type: "string", optional: true }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name, category, level, commissionId });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            if (category == PositionCategory.komisi && !commissionId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Id komisi wajib diisi'
                });
            }

            if (commissionId) {
                const commissionExist = await CommissionService.getOneById(commissionId);

                if (!commissionExist) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Komisi tidak ditemukan'
                    });
                }
            }

            const positionExist = await PositionService.getOneById(id);

            if (!positionExist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Posisi tidak ditemukan'
                });
            }

            const positionNameExist = await PositionService.getOneByName(name, id);

            if (positionNameExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Posisi sudah terdaftar'
                });
            }

            const data = await PositionService.update(id, { name, category, level, commissionId });

            res.status(200).json({
                status: 'success',
                message: 'Data posisi berhasil diubah',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mengubah data posisi' });

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

            const positionExist = await PositionService.getOneById(id);

            if (!positionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Posisi tidak ditemukan'
                });
            }

            const data = await PositionService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data posisi berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal menghapus data posisi' });

        }
    }

}