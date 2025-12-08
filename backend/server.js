require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/db");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const purchaseRoutes = require("./routes/purchases");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
