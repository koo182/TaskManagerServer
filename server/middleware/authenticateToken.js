import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  jwt.verify(token, process.env.JWT_PASS, (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = decodedToken;
    next();
  });
};

export default authenticateToken;
