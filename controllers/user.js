const User = require('../models/user')
const users = {}

users.showRegisterPage = (req, res, next) => {
    res.render(`users/register`)
}

users.registerAUser = async(req, res, next) => {
    const { username, password, email } = req.body
    const newUser = new User({ email, username})
    const userWithPassword = await User.register(newUser, password)
    req.login(userWithPassword, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome!')
        res.redirect('/campgrounds')
    })
}

users.showLoginPage = (req, res, next) => {
    res.render(`users/login`)
}

users.logAUserIn = (req, res) => {
    req.flash('success', 'Welcome!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

users.logOut = (req, res, next) => {
    req.logout( function(err) {
        if(err){
            return next(err)
        }
        req.flash('success', 'Bye! See you again')
        res.redirect('/campgrounds')
    })
}

module.exports = users
