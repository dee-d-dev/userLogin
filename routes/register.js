const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.get("/register", (req, res) => {
  res.send("Register page");
});

router.post("/register", async (req, res) => {
  try {
    await registerAuth.validateAsync(req.body);
  } catch (err) {
    res.send(err.details[0].message);
    process.exit(1)
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    res.send("a user with this email has already been registered");
  }
  const salt = await bcrypt.genSalt(10);
  const user = new User(req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();

  res.send(user);
});

const registerAuth = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  birthday: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.ref("password"),
});

module.exports = router;
