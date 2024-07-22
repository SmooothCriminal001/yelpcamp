const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    name: String
})

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    images: [ ImageSchema ],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
})

ImageSchema.virtual('thumbNailUrl').
  get(function() { return this.url?.replace('/upload', '/upload/h_200,w_200') })

campgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground){
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)