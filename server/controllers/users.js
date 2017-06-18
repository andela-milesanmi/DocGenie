// const jwt = require('jsonwebtoken');
const User = require('../models').User;
const Document = require('../models').Document;
// const secret = require('../config/config.json').secret;
const authentication = require('../middleware/authentication');
// const brcrypt = require('bcrypt');

module.exports = {
  createNewUser(request, response) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(request.body.email)) {
      return response.status(401).send({
        message: 'Email is not rightly formatted',
      });
    }
    if (!request.body.fullname || !request.body.email || !request.body.password
      || !request.body.username) {
      return response.status(401).send({ message: 'Please fill all the fields' });
    }

    // check if roleId is 1
    if (request.body && Number(request.body.roleId) === 1) {
      return response.status(400).json({
        message: 'You are not allowed to create an admin user',
      });
    }

    return User.findAll({
      where: {
        $or: [
          {
            username: request.body.username
          },
          {
            email: request.body.email
          }
        ]
      },
    }).then((existingUser) => {
      if (existingUser.length > 0) {
        throw new Error({
          message: 'Username or email already exists'
        });
      }
      return User
        .create({
          username: request.body.username,
          fullname: request.body.fullname,
          roleId: request.body.roleId,
          email: request.body.email,
          password: request.body.password,
        });
    }).then((user) => {
      const token = authentication.generateToken(user);

      return response.status(200).json({
        message: 'Signed up successfully',
        user,
        token,
      });
    }).catch((error) => {
      response.status(400).send(error);
    });
  },
  signIn(request, response) {
    if (!request.body.email || !request.body.password) {
      return response.status(401).send({
        message: 'Enter all required fields'
      });
    }
    return User.findOne({
      where: {
        email: request.body.email
      }
    }).then((user) => {
      if (!user) {
        return response.status(400).send({
          message: 'User does not exist',
        });
      } else if (!validatePassword(request.body.password)) {
        return response.status(400).send({
          message: 'Invalid password',
        });
      }
      // if user is found and password is right,
      // create a token
      const token = authentication.generateToken(user);

      return response.status(200).send({
        message: 'Signed in successfully',
        user,
        token,
      });
    }).catch(error => response.status(400).send(error));
  },
  listAllUsers(request, response) {
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    return User
      .findAndCountAll({
        limit,
        offset,
        order: '"createdAt" DESC',
      })
      .then((users) => {
        if (!users) {
          return response.status(404).send({
            message: 'No user found',
          });
        }
        const pagination = limit && offset ? {
          totalCount: users.count,
          pages: Math.ceil(users.count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          pageSize: users.rows.length,
        } : null;
        return response.status(200).send({
          users: users.rows,
          pagination,
        });
      })
      .catch(error => response.status(400).send(error));
  },
  findAUser(request, response) {
    return User
    .findById(request.params.id)
    .then((user) => {
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
       // check if roleId is 1
    return User
    .findById(request.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('User Not Found');
        }
        if (request.body.roleId && Number(user.roleId) !== 1) {
          throw new Error('You are not authorized to change a user\'s role');
        }
        return user
        .update(request.body);
      }).then(user => response.status(200).send(user))  // Send back updated user
      .catch((error) => {
        response.status(400).send(error.message);
      });
  },
  deleteAUser(request, response) {
    return User
    .findById(request.params.id)
    .then((user) => {
      if (!user) {
        return response.status(400).send({
          message: 'User Not Found',
        });
      }
      return user
        .destroy();
    }).then(() => response.status(200).send('User deleted successfully'))
    .catch(error => response.status(400).send(error));
  },
  findUserDocuments(request, response) {
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    return Document
    .findAndCountAll({
      where: {
        userId: request.params.id,
      },
      limit,
      offset,
      order: '"createdAt" DESC',
    })
      .then((documents) => {
        if (!documents) {
          return response.status(404).send({
            message: 'Document(s) Not Found',
          });
        }
        const pagination = limit && offset ? {
          totalCount: documents.count,
          pages: Math.ceil(documents.count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          pageSize: documents.rows.length,
        } : null;
        return response.status(200).send({
          documents: documents.rows,
          pagination,
        });
      })
      .catch(error => response.status(400).send(error));
  },
  searchForUser(request, response) {
    return User
      .findAll({
        where: {
          $or: [
            {
              username: {
                $iLike: `%${request.params.searchKey}%`
              }
            },
            {
              fullname: {
                $iLike: `%${request.params.searchKey}%`
              }
            }
          ]
        },
        limit: 10,
      }).then((searchResult) => {
        if (!searchResult.length) {
          return response.status(404).send({
            message: 'No user found',
          });
        }
        return response.status(200).send(searchResult);
      })
    .catch(error => response.status(400).send(error));
  },
  signOut(request, response) {
    return response.status(200).send({ message: 'Successfully logged out.' });
  },
  // signUp(request, response) {
  //   const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  //   if (!emailRegex.test(request.body.email)) {
  //     return response.status(401).send({
  //       message: 'Email is not rightly formatted',
  //     });
  //   }
  //   if (!request.body.name || !request.body.email || !request.body.password) {
  //     return response.status(401).send({ message: 'Incomplete user details' });
  //   }

  //   return User.findOne({
  //     where: {
  //       email: request.body.email
  //     },
  //   })
  //     .then((user) => {
  //       if (!user) {
  //         return User
  //           .create({
  //             username: request.body.username,
  //             fullname: request.body.fullname,
  //             roleId: request.body.roleId,
  //             email: request.body.email,
  //             password: request.body.password,
  //           })
  //           .then(user => response.status(201).send(user))
  //           .catch(error => response.status(400).send(error));
  //       }
  //     });
  // },
};
