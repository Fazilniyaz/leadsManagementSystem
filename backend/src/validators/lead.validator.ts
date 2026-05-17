import { body, query } from 'express-validator';

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .matches(/^[A-Za-z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, or apostrophes'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email required'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Phone must be exactly 10 digits'),
  body('source')
    .notEmpty()
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .matches(/^[A-Za-z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, or apostrophes'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email required'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Phone must be exactly 10 digits'),
  body('source')
    .optional()
    .isIn(['website', 'instagram', 'referral']),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost']),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];