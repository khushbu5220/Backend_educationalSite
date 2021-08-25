const express = require("express");
const router = new express.Router();

const { ok } = require("assert");
const { validate } = require("../model/mentor");
const checkAuth = require("../middleware/check-auth");
const MentorsController = require("../controllers/mentor");
const profiles = require("./../middleware/profile");
const documents = require("./../middleware/studyMaterial")


router.post("/mentor/register", MentorsController.mentors_post_register);

// ===================== Added by shijith ========================================

router.get(
  "/mentor/getdetails",
  checkAuth,
  MentorsController.loggedinMentor_getallDetails
);

router.get("/mentor", MentorsController.get_allMentor);

router.post(
  "/mentor/profile",
  checkAuth,
  profiles.profile,
  MentorsController.mentors_post_profile
);

router.post("/mentor/search", MentorsController.mentorFilter);

router.get("/mentor/id/:_id", MentorsController.mentor_get_details);

// router.post('/api/register', MentorsController.verifyEmail);

router.post("/mentor/login", MentorsController.mentors_post_login);

// router.post('/mentor/profile',checkAuth, MentorsController.mentors_post_checkAuth);

router.get('/mentor/exam/:exam', MentorsController.mentor_get_exam);

router.post('/mentor/change-password',checkAuth, MentorsController.mentors_post_changePassword);

router.post("/mentor/studyMaterial", checkAuth, documents.document, MentorsController.studyMaterial)

router.post("/task", checkAuth, MentorsController.post_task);

// router.get("/task", MentorsController.get_task);

module.exports = router;
