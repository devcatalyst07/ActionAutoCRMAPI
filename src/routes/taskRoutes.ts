import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { createTaskValidation, idParamValidation, paginationValidation, validate } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/', paginationValidation, validate, TaskController.getAll);
router.post('/', createTaskValidation, validate, TaskController.create);
router.put('/:id', idParamValidation, validate, TaskController.update);
router.delete('/:id', idParamValidation, validate, TaskController.delete);

export default router;
