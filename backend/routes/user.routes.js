const express = require("express");
const UserModel = require("../models/user.model");
require("dotenv").config();

// const UserData = require("../models/userdata.model");

const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Finding the existing user
    const user = await UserModel.find({ email: email });

    if (user.length > 0) {
      //       // comparing the password with the existing user password
      bcrypt.compare(password, user[0].password, async (err, result) => {
        if (result) {
          await UserModel.findByIdAndUpdate(
            { _id: user[0]._id },
            { active: true }
          );
          res.status(200).send({
            message: "Login successful",
            // Generating the jwt token
            token: jwt.sign({ userID: user[0]._id }, process.env.secretKey),
          });
        } else {
          res.status(400).send({ message: "Invalid password" });
        }
      });
    } else {
      res
        .status(400)
        .send({ message: "User not found, Please create a new account" });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
module.exports = userRouter;