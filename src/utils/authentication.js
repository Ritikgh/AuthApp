let jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });
async function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  console.log("token________________", token, "   ", process.env.SECRET);

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        // Handle error
        console.error("Token verification failed:", err);
        res.status(401).send({ success: false, message: "Token Expired" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).send({ success: false, message: "Please add token" });
  }
}

module.exports = {
  verifyToken,
};
