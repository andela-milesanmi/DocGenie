const User = require('../models').User;
const Document = require('../models').Document;

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
    const limit = request.query.limit || '5';
    const offset = request.query.offset || '0';
    return User
      .findAndCountAll({
        limit,
        offset,
      })
      .then(users => {
        if (!users) {
          return response.status(404).send({
           message: 'No user found',
         });
        }
        console.log("user.rows", users.rows)
        return response.status(200).send(users);
      })
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
    }).then(() => response.status(200).send(user))  // Send back updated user
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
    }).then(() => response.status(200).send("User deleted successfully"))
    .catch(error => response.status(400).send(error));
  },
  findUserDocuments(request, response) {
  return Document
    .findAll({
      where: {
        userId: request.params.id,
      }
    })
    .then(document => {
      if (!document.length) {
        return response.status(404).send({
          message: 'Document(s) Not Found',
        });
      }
      return response.status(200).send(document);
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
        limit: 5,
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


  // fetchFiveUsers(request, response) {
  //   const limit = request.params.limit || '5';
  //   const offset = request.params.offset || '5';
  //   return User.findAll({
  //     limit: limit,
  //     offset: offset,
  //   }).then((users) => {
  //     if (!users.length) {
  //       return response.status(404).send({
  //         message: 'No user found',
  //       });
  //     }
  //     // const pagination = limit && offset ? {
  //     //   totalCount: users.count,
  //     //   pages: Math.ceil(users.count / limit),
  //     //   currentPage: Math.floor(offset / limit) + 1,
  //     //   pageSize: users.rows.length,
  //     // }: null;
  //     console.log("user.rows", users.rows)
  //     return response.status(200).send(users);
  //   })
  //   .catch(error => response.status(400).send(error));
  // }
};
