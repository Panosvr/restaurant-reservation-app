const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Απαιτείται έγκυρο token" });
  }
  const token = bearerHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Απαγορεύεται η πρόσβαση, δεν υπάρχει token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // αποθηκεύουμε το id/name του χρήστη
    next();
  } catch (err) {
    return res.status(401).json({ message: "Μη έγκυρο token" });
  }
}

module.exports = verifyToken;
