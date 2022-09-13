const CustomAPIError = require('./custom-error');
const { StatusCodes } = require('http-status-codes');

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;

// unauthenticated error is for dashboard route
// this will be imported to auth.js -> for authenticationMiddleware
