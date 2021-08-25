const mongoose = require('mongoose')



const ParentSchema = mongoose.Schema({
    username: {
        type: String
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
    profile: {
        type: String
    }
},{
    collection: 'parents'
})

const Parent = mongoose.model('ParentSchema', ParentSchema)

module.exports = Parent