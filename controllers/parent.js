const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const Parent = require("../model/parent");
const { response } = require("express");

const JWT_SECRET = process.env.JWT_KEY;


exports.Parents_post_register = async (req, res) => {
  // console.log(req.body)

  // Hashing of password
  const {
    username,
    parent_phone,
    address,
    password: plainTextPassword,
  } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!parent_phone || typeof parent_phone !== "string") {
    return res.status(400).json({
      message: "Parents phone no. is required",
    });
  }

  if (parent_phone.length !== 10) {
    return res.status(400).json({ message: "Wrong phone no." });
  }

  if (!address || typeof address !== "string") {
    return res.status(400).json({ message: "Address is required" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(400).json({ message: "Password is required" });
  }

  if (plainTextPassword.length < 7) {
    return res.status(400).json({
      message: "Password too small. Should be atleast 8 characters",
    });
  }


  const password = await bcrypt.hash(plainTextPassword, 10);

  // console.log(await bcrypt.hash(password, 10))

  try {
    const response = await Parent.create({
      username,
      parent_phone,
      address,
      password
    });
    console.log("Parents account created successfully: ", response);
  
    res.status(201).json({ message: "Successfully signed up" });

  } catch (error) {
    // console.log(JSON.stringify(error))
    if (error.code === 11000) {
      // duplicate key
      return res.status(401).json({ message: "Invalid email or password" });
    }
    throw error;
  }
};

// This is made only for fetching details again while refreshing
exports.loggedinParent_getallDetails = async (req, res) => {
  console.log("user details requested");
  try {
    const _id = req.parentData.id;
    console.log("req_id:", _id);
    const parentData = await User.findById(_id);

    console.log(parentData);

    if (!parentData) {
      return res.status(404).send();
    } else {
      res.status(200).json({
        userId: parentData._id,
        username: parentData.username,
        parent_phone: parentData.parent_phone,
        address: parentData.address,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

exports.Parents_post_login = async (req, res) => {
  // console.log(req.body)
  try {
    const { parent_phone, password } = req.body;
    console.log(req.body);
    const parent = await Parent.findOne({ parent_phone: parent_phone }).lean();
    console.log(parent);
    if (!parent) {
      return res.status(400).json({ message: "Invalid phone/password" });
    }

    if (await bcrypt.compare(password, parent.password)) {
      // the username,password combination is successful

      const token = jwt.sign(
        {
          id: parent._id,
          parent_phone: parent.parent_phone.toString(),
        },
        JWT_SECRET
      );
      console.log(token);

      return res.status(200).json({
        jwtToken: token,
        parentId: parent._id,
        username: parent.username,
        parent_phone: parent.parent_phone,
        address: parent.address,
        profile: parent.profile
      });
    } else {
      res.status(400).json({ message: "Invalid email/password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.Parents_post_changePassword = async (req, res) => {
  console.log("password update request recieved");
  // taking data from req body
  const { currentPassword, newPassword: plainTextPassword } = req.body;

  // email is taken from check-auth using token
  const parent_phone = req.parentData.parent_phone;
  const _id = req.parentData.id;

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
    const parent = await Parent.findOne({ _id: _id }).lean();
    if (!parent) {
      return res.status(400).json({ message: "Invalid phone/password" });
    }
    if (await bcrypt.compare(currentPassword, parent.password)) {
      console.log("password verified");
      const password = await bcrypt.hash(plainTextPassword, 10);
      await Parent.updateOne(
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

exports.Parents_post_profile = async (req, res, next) => {
 try {
    path = "/userImg/" + req.file.filename;

    updateProfile = await User.findByIdAndUpdate(
      { _id: req.parentData.id },
      { profile: path },
      { new: true }
    );

    res.status(200).json({ profile: updateProfile.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};