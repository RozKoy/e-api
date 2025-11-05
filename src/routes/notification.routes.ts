import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

export const NotificationRouter = Router();

NotificationRouter.get('/', NotificationController.getByUserId);