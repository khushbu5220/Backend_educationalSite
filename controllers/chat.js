//.........................ALL Imports............................
const express = require("express");
const db = require('../model/chat');
require('dotenv').config()
var _ = require('lodash');


//....................ALL Message Page Routes.......................


// general message apis
// exports.addStarred = async (req, res) => {
//     try {
//         const { threadId, messageId } = req.body
//         if (!threadId || !messageId) {
//             res.status(400).json({ error: "Fields are missing.!" })
//         } else {
//             //check pre existing
//             checkPre = await db.user.findOne({ _id: req.userData.userId, starredMessages: { $elemMatch: { messageId: messageId } } }, 'starredMessages')
//             if (checkPre) {
//                 res.status(400).json({ error: "Already starred", added: false })
//             } else {
//                 checkThread = await db.chatthread.findOne({ _id: threadId, chatUsers: { $in: req.userData.userId }, messages: { $elemMatch: { "_id": messageId } } })
//                 if (checkThread) {
//                     // update to user profile
//                     const starredMessage = {
//                         threadId: threadId,
//                         messageId, messageId
//                     }
//                     updateUser = await db.user.updateOne({ _id: req.userData.userId }, { $push: { starredMessages: starredMessage } })
//                     res.status(200).json({ updateUser, added: true })
//                 } else {
//                     res.status(400).json({ error: "Something went wrong", added: false })
//                 }
//             }
//         }
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }

// exports.removeStarred = async (req, res) => {
//     try {
//         const { messageId } = req.body

//         const removeStarred = await db.user.updateOne({ _id: req.userData.userId }, { $pull: { starredMessages: { messageId: messageId } } })

//         res.status(200).json({ removed: true })
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }

// exports.starredMessages = async (req, res) => {
//     try {
//         const { } = req.body

//         starredMessage = await db.user.findById({ _id: req.userData.userId }, 'starredMessages')
//         res.status(200).json(starredMessage.starredMessages)
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }

// message request apis

