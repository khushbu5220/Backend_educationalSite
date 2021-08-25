const express = require("express");
// const bcrypt = require("bcryptjs");
const validator = require("validator");
// const jwt = require("jsonwebtoken");
const multer = require("multer");
const Video = require("../model/video");

// const JWT_SECRET = process.env.JWT_KEY;

exports.mentors_post_videos = async (req, res, next) => {
  try {
    videoData = {
      video: "/videos/" + req.file.filename,
      topic: req.body.topic,
      desc: req.body.desc,
      postedByMentor: req.body.username,
      postedBy: req.userData.id,
      timestamp: true
    };

    const createMe = await Video.create(videoData);

    const response = await Video.find().populate(
      "postedBy",
      "username profile"
    );

    res.status(200).json(response.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.mentors_get_videos = async (req, res) => {
  try {
    const data = await Video.find().populate(
      "postedBy", "username profile"
    );

    res.status(200).json(data.reverse());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.my_videos = async (req, res) => {
  try {
    const postedBy = req.params.postedBy;
    const data = await Video.find({ postedBy });

    if (!data) {
      return res.status(404).send(error);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.mentors_delete_video = async (req, res) => {
  try {
    const _id = req.params._id;
    const deleted = await Video.findByIdAndDelete({ _id });

    if (!_id) {
      return res.status(400).send();
    } else {
      res.send(deleted);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
