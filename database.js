const mongoose = require('mongoose')
require('dotenv').config()
const uri = process.env.MONGO_URI

const MongDB = async () => {
    try {
        await mongoose.connect(uri)
        console.log("Connected to MongDB")

    } catch (error) {
        console.log("connection failed")
        console.log(error)
        process.exit(1)
    }
}

module.exports = MongDB