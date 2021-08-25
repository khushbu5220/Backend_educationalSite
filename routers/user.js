const express = require("express");
const router = new express.Router();

const { ok } = require("assert");
const { validate } = require("../model/user");
const checkAuth = require("../middleware/check-auth");
const profiles = require("./../middleware/userImg");
const UsersController = require("../controllers/user");

router.post("/user/register", UsersController.users_post_register);

router.get("/user/getdetails", checkAuth, UsersController.loggedinUser_getallDetails);

router.get("/user/:id", UsersController.user_get_details);                                        // id

router.post("/user/register", UsersController.verifyEmail);

router.post("/user/login", UsersController.users_post_login);                                     // email, password

router.post("/user/profile", checkAuth, profiles.profile, UsersController.users_post_profile);

// router.post("/user/profile", checkAuth, UsersController.users_post_checkAuth);

router.post("/user/change-password", checkAuth, UsersController.users_post_changePassword);

router.post("/user/followmentor", checkAuth, UsersController.follow_mentor);

router.post("/user/unfollowmentor", checkAuth, UsersController.unfollow_mentor);

router.post("/user/followings", checkAuth, UsersController.followings);

router.patch("/user/updateEmail", checkAuth, UsersController.user_patch_email);

module.exports = router;
