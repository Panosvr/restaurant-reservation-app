const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Σφάλμα σύνδεσης με τη βάση:", err);
  } else {
    console.log("✅ Συνδέθηκε με επιτυχία στη MariaDB");
  }
});

module.exports = db;
