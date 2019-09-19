var _ = require("lodash"),
    jwt = require("jsonwebtoken");

function createAccessToken(user) {
    return jwt.sign(_.omit(user, "password"), "oonagi", {
        expiresIn: 60 * 10
    });
}

function createRefreshToken() {
    return jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 60,
            jti: genJti() // unique identifier for the token
        },
        "oonagi"
    );
}

// Generate Unique Identifier for the access token
function genJti() {
    let jti = "";
    let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return jti;
}

module.exports = { createAccessToken, createRefreshToken };
