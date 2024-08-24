import jwt from "jsonwebtoken";
import createError from "http-errors";

function verifyAdminAccessToken(req: any, res: any, next: any) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET_ADMIN,
    (err: any, payload: any) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return res.status(404).json({ msg: message });
      }

      if (Date.now() >= payload.exp * 1000) {
        // Check if token is expired
        return res.status(404).json({ msg: "Token expired" });
      }

      req.payload = payload;
      next();
    },
  );
}



function verifyAccessToken(req, res, next) {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
      req.payload = payload
      next()
    })
  }


function createToken(_id: string, email: string) {
  return jwt.sign({ id: _id, email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
}


function createUserToken(_id: string, username: string) {
  return jwt.sign({ id: _id, username: username }, process.env.ACCESS_TOKEN_SECRET_USER, {
    expiresIn: "365d",
  });
}

function createAdminToken(_id: string, email: string) {
  return jwt.sign(
    { id: _id, email: email },
    process.env.ACCESS_TOKEN_SECRET_ADMIN,
    {
      expiresIn: "30d",
    },
  );
}



module.exports = {
  createToken,
  verifyAdminAccessToken,
  createAdminToken,
  verifyAccessToken,
  createUserToken
};