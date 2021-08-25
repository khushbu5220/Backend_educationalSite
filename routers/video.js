const express = require("express");
const router = new express.Router();

const { ok } = require("assert");
const { validate } = require("../model/video");
const checkAuth = require("../middleware/check-auth");
const VideosController = require("../controllers/video");
// const profiles = require("./../middleware/profile");
const videos = require("./../middleware/video");



router.post("/videos", checkAuth, videos.videoUpload , VideosController.mentors_post_videos);

router.get("/allvideos", VideosController.mentors_get_videos);

router.get("/myvideos/:postedBy", VideosController.my_videos);

router.delete("/video/:_id", VideosController.mentors_delete_video);


module.exports = router;
