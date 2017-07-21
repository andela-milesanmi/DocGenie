const User = require('../models').User;
const Document = require('../models').Document;
const authentication = require('../middleware/authentication');
const errorHandler = require('../helpers/errorHandler')
const bcrypt = require('bcrypt-nodejs');

module.exports = {
  // create new user on sign up
  createNewUser(request, response) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(request.body.email)) {
      return response.status(401).send({
        message: 'Email is not rightly formatted',
      });
    }
    if (!request.body.fullname || !request.body.email || !request.body.password
      || !request.body.username) {
      return response.status(401).send({
        message: 'Please fill all the fields'
      });
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
        user: user.filterUserDetails(),
        token,
      });
    }).catch((error) => {
      const errorMessage = error.message || error;
      const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
      response.status(400).send(customError);
    });
  },
  // sign in a user
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
        user: user.filterUserDetails(),
        token,
      });
    }).catch((error) => {
      const errorMessage = error.message || error;
      const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
      response.status(400).send(customError);
    });
  },
  listAllUsers(request, response) {
    const limit = request.query.limit || '6';
    const offset = request.query.page ?
      (Number(request.query.page - 1) * limit) : 0;
    const { userId } = request.decoded;
    return User
      .findAndCountAll({
        where: {
          id: {
            $ne: userId
          }
        },
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
          users: users.rows.map(user => user.filterUserDetails()),
          pagination,
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // find a particular user
  findAUser(request, response) {
    return User
      .findById(request.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('User Not Found');
        }
        return response.status(200).send(user.filterUserDetails());
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // update user attributes
  updateAUser(request, response) {
    return User
      .findById(request.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('User Not Found');
        }

        // validating user password, confirming if old password is correct
        if (request.body.oldPassword || request.body.password
         || request.body.confirmPassword) {
          if (!bcrypt.compareSync(request.body.oldPassword, user.password)) {
            throw new Error('Old password is incorrect');
          }
          // checking if password and confirmPassword fields match
          if (request.body.password &&
          (request.body.password !== request.body.confirmPassword)) {
            throw new Error('Passwords do not match');
          }
          if (request.body.oldPassword === request.body.password) {
            throw new Error('Please change your password');
          }
        }
        let userDetails;

        if (request.decoded.userId === user.id && !request.body.roleId) {
          const { roleId, oldPassword, confirmPassword, ...rest } = request.body;
          userDetails = rest;
        } else if (request.decoded.roleId === 1 &&
          request.decoded.userId !== user.id && request.body.roleId) {
          const { roleId } = request.body;
          userDetails = { roleId };
        } else {
          throw new Error('Sorry, you are not authorized for this action');
        }
        return user
          .update(userDetails);
      }).then(user => response.status(200).send(user.filterUserDetails()))
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // delete a user
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
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // find all a user's documents
  findUserDocuments(request, response) {
    const limit = request.query.limit || '6';
    const offset =
     request.query.page ? (Number(request.query.page - 1) * limit) : 0;

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
          documents: documents.rows.map(({
            user, id, access, title, content,
            userId, createdAt, updatedAt }) => {
            return {
              id,
              access,
              title,
              content,
              userId,
              createdAt,
              updatedAt,
              user: user.filterUserDetails() };
          }),
          pagination,
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // search for users
  searchForUser(request, response) {
    const limit = request.query.limit || '6';
    const offset = request.query.page ?
      (Number(request.query.page - 1) * limit) : 0;
    return User
      .findAndCountAll({
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
        limit,
        offset,
        order: '"createdAt" DESC',
      }).then((users) => {
        if (!users) {
          throw new Error('No user(s) found');
        }
        const pagination = {
          totalCount: users.count,
          pages: Math.ceil(users.count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          pageSize: users.rows.length,
        };
        return response.status(200).send({
          users: users.rows.map(user => user.filterUserDetails()),
          pagination
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // logout user
  signOut(request, response) {
    return response.status(200).send({ message: 'Successfully logged out' });
  },
};
