const express = require('express')
const router = express.Router({mergeParams: true})
const { AppError, handleAsync } = require('../utils')
const { validateReview, isLoggedIn, isReviewOwned } = require('../middleware')
const reviews = require('../controllers/review')

router.post('/', isLoggedIn, validateReview, handleAsync(reviews.createAReview))

router.delete('/:reviewId', isLoggedIn, isReviewOwned, handleAsync(reviews.deleteAReview))

module.exports = router