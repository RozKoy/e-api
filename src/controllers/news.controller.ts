import { CategoryService } from '@/services/category.service';
import { NewsService } from '@/services/news.service';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import path from 'path';
import fs from 'fs';

export class NewsController {
    static async create(req: Request, res: Response) {

        const { title, content, categoryId, date } = req.body;

        const file = req.file;

        const v = new Validator();

        const schema = {
            title: { type: "string", empty: false },
            content: { type: "string", empty: false },
            categoryId: { type: "string", empty: false },
            date: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ title, content, categoryId, date });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const newsExist = await NewsService.getOneByTitle(title);

            if (newsExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Berita sudah ada'
                });
            }

            const categoryExist = await CategoryService.getOneById(categoryId);

            if (!categoryExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Kategori tidak ditemukan'
                });
            }

            const news = await NewsService.create({ title, content, categoryId, date: new Date(date) });

            const imageData: any = {};

            let finalPath: string | null = null;

            if (file) {
                const finalFolder = path.join(__dirname, "../../uploads/images/news", news.id);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, file.filename);

                fs.renameSync(file.path, finalPath);

                imageData.fileName = file.originalname;
                imageData.filePath = finalPath;
                imageData.fileUrl = `${process.env.APP_URL}/uploads/images/news/${news.id}/${file.filename}`;
            }

            const updatedNews = await NewsService.update(news.id, { imageName: imageData.fileName, imageUrl: imageData.fileUrl, imagePath: imageData.filePath });

            return res.status(201).json({
                status: 'success',
                message: 'Berita berhasil dibuat',
                data: updatedNews
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal membuat berita'
            });

        }
    }

    static async getAll(req: Request, res: Response) {

        const { search, page, limit, categoryId } = req.query as { search?: string, page?: number, limit?: number, categoryId?: string };

        try {

            const data = await NewsService.getAll(categoryId, search, Number(page), Number(limit));

            res.status(200).json({
                status: 'success',
                message: 'Data berita berhasil didapatkan',
                data: data.data,
                totalData: data.totalData,
                totalPage: data.totalPages
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data berita'
            });

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

            const data = await NewsService.getOne(id);

            res.status(200).json({
                status: 'success',
                message: 'Data berita berhasil didapatkan',
                data
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan data berita'
            });

        }
    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        const { title, content, categoryId, date } = req.body;

        const file = req.file;

        const v = new Validator();

        const schema = {
            title: { type: "string", optional: true, empty: false },
            content: { type: "string", optional: true, empty: false },
            categoryId: { type: "string", optional: true, empty: false },
            date: { type: "string", optional: true, empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ title, content, categoryId, date });

            if (validationResponse !== true) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const categoryExist = await CategoryService.getOneById(categoryId);

            if (!categoryExist) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'Kategori tidak ditemukan'
                });
            }

            const newsExist = await NewsService.getOne(id);

            if (!newsExist) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'Berita tidak ditemukan'
                });
            }

            const imageData: any = {};

            let finalPath: string | null = null;

            if (file) {

                const oldFilePath = newsExist.imagePath;

                if (oldFilePath && fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                        console.log("🗑️ File lama dihapus:", oldFilePath);
                    } catch (err) {
                        console.error("❌ Gagal menghapus file lama:", err);
                    }
                }

                const finalFolder = path.join(__dirname, "../../uploads/images/news", newsExist.id);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, file.filename);

                fs.renameSync(file.path, finalPath);

                imageData.fileName = file.originalname;
                imageData.filePath = finalPath;
                imageData.fileUrl = `${process.env.APP_URL}/uploads/images/news/${newsExist.id}/${file.filename}`;

            }

            const updatedNews = await NewsService.update(id, {
                title,
                content,
                categoryId,
                imageName: imageData.fileName,
                imageUrl: imageData.fileUrl,
                imagePath: imageData.filePath,
                date: date ? new Date(date) : undefined
            });

            return res.status(200).json({
                status: 'success',
                message: 'Berita berhasil diubah',
                data: updatedNews
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengubah berita'
            });

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

            const newsExist = await NewsService.getOne(id);

            if (!newsExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Berita tidak ditemukan'
                });
            }

            if (newsExist.imagePath && fs.existsSync(newsExist.imagePath)) {
                fs.unlinkSync(newsExist.imagePath);

                const parentFolder = path.dirname(newsExist.imagePath);
                try {
                    if (fs.existsSync(parentFolder)) {
                        fs.rmSync(parentFolder, { recursive: true, force: true });
                    }
                } catch (err) {
                    console.error("Gagal menghapus folder:", err);
                }
            }

            await NewsService.delete(id);

            return res.status(200).json({
                status: 'success',
                message: 'Berita berhasil dihapus'
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus berita'
            });

        }
    }

}