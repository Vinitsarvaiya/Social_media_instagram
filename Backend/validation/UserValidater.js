const { body } = require('express-validator');
const ErrorValidator = require("../Util/ValidatorError");

const RegisterValidator = [
    body('fullname', 'Full name should not be empty').notEmpty(),
    body('username', 'Username should not be empty').notEmpty(),
    body('email', 'Please provide a valid email address').isEmail(),
    body('password', 'Password must be at least 3 characters long').isLength({ min: 3 }),
    body('number', 'Phone number must be exactly 10 digits').isLength({ min: 10, max: 10 }),
    body('gender', 'Gender is required and must be either "male" or "female"').isIn(['male', 'female']),
];

const VerifyValidator = [
    body('otp', 'OTP must not be empty and must be a numeric value').notEmpty().isNumeric(),
];

const LoginValidator = [
    body('email', 'Please provide a valid email').isEmail().notEmpty(),
    body('password', 'Password must be at least 3 characters long').notEmpty(),
];

const ResendOtpValidator = [
    body('email', 'Please provide a valid email address').isEmail(),
];

module.exports = {
    RegisterValidator: [...RegisterValidator, ErrorValidator],
    VerifyValidator: [...VerifyValidator, ErrorValidator],
    LoginValidator: [...LoginValidator, ErrorValidator],
    ResendOtpValidator: [...ResendOtpValidator, ErrorValidator],
};
