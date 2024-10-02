const router = require('express').Router();

const UserRoute = require('./userRoute')
const postRoute = require('./postRoute')
const PeopleRoute = require('./peopleRoute')

router.use('/user',UserRoute)
router.use('/post',postRoute)
router.use('/people',PeopleRoute)

module.exports = router