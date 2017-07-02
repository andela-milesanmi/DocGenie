const Role = require('../models').Role;

module.exports = {
  createNewRole(request, response) {
    if (request.decoded && Number(request.decoded.roleId) !== 1) {
      return response.status(400).json({
        message: 'You are not allowed to create a new role',
      });
    }
    return Role
      .create({
        title: request.body.title,
      })
      .then(role => response.status(201).send(role))
      .catch(error => response.status(400).send(error));
  },
  listAllRoles(request, response) {
    return Role
      .all()
      .then(roles => response.status(200).send(roles))
      .catch(error => response.status(400).send(error));
  },
  destroyARole(request, response) {
    return Role
      .findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(400).send({
            message: 'Role Not Found',
          });
        }
        return role
          .destroy()
          .then(() => response.status(204).send())
          .catch(error => response.status(400).send(error));
      })
      .catch(error => response.status(400).send(error));
  },
};
