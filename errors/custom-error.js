class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = CustomAPIError;

// there'll be 2 classes extended from CustomAPIError (badrequest and unauthenticated)
