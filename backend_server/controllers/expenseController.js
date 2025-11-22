const expenseService = require('../services/expenseService');
const { validationResult } = require('express-validator');

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const expenseData = {
        ...req.body,
        user: req.userId
      };

      const expense = await expenseService.createExpense(expenseData);
      res.status(201).json({
        message: 'Expense created successfully',
        expense
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpenses(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await expenseService.getUserExpenses(req.userId, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getExpenseSummary(req, res, next) {
    try {
      const summary = await expenseService.getExpenseSummary(req.userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  async updateExpense(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const expense = await expenseService.updateExpense(
        req.params.id,
        req.userId,
        req.body
      );
      res.json({
        message: 'Expense updated successfully',
        expense
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      await expenseService.deleteExpense(req.params.id, req.userId);
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseController();