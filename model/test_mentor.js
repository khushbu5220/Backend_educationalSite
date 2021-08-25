const mongoose = require('mongoose')


const test = mongoose.Schema({
    question: {
        type: String,
        unique: true
    },
    image: {
        type: String
    },
    option: [{
        option1: {
            type: String
        },
        option2: {
            type: String
        },
        option3: {
            type: String
        },
        option4:{
            type: String
        }
    }],
    answer: {
        type: String
    }
})



const Test_mentorSchema = mongoose.Schema({
    subject: {
        type: String,
    },
    test: [test]
},{
    collection: 'test_mentor'
})

const model = mongoose.model('test_mentorSchema', Test_mentorSchema)

module.exports = model