const router = require('express').Router();
const UserController = require('../Controller/UserController');
const Authentication = require('../middleware/Authantication');
const { FileUploadUserMiddleware } = require('../middleware/FileUploadMiddleware');
const {
    RegisterValidator,
    VerifyValidator,
    LoginValidator,
    ResendOtpValidator,
} = require('../validation/UserValidater');

router.post('/register', RegisterValidator, UserController.CreateUser);
router.post('/login', LoginValidator, UserController.LoginUser);
router.post('/verify', VerifyValidator, UserController.VerifyUser);
router.post('/resend', ResendOtpValidator, UserController.ResendOtp);
router.get('/userdata', Authentication, UserController.UserData);
router.post('/update', Authentication, FileUploadUserMiddleware, UserController.UpdateUser);
router.post('/search', Authentication, UserController.SearchUser);
router.get('/list', Authentication, UserController.FollowFollowingUser);
router.post('/userprofile', Authentication, UserController.UserProfiledata);
router.post('/friendprofile', Authentication, UserController.FriendProfile);
router.get('/profileimage/:image', UserController.ProfileImage);

module.exports = router;
