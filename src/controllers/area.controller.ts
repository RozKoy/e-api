import { AreaService } from '@/services/area.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class AreaController {
    static async create(req: Request, res: Response) {

        const { name } = req.body;

        try {
            
            const v = new Validator();
            
            const schema = {
                name: { type: "string" }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {

                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            
            }

            const areaExist = await AreaService.getOneByName(name);

            if (areaExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Area sudah terdaftar'
                });
            }

            const data = await AreaService.create({ name });
            
            return res.status(201).json({
                status: 'success',
                message: 'Data area berhasil ditambahkan',
                data
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal menambahkan data area' });
        }
    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await AreaService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data area berhasil didapatkan',
                data : data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data area' });

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

            const data = await AreaService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data area berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mendapatkan data area' });

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
                name: { type: "string", optional: true }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const areaExist = await AreaService.getOneById(id);

            if (!areaExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Area tidak ditemukan'
                });
            }

            const areaNameExist = await AreaService.getOneByName(name);

            if (areaNameExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Area sudah terdaftar'
                });
            }

            const data = await AreaService.update(id, { name });

            res.status(200).json({
                status: 'success',
                message: 'Data area berhasil diubah',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal mengubah data area' });

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

            const areaExist = await AreaService.getOneById(id);

            if (!areaExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Area tidak ditemukan'
                });
            }

            const data = await AreaService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data area berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({ error: 'Gagal menghapus data area' });

        }
    }

}