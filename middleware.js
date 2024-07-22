const Campground = require('./models/campground');
const Review = require('./models/review');
const validationSchema = require('./schemas/campgroundSchema')
const reviewSchema = require('./schemas/reviewSchema')
const { AppError } = require('./utils')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first to access this page')
        return res.redirect('/login')
    }
    next()
}

module.exports.isCampgroundThereAndOwned = async(req, res, next) => {
    const { id } = req.params

    if(!id){
        return next()
    }

    const thisCampground = await Campground.findById(id).populate('author')

    if(!thisCampground){
        req.flash('error', 'No campground found!')
        return res.redirect(`/campgrounds/${id}`)
    }

    if(!thisCampground.author.equals(req.user)){
        req.flash('error', 'You do not have permission for this operation!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = validationSchema.validate(req.body)

    if(error){
        const msg = error.details.map( err => err.message ).join(', ')
        throw new AppError(400, msg)
    }
    else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if(error){
        const msg = error.details.map( err => err.message ).join(', ')
        throw new AppError(400, msg)
    }
    else{
        next()
    }
}

module.exports.isReviewOwned = async(req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId).populate({
            path: "author",
        })

    if(!review.author.equals(req.user)){
        req.flash('error', 'You do not have permission to perform this action!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}