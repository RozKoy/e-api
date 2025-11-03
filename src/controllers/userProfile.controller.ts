import { UserService } from '@/services/user.service';
import { UserProfileService } from '@/services/userProfile.service';
import { Gender } from '@prisma/client';
import { Request, Response } from 'express';
import Validator from 'fastest-validator';
import fs from "fs";

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

        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'userId wajib diisi'
            });
        }

        try {

            const v = new Validator();

            const schema = {
                name: { type: "string" },
                age: { type: "number", optional: true },
                gender: { type: "enum", values: Object.values(Gender), optional: true },
                phoneNumber: { type: "string", optional: true },
            };

            const check = v.compile(schema);

            const validationResponse = check({ name, parsedAge, gender, phoneNumber });

            if (validationResponse !== true) {
                return res.status(400).json({ error: validationResponse });
            }

            const userExist = await UserService.getOneById(userId);

            if (!userExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User tidak ditemukan'
                });
            }

            const userProfileExist = await UserProfileService.getOneByUserId(userId);

            if (userProfileExist) {
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
                newProfileData.imageName = image.originalname;
                newProfileData.imagePath = image.path;
                newProfileData.imageUrl = `${process.env.APP_URL}/uploads/images/${userId}/${image.filename}`;
            }

            const data = await UserProfileService.create(newProfileData);

            res.status(201).json({
                status: 'success',
                message: 'Data user profile berhasil ditambahkan',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal mendapatkan data user profile' });
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
                name: { type: "string", optional: true },
                age: { type: "number", optional: true },
                gender: { type: "enum", values: Object.values(Gender), optional: true },
                phoneNumber: { type: "string", optional: true },
            };

            const check = v.compile(schema);

            const validationResponse = check({ name, parsedAge, gender, phoneNumber });

            if (validationResponse !== true) {
                return res.status(400).json({ error: validationResponse });
            }

            const userProfileExist = await UserProfileService.getOneById(id);

            if (!userProfileExist) {
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

                newProfileData.imageName = image.originalname;
                newProfileData.imagePath = image.path;
                newProfileData.imageUrl = `${process.env.APP_URL}/uploads/images/${userProfileExist.userId}/${image.filename}`;
            }

            const data = await UserProfileService.update(id, newProfileData);

            res.status(200).json({
                status: 'success',
                message: 'Data user profile berhasil diupdate',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Gagal mendapatkan data user profile' });
        }
    }
}