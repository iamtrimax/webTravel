const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        //auto refresh token at here
        const refreshToken = req.headers["x-refresh-token"];
        //check refresh token
        if (!refreshToken) {
          return res.status(401).json({
            message: "refresh token is missing",
          });
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
          if (err && err.name === "TokenExpiredError") {
            return res.status(403).json({
              message: "invalid refresh token or expired",
            });
          } else {
            //if refresh token is valid, generate new access token
            const newRefreshToken = jwt.sign(
              { id: decode.id, email: decode.email, role: decode.role },
              process.env.JWT_SECRET,
              { expiresIn: "14d" }
            );
            const data = {
              accessToken: refreshToken,
              refreshToken: newRefreshToken,
            };
            return res.status(403).json({
              message: "Token refreshed",
            });
          }
        });
      } else {
        req.user = decode;
        next();
      }
    }
    req.user = decode;
    next();
  });
};
module.exports = verifyAccessToken;
