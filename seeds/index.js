const cities = require("./cities")
const { descriptors, places} = require('./seedHelpers')
const Campground = require('../models/campground')
const User = require('../models/user')

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on("error", console.error.bind(console, `Error during yelp-camp database creation:`))
db.once("open", () => {
    console.log("Database Connected")
})

const sample = array => array[(Math.floor(Math.random() * array.length))]

const seedDB = async() => {
    await Campground.deleteMany({})

    const potterUser = await User.findOne( { username: "harrypotter"} )
    console.log(potterUser);

    for(let i = 0; i < 50; i++){
        const randomCity = cities[(Math.floor(Math.random() * cities.length))]
        const price = Math.floor(Math.random() * 20) + 10;
        const newCamp = new Campground({
            location: `${randomCity.city}, ${randomCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dhggz5sgx/image/upload/v1707384749/Yelpcamp/hajff4s3jo3jjmdmpv1q.jpg',
                    name: 'Default'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur suscipit quisquam inventore accusantium, ipsa architecto fugiat esse tenetur. Adipisci nulla repudiandae possimus minima et architecto assumenda vel, nobis unde aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur suscipit quisquam inventore accusantium, ipsa architecto fugiat esse tenetur. Adipisci nulla repudiandae possimus minima et architecto assumenda vel, nobis unde aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur suscipit quisquam inventore accusantium, ipsa architecto fugiat esse tenetur. Adipisci nulla repudiandae possimus minima et architecto assumenda vel, nobis unde aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur suscipit quisquam inventore accusantium, ipsa architecto fugiat esse tenetur. Adipisci nulla repudiandae possimus minima et architecto assumenda vel, nobis unde aspernatur.',
            price: price,
            geometry: { type: 'Point', coordinates: [ 78.114098, 9.926115 ] },
            author: potterUser._id
        })

        await newCamp.save()
    }

    console.log(`Sample data created`);
}

seedDB()
.then(() => {
    db.close()
    .then(() => {
        console.log(`Connection closed`);
    })
}).catch(error => {
    console.log(`Error during seeding: ${error.message}`);
})
