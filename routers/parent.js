const express = require("express");
const router = new express.Router();

const { ok } = require("assert");
const { validate } = require("../model/parent");
const checkAuth = require("../middleware/check-auth");
// const profiles = require("./../middleware/userImg");
const ParentsController = require("../controllers/parent");

router.post("/parent/register", ParentsController.Parents_post_register);

router.get("/parent/getdetails", checkAuth, ParentsController.loggedinParent_getallDetails);

router.post("/parent/login", ParentsController.Parents_post_login);                                     // email, password

router.post("/parent/profile", checkAuth, 
// profiles.profile, 
ParentsController.Parents_post_profile);

router.post("/parent/change-password", checkAuth, ParentsController.Parents_post_changePassword);


module.exports = router;
