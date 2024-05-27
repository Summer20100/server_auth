const ApiError = require("../exeption/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const auhtorizationHeader = req.headers.authorization;
    if (!auhtorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = auhtorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
    
  } catch(e) {
    return next(ApiError.UnauthorizedError());
  }
}