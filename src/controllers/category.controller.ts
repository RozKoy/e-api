import { CategoryService } from '@/services/category.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';

export class CategoryController {

    static async create(req: Request, res: Response) {

        const { name } = req.body;

        const v = new Validator();

        const schema = {
            name: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const categoryExist = await CategoryService.getOneByName(name);

            if (categoryExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Kategori sudah ada'
                });
            }

            const category = await CategoryService.create({ name });

            return res.status(201).json({
                status: 'success',
                message: 'Kategori berhasil dibuat',
                data: category
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal membuat kategori'
            });

        }

    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await CategoryService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data kategori berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data kategori'
            });

        }
    }

    static async getOneById(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const data = await CategoryService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data kategori berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data kategori'
            });

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

        const v = new Validator();

        const schema = {
            name: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const categoryExist = await CategoryService.getOneById(id);

            if (!categoryExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Kategori tidak ditemukan'
                });
            }

            const nameExist = await CategoryService.getOneByName(name, id);

            if (nameExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Kategori sudah ada'
                });
            }

            const category = await CategoryService.update(id, { name });

            return res.status(200).json({
                status: 'success',
                message: 'Data kategori berhasil diubah',
                data: category
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengubah data kategori'
            });

        }
    }

    static async delete(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const categoryExist = await CategoryService.getOneById(id);

            if (!categoryExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Kategori tidak ditemukan'
                });
            }

            const data = await CategoryService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data kategori berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus data kategori'
            });

        }
    }
}