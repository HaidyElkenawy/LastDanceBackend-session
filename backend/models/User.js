const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // add fields here
});

module.exports = mongoose.model("User", UserSchema);
