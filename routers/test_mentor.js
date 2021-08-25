const express = require("express")
const router = new express.Router();
const uploader = require('./../middleware/upload')

const checkAuth = require('../middleware/check-auth');

const Mentor_TestController = require('../controllers/test_mentor');


router.post('/mentor_test',checkAuth, uploader.image, Mentor_TestController.mentors_post_test);

router.get('/mentor_test', Mentor_TestController.mentors_get_api);

router.get('/mentor_test/:subject', Mentor_TestController.mentors_get_test);

router.patch("/mentor_test/:subject", Mentor_TestController.mentors_patch_test);

router.delete("/mentor_test/:subject", Mentor_TestController.mentors_delete_test);

module.exports = router;