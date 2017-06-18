const rolesController = require('../controllers').roles;
const UsersController = require('../controllers').users;
const DocumentsController = require('../controllers').documents;

module.exports = (app) => {
  app.get('/api', (request, response) => response.status(200).send({
    message: 'Welcome to the DocGenie API!',
  }));

  // roles routes
  app.post('/api/roles', rolesController.createNewRole);
  app.get('/api/roles', rolesController.listAllRoles);
  app.delete('/api/roles/:id', rolesController.destroyARole);

  // user routes
  app.post('/auth/api/users', UsersController.createNewUser);
  app.get('/api/users', UsersController.listAllUsers);
  app.get('/api/users/:id', UsersController.findAUser);
  app.get('/api/users/:id/documents', UsersController.findUserDocuments);
  app.put('/api/users/:id', UsersController.updateAUser);
  app.delete('/api/users/:id', UsersController.deleteAUser);
  app.post('/auth/api/users/login', UsersController.signIn);
  app.get('/api/users/logout', UsersController.signOut);

  // document routes
  app.post('/api/documents', DocumentsController.createADocument);
  app.get('/api/documents', DocumentsController.listAllDocuments);
  app.get('/api/documents/:id', DocumentsController.findADocument);
  app.put('/api/documents/:id', DocumentsController.updateADocument);
  app.delete('/api/documents/:id', DocumentsController.deleteADocument);

  // search routes
  app.get('/api/search/users/:searchKey', UsersController.searchForUser)
  app.get('/api/search/documents/:searchKey', DocumentsController.searchForDocument)
};
