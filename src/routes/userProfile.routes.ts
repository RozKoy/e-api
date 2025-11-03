import { Router } from 'express';
import { UserProfileController } from '../controllers/userProfile.controller';
import { upload } from "@/libs/multer";

export const userProfileRoutes = Router();

userProfileRoutes.post('/:userId', upload.single('image'), UserProfileController.create);
userProfileRoutes.put('/:id', upload.single('image'), UserProfileController.update);