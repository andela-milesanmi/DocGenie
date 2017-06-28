const jwt = require('jsonwebtoken');


module.exports = {
  verifyToken(request, response, next) {
    if (request.url.startsWith('/auth')) return next();

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
        console.log(request.decoded, "request.decoded");
        next();
      });
    } else {
      return response.status(401).send({
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
};
