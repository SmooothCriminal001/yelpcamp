if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const path = require("path")
const express = require("express")
const app = express()
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const User = require('./models/user')
const expMongoSanitize = require('express-mongo-sanitize')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const userRoute = require('./routes/user')
const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/review')
const helmet = require('helmet')

const mongoUrl = process.env.MONGO_URL
const secret = process.env.SECRET

app.use(methodOverride('_method'))
app.use(expMongoSanitize())

const store = MongoStore.create({
    mongoUrl: mongoUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisShouldBeABetterSecret'
    }
});

store.on("error", function(e){
    console.log("Session store error!", e)
})

const sessionSettings = { 
    name: 'campgroundStuff',
    store,
    secret: secret, 
    resave: false, 
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7),
        httpOnly: true
    }
}

app.use(session(sessionSettings))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

mongoose.connect(mongoUrl)
.then(() => {
    console.log(`Database connected`);
})
.catch((err) => {
    console.log(`Error during yelp-camp database creation: ${err.message}`)
})

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(helmet({
    contentSecurityPolicy: false
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate)

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.successFlash = req.flash('success')
    res.locals.errorFlash = req.flash('error')
    next()
})

/* Printing request info for checking express-mongo-sanitize. It should remove '$' and '.' in incoming request
app.use((req, res, next) => {
    console.log('Params:', req.params)
    console.log('Queries: ', req.query)
    console.log('Body: ', req.body)
    next()
})
*/

app.get('/', (req, res, next) => {
    res.redirect("/campgrounds")
})


app.use('/', userRoute)
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)

app.listen(2200, () => {
    console.log("Connection established at: http://localhost:2200/")
})

app.use((err, req, res, next) => {
    const {status = 500} = err
    if(!err.message){
        err.message = "Something went wrong!"
    }
    res.status(status).render(`error`, { err })
})
