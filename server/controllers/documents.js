const Document = require('../models').Document;
const User = require('../models').User;
const errorHandler = require('../helpers/errorHandler');

module.exports = {

  /**
   * Creates a new document
  * @param {object} request - request object received from the client
   * @param {object} response - response object served to the client
   * @returns {promise} document - new document created
   */
  createADocument(request, response) {
    return Document
      .create({
        userId: request.decoded.userId,
        title: request.body.title,
        access: request.body.access,
        content: request.body.content
      })
      .then(document => response.status(201).send(document))
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },


  /**
   * Fetches all documents which the current user has access to view
  * @param {object} request - request object received from the client
   * @param {object} response - response object served to the client
   * @returns {promise} documents - all documents fetched
   */

  listAllDocuments(request, response) {
    const limit = request.query.limit || '6';
    const offset =
    request.query.page ? (Number(request.query.page - 1) * limit) : 0;
    const { roleId, userId } = request.decoded;
    return Document
      .findAndCountAll({
        include: [{ model: User,
          as: 'user' }],
        where: {
          $or: [
            { userId },
            { access: {
              $gte: roleId,
              $ne: -1
            }
            },
            { access: 0 }
          ]
        },
        limit,
        offset,
        order: '"createdAt" DESC',
      })
      .then((documents) => {
        if (!documents) {
          throw new Error('No documents found');
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
            userId: docUserId, createdAt, updatedAt }) => {
            return {
              id,
              access,
              title,
              content,
              userId: docUserId,
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
  // fetch a particular document
  findADocument(request, response) {
    return Document
      .findById(request.params.id)
      .then((document) => {
        if (!document) {
          throw new Error('Document Not Found');
        }
        return response.status(200).send(document);
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(404).send(customError);
      });
  },
  // update document attributes
  updateADocument(request, response) {
    return Document
      .findById(request.params.id)
      .then((document) => {
        if (!document) {
          throw new Error('Document Not Found');
        }
        if (request.decoded.userId !== document.userId) {
          throw new Error('You\'re not allowed to update this document');
        }
        return document
          .update({
            userId: request.body.userId || document.userId,
            title: request.body.title || document.title,
            access: request.body.access || document.access,
            content: request.body.content || document.content,
          });
      }).then((updatedDocument) => {
        response.status(200).send(updatedDocument);
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // delete a document
  deleteADocument(request, response) {
    return Document
      .findById(request.params.id)
      .then((document) => {
        if (!document) {
          throw new Error('Document Not Found');
        }
        return document
          .destroy()
          .then(() => {
            response.status(200).send('Document deleted successfully');
          });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  },
  // search for particular documents
  searchForDocument(request, response) {
    const { roleId, userId } = request.decoded;
    const limit = request.query.limit || '6';
    const offset =
     request.query.page ? (Number(request.query.page - 1) * limit) : 0;

    return Document
      .findAndCountAll({
        include: [{ model: User,
          as: 'user' }],
        where: {
          $and: [
            {
              $or: [
                { title: { $iLike: `%${request.params.searchKey}%` } },
                { content: { $iLike: `%${request.params.searchKey}%` } }
              ]
            },
            {
              $or: [
                { userId },
                { access: {
                  $gte: roleId,
                  $ne: -1 }
                },
                { access: 0 }
              ],
            }
          ]
        },
        limit,
        offset,
        order: '"createdAt" DESC',
      }).then((documents) => {
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
            userId: docUserId, createdAt, updatedAt }) => {
            return {
              id,
              access,
              title,
              content,
              userId: docUserId,
              createdAt,
              updatedAt,
              user: user.filterUserDetails() };
          }),
          pagination
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        const customError = errorHandler.filterSequelizeErrorMessage(errorMessage);
        response.status(400).send(customError);
      });
  }
};
