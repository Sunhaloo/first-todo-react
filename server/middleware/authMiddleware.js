// import the 'JSON Web Token' library
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    // get token from authrisation ( request ) header
    const authHeader = req.headers["authorization"];
    // split the data ( "Bearer ey12345.abc6789.xyz123" ) into 2 parts and get the token only
    const token = authHeader && authHeader.split(" ")[1];

    // if there are not token is not present
    // NOTE: status code = '401' ==> missing / invalid / failed authentication details
    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    // use the `jwt.verify` function to verify token for each user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach / get the user information ( { userId, username } ) to the request object
    req.user = decoded;

    // continue to the actual route handler
    next();

    // NOTE: status code = '403' ==> request "valid" but unauthorised
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

// export the token
module.exports = { authenticateToken };
