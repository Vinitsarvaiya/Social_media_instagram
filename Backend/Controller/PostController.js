const { Post, User, People } = require('../models');
const { validationResult } = require("express-validator");
const { model } = require('mongoose');
const path = require('path');
const { where } = require('sequelize');
const { unlink } = require('fs').promises;

const CreatePost = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.user;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, message: "Invalid input", errors: errors.array() });
    }

    try {
        let imageName = null;
        if (req.file) {
            imageName = req.file.filename;
        }

        const post = await Post.create({ title, description, image: imageName, user_id: id });
        res.status(201).json({post:post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error has come" });
    }
};

const DeletePost = async (req, res) => {
    const { id: user_id } = req.user;
    const { id } = req.body;

    try {
        const post = await Post.findOne({ where: { id, user_id } });
        if (!post) {
            return res.status(404).json({ message: "User post not found" });
        }

        if (post.image) {
            const filePath = path.join(__dirname, '../Public/Post/', post.image);
            await unlink(filePath);
        }

        await post.destroy();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};

const FindUserPost = async (req, res) => {
    const { id } = req.user;

    try {
        const post = await Post.findAll({
            where: { user_id: id },
            attributes: { exclude: ["createdAt", "updatedAt", "user_id"] }
        });

        if (!post.length) {
            return res.json({ message: "No posts available" });
        }

        res.json({ message: "All user posts", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user posts" });
    }
};

const FindUserPostByID = async (req, res) => {
    const { id } = req.body;

    try {
        const post = await Post.findAll({
            where: { user_id: id },
            attributes: { exclude: ["createdAt", "updatedAt", "user_id"] }
        });

        if (!post.length) {
            return res.json({ message: "No posts available" });
        }

        res.json({ message: "All user posts", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user posts" });
    }
};

const FindFriendPost = async (req, res) => {
    const { id } = req.user;

    try {
        const posts = await Post.findAll({
            attributes:{exclude:["createdAt", "updatedAt"]},
            include:{
                model:User,
                as:"user",
                attributes:{exclude:["createdAt", "updatedAt","verify","email","password","number","gender"]},
                include:{
                    model: People,
                    as: "following",
                    where:{sender_id:id,status:"accepted"},
                    attributes:{exclude:["createdAt", "updatedAt"]},
                }
            }
        })
        if (!posts.length) {
            return res.json({ message: "No posts available" });
        }

        res.json({ message: "All friend posts", posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching friend posts" });
    }
};

const PostImage = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOne({ where: { id } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const filePath = path.join(__dirname, `../Public/Post/${post.image}`);
        return res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the post image" });
    }
};

module.exports = {
    CreatePost,
    FindUserPost,
    FindFriendPost,
    PostImage,
    DeletePost,
    FindUserPostByID
};
