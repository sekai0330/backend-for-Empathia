const mongoose = require('mongoose')

const Schema = mongoose.Schema 

const userDataSchema = new Schema({
    id: {
        type: String,
    },
    scores: {
        type: Number,
    },
    transcript: {
        type: String,
    },
    user_id: {
        type: String,
        required: true
    },
    feedback: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('UserData', userDataSchema) 