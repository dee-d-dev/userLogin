const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  const payload = { name: user };
  if (!user) {
    res.send("invalid username or password");
  }

  if (await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.send(`login successful ${token}`);
  } else {
    res.send("password is incorrect");
  }
});

function authenticateToken(req, res, next){

}

module.exports = router;
