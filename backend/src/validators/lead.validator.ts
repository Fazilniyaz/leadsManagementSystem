import { body, query } from 'express-validator';

export const createLeadValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('phone').optional().trim(),
  body('source')
    .notEmpty()
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Invalid status'),
  body('notes').optional().trim(),
];

export const updateLeadValidator = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().trim().isEmail(),
  body('phone').optional().trim(),
  body('source')
    .optional()
    .isIn(['website', 'instagram', 'referral']),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost']),
  body('notes').optional().trim(),
];