import { Router } from 'express';
import { LeadController } from '../controllers/leadController';
import { authenticate } from '../middleware/auth';
import { createLeadValidation, idParamValidation, paginationValidation, validate } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/', paginationValidation, validate, LeadController.getAll);
router.get('/:id', idParamValidation, validate, LeadController.getById);
router.post('/', createLeadValidation, validate, LeadController.create);
router.put('/:id', idParamValidation, validate, LeadController.update);
router.delete('/:id', idParamValidation, validate, LeadController.delete);

export default router;
