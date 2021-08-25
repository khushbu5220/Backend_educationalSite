const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../model/user");

const JWT_SECRET = process.env.JWT_KEY;
const Mentor = require("../model/mentor");

// const { response } = require("express");

// const JWT_SECRET = process.env.JWT_KEY;

exports.users_post_register = async (req, res) => {
  // console.log(req.body)

  // Hashing of password
  const {
    username,
    email,
    phone,
    parent_phone,
    address,
    password: plainTextPassword,
    exam,
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

  if (!parent_phone || typeof phone !== "string") {
    return res.status(400).json({
      message: "Parents phone no. is required",
    });
  }

  if (!address || typeof address !== "string") {
    return res.status(400).json({ message: "Address is required" });
  }

  if (phone.length !== 10) {
    return res.status(400).json({ message: "Wrong phone no." });
  }

  if (parent_phone.length !== 10) {
    return res.status(400).json({ message: "Wrong phone no." });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(400).json({ message: "Password is required" });
  }

  if (plainTextPassword.length < 7) {
    return res.status(400).json({
      message: "Password too small. Should be atleast 8 characters",
    });
  }

  if (!exam || typeof exam !== "string") {
    return res.status(400).json({ message: "Exam is required" });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  // console.log(await bcrypt.hash(password, 10))

  try {
    const response = await User.create({
      username,
      email,
      phone,
      parent_phone,
      address,
      password,
      exam,
    });
    console.log("User created successfully: ", response);
    // const token = jwt.sign(
    //   {
    //     id: response._id,
    //     email: response.email.toString(),
    //   },
    //   JWT_SECRET
    // );
    // console.log(token);
    res.status(201).json({ message: "Successfully signed up" });
    // res.status(200).json({
    //   userId: response._id,
    //   username: response.username,
    //   exam: response.exam,
    //   phone: response.phone,
    //   address: response.address,
    //   parent_phone: response.parent_phone,
    // });
  } catch (error) {
    // console.log(JSON.stringify(error))
    if (error.code === 11000) {
      // duplicate key
      return res.status(401).json({ message: "Invalid email or password" });
    }
    throw error;
  }
};

exports.user_get_details = async (req, res) => {
  try {
    const _id = req.params.id;
    console.log("req_id", _id);
    const userData = await User.findById(_id);

    console.log(userData);

    if (!userData) {
      return res.status(404).send();
    } else {
      res.status(200).json({
        userId: userData._id,
        email: userData.email,
        username: userData.username,
        exam: userData.exam,
        phone: userData.phone,
        parent_phone: userData.parent_phone,
        address: userData.address,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

// This is made only for fetching details again while refreshing
exports.loggedinUser_getallDetails = async (req, res) => {
  console.log("user details requested");
  try {
    const _id = req.userData.id;
    console.log("req_id:", _id);
    const userData = await User.findById(_id);

    console.log(userData);

    if (!userData) {
      return res.status(404).send();
    } else {
      res.status(200).json({
        userId: userData._id,
        email: userData.email,
        username: userData.username,
        exam: userData.exam,
        phone: userData.phone,
        parent_phone: userData.parent_phone,
        address: userData.address,
        profile: userData.profile,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    userData = await db.user.findOne({ mobile: req.userData.mobile });
    if (code == "123456") {
      res.status(200).json({
        emailVerified: "true",
      });
    } else {
      res.status(400).json({
        emailVerified: "false",
        message: "Something went wrong.!",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.users_post_login = async (req, res) => {
  // console.log(req.body)
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email: email }).lean();
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid email/password" });
    }

    if (await bcrypt.compare(password, user.password)) {
      // the username,password combination is successful

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email.toString(),
        },
        JWT_SECRET
      );
      console.log(token);

      return res.status(200).json({
        jwtToken: token,
        userId: user._id,
        email: user.email,
        username: user.username,
        exam: user.exam,
        phone: user.phone,
        parent_phone: user.parent_phone,
        address: user.address,
        profile: user.profile,
      });
    } else {
      res.status(400).json({ message: "Invalid email/password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.users_post_checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      id: req.userData.id,
      email: req.userData.email,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: ";))" });
  }
};

exports.users_post_changePassword = async (req, res) => {
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
    const user = await User.findOne({ _id: _id }).lean();
    if (!user) {
      return res.status(400).json({ message: "Invalid email/password" });
    }
    if (await bcrypt.compare(currentPassword, user.password)) {
      console.log("password verified");
      const password = await bcrypt.hash(plainTextPassword, 10);
      await User.updateOne(
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

  // console.log("JWT decoded: ", User);
  // res.status(200).json({ message: "succesfully updated password" });
};

exports.follow_mentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    console.log(mentorId);
    updateUser = await User.findOneAndUpdate(
      { _id: req.userData.id },
      {
        $addToSet: {
          following: mentorId,
        },
      },
      { new: true }
    ).populate("following", "username email");

    updateMentor = await Mentor.findOneAndUpdate(
      { _id: mentorId },
      {
        $addToSet: {
          follower: req.userData.id,
        },
      }
    );
    res.status(200).json(updateUser.following);
  } catch (e) {
    res.status(500).json({ error: e.message }); 
  }
};

exports.followings = async (req, res) => {
  console.log("requested followings of the user");
  try {
    userData = await User.findOne({ _id: req.userData.id }).populate(
      "following",
      "username email"
    );

    res.status(200).json(userData.following);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.unfollow_mentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    console.log(mentorId);
    deleteUser = await User.findOneAndUpdate(
      { _id: req.userData.id },
      {
        $addToSet: {
          follow: mentorId,
        },
      }
    ).populate("unfollow", "username email");

    deleteMentor = await Mentor.findOneAndUpdate(
      { _id: mentorId },
      {
        $addToSet: {
          follower: req.userData.id,
        },
      }
    );
    res.status(200).json(deleteMentor.unfollow);
  } catch (e) {
    res.status(500).json({ error: e.message }); 
  }
};

exports.unfollow = async (req, res) => {
  console.log("requested unfollow of the user");
  try {
    userData = await User.findOneAndDelete({ _id: req.userData.id }).populate(
      "unfollow",
      "username email"
    );

    res.status(200).json(userData.unfollow);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.user_patch_email = async (req, res) => {
  try {
    const token = req.params.token;
    const updateEmail = await User.findOneAndUpdate(token, req.body, {
      new: true,
    });
    res.send(updateEmail);
  } catch (e) {
    res.status(404).send(e);
    console.log(e);
  }
};

exports.users_post_profile = async (req, res, next) => {
  try {



    path = "/userImg/" + req.file.filename;

    updateProfile = await User.findByIdAndUpdate(
      { _id: req.userData.id },
      { profile: path },
      { new: true }
    );

    res.status(200).json({ profile: updateProfile.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
