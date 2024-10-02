const { User, Otp, People, Post } = require('../models');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const nodemailer = require('nodemailer')
const { Op, where } = require('sequelize')
var jwt = require('jsonwebtoken');
const { SecretKey } = require("../config");
const { JWTtoken } = require('../Util/JWTtoken')
const { createTokenPair } = require("../Util/JWTtoken");
const { validationResult } = require("express-validator");
const saltRounds = 10;
const path = require('path');
const { verify } = require('crypto');

const CreateUser = async (req, res) => {
    try {
        const { email, password, ...restBody } = req.body;

        console.log("Creating user");

        const existingUser = await User.findOne({ where: { email } });
        console.log(JSON.stringify(existingUser));

        if (existingUser) {
            return res.status(200).send({ error: "User already exists" });
        }

        if (!password) {
            return res.status(400).send({ error: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ email, password: hashedPassword, ...restBody });
        console.log(JSON.stringify(user))
        if (user) {
            await Otpgenrater({ email });
            return res.status(201).send({ message: "User created successfully", user });
        } else {
            return res.status(200).send({ error: "User not created" });
        }

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(200).send({ error: "Error while creating user" });
    }
};




const VerifyUser = async (req, res) => {
    console.log("Verifying user");

    const { email, otp } = req.body;

    if (!email) {
        return res.status(200).send({ message: "Please register first" });
    }

    try {
        const expired = new Date(Date.now() - 5 * 60 * 1000);
        await Otp.destroy({
            where: {
                createdAt: {
                    [Op.lt]: expired
                }
            }
        });

        const verifyUserOtp = await Otp.findOne({ where: { email:email } });
        console.log(verifyUserOtp);

        if (verifyUserOtp == null) {
            
            console.log("inside")
            return res.status(200).send({ message: "Otp dose not match" });
        }

        if (verifyUserOtp.otp == otp) {

            await Otp.destroy({ where: { email:email } });

            const findUser = await User.findOne({ where: { email:email } });

            if (!findUser) {
                return res.status(200).send({ message: "User not found" });
            }

            findUser.verify = true;
            await findUser.save();

            return res.status(200).send({ message: "User verify successfully" });
        } else {
            return res.status(200).send({ message: "Otp dose not match" });
        }

    } catch (error) {
        console.error("Error during verification:", error);
        return res.status(200).send({ error: "Error while verifying user" });
    }
};



const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(200).send({ message: "User does not exist please register" });
        }

        if (!user.verify) {
            const expired = new Date(Date.now() - 5 * 60 * 1000);

            await Otp.destroy({
                where: {
                    createdAt: { [Op.lt]: expired }
                }
            });

            const otpDestroyed = await Otp.destroy({ where: { email } });

            if (!otpDestroyed) {
                await Otpgenrater({ email: user.email });
            }

            return res.status(200).send({ message: "please verify your email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createTokenPair({ id: user.id, email: user.email });
            console.log("JWT created for user:", token);

            return res.status(200).send({
                message: "user login sucessfully",
                token
            });
        } else {
            return res.status(200).send({ message: "User and password does not match" });
        }

    } catch (error) {
        // console.error("Error", error);
        return res.status(200).send({ error: "error its here" });
    }
};



const ResendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Please register first" });
    }

    await Otp.destroy({ where: { email } });

    await Otpgenrater({ email });

    res.status(200).send({ message: "OTP resent successfully" });
};

const Otpgenrater = async ({ email }) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Generated OTP: ${otp}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your OTP: ${otp}`,
    };

    await Otp.create({ email, otp });
    console.log("OTP stored successfully.");

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
};

const UserData = async (req, res) => {
    const { id } = req.user;

    const user = await User.findOne({
        where: { id },
        attributes: {
            exclude: ["id", "password", "email", "createdAt", "updatedAt", "verify"]
        }
    });

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ user });
};

const UpdateUser = async (req, res) => {
    const { id } = req.user;
    const { fullname, username, number, gender } = req.body;

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            console.log("----")
            return res.status(404).send({ message: "User not found" });
        }

        user.fullname = fullname 
        user.username = username
        user.number = number 
        user.gender = gender

        if (req.file) {
            user.image = req.file.filename;
        }

        await user.save();

        res.status(200).send({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Error occurred while updating the user" });
    }
};

const SearchUser = async (req, res) => {
    const { id } = req.user;
    let { search } = req.body;

    if (!search) {
        search = "";
    }

    const user = await User.findAll({
        where: {
            fullname: { [Op.iLike]: `%${search}%` },
            verify:'t'
        },
        attributes: {
            exclude: ["password", "createdAt", "updatedAt", "verify"]
        },
        include: {
            model: People,
            as: "following",
            where: { sender_id: id },
            required: false,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }
    });

    res.status(200).send({user:user,id:id});
};

const FollowFollowingUser = async (req, res) => {
    const { id } = req.user;

    const users = await User.findAll({
        where: { id },
        include: [
            {
                model: Post,
                as: "posts",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: People,
                as: "follower",
                where: { status: "accepted" },
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: User,
                    as: "receiver_user"
                }
            },
            {
                model: People,
                as: "following",
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: User,
                    as: "sender_user"
                }
            }
        ]
    });

    res.status(200).send({ user: users[0] });
};

const UserProfiledata = async (req, res) => {
    const {id} = req.user

    const users = await User.findAll({
        where: { id },
        include: [
            {
                model: Post,
                as: "posts",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: People,
                as: "follower",
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: User,
                    as: "receiver_user"
                }
            },
            {
                model: People,
                as: "following",
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: User,
                    as: "sender_user"
                }
            }
        ]
    });

    res.status(200).send({ user: users[0] });
};

const FriendProfile = async (req, res) => {
    const {id} = req.body

    const users = await User.findAll({
        where: { id },
        include: [
            {
                model: Post,
                as: "posts",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: People,
                as: "follower",
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: User,
                    as: "receiver_user"
                }
            },
            {
                model: People,
                as: "following",
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include: {
                    model: User,
                    as: "sender_user"
                }
            }
        ]
    });

    res.status(200).send({ user: users[0] });
};

const ProfileImage = async (req, res) => {
    const { image } = req.params;

    const user = await User.findOne({ where: { image } });

    if (!user || !user.image) {
        return res.status(404).send({ message: "Profile picture not found" });
    }

    const filePath = path.join(__dirname, `../Public/User/${user.image}`);
    res.sendFile(filePath);
};

module.exports = {
    CreateUser,
    VerifyUser,
    LoginUser,
    ResendOtp,
    UserData,
    UpdateUser,
    SearchUser,
    FollowFollowingUser,
    ProfileImage,
    UserProfiledata,
    FriendProfile
};
