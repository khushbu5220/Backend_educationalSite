const express = require("express");
const router = new express.Router();

const { ok } = require("assert");
const { validate } = require("../model/chat");
const checkAuth = require("../middleware/check-auth");
const message_controller = require("../controllers/chat");


//personal
//Message Request apis
// in this all apis chattype needed
router.post('/chatthreads', checkAuth, message_controller.chatThread);              // (to give chat lists with last message in it with time sorted)     //nothing
router.post('/activechats', checkAuth, message_controller.activeChats);            // to give all active chats ids with users( to check where is message is active or not)
//nothing
router.post('/chatmessagereq', checkAuth, message_controller.messageReq);        //if not(then send message request) ( not seen by receiver)(you dont have ThreadId)
// userTo, message, type(not needed now)
router.post('/messagereq/accept', checkAuth, message_controller.acceptMessageReq);    //accept(boolean), userId
//message sending
router.post('/sendmessage', checkAuth, message_controller.sendMessage);             // only threadId needed and message content  //message, forwarded(bool), deleted(bool)
router.post('/message/delete', checkAuth, message_controller.deleteMessage)        //  threadId, messageId
router.post('/messages', checkAuth, message_controller.messages);                 // messages(20) with pagination threadid is needed  //threadId, page


//group
//chat ype need(group)
router.post('/group/create', checkAuth, message_controller.createGroup);        // memebers to add, minimum in group(2) //threadId, groupName, description, users(array)
//all api work on thread
router.post('/group/edit', checkAuth, message_controller.groupEdit);                             //threadId, groupName, groupDescription
router.post('/group/delete', checkAuth, message_controller.groupDelete);                        //threadId
router.post('/group/member/add', checkAuth, message_controller.groupAddMember);                //threadId, userId
router.post('/group/member/remove', checkAuth, message_controller.groupRemoveMember);         //threadId, userId
router.post('/group/admin/add', checkAuth, message_controller.groupMakeAdmin);               //threadId, userId
router.post('/group/admin/remove', checkAuth, message_controller.groupRemoveAdmin);         //threadId, userId
router.post('/group/leave', checkAuth, message_controller.groupLeave);                     //threadId

module.exports = router;