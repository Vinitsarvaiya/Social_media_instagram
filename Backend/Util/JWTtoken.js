const { sign } = require("jsonwebtoken");
const { SecretKey } = require("../config");

function createTokenPair(data) {
    return sign(data, SecretKey, { expiresIn: "1w" });
}

module.exports = { createTokenPair };