const mongoose = require('mongoose');
var Schema = mongoose.Schema;



const readByRecipientSchema = new mongoose.Schema({
    _id: false,
    readByUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    readAt: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: false })


const Message = new Schema({
    message: {
        type: Schema.Types.Mixed
    },
    type: {
        type: String,
        enum: ['TEXT', 'PIC'],
        default: 'TEXT'
    },
    byUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replyMessageId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatThread.Message'
    },
    forwarded: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    readByRecipients: [readByRecipientSchema],
}, {timestamps: true})

// var chatMessage = mongoose.model('Message', Message)


const ChatThreadSchema = new mongoose.Schema({

    chatType: {
        type: String,
        enum: ['single', 'group'],
        default: 'single',
        required: true,
    },
    chatUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    messages: [Message],
    //group
    groupName: {
        type: String,
    },
    groupCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupAdmins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    groupDescription: {
        type: String,
    },
    messageRequest:{
        type: Boolean,
        default: true
    }


}, { timestamps: true })
var ChatThread = mongoose.model('ChatThread', ChatThreadSchema)
module.exports = ChatThread;