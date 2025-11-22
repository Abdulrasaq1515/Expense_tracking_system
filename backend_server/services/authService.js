const User = require('../data/model/User');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class AuthService {
  async register(userData) {
    const { email, password, name } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({ email, password, name });
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { user, token };
  }

  async login(credentials) {
    const { email, password } = credentials;
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { user, token };
  }

  async getCurrentUser(userId) {
    return await User.findById(userId);
  }
}

module.exports = new AuthService();