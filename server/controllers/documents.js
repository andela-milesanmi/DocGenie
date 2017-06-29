const Document = require('../models').Document;
const User = require('../models').User;
const jwt = require('jwt-decode');

module.exports = {
  createADocument(request, response) {
    return Document
      .create({
        userId: request.decoded.userId,
        title: request.body.title,
        access: request.body.access,
        content: request.body.content
      })
      .then(document => response.status(201).send(document))
      .catch(error => response.status(400).send(error));
  },
  listAllDocuments(request, response) {
    const limit = request.query.limit || '6';
    const offset = request.query.page ? (Number(request.query.page - 1) * limit) : 0;
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
          return response.status(404).send({
            message: 'No documents found',
          });
        }
        const pagination = limit ? {
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
      .catch((error) => {
        console.log(error, 'this is an error');
        response.status(400).send(error);
      });
  },
  findADocument(request, response) {
    return Document
      .findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(404).send({
            message: 'Document Not Found',
          });
        }
        return response.status(200).send(document);
      })
      .catch(error => response.status(400).send(error));
  },
  updateADocument(request, response) {
    return Document
      .findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(404).send({
            message: 'Document Not Found',
          });
        }
        return document
          .update({
            userId: request.body.userId || document.userId,
            title: request.body.title || document.title,
            access: request.body.access || document.access,
            content: request.body.content || document.content,
          })
          .then(() => response.status(200).send(document))
          .catch((error) => { response.status(400).send(error); });
      })
      .catch((error) => { response.status(400).send(error); });
  },
  deleteADocument(request, response) {
    return Document
      .findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(400).send({
            message: 'Document Not Found',
          });
        }
        return document
          .destroy()
          .then(() => response.status(200).send('Document deleted successfully'))
          .catch(error => response.status(400).send(error));
      })
      .catch(error => response.status(400).send(error));
  },
  searchForDocument(request, response) {
    const { roleId, userId } = request.decoded;
    return Document
      .findAll({
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
        limit: 10,
      }).then((searchResult) => {
        if (!searchResult.length) {
          return response.status(404).send({
            message: 'No documents found',
          });
        }
        return response.status(200).send(searchResult);
      })
      .catch(error => response.status(400).send(error));
  }
};
