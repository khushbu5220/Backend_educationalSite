const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    email:{
        type: String,
        unique:[true, "Email is already present"],
    },
    phone: {
        type:Number,
        unique: [true, "Phone no. is already present"]
    },
    parent_phone: {
        type: String
    },
    address:{
        type: String
    },
    password: {
        type: String
    },
    exam: {
        type: String
    },
    profile: {
        type: String,
        default: "/userImg/default.png"
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'Mentor',
    }],
},{
    collection: 'users'
})

const User = mongoose.model('UserSchema', UserSchema)

module.exports = User 