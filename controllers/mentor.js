const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Mentor = require("../model/mentor");

const JWT_SECRET = process.env.JWT_KEY;

exports.mentors_post_register = async (req, res) => {
  // console.log(req.body)

  // Hashing of password
  const {
    username,
    email,
    phone,
    address,
    password: plainTextPassword,
    exam,
    subject,
  } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Wrong email" });
  }

  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ message: "Phone no. is required" });
  }

  if (!address || typeof address !== "string") {
    return res.status(400).json({ message: "Address is required" });
  }

  if (phone.length !== 10) {
    return res.status(400).json({ message: "Wrong phone no." });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(400).json({ message: "Password is required" });
  }

  if (plainTextPassword.length < 7) {
    return res
      .status(400)
      .json({ message: "Password too small. Should be atleast 8 characters" });
  }

  if (!exam || typeof exam !== "string") {
    return res.status(400).json({ message: "Exam is required" });
  }

  if (!subject || typeof exam !== "string") {
    return res.status(400).json({ message: "Exam is required" });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  // console.log(await bcrypt.hash(password, 10))

  try {
    const response = await Mentor.create({
      username,
      email,
      phone,
      address,
      password,
      exam,
      subject,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    // console.log(JSON.stringify(error))
    if (error.code === 11000) {
      // duplicate key
      // this error is occured to duplication
      // but we are not sending duplication error message, as it helps some hackers to know that an account exists on this mail id
      return res.status(400).json({ message: "Invalid email or password" });
    }
    throw error;
  }

  res.status(201).json({ message: "Mentor registered successfully" });
};

exports.get_allMentor = async (req, res) => {
  try {
    const data = await Mentor.find();

    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.mentorFilter = async (req, res) => {
  try {
    const { username, subject } = req.body;

    if (username && subject) {
      result = await Mentor.find({ username: username, subject: subject });
    } else if (username) {
      result = await Mentor.find({ username: username });
    } else if (subject) {
      result = await Mentor.find({ subject: subject });
    } else {
      // no filter
      result = await Mentor.find();
    }

    res.status(200).json({
      count: result.length,
      results: result,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.mentor_get_details = async (req, res) => {
  try {
    const _id = req.params._id;
    const data3 = await Mentor.findById({ _id: _id });

    if (!data3) {
      return res.status(404).send(e);
    } else {
      res.status(200).send(data3);
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.mentors_post_login = async (req, res) => {
  // console.log(req.body)
  try {
    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email: email }).lean();

    if (!mentor) {
      return res.status(401).json({ message: "Invalid email/password" });
    }

    if (await bcrypt.compare(password, mentor.password)) {
      // the username,password combination is successful

      const token = jwt.sign(
        {
          id: mentor._id,
          email: mentor.email.toString(),
        },
        JWT_SECRET
      );
      console.log(token);

      return res.status(200).json({
        jwtToken: token,
        userId: mentor._id,
        email: mentor.email,
        username: mentor.username,
        exam: mentor.exam,
        subject: mentor.subject,
        phone: mentor.phone,
        address: mentor.address,
        profile: mentor.profile, //Some changes here too......
        videoData: mentor.videoData, //Some changes here too......
      });
    } else {
      res.status(401).json({ message: "Invalid email/password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// This is made only for fetching details again while refreshing
exports.loggedinMentor_getallDetails = async (req, res) => {
  // console.log("mentor details requested");
  try {
    const _id = req.userData.id;
    // console.log("req_id:", _id);
    const mentorData = await Mentor.findById(_id);

    // console.log(mentorData);

    if (!mentorData) {
      return res.status(404).send();
    } else {
      res.status(200).json({
        userId: mentorData._id,
        email: mentorData.email,
        username: mentorData.username,
        exam: mentorData.exam,
        subject: mentorData.subject,
        phone: mentorData.phone,
        address: mentorData.address,
        profile: mentorData.profile,
        videoData: mentorData.videoData,
        // videoData:[{ video: mentorData.video, topic: mentorData.topic, desc: mentorData.desc, postedBy: mentorData.id }]
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

exports.mentors_post_changePassword = async (req, res) => {
  console.log("password update request recieved");
  // taking data from req body
  const { currentPassword, newPassword: plainTextPassword } = req.body;

  // email is taken from check-auth using token
  const email = req.userData.email;
  const _id = req.userData.id;

  // validating new password
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    console.log("Invalid password");
    return res.status(400).json({ message: "Invalid password" });
  }

  if (plainTextPassword.length < 7) {
    console.log("Password too small. Should be atleast 8 characters");
    return res
      .status(400)
      .json({ message: "Password too small. Should be atleast 8 characters" });
  }

  try {
    // searching for any user with the email given
    const mentor = await Mentor.findOne({ _id: _id }).lean();
    if (!mentor) {
      return res.status(400).json({ message: "Invalid email/password" });
    }
    if (await bcrypt.compare(currentPassword, mentor.password)) {
      console.log("password verified");
      const password = await bcrypt.hash(plainTextPassword, 10);
      await Mentor.updateOne(
        {
          _id,
        },
        {
          $set: { password },
        }
      );
      console.log("password updated");
      res.status(200).json({ message: "succesfully updated password" });
    } else {
      return res.status(400).json({ message: "Invalid email/password" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.mentors_post_profile = async (req, res, next) => {
  console.log("reached profile controller");
  try {
    path = "/profiles/" + req.file.filename;

    updateProfile = await Mentor.findByIdAndUpdate(
      { _id: req.userData.id },
      { profile: path },
      { new: true }
    );

    res.status(200).json({ profile: updateProfile.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.studyMaterial = async (req, res) => {
  try {
    studyMaterial = {
      topic: req.body.topic,
      link: req.body.link,
      document: "/studyMaterial/" + req.file.filename,
    };

    const response = await Mentor.findOneAndUpdate(
      { _id: req.userData.id },
      { $push: { studyMaterial: studyMaterial } },
      { new: true }
    );

    // const response = await Mentor.findOneAndUpdate({ _id: req.userData.id }, { $push: { studyMaterial: studyMaterial }}, { new: true })

    res.status(201).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.mentor_get_exam = async (req, res) => {
  try {
    const exam = req.params.exam;
    const data = await Mentor.find({ exam });

    if (!data) {
      return res.status(404).send(error);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.post_task = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      info: req.body.info,
      mcq: [
        {
          question: req.body.question,
          option: [
            {
              option1: req.body.option1,
              option2: req.body.option2,
              option3: req.body.option3,
              option4: req.body.option4,
            },
          ],
          image: "/images/" + req.file.filename,
          answer: req.body.answer,
        },
      ],

      exercise: [
        {
          ques: req.body.ques,
          quesImg: "/images/" + req.file.filename,
          // ans: req.body.ans,
          // ansImg: "/answers/" + req.file.filename,
        },
      ],
    };

    const response = await Mentor_test.create(data);

    res.status(201).send(response);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.get_task = async (req, res) => {
  try {
    const data = await Mentor.find();
    res.status(200).json(data.reverse());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
