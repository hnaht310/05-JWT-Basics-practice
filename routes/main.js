const express = require('express');
const router = express.Router();

const { login, dashboard } = require('../controllers/main.js');

const authenticationMiddleware = require('../middleware/auth');

// all the requests that go to /dashboard route will have to go through authenticationMiddleware first
router.route('/dashboard').get(authenticationMiddleware, dashboard); // every time a user hits this dashboard route, they will go through the authenticationMiddleware() first, then pass to dashboard() (this can be done because of the next() in authenticationMiddleware)
router.route('/login').post(login);

module.exports = router;
