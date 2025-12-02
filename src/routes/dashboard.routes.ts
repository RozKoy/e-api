import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get('/', DashboardController.getDashboardData);