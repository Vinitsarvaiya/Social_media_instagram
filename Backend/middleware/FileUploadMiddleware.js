const express = require('express');
const { unlink } = require('fs').promises;
const multer = require('multer');
const { User } = require('../models');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'Public/Post',
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const FileUploadMiddleware = multer({
    storage: storage
}).single('image');

const Deletefile = async (id) => {
    try {
        const user = await User.findOne({ where: { id } });
        if (!user || !user.image) {
            console.log("no image to delete.");
            return;
        }
        const filePath = path.join(__dirname, '../Public/User/', user.image);
        await unlink(filePath);
        user.image = null;
        await user.save();
    } catch (error) {
        console.log("error deleting file:", error);
    }
};

const storageUser = multer.diskStorage({
    destination: 'Public/User',
    filename: async function (req, file, cb) {
        try {
            const { id } = req.user;

            await Deletefile(id);

            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        } catch (error) {
            console.log("error processing file upload:", error);
            cb(error);
        }
    }
});

const FileUploadUserMiddleware = multer({
    storage: storageUser
}).single('image');

module.exports = { FileUploadUserMiddleware, FileUploadMiddleware };
