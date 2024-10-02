const { verify } = require("jsonwebtoken");
const { User } = require('../models');
const { SecretKey } = require("../config");

const Authentication = async (req, res, next) => {
    try {
        const fulltoken = req.header("Authorization");

        if (!fulltoken || !fulltoken.startsWith("Bearer ")) {
            return res.status(200).send({ message: "Invalid token" });
        }

        const token = fulltoken.split(" ")[1];
        if (!token) {
            return res.status(200).send({ message: "token is not valid" });
        }

        const validToken = verify(token, SecretKey);

        if (!validToken) {
            return res.status(200).send({ message: "token is not valid" });
        }

        const user = await User.findOne({ where: { id: validToken.id } });
        if (!user) {
            return res.status(200).send({ message: "User not found with this token" });
        }

        delete validToken.iat;
        delete validToken.exp;
        req.user = validToken;
        next();

    } catch (error) {
        console.error("authentication error:", error);
        res.status(200).send({ message: "error authentication" });
    }
};

module.exports = Authentication;
