const Document = require('../models').Document;

module.exports = {
  createADocument(request, response) {
    return Document
      .create({
        userId: request.body.userId,
        title: request.body.title,
        access: request.body.access,
        content: request.body.content
      })
      .then(document => response.status(201).send(document))
      .catch(error => response.status(400).send(error));
  },
  listAllDocuments(request, response) {
    return Document
      .all()
      .then(document => response.status(200).send(document))
      .catch(error => response.status(400).send(error));
  },
  findADocument(request, response) {
  return Document
    .findById(request.params.id)
    .then(document => {
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
    .then(document => {
      if (!document) {
        return response.status(404).send({
          message: 'document Not Found',
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
        .catch((error) => response.status(400).send(error));
    })
    .catch((error) => response.status(400).send(error));
  },
  deleteADocument(request, response) {
  return Document
    .findById(request.params.id)
    .then(document => {
      if (!document) {
        return response.status(400).send({
          message: 'Document Not Found',
        });
      }
      return document
        .destroy()
        .then(() => response.status(200).send("Document deleted successfully"))
        .catch(error => response.status(400).send(error));
    })
    .catch(error => response.status(400).send(error));
  },
};
