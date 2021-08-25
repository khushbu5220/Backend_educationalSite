// start: nodemon app.js
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const logger = require("morgan");

// This cors is added for testing purpose only
const cors = require("cors");

const { Router } = require("express");
const port = process.env.PORT;

const userRouter = require("./routers/user");

const mentorRouter = require("./routers/mentor");

const test_mentor = require("./routers/test_mentor");

const parentRouter = require("./routers/parent");

const videoRouter = require("./routers/video");

const chatThreadRouter = require("./routers/chat");

require("./db/conn");

const app = express();

// Using cors over here
app.use(cors());

app.use(logger("dev"));

var multer = require('multer');
// var upload = multer({ dest: './uploads' });


app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "uploads")));

// app.use(multer({dest:'./uploads/'}).single('singleInputFileName'));

app.use(bodyParser.json());

app.use(userRouter);
app.use(mentorRouter);
app.use(test_mentor);
app.use(parentRouter);
app.use(videoRouter);
app.use(chatThreadRouter);

// console.log(process.env.JWT_KEY)

app.listen(port, () => {
  console.log(`Server up at ${port}`);
});
