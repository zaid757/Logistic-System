const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //uniq nie function dia kat bawah tuh plugin sebab dia true
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true}  //nie utk monggose function database
});

userSchema.plugin(uniqueValidator); // untuk elak sama

module.exports = mongoose.model("User", userSchema);
