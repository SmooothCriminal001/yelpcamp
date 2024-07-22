const express = require('express')
const router = express.Router({mergeParams: true})
const passport = require('passport')
const users = require('../controllers/user')

router.route('/register')
    .get(users.showRegisterPage)
    .post(users.registerAUser)

router.route('/login')
    .get(users.showLoginPage)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }),
        users.logAUserIn
    )

router.get('/logout', users.logOut)

module.exports = router