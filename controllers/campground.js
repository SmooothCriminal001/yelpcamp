const Campground = require('../models/campground')
const campgrounds = {}
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN

const geoCoder = mbxGeocoding({
    accessToken: mapBoxToken
})

campgrounds.showAllCampgrounds = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render(`campgrounds/index`, { campgrounds })
}

campgrounds.showNewCampgroundForm = (req, res) => {
    res.render(`campgrounds/new`)
}

campgrounds.showACampgroundDetails = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author"}
        }).populate({
            path: "author",
        })

    if(!campground){
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render(`campgrounds/show`, { campground })
}

campgrounds.createACampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const { campground } = req.body
    campground.geometry = geoData.body.features[0].geometry
    const newCampground = await new Campground(
        {
            ...campground, 
            author: req.user._id,
            images: req.files.map(eachImage => ( {url: eachImage.path, name: eachImage.filename} ))
        }).save()
    console.log(campground);
    req.flash('success', "Campground created successfully!")
    res.redirect(`/campgrounds/${newCampground.id}`)
}

campgrounds.showCampgroundEditForm = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render(`campgrounds/edit`, { campground })
}

campgrounds.editACampground = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(
        id, 
        req.body.campground, 
        {new: true, runValidators: true}
    )
    campground.images.push(...req.files.map(eachImage => ({ url: eachImage.path, name: eachImage.filename})))
    await campground.save()
    
    if(req.body.imagesToDelete){
        for(const filename of req.body.imagesToDelete){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: {name: { $in: req.body.imagesToDelete }}  } })
    }
    
    req.flash('success', 'Campground updated successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
}

campgrounds.deleteACampground = async(req, res, next) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted successfully!')
    res.redirect(`/campgrounds`)
}

module.exports = campgrounds