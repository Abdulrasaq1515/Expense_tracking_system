const Expense = require('../data/model/Expense');

class ExpenseService {
  async createExpense(expenseData) {
    return await Expense.create(expenseData);
  }

  async getUserExpenses(userId, filters = {}) {
    const {
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = filters;

    const query = { user: userId };
    
    // Apply filters
    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { date: -1 },
      populate: 'user',
      lean: true
    };

    // Using pagination with mongoose-paginate-v2 (you'd need to install it)
    // For simplicity, using basic mongoose methods
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Expense.countDocuments(query);

    return {
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getExpenseSummary(userId) {
    const summary = await Expense.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const result = {};
    summary.forEach(item => {
      result[item._id] = item.total;
    });

    return result;
  }

  async updateExpense(expenseId, userId, updateData) {
    const expense = await Expense.findOne({ _id: expenseId, user: userId });
    if (!expense) {
      throw new Error('Expense not found');
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        expense[key] = updateData[key];
      }
    });

    return await expense.save();
  }

  async deleteExpense(expenseId, userId) {
    const result = await Expense.findOneAndDelete({ _id: expenseId, user: userId });
    if (!result) {
      throw new Error('Expense not found');
    }
    return result;
  }

  async getExpenseById(expenseId, userId) {
    return await Expense.findOne({ _id: expenseId, user: userId });
  }
}

module.exports = new ExpenseService();