require("dotenv").config();
const express = require("express");
const cors = require('cors');


const connectDB = require("./utils/db");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const purchaseRoutes = require("./routes/purchases");
const errorHandler = require("./middleware/errorHandler");



const app = express();
app.use(express.json());
app.use(cors({origin: JSON.parse(process.env.PRODUCTION)?
  process.env.CLIENT: '*'
})); // Enable CORS for all origins);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Books Assignment Backend is running");
});


app.listen(PORT, function () {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});