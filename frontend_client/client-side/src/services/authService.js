import api from './api';

class AuthService {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  }

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response;
  }

  async getCurrentUser(token) {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }

  setToken(token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();