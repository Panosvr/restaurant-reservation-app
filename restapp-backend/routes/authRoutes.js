const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Σφάλμα στο query" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Το email υπάρχει ήδη" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Σφάλμα στο hash" });

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Σφάλμα στη δημιουργία χρήστη" });

          const user_id = result.insertId;
          const token = jwt.sign(
            { id: user_id, name },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
          );

          return res.status(201).json({
            message: "Ο χρήστης δημιουργήθηκε",
            token, // <= Προσθήκη token μετά την εγγραφή
          });
        }
      );
    });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Μη έγκυρα στοιχεία" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) {
        return res.status(401).json({ message: "Λάθος κωδικός" });
      }

      const token = jwt.sign(
        { id: user.user_id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        token,
        user: { id: user.user_id, name: user.name, email: user.email },
      });
    });
  });
});

module.exports = router;
