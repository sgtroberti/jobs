import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/auth.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No token" });

  const parts = authHeader.split(" ");
  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Not a Bearer token" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Invalid token" });

    req.userId = decoded.params.id;

    return next();
  });
};
