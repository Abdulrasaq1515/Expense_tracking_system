const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

const expenseValidation = [
  body('amount').isFloat({ min: 0 }),
  body('category').isIn(['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other']),
  body('date').isISO8601(),
  body('note').optional().isLength({ max: 200 })
];

module.exports = {
  registerValidation,
  loginValidation,
  expenseValidation
};