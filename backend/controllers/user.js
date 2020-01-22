const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user"); // amik dekat model user

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => { // nie utk create hash bg security
    const user = new User({
      email: req.body.email,
      password: hash,
      username: req.body.username
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}
exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ username:req.body.username}).findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed satu"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed dua"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id, usernameId: fetchedUser.username },// nie nantie pakai utk auth service front end .
        process.env.JWT_KEY, // amik nie drpde nodemon.json ade secret key punya data
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        usernameId: fetchedUser.username
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
