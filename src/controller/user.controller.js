const mongoUtil = require("../db/mongoUtil");
const bcrypt = require("bcryptjs");
const { constant } = require("../utils/constant");
const collection = constant.collections;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });

function errorHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      // Log the error
      console.error("An error occurred:", error);
      // Handle the error and send a response to the client
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}

exports.logInUser = errorHandler(async (req, res) => {
  console.log("####### Login User #######");
  let data = req.body;
  console.log(data);

  const db = await mongoUtil.connectToMongoDB();

  if (data.email == null || data.password == null) {
    res.status(401).send({ success: false, message: "Invalid credential" });
  } else {
    let findUser = await db
      .collection(collection.users)
      .findOne({ email: data.email });
    if (!findUser) {
      return res
        .status(401)
        .send({ success: false, message: "Can't find the user" });
    } else {
      let verifyPassword = bcrypt.compareSync(data.password, findUser.password); // verifying password using bcrypt npm package
      console.log("verifyPassword ____", verifyPassword);
      if (verifyPassword === true) {
        console.log("verified pwd");

        // Start generating accesstoken
        let accessToken = await jwt.sign(
          { id: findUser.userId, email: findUser.email },
          process.env.SECRET,
          {
            expiresIn: process.env.JWT_EXPIRATION,
          }
        );

        let refreshToken = await jwt.sign(
          { id: findUser.userId, email: findUser.email },
          process.env.SECRET
        );

        res
          .status(200)
          .send({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        return res
          .status(401)
          .send({ success: false, message: "Wrong Password" });
      }
    }
  }
});

exports.generateAccestoken = errorHandler(async (req, res) => {
  console.log("####### generate Access token #######");
  let data = req.body;
  console.log(data);

  const db = await mongoUtil.connectToMongoDB();

  if (data.refreshToken == null) {
    res.status(401).send({ success: false, message: "Invalid token" });
  } else {
    const decodeToken = jwt.verify(data.refreshToken, process.env.SECRET);
    console.log("decodeToken     ", decodeToken);

    if(!decodeToken){
     return res.status(401).send({ success: false, message: "Token Expired" });
    }
    let findUser = await db
      .collection(collection.users)
      .findOne({ email: decodeToken.email });

    if (!findUser) {
      return res
        .status(401)
        .send({ success: false, message: "Can't find user" });
    } else {
      let accessToken = await jwt.sign(
        { id: findUser.userId, email: findUser.email },
        process.env.SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION,
        }
      );
      res
        .status(200)
        .send({ accessToken: accessToken, refreshToken: data.refreshToken });
    }
  }
});

exports.getUserData = errorHandler(async (req, res) => {
  console.log("####### Get users data #######");
  let data = req.body;
  console.log(data);

  const db = await mongoUtil.connectToMongoDB();

  const userData = await db
    .collection(collection.users)
    .find()
    .project({ _id: 0, userId: 1, userName: 1, email: 1 })
    .toArray();

  console.log(userData);
  res.status(200).send(userData);
});
