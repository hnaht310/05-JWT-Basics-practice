// check username, password in post(login) request
// if exist, create new Json web token JWT
// send back to front end

// set up authentication so only the request with JWT can access the dashboard

const jwt = require('jsonwebtoken'); // import jwt package
const { BadRequestError } = require('../errors');

const login = async (req, res) => {
  const { username, password } = req.body;

  // Option 1: if we use mongoose validation, it will throw an error when username and password are empty but in this project, we don't use mongodb
  // Option 2: We can use Joi (will learn it later)
  // Option 3: check in the controller
  // console.log(username, password);
  if (!username || !password) {
    // create a new instance of CustomAPIError(msg, statusCode)
    // when CustomAPIError is thrown, it will be handled by error-handler.js -> (app.use(errorHandlerMiddleware)) => which returns res.status(err.statusCode).json({ msg: err.message }) because this error is an instance of CustomAPIError (read error-handler.js)
    throw new BadRequestError('Please provide username and password'); // returns {"msg": "Please provide email and password"}, which is res.status(err.statusCode).json({ msg: err.message })
    // throw new Error('this will not be printed'); // if we do this, it will return res.status(500).send('Something went wrong try again later') => this is from error-handler.js
  }

  // this is for demo, normally provided by MongoDB
  const id = new Date().getDate();

  // try to keep the payload small, better experience for user
  // jwt.sign() -> 3 parameters: payload, jwt secret (secret string), and options
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  }); // we use the secret to sign the token. This secret can be used to sign tokens to it needs to be saved in the server
  res.status(200).json({ msg: 'user created', token }); // this returns {"msg": "user created", "token": some encoded token (string) here}. We can go to jwt.io to decode the token
};

const dashboard = async (req, res) => {
  // // console.log(req.headers); // this will return the Headers object (for demo, we already add the authorization property to Headers object in Postman. In production, this will be from user).
  // // Bearer (in the req.headers): Bearer schema. Read more about this -> this is from front end
  // // In this project, this is when the user clicks on Get Data button
  // const authHeader = req.headers.authorization; // eg:   authorization: 'Bearer someEncodedTokenStringHere'
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   // 401: authentication error code
  //   throw new CustomAPIError('No token provided', 401);
  // }
  // // get the token
  // const token = authHeader.split(' ')[1];
  // // VERIFICATION: check if token is valid (if it matches the token the backend sent with jwt.sign)
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   // console.log(decoded); //{  id: 12, username: 'john', iat: 1662983437, exp: 1665575437 }
  //   const luckyNumber = Math.floor(Math.random() * 100);
  //   res.status(200).json({
  //     msg: `Hello, ${decoded.username}`,
  //     secret: `Here's your authorized data, your lucky number is ${luckyNumber}`,
  //   });
  // } catch (error) {
  //   // error example: token might be expired
  //   throw new CustomAPIError('Not authorized to access this route', 401);
  // }
  //----------
  // This is after we refactor our code:
  // note: since in router for '/dashboard' route, we pass in authenticationMiddleware first, then call next()=> we can get access to req.headers.user
  console.log(req.user); // { id: 12, username: 'thanh' }
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here's your authorized data, your lucky number is ${luckyNumber}`,
  });
};

module.exports = { login, dashboard };
