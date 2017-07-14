[![Build Status](https://travis-ci.org/andela-mharuna/DocGenie.svg?branch=staging)](https://travis-ci.org/andela-mharuna/DocGenie)[![Coverage Status](https://coveralls.io/repos/github/andela-mharuna/DocGenie/badge.svg?branch=staging)](https://coveralls.io/github/andela-mharuna/DocGenie?branch=staging)
# DocGenie
A document management system that allows users create documents, set access privileges for their documents, view other users' public and role-level documents, save private for-your-eyes-only documents and also edit or delete your saved documents.

### About the Application

### API Features

The following features make up the Document Management System API:

##### Authentication

* Uses JSON Web Token (JWT) for authentication.
* Generates a token upon successul login / account creation and returns it to the client.
* Verifies the token to ensures a user is authenticated to access some endpoints.

##### Users

* Allows users to be created.
* Allows users to login and obtain a token
* Allows authenticated users to retrieve and edit their information only.
* Ensures all users can be retrieved and modified by an admin user.

##### Roles

* Ensures that users have roles.
* Ensures user roles could be admin or regular.
* Ensures roles can be created, retrieved, updated and deleted by an admin user.
* Ensures a non-admin user cannot create, retrieve, modify, or delete roles.

##### Documents

* Allows new documents to be created by authenticated users.
* Ensures all documents have access roles defined as public or private.
* Allows admin users to create, retrieve, modify, and delete documents.
* Allows the admin user to retrieve all documents, except private documents.
* Allows documents to be retrieved by its owners.
* Ensures users can delete, and update documents that they own.
* Allows users to retrieve all documents they own.

##### Search

* It allows users to search public/role documents that belong to other users (as well as documents that belong to the user).
* It allows admin to retrieve all documents that matches search term, be it public or role-based.

##### Tech Stack

* [React] - A javascript library for building user interfaces
* [Redux] - A predictable state container for JavaScript apps.
* [Enzyme] - A JavaScript Testing utility for React
* [Materialize] - A great UI boilerplate for modern web apps
* Node.js - An evented I/O for the backend
* Express - A node.js framework for routing
* [Webpack] - A file bundler and task runner
* [Sequelize] - Sequelize is a promise-based ORM for Node.js and io.js.
* [JWT] - Used to authenticate users, to enable them access the app routes
* [Postgresql]: SQL database

##### How To Install

N.B: DocGenie requires Node.js v4+ to run

* Clone/download this repository then run the following commands:
```
$ cd DocGenie
$ npm install
$ npm run start:dev
$ npm start
$ npm test
```
###### Run in Postman

* Download and install Postman and check the API Documentation for the endpoints.

##### API Documentation

The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.

##### Authentication

* Users are assigned a token when signup or signin. This token is needed for subsequent HTTP requests to the API for authentication and can be attached as values to the header's x-acess-token or authorization key. API requests made without authentication will fail with the status code ```401: Unauthorized Access```.

####### Below are the API endpoints and their functions:

* EndPoint	Functionality
 - POST /auth/api/users/login : Logs a user in.
 - POST /api/users/logout :	Logs a user out.
 - POST /auth/api/users : 	Creates a new user.
 - GET /api/users	: Find matching instances of user.
 - GET /api/users/:id	Find a particular user.
 - PUT /api/users :	Update user attributes.
 - DELETE /api/users	: Delete user.
 - POST /api/documents :	Creates a new document instance.
 - GET /api/documents :	Find matching instances of documents.
 - GET /api/documents/:id :	Find a particular document.
 - PUT /api/documents :	Update document attributes.
 - DELETE /api/documents/:id	: Delete document.
 - GET /api/users/:id/documents :	Find all documents belonging to the user.
 - GET /api/search/users/:key :	Gets all users whose names match the search-key
 - GET /api/search/documents/:term	Get all documents with title and content matching the search-key

###### The following are some sample response from the API.

####### Endpoints for Roles API:
- Create Roles

* Endpoint: POST: /api/roles
* Request:
```
{
  "title": "admin"
}
```

* Response:
```
Status: 200: OK
{
  "id": 1,
  "title": "admin",
  "createdAt": "2016-12-06T06:44:54.792Z",
  "updatedAt": "2016-12-06T06:44:54.792Z"
}
```

####### Endpoint for Users API.

- Create User

Endpoint: POST: api/users
Request:
```
{
  "username": "memuna",
  "fullname": "memuna h",
  "email": "memuna@gmail.com",
  "roleId": 2,
  "password": "password",
  "confirmPassword": "password"
}
```
* Response
```
Status: 201: OK
Body (application/json)
{
  "user": {
    "id": 141,
    "username": "memuna",
    "fullname": "memuna h",
    "email": "memuna@gmail.com",
    "roleId": 2,
    "password": "@a39chc.sduc*#ka82.te638w7qd"
    "createdAt": "2017-02-19T17:34:19.992Z",
    "updatedAt": "2017-02-19T17:34:19.992Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjE0MSwiUm9sZUlkIjoxLCJpYXQiOjE0ODc1MjU2NjAsImV4cCI6MTQ4NzY5ODQ2MH0.ddCQXZB2_woJ32xZNHqPBhNXfjBRg6T3ZsSmF8GCplA"
}
```

###### Endpoint for document API.

- Get All Documents

* Request:
- Endpoint: GET: /documents
- Requires: Authentication by Admin

- Response:
```
Status: 200: OK
Body (application/json)
[{
    "id": 10,
    "title": "A document",
    "content": "Test document",
    "access": "Public",
    "userId": 2,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 3,
    "title": "Okay",
    "content": "What do we have here?",
    "access": "1",
    "userId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

###### Limitations:

- The limitations to the DocGenie API are as follows:

* Users cannot upload images in their documents yet.
* Users cannot share documents with people, but can make document public to make it available to other users.

###### Contributing

- Contributors are welcome to further enhance the features of this API by contributing to its development. The following guidelines should guide you in contributing to this project:

* Download/Clone this repository.
* Install the dependencies using npm install.
* Run npm start to start the application.
* To test: run npm test.
* Fork this repo to your own repository.
* Create a new branch: git checkout -b new-branch-name.
* Work on a new feature and push to your branch.
* Create a pull request to the staging branch of this repo.
