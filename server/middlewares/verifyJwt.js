const jwt = require('jsonwebtoken');

const verifyJwt = (req,res,next) => {
    const {cookies} = req;
    if(!cookies || !cookies.accessToken) return res.status(401).json({err: "Unauthorized"});

    const {accessToken} = cookies;

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decode) => {
            if(err) return res.status(500).json({err: "Error while decoding token"});
            req.userId = decode.userId,
            req.role = decode.role,
            next()
        }
    )
}

module.exports = verifyJwt