exports.chatThread = async (req, res) => {
    try {
        const { } = req.body

        const thread = await db.findById({ _id: req.userData.userId }, 'chatThreads -_id')
            .populate('chatThreads')

        res.status(200).json(thread.chatThreads)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.activeChats = async (req, res) => {
    try {
        const { } = req.body

        // previous user data 
        const userD = await db.user.findById({ _id: req.userData.userId }, 'following')

        // updated active user lists 

        const updateActiveChats = await db.user.findByIdAndUpdate({ _id: req.userData.userId }, {
            $addToSet: {
                activeChats: userD.following
            }
        }, {
            "fields": { "activeChats": 1 },
            new: true
        })

        res.status(200).json(updateActiveChats)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.messageReq = async (req, res) => {
    try {
        // handle 2nd message in it 
        const { userTo, message, type } = req.body
        if (!userTo || !message) {
            res.status(400).json({ error: "fields are missing" })
        }
        else {
            // check if thread exist by two user 


            //check for active chat if pre existing
            check = await db.user.findById({ _id: req.userData.userId }, 'activeChats -_id')
            if (check.activeChats.includes(userTo)) {
                res.status(200).json({ alreadyExists: true })

            } else {
                //create messagethread and create message and add thread id to both user 
                const thread = {
                    chatType: "single",
                    chatUsers: [req.userData.userId, userTo],
                    messages: [{
                        message: message,
                        type: "TEXT",
                        byUser: req.userData.userId
                    }],
                    messageRequest: true
                }
                // thread.chatUser.push(req.userData.userId).push(userTo)
                const id = "5fda281353aa4eb868c2f111" //fake

                const createThread = await db.chatthread.findByIdAndUpdate(id, {
                    $set: thread
                }, {
                    upsert: true,
                    new: true
                })

                //adding threadId to both userThreads
                addToSelf = await db.user.updateOne({ _id: req.userData.userId }, {
                    $addToSet: {
                        chatThreads: createThread._id
                    }
                })
                addToReceiver = await db.user.updateOne({ _id: userTo }, {
                    $addToSet: {
                        chatThreads: createThread._id
                    }
                })

                res.status(200).json({
                    thread: createThread,
                    reqSent: true
                })

            }

        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.acceptMessageReq = async (req, res) => {
    try {
        const { accept, threadId } = req.body
        // do work with threadId

        if (accept) {
            thread = await db.chatthread.findOne({ _id: threadId, chatUsers: { $in: req.userData.userId } })
            if (thread) {

                // add on active user to both users schema
                //self
                const addToActiveUsersSelf = await db.user.updateOne({ _id: req.userData.userId }, {
                    $addToSet: {
                        activeChats: req.userData.userId
                    }
                })
                const otherUser = thread.chatUsers

                otherUser.pull(req.userData.userId)

                //other user
                const addToActiveUsersOther = await db.user.updateOne({ _id: otherUser[0] }, {
                    $addToSet: {
                        activeChats: otherUser[0]
                    }
                })
                //req delete from thread schema 
                const updateThread = await db.chatthread.updateOne({ _id: thread._id }, { $set: { messageRequest: false } })

                res.status(200).json({
                    accepted: true
                })
            }
            else {
                res.status(400).json({ message: "Thread not found" })
            }

        } else {
            res.status(200).json({ accpted: false })
        }


    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const { threadId, message, forwarded, deleted } = req.body

        if (!message) {
            res.status(400).json({ error: "Message is required." })
        }
        else {
            //checkthread
            checkThread = await db.chatthread.findOne({ _id: threadId, chatUsers: { $in: req.userData.userId } })
            if (checkThread) {

                //add message to thread
                messageData = {
                    message: message,
                    forwarded: forwarded,
                    deleted: deleted
                }

                addMessage = await db.chatthread.findByIdAndUpdate({ _id: threadId }, { $push: { messages: messageData } }, { new: true })
                res.status(200).json(addMessage)

            } else {
                res.status(400).json({ error: "ChatThread not found." })
            }
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const { threadId, messageId } = req.body
        if (!threadId || !messageId) {
            return res.status(400).json({ error: "Enter required field" });
        }
        else {
            updateThread = await db.chatthread.findOneAndUpdate({
                _id: threadId,
                chatUsers: { $in: req.userData.userId },
                "messages._id": messageId,
                "messages.byUser": req.userData.userId
            }, {
                $set: {
                    "messages.$.deleted": true,
                    "messages.$.message": ""
                }
            }, { new: true })
            res.status(200).json(updateThread)
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.messages = async (req, res) => {
    try {
        const { threadId, page } = req.body

        const messageList = await db.chatthread.findOne({
            _id: threadId,
            chatUsers: { $in: req.userData.userId },
        })

        const start = (page - 1) * 30
        const end = page * 30 - 1

        res.status(200).json(messageList.messages)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.createGroup = async (req, res) => {
    try {
        const { groupName, description, users } = req.body
        users.push(req.userData.userId)
        const uniqueUsers = users.filter((v, i, a) => a.indexOf(v) === i);

        if (!groupName || !users) {
            res.status(400).json({ error: "Enter required fields" })
        }
        else if (uniqueUsers.length < 2) {
            res.status(400).json({ error: "Minimum 2 users required.!" })
        }
        else {

            group = {
                chatType: "group",
                chatUsers: uniqueUsers,
                groupName: groupName,
                groupAdmins: [req.userData.userId],
                groupCreator: req.userData.userId,
                groupDescription: description,
                messages: []
            }
            createGroup = await db.chatthread.create(group)
            // add thread to all users



            res.status(200).json(createGroup)
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupEdit = async (req, res) => {
    try {
        const { threadId, groupName, groupDescription } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupDelete = async (req, res) => {
    try {
        const { threadId } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupAddMember = async (req, res) => {
    try {
        const { threadId, userId } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupRemoveMember = async (req, res) => {
    try {
        const { threadId, userId } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupMakeAdmin = async (req, res) => {
    try {
        const { threadId, userId } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupRemoveAdmin = async (req, res) => {
    try {
        const { threadId, userId } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.groupLeave = async (req, res) => {
    try {
        const { threadId } = req.body


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}




































































































// previous made apis

exports.contacts = async (req, res) => {
    try {
        var result = await db.user.findById({
            _id: req.userData.userId
        }).populate('following', 'name username profilePic')
        res.status(200).json(result.following)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.messageTo = async (req, res) => {
    try {
        const { userTo, message, chatRoomId } = req.body

        checkUser = await db.user.findById({ _id: req.userData.userId }, 'chatByUser')
        if (checkUser.chatByUser.includes(userTo)) {
            // create and send msg to user 
            chatMessage = {
                chatRoomId: chatRoomId,
                message: message,
                type: 'TEXT',
                byUser: req.userData.userId
            }

            createmessage = await db.chatmessages.create(chatMessage)

            global.io.sockets.in(chatRoomId).emit('new message', { message: chatMessage });

            return res.status(200).json({
                message: createmessage,
                newRoom: false

            })

        }
        else {
            chatroom = {
                chatType: "single",
                chatUsers: [userTo, req.userData.userId]
            }
            //create this chatroom
            createChatroom = await db.chatroom.create(chatroom)




            //add to user chatByUser array and chatroomid to user data 

            addToSelfUser = await db.user.updateOne({ _id: req.userData.userId }, {
                $addToSet: {
                    chatRooms: createChatroom._id,
                    chatByUser: userTo
                }
            })

            // 2nd user
            addTo2ndUser = await db.user.updateOne({ _id: userTo }, {
                $addToSet: {
                    chatRooms: createChatroom._id,
                    chatByUser: req.userData.userId
                }
            })

            //create message and add to that chatroom 

            chatMessage = {
                chatRoomId: createChatroom._id,
                message: message,
                type: 'TEXT',
                byUser: req.userData.userId
            }

            createmessage = await db.chatmessages.create(chatMessage)

            global.io.sockets.in(createChatroom._id).emit('new message', { message: chatMessage });

            return res.status(200).json({
                message: createmessage,
                newRoom: true

            })

        }



    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.chatrooms = async (req, res) => {
    try {
        chatRooms = await db.user.findOne({ _id: req.userData.userId }, 'chatRooms')
            .populate('chatRooms')

        return res.status(200).json(chatRooms)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.chatroomMessages = async (req, res) => {
    try {
        const { chatRoomId } = req.body
        chatMessages = await db.chatmessages.find({ chatRoomId: chatRoomId })


        return res.status(200).json(chatMessages)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
