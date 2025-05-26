const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");

// Δημιουργία κράτησης
router.post("/", verifyToken, (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;
  const user_id = req.user.id;

  if (!restaurant_id || !date || !time || !people_count) {
    return res.status(400).json({ message: "Όλα τα πεδία είναι υποχρεωτικά" });
  }

  // Έλεγχος αν έχει ήδη κάνει κράτηση ο χρήστης την ίδια μέρα στο ίδιο εστιατόριο
  db.query(
    `SELECT * FROM reservations
     WHERE user_id = ? AND restaurant_id = ? AND date = ?`,
    [user_id, restaurant_id, date],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Σφάλμα ελέγχου κρατήσεων" });

      if (results.length > 0) {
        return res.status(409).json({
          message:
            "Έχεις ήδη κράτηση για αυτήν την ημερομηνία στο συγκεκριμένο εστιατόριο",
        });
      }

      // Αν δεν υπάρχει ήδη, κάνε την κράτηση
      db.query(
        "INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)",
        [user_id, restaurant_id, date, time, people_count],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Σφάλμα στη δημιουργία κράτησης" });

          res.status(201).json({ message: "Η κράτηση καταχωρήθηκε" });
        }
      );
    }
  );
});

// Προβολή κρατήσεων χρήστη
router.get("/my", verifyToken, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT r.reservation_id, r.date, r.time, r.people_count,
            rest.name AS restaurant_name, rest.location
     FROM reservations r
     JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
     WHERE r.user_id = ?`,
    [user_id],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Σφάλμα κατά την ανάκτηση των κρατήσεων" });

      res.json({ reservations: results });
    }
  );
});

// Διαγραφή κράτησης (με έλεγχο αν ανήκει στον χρήστη)
router.delete("/:id", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const reservation_id = req.params.id;

  db.query(
    "SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?",
    [reservation_id, user_id],
    (err, results) => {
      if (err || results.length === 0) {
        return res
          .status(404)
          .json({ message: "Δεν βρέθηκε κράτηση ή δεν σου ανήκει" });
      }

      db.query(
        "DELETE FROM reservations WHERE reservation_id = ?",
        [reservation_id],
        (err2, result) => {
          if (err2) {
            return res
              .status(500)
              .json({ message: "Αποτυχία διαγραφής κράτησης" });
          }

          res.json({ message: "Η κράτηση διαγράφηκε με επιτυχία" });
        }
      );
    }
  );
});
// Ενημέρωση κράτησης
router.put("/:id", verifyToken, (req, res) => {
  const { date, time, people_count } = req.body;
  const user_id = req.user.id;
  const reservation_id = req.params.id;

  if (!date || !time || !people_count) {
    return res.status(400).json({ message: "Όλα τα πεδία είναι υποχρεωτικά" });
  }

  // Έλεγχος αν η κράτηση ανήκει στον χρήστη
  db.query(
    "SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?",
    [reservation_id, user_id],
    (err, results) => {
      if (err || results.length === 0) {
        return res
          .status(404)
          .json({ message: "Η κράτηση δεν βρέθηκε ή δεν σου ανήκει" });
      }

      // Ενημέρωση κράτησης
      db.query(
        "UPDATE reservations SET date = ?, time = ?, people_count = ? WHERE reservation_id = ?",
        [date, time, people_count, reservation_id],
        (err2) => {
          if (err2) {
            return res
              .status(500)
              .json({ message: "Αποτυχία ενημέρωσης κράτησης" });
          }

          res.json({ message: "Η κράτηση ενημερώθηκε με επιτυχία" });
        }
      );
    }
  );
});

module.exports = router;
