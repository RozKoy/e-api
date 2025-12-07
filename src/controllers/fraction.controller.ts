import fs from 'fs';
import { FractionService } from '@/services/fraction.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import path from 'path';

export class FractionController {
    static async create(req: Request, res: Response) {

        const { name } = req.body;

        const image = req.file;

        let finalPath: string | null = null;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const newFractionData: any = {
                name,
            };

            const fractionExist = await FractionService.getOneByName(name);

            if (fractionExist) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'Fraction sudah terdaftar'
                });
            }

            const fraction = await FractionService.create({ name });

            if (image) {
                const finalFolder = path.join(__dirname, "../../uploads/images/fractions", fraction.id);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, image.filename);

                fs.renameSync(image.path, finalPath);

                newFractionData.imageName = image.originalname;
                newFractionData.imagePath = finalPath;
                newFractionData.imageUrl = `${process.env.APP_URL}/uploads/images/fractions/${fraction.id}/${image.filename}`;
            }

            const data = await FractionService.update(fraction.id, newFractionData);

            res.status(201).json({
                status: 'success',
                message: 'Data fraction berhasil ditambahkan',
                data
            });

        } catch (error) {

            if (finalPath && fs.existsSync(finalPath)) {
                fs.unlinkSync(finalPath);
            }

            if (image && (!finalPath || !fs.existsSync(finalPath))) {
                fs.unlinkSync(image.path);
            }

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal menambahkan data fraction'
            });

        }

    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit } = req.query as { search?: string, page?: number, limit?: number };

        try {

            const data = await FractionService.getAll(search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data fraction berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data fraction'
            });

        }

    }

    static async getOneById(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const data = await FractionService.getOneById(id);

            res.status(200).json({
                status: 'success',
                message: 'Data fraction berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data fraction'
            });

        }

    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;
        const { name } = req.body;
        const image = req.file;

        let finalPath: string | null = null;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false }
            };

            const check = v.compile(schema);

            const validationResponse = check({ name });

            if (validationResponse !== true) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const fractionExist = await FractionService.getOneById(id);

            if (!fractionExist) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'Fraction tidak ditemukan'
                });
            }

            const fractionNameExist = await FractionService.getOneByName(name, id);

            if (fractionNameExist) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'Fraction sudah terdaftar'
                });
            }

            const newFractionData: any = {
                name,
                imageName: fractionExist.imageName,
                imagePath: fractionExist.imagePath,
                imageUrl: fractionExist.imageUrl
            };

            if (image) {

                const oldImagePath = fractionExist.imagePath;

                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("🗑️ File lama dihapus:", oldImagePath);
                    } catch (err) {
                        console.error("❌ Gagal menghapus file lama:", err);
                    }
                }

                const finalFolder = path.join(__dirname, "../../uploads/images/fractions", fractionExist.id);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, image.filename);

                fs.renameSync(image.path, finalPath);

                newFractionData.imageName = image.originalname;
                newFractionData.imagePath = finalPath;
                newFractionData.imageUrl = `${process.env.APP_URL}/uploads/images/fractions/${fractionExist.id}/${image.filename}`;
            }

            const data = await FractionService.update(id, newFractionData);

            res.status(200).json({
                status: 'success',
                message: 'Data fraction berhasil diubah',
                data
            });

        } catch (error) {

            if (finalPath && fs.existsSync(finalPath)) {
                fs.unlinkSync(finalPath);
            }

            if (image && (!finalPath || !fs.existsSync(finalPath))) {
                fs.unlinkSync(image.path);
            }

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengubah data fraction'
            });

        }

    }

    static async delete(req: Request, res: Response) {

        const { id } = req.params;

        try {

            const fractionExist = await FractionService.getOneById(id);

            if (!fractionExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Fraction tidak ditemukan'
                });
            }

            if (fractionExist.imagePath && fs.existsSync(fractionExist.imagePath)) {
                fs.unlinkSync(fractionExist.imagePath);

                const parentFolder = path.dirname(fractionExist.imagePath);
                try {
                    if (fs.existsSync(parentFolder)) {
                        fs.rmSync(parentFolder, { recursive: true, force: true });
                    }
                } catch (err) {
                    console.error("Gagal menghapus folder:", err);
                }
            }

            const data = await FractionService.delete(id);

            res.status(200).json({
                status: 'success',
                message: 'Data fraction berhasil dihapus',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus data fraction'
            });

        }

    }
}