const router = require('express').Router();
const UserController = require('../Controller/UserController')
const PostController = require('../Controller/PostController')
const {FileUploadMiddleware} = require('../middleware/FileUploadMiddleware')
const Authantication = require('../middleware/Authantication')
const PeopleController = require('../Controller/PeopleController')

router.post('/request',Authantication,PeopleController.Followingrequest)
router.post('/accepted',Authantication,PeopleController.AcceptedRequest)
router.post('/rejected',Authantication,PeopleController.RejectedRequest)
router.post('/unfollow',Authantication,PeopleController.unfollowRequest)


module.exports = router