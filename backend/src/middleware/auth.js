import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId, name: payload.name };
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (apiKey !== process.env.FRONTEND_API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
}
