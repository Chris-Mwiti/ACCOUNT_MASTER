const TryCatchHelper = require("../helpers/TryCatch");
const RefreshTokenModel = require("../models/Tokens");
const jwt = require("jsonwebtoken");

async function checkCookies(req, res, next) {
  const { cookies } = req;

  if (!cookies || (!cookies.refreshToken && !cookies.accessToken))
    return res.status(401).json({ msg: "Please Log in" });

  if (cookies.refreshToken && !cookies.accessToken) {
    const tokenModel = new RefreshTokenModel();
    const { refreshToken } = cookies;
    const [data, error] = await TryCatchHelper(() =>
      tokenModel.getRefreshToken(refreshToken)
    );
    if (error)
      return res.status(500).json({ err: "Error while fetching token data" });
    if(!data) return res.status(401).json({err: "Please log in"});
    const { token } = data;
    let accessToken = "";
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err)
        return res.status(500).json({ err: "Error while decoding token" });
      accessToken = jwt.sign(
        { "userId": decode.userId, "role": decode.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 900 }
      );
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    return next();
  } else {
    return next();
  }
}

module.exports = checkCookies