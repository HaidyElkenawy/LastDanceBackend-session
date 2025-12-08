const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  // add fields here
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
