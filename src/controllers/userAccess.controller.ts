import { AreaService } from '@/services/area.service';
import { FractionService } from '@/services/fraction.service';
import { UserService } from '@/services/user.service';
import { UserAccessService } from '@/services/userAccess.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class UserAccessController {
    static async create(req: Request, res: Response) {

        const { userId, areaId, fractionId, publicUser } = req.body;

        const v = new Validator();

        const schema = {
            userId: { type: "string" },
            areaId: { type: "string" },
            fractionId: { type: "string" },
            publicUser: { type: "boolean" }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ userId, areaId, fractionId, publicUser });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const userExist = await UserService.getOneById(userId);

            if (!userExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User tidak ditemukan'
                });
            }

            const areaExist = await AreaService.getOneById(areaId);

            if (!areaExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Area tidak ditemukan'
                });
            }

            const fractionExist = await FractionService.getOneById(fractionId);

            if (!fractionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Fraction tidak ditemukan'
                });
            }

            const userAccessExist = await UserAccessService.getOneByUserIdAndAreaIdAndFractionId(userId, areaId, fractionId);

            if (userAccessExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User akses sudah ada'
                });
            }

            const userAccesses = await UserAccessService.create({ userId, areaId, fractionId, public: publicUser });

            return res.status(201).json({
                status: 'success',
                message: 'Data user akses berhasil ditambahkan',
                data: userAccesses
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Gagal menambah data user akses' });
        }

    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await UserAccessService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data user akses berhasil didapatkan',
                data : data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Gagal mendapatkan data user akses' });
        }
    }

    static async getByUserId(req: Request, res: Response) {

        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'userId wajib diisi'
            });
        }

        try {

            const data = await UserAccessService.getByUserId(userId);

            res.status(200).json({
                status: 'success',
                message: 'Data user akses berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Gagal mendapatkan data user akses' });
        }
    }

    static async getOneById(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'id wajib diisi'
            });
        }

        try {

            const data = await UserAccessService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data user akses berhasil didapatkan',
                data
            });

        }catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Gagal mendapatkan data user akses' });

        }

    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'id wajib diisi'
            });
        }

        const { userId, areaId, fractionId, publicUser } = req.body;

        const v = new Validator();

        const schema = {
            userId: { type: "string" },
            areaId: { type: "string" },
            fractionId: { type: "string" },
            publicUser: { type: "boolean" }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ userId, areaId, fractionId, publicUser });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const userAccessExist = await UserAccessService.getOneById(id);

            if (!userAccessExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User akses tidak ditemukan'
                });
            }

            const userExist = await UserService.getOneById(userId);

            if (!userExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User tidak ditemukan'
                });
            }

            const areaExist = await AreaService.getOneById(areaId);

            if (!areaExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Area tidak ditemukan'
                });
            }

            const fractionExist = await FractionService.getOneById(fractionId);

            if (!fractionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Fraction tidak ditemukan'
                });
            }

            const duplicateUserAccess = await UserAccessService.getOneByUserIdAndAreaIdAndFractionId(userId, areaId, fractionId, id);

            if (duplicateUserAccess) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User akses sudah ada'
                });
            }

            const userAccesses = await UserAccessService.update(id, { userId, areaId, fractionId, public: publicUser });

            return res.status(200).json({
                status: 'success',
                message: 'Data user akses berhasil diupdate',
                data: userAccesses
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Gagal update data user akses' });
        }
    }

    static async delete(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'id wajib diisi'
            });
        }

        try {

            const userAccessExist = await UserAccessService.getOneById(id);

            if (!userAccessExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User akses tidak ditemukan'
                });
            }

            const data = await UserAccessService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data user akses berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Gagal hapus data user akses' });
        }
    }
}