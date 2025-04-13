const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// Register User
module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, fullname } = req.body;

    const user = await userModel.findOne({ email });
    if (user)
      return res.status(401).send("You already have an account, please login.");

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          const user = await userModel.create({
            email,
            password: hash,
            fullname,
          });

          const token = generateToken(user);
          res.cookie("token", token);

          res.redirect("/shop");
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

// Login User
module.exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.send("Email or Password Incorrect");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      res.send("Email or Password Incorrect");
    }
  });
};


// ✅ Logout User
module.exports.logoutUser = function (req, res) {
  req.flash("message", "Logged out successfully");
  res.clearCookie("token").redirect("/");
};
