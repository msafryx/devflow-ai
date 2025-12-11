import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get("/google", (req, res) => {
  const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const scope = encodeURIComponent("openid email profile");

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}`;

  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code");

  try {
    // 1) Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { id_token } = tokenRes.data;

    // 2) Decode id_token (JWT)
    const payload = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // 3) Find or create user
    let user = await User.findOne({ provider: "google", providerId: googleId });
    if (!user) {
      user = await User.create({
        provider: "google",
        providerId: googleId,
        name,
        email,
        avatarUrl: picture,
      });
    }

    // 4) Create our own JWT
    const appToken = jwt.sign(
      { userId: user._id.toString(), name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 5) Redirect back to frontend with token
    const frontendUrl = `${process.env.FRONTEND_ORIGIN}/auth/callback?token=${appToken}`;
    res.redirect(frontendUrl);
  } catch (err) {
    console.error("Google OAuth error:", err.response?.data || err.message);
    res.status(500).send("Auth error");
  }
});

export default router;
