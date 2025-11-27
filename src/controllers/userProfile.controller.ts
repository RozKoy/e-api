import { UserService } from '@/services/user.service';
import { UserProfileService } from '@/services/userProfile.service';
import { Gender } from '@generated/prisma/client';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import fs from "fs";
import path from 'path';

export class UserProfileController {
    static async create(req: Request, res: Response) {

        const { userId } = req.params;

        const {
            name,
            age,
            gender,
            phoneNumber,
        } = req.body;

        const parsedAge = age ? Number(age) : undefined;

        const image = req.file;

        let finalPath: string | null = null;

        if (!userId) {
            if (image) fs.unlinkSync(image.path);
            return res.status(400).json({
                status: 'error',
                message: 'userId wajib diisi'
            });
        }

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", empty: false },
                age: { type: "number", optional: true, empty: false },
                gender: { type: "enum", values: Object.values(Gender), optional: true, empty: false },
                phoneNumber: { type: "string", optional: true, empty: false },
            };

            const check = v.compile(schema);

            const validationResponse = check({ name, parsedAge, gender, phoneNumber });

            if (validationResponse !== true) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const userExist = await UserService.getOneById(userId);

            if (!userExist) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'User tidak ditemukan'
                });
            }

            const userProfileExist = await UserProfileService.getOneByUserId(userId);

            if (userProfileExist) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'User profile sudah terdaftar'
                });
            }

            const newProfileData: any = {
                userId,
                name,
                age: parsedAge,
                gender,
                phoneNumber,
            };

            if (image) {
                const finalFolder = path.join(__dirname, "../../uploads/images/profiles", userId);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, image.filename);

                fs.renameSync(image.path, finalPath);

                newProfileData.imageName = image.originalname;
                newProfileData.imagePath = finalPath;
                newProfileData.imageUrl = `${process.env.APP_URL}/uploads/images/profiles/${userId}/${image.filename}`;
            }

            const data = await UserProfileService.create(newProfileData);

            res.status(201).json({
                status: 'success',
                message: 'Data user profile berhasil ditambahkan',
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
                message: 'Gagal menambahkan data user profile'
            });
        }
    }

    static async update(req: Request, res: Response) {

        const { id } = req.params;

        const {
            name,
            age,
            gender,
            phoneNumber,
        } = req.body;

        const image = req.file;

        let finalPath: string | null = null;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id wajib diisi'
            });
        }

        const parsedAge = age ? Number(age) : undefined;

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string", optional: true, empty: false },
                age: { type: "number", optional: true, empty: false },
                gender: { type: "enum", values: Object.values(Gender), optional: true, empty: false },
                phoneNumber: { type: "string", optional: true, empty: false },
            };

            const check = v.compile(schema);

            const validationResponse = check({ name, parsedAge, gender, phoneNumber });

            if (validationResponse !== true) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const userProfileExist = await UserProfileService.getOneById(id);

            if (!userProfileExist) {
                if (image) fs.unlinkSync(image.path);
                return res.status(400).json({
                    status: 'error',
                    message: 'User profile tidak ditemukan'
                });
            }

            const newProfileData: any = {
                id,
                name,
                age: parsedAge,
                gender,
                phoneNumber,
            };

            if (image) {

                const oldImagePath = userProfileExist.imagePath;

                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("🗑️ File lama dihapus:", oldImagePath);
                    } catch (err) {
                        console.error("❌ Gagal menghapus file lama:", err);
                    }
                }

                const finalFolder = path.join(__dirname, "../../uploads/images/profiles", userProfileExist.userId);
                if (!fs.existsSync(finalFolder)) fs.mkdirSync(finalFolder, { recursive: true });

                finalPath = path.join(finalFolder, image.filename);

                fs.renameSync(image.path, finalPath);

                newProfileData.imageName = image.originalname;
                newProfileData.imagePath = finalPath;
                newProfileData.imageUrl = `${process.env.APP_URL}/uploads/images/profiles/${userProfileExist.userId}/${image.filename}`;
            }

            const data = await UserProfileService.update(id, newProfileData);

            res.status(200).json({
                status: 'success',
                message: 'Data user profile berhasil diubah',
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
                message: 'Gagal mengubah data user profile'
             });
        }
    }
}