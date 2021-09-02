const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const register = require("./routes/register");
const login = require("./routes/login");
const mongoose = require("mongoose");

app.use(express.json());
app.use("/api", register);
app.use("/api", login);

app.get("/api/home", (req, res) => {
  res.send("Welcome");
});

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("connected to database successfully");
});
const PORT = process.env.PORT;

app.listen(PORT || 5000, () => {
  console.log(`server starts running on port ${PORT}`);
});
