const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");

// GET /api/restaurants
router.get("/", verifyToken, (req, res) => {
  db.query("SELECT * FROM restaurants", (err, results) => {
    if (err)
      return res.status(500).json({ message: "Σφάλμα στη λήψη εστιατορίων" });

    res.json({ restaurants: results });
  });
});

module.exports = router;
