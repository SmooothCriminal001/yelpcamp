const express = require('express')
const router = express.Router({mergeParams: true})
const multer = require('multer')
const { handleAsync } = require('../utils')
const { isLoggedIn: loginCheck, isCampgroundThereAndOwned, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campground')
const { storage } = require('../cloudinary')

const upload = multer({ storage })
//const upload = multer({ dest: 'uploads/' })


router.route('/')
    .get(handleAsync(campgrounds.showAllCampgrounds))
    .post(loginCheck, upload.array('images'), validateCampground, handleAsync(campgrounds.createACampground))

router.get('/new', loginCheck, campgrounds.showNewCampgroundForm)

router.route('/:id')
    .get(handleAsync(campgrounds.showACampgroundDetails))
    .put(loginCheck, isCampgroundThereAndOwned, upload.array('images'), validateCampground, handleAsync(campgrounds.editACampground))
    .delete(loginCheck, isCampgroundThereAndOwned, handleAsync(campgrounds.deleteACampground))

router.get('/:id/edit', loginCheck, isCampgroundThereAndOwned, handleAsync(campgrounds.showCampgroundEditForm))

module.exports = router