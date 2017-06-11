const User = require('../models').User;

module.exports = {
  createNewUser(request, response) {
    //check if roleId is 1
    if (request.body && Number(request.body.roleId) === 1) {
      response.status(400).json({
        message: 'You are not allowed to create an admin user',
      });
      return;
    }

    return User
      .create({
        username: request.body.username,
        fullname: request.body.fullname,
        roleId: request.body.roleId,
        email: request.body.email,
        password: request.body.password,
      })
      .then(user => response.status(201).send(user))
      .catch(error => response.status(400).send(error));
  },
  listAllUsers(request, response) {
    return User
      .all()
      .then(users => response.status(201).send(users))
      .catch(error => response.status(400).send(error));
  },
  findAUser(request, response) {
  return User
    .findById(request.params.id)
    .then(user => {
      if (!user) {
        return response.status(404).send({
          message: 'User Not Found',
        });
      }
      return response.status(200).send(user);
    })
    .catch(error => response.status(400).send(error));
  },
  updateAUser(request, response) {
  return User
    .findById(request.params.id)
    .then(user => {
      if (!user) {
        return response.status(404).send({
          message: 'User Not Found',
        });
      }
      return user
        .update({
          username: request.body.username || user.username,
          fullname: request.body.fullname || user.fullname,
          roleId: request.body.roleId || user.roleId,
          email: request.body.email || user.email,
          password: request.body.password || user.password,
        })
        .then(() => response.status(200).send(user))  // Send back updated user
        .catch((error) => response.status(400).send(error));
    })
    .catch((error) => response.status(400).send(error));
  },
  deleteAUser(request, response) {
  return User
    .findById(request.params.id)
    .then(user => {
      if (!user) {
        return response.status(400).send({
          message: 'User Not Found',
        });
      }
      return user
        .destroy()
        .then(() => response.status(200).send("User deleted successfully"))
        .catch(error => response.status(400).send(error));
    })
    .catch(error => response.status(400).send(error));
  },
};
