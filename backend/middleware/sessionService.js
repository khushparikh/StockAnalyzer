const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Session = require('../models/Session');

class SessionService {
  static async createSession(userId) {
    // Clear any existing sessions for this user (optional)
    await Session.update(
      { isValid: false },
      { where: { userId, isValid: true } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '20m' }
    );

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 20);

    // Create session record
    const session = await Session.create({
      userId,
      token,
      expiresAt,
      isValid: true
    });

    return session.token;
  }

  static async validateSession(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const session = await Session.findOne({
        where: {
          token,
          userId: decoded.userId,
          isValid: true,
          expiresAt: {
            [Op.gt]: new Date()
          }
        }
      });

      return session !== null;
    } catch (error) {
      return false;
    }
  }

  static async invalidateSession(token) {
    await Session.update(
      { isValid: false },
      { where: { token } }
    );
  }

  static async invalidateAllUserSessions(userId) {
    await Session.update(
      { isValid: false },
      { where: { userId } }
    );
  }
}

module.exports = SessionService;
