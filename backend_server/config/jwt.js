module.exports = {
  secret: process.env.JWT_SECRET || 'i_can_put_my_key_here_for_development',
  expiresIn: '24h'
};