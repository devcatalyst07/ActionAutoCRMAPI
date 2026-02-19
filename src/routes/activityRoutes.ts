import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';
import { authenticate } from '../middleware/auth';
import { createActivityValidation, idParamValidation, paginationValidation, validate } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/', paginationValidation, validate, ActivityController.getAll);
router.post('/', createActivityValidation, validate, ActivityController.create);
router.put('/:id', idParamValidation, validate, ActivityController.update);
router.delete('/:id', idParamValidation, validate, ActivityController.delete);

export default router;
