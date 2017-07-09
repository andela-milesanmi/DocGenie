const User = require('../models').User;
const Document = require('../models').Document;
const authentication = require('../middleware/authentication');
const bcrypt = require('bcrypt-nodejs');

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
    if (request.body.password !== request.body.confirmPassword) {
      return response.status(401).send({ message: 'Password does not match' });
    }
    if (request.decoded && (Number(request.body.roleId) === 1
    && Number(request.decoded.roleId) !== 1)) {
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
        throw new Error('Username or email already exists');
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
      const errorMessage = error.message || error;
      response.status(400).send(errorMessage);
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
        throw new Error('Not an existing user');
      } else if (!user.validatePassword(request.body.password, user)) {
        throw new Error('Invalid password');
      }
      // if user is found and password is right,
      // create a token
      const token = authentication.generateToken(user);

      return response.status(200).send({
        message: 'Signed in successfully',
        user,
        token,
      });
    }).catch((error) => {
      const errorMessage = error.message || error;
      response.status(400).send(errorMessage);
    });
  },
  listAllUsers(request, response) {
    const limit = request.query.limit || '6';
    // const offset = request.query.offset || '0';
    const offset = request.query.page ? (Number(request.query.page - 1) * limit) : 0;
    const { userId } = request.decoded;
    return User
      .findAndCountAll({
        // where: {
        //   id: {
        //     $ne: userId
        //   }
        // },
        limit,
        offset,
        order: '"createdAt" DESC',
      })
      .then((users) => {
        if (!users) {
          throw new Error('No user found');
        }
        const pagination = {
          totalCount: users.count,
          pages: Math.ceil(users.count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          pageSize: users.rows.length,
        };
        return response.status(200).send({
          users: users.rows,
          pagination,
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        response.status(400).send(errorMessage);
      });
  },
  findAUser(request, response) {
    return User
      .findById(request.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('User Not Found');
        }
        return response.status(200).send(user);
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        response.status(400).send(errorMessage);
      });
  },
  updateAUser(request, response) {
    return User
      .findById(request.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('User Not Found');
        }
        // checking if a user can change their own role
        if (request.body.roleId && (Number(request.decoded.userId) === Number(user.id)
        && (Number(request.body.roleId) < Number(user.roleId) || Number(request.body.roleId) > Number(user.roleId)))) {
          throw new Error('You are not authorized to change your own role');
        }

        if (request.body.roleId && (request.body.roleId !== user.roleId && request.decoded.roleId !== 1)) {
          throw new Error('You are not authorized to change a user\'s role');
        }
        if (request.body.oldPassword || request.body.newPassword || request.body.confirmPassword) {
          if ((bcrypt.compareSync(request.body.oldPassword, user.password))) {
            throw new Error('Old password is incorrect');
          }
          if (request.body.newPassword && (request.body.newPassword !== request.body.confirmPassword)) {
            throw new Error('Passwords do not match');
          }
          if (oldPassword === newPassword) {
            throw new Error('Please change your password');
          }
        }
        return user
          .update(request.body);
      }).then(user => response.status(200).send(user)) // Send back updated user
      .catch((error) => {
        response.status(400).send(error.message);
      });
  },
  deleteAUser(request, response) {
    const { userId, roleId } = request.decoded;
    return User
      .findById(request.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }
        // checking if a non-admin is trying to delete another user's account
        if (userId !== user.id && Number(roleId) !== 1) {
          throw new Error('You\'re not authorized to delete another user');
        }
        return user
          .destroy();
      }).then(() => response.status(200).send('User deleted successfully'))
      .catch((error) => {
        const errorMessage = error.message || error;
        response.status(400).send(errorMessage);
      });
  },
  findUserDocuments(request, response) {
    const limit = request.query.limit || '6';
    const offset = request.query.page ? (Number(request.query.page - 1) * limit) : 0;

    return Document
      .findAndCountAll({
        include: [{ model: User,
          as: 'user' }],
        where: {
          userId: request.params.id,
        },
        limit,
        offset,
        order: '"createdAt" DESC',
      })
      .then((documents) => {
        if (!documents) {
          throw new Error('Document(s) Not Found');
        }
        const pagination = {
          totalCount: documents.count,
          pages: Math.ceil(documents.count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          pageSize: documents.rows.length,
        };
        return response.status(200).send({
          documents: documents.rows,
          pagination,
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        response.status(400).send(errorMessage);
      });
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
          throw new Error('No user(s) found');
        }
        return response.status(200).send(searchResult);
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        response.status(400).send(errorMessage);
      });
  },
  signOut(request, response) {
    return response.status(200).send({ message: 'Successfully logged out' });
  },
};
