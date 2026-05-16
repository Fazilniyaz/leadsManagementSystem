import { Router } from 'express';
import {
  getAllLeads, getSingleLead,
  createLead, updateLead, deleteLead, 
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // All lead routes need auth

router.get('/export/csv', exportLeadsCSV); 
router.get('/',           getAllLeads);
router.get('/:id',        getSingleLead);  
router.post('/',          createLeadValidator, createLead);
router.put('/:id',        updateLeadValidator, updateLead);
router.delete('/:id',     restrictTo('admin'), deleteLead);

export default router;