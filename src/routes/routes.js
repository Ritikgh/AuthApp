const {Router} = require("express");

let router = Router();

let user = require("./user.routes");

router.use("/user", user)

module.exports = router;