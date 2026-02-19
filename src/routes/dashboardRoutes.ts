import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', DashboardController.getSummary);
router.post('/clock-in', DashboardController.clockIn);
router.post('/clock-out', DashboardController.clockOut);

export default router;
