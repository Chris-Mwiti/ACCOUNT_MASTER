const jwt =  require('jsonwebtoken');

const TokenGenerotor = (user) => {
    const accessToken = jwt.sign(
        {"userId": user.id, "role": user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "900s"}
    )

    const refreshToken = jwt.sign(
        {"userId": user.id, "role": user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "1d"}
    )

    return {accessToken,refreshToken}
}

module.exports = TokenGenerotor