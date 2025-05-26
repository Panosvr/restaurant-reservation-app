const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const app = express();
const restaurantRoutes = require("./routes/restaurantsRoutes");
const reservationRoutes = require("./routes/reservationsRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reservations", reservationRoutes);
app.get("/", (req, res) => {
  res.json({ message: "🚀 API is working" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
