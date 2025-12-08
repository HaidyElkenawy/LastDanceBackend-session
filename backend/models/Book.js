const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  // add fields here
});

module.exports = mongoose.model("Book", BookSchema);
