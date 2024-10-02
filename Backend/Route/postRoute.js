const router = require('express').Router();
const UserController = require('../Controller/UserController')
const PostController = require('../Controller/PostController')
const {FileUploadMiddleware} = require('../middleware/FileUploadMiddleware')
const Authantication = require('../middleware/Authantication')
const {CreatePostValidator} = require('../validation/PostValidater')

router.post('/create',Authantication,FileUploadMiddleware,CreatePostValidator,PostController.CreatePost)
router.post('/delete',Authantication,PostController.DeletePost)
router.get('/userpost',Authantication,PostController.FindUserPost)
router.post('/userpostid',Authantication,PostController.FindUserPostByID)
router.post('/Followingpost',Authantication,PostController.FindFriendPost)
router.get('/postimage/:id',PostController.PostImage)

module.exports = router