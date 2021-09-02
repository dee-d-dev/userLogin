const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

router.get("/users/:id", authenticateToken, async (req, res) => {
  const users = await User.findById(req.params.id);
  if (!users) {
    res.send(`doesn't exist`);
  }
  res.send(users);
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  const payload = { name: user };
  if (!user) {
    res.send("invalid username or password");
  }

  if (await bcrypt.compare(req.body.password, user.password)) {
    const token = generateToken(payload);
  } else {
    res.send("password is incorrect");
  }
});

function generateToken(payload) {
  jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    (err, token) => {
      res.send(token);
    },
    { expiresIn: "30s" }
  );
}


function authenticateToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }

  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(authData);
    }
  });
}

module.exports = router;
