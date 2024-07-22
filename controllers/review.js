const Review = require('../models/review')
const Campground = require('../models/campground')

const reviews = {}

reviews.createAReview = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review({ ...req.body.review, author: req.user._id })
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${id}`)
}

reviews.deleteAReview = async(req, res, next) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports = reviews