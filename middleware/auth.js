// this middleware is to handle authentication error for /dashboard route
// authenticationMiddleware will be imported to controllers/main.js

const jwt = require('jsonwebtoken'); // import jwt package
// const CustomAPIError = require('../errors/custom-error');
const { UnauthenticatedError } = require('../errors'); //when you have index.js - it's automatically becomes default export. So that way we can structure all our exports there and as a result can simply point to a folder instead of specific file.
// An extra note: if the filename passed to require is actually a directory, it will first look for package.json in the directory and load the file referenced in the main property. Otherwise, it will look for an index.js.

const authenticationMiddleware = async (req, res, next) => {
  //   console.log(req.headers.authorization);
  // console.log(req.headers); // this will return the Headers object (for demo, we already add the authorization property to Headers object in Postman. In production, this will be from user).
  // Bearer (in the req.headers): Bearer schema. Read more about this -> this is from front end
  // In this project, this is when the user clicks on Get Data button
  const authHeader = req.headers.authorization; // eg:   authorization: 'Bearer someEncodedTokenStringHere'
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 401: authentication error code
    throw new UnauthenticatedError('No token provided');
  }
  // get the token
  const token = authHeader.split(' ')[1]; // eg:   authorization: 'Bearer someEncodedTokenStringHere' => extract the tokenstring
  // VERIFICATION: check if token is valid (if it matches the token the backend sent with jwt.sign)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded); //{  id: 12, username: 'john', iat: 1662983437, exp: 1665575437 }
    const { id, username } = decoded;
    req.user = { id, username };
    next(); // call next() so we can move on to next middleware
    // in js file in routes folder=> router.route('/dashboard').get(authenticationMiddleware, dashboard); // every time a user hits this dashboard route, they will go through the authenticationMiddleware() first, then to dashboard() (this can be done because of the next() function call)
  } catch (error) {
    // error example: token might be expired
    throw new UnauthenticatedError('Not authorized to access this route');
  }
};

module.exports = authenticationMiddleware;
