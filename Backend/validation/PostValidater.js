const { body } = require('express-validator');
const ErrorValidator = require("../Util/ValidatorError");

const CreatePostValidator = [
    body('title')
        .notEmpty().withMessage('Title is required'),
    
    body('description')
        .notEmpty().withMessage('Description is required'),
    
    

    ErrorValidator
];

module.exports = { CreatePostValidator };

