const mongoose = require('mongoose')


const OtpSchema = mongoose.Schema({
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
    
    
},{
    collection: 'users'
})

const model = mongoose.model('OtpSchema', OtpSchema)

module.exports = model