const joi = require("./schemaUtil")

module.exports = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().min(0).max(50).required(),
        location: joi.string().required().escapeHTML(),
        //image: joi.string().required(),
        description: joi.string().required().escapeHTML()
    }).required(),
    imagesToDelete: joi.array()
})