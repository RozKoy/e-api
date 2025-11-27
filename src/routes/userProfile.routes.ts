import { Router } from 'express';
import { UserProfileController } from '../controllers/userProfile.controller';
import { upload } from "@/libs/multer";
import { authorization } from '@/middlewares/authorization';

export const userProfileRoutes = Router();

userProfileRoutes.put('/self', upload.single('image'), UserProfileController.updateSelf);
userProfileRoutes.post('/:userId', upload.single('image'), authorization('Buat Profil Pengguna'), UserProfileController.create);
userProfileRoutes.put('/:id', upload.single('image'), authorization('Ubah Profil Pengguna'), UserProfileController.update);