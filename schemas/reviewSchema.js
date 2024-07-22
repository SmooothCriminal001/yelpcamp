const joi = require("./schemaUtil")

const reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required().escapeHTML(),
        rating: joi.number().min(1).max(5).required()
    }).required()
})

module.exports = reviewSchema