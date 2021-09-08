const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getText, loginController, findUser, authenticateToken } = require("../controllers/controller");

router.get("/users/protected", authenticateToken, findUser );

router.get("/users", getText);

router.post("/login", loginController);

module.exports = router;
