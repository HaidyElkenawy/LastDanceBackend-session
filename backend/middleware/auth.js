const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (req, res, next) => {
  // add auth middleware here
try{
  const auth = req.headers["Authorization"];
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = auth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded
  

}
catch(err){
  res.status(401).json({ message: "Unauthorized" });
}
};
