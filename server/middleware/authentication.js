const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken(request, response, next) {
    const token = request.headers.authorization ||
      request.headers['x-access-token'];
    if (token) {
      jwt.verify(token, process.env.JWTSECRET, (error, decoded) => {
        if (error) {
          return response.status(401).send({
            message: 'Invalid token',
          });
        }
        request.decoded = decoded;
        next();
      });
    } else {
      // if (request.originalUrl.startsWith('/auth')) return next();
      return response.status(403).send({
        message: 'Token required for access',
      });
    }
  },

  /**
   * generateToken generates token for authentication
   * @param {Object} user object
   * @returns {Object} jwt
   */
  generateToken(user) {
    return jwt.sign({
      userId: user.id,
      roleId: user.roleId,
    }, process.env.JWTSECRET, { expiresIn: '1 day' });
  },

  /**
  *
  * Verifies admin access
  * @param {any} request
  * @param {any} response
  * @param {any} next
  * @returns {object} response message
  */
  verifyAdminAccess(request, response, next) {
    if (request.decoded.roleId === 1) {
      next();
    } else {
      return response.status(401).send({
        message: 'Sorry, You\'re not authorized to perform this action',
      });
    }
  }
};
