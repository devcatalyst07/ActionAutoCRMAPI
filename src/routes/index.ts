import { Router } from 'express';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import leadRoutes from './leadRoutes';
import taskRoutes from './taskRoutes';
import activityRoutes from './activityRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/leads', leadRoutes);
router.use('/tasks', taskRoutes);
router.use('/activities', activityRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Action Auto CRM API is running.',
    timestamp: new Date().toISOString(),
  });
});

export default router;
