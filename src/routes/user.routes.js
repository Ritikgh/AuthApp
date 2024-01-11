const {Router} = require("express");
const  {verifyToken} = require("../utils/authentication")

let router = Router()

const user = require("../controller/user.controller")

router.post("/logIn", user.logInUser) // route to login the user , generate access token and refresh token
router.post("/accessToken", user.generateAccestoken) // route to generate access token using refresh token
router.get("/allUsers", verifyToken,user.getUserData) // route to get user data

module.exports = router;