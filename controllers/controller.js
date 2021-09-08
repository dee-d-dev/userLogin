const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

exports.getHome = (req, res) => {
  res.send("Welcome");
};

exports.getText = (req, res) => {
  res.send("now working again");
};

exports.loginController = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.send("invalid username or password");
  }

  if (await bcrypt.compare(req.body.password, user.password)) {
    const payload = { name: user };
    // async function generateToken(payload) {
    //   await jwt.sign(
    //     payload,
    //     process.env.ACCESS_TOKEN_SECRET,
    //     (err, token) => {
    //       res.send(token);
    //     },
    //     { expiresIn: "30s" }
    //   );
    // }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
    //  token = await generateToken(payload);
    res.send(`login successful ${token}`);
  } else {
    res.send("password is incorrect");
  }
  next();
};

exports.findUser = async (req, res) => {
  res.send("a protected route opened");
};

exports.authenticateToken = async (req, res, next) => {
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
};
