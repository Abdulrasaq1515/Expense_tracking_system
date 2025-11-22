import api from './api';

class ExpenseService {
  async getExpenses(filters = {}, token) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/expenses?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }

  async getSummary(token) {
    const response = await api.get('/expenses/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }

  async createExpense(expenseData, token) {
    const response = await api.post('/expenses', expenseData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }

  async updateExpense(id, expenseData, token) {
    const response = await api.put(`/expenses/${id}`, expenseData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }

  async deleteExpense(id, token) {
    const response = await api.delete(`/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }
}

export default new ExpenseService();