import express from "express";
import Snapshot from "../models/Snapshot.js";
import { requireAuth, requireApiKey } from "../middleware/auth.js";

const router = express.Router();

// POST /api/records -> save a snapshot for current user
router.post("/", requireAuth, requireApiKey, async (req, res) => {
  try {
    const payload = req.body;

    if (typeof payload.aiScore !== "number") {
      return res
        .status(400)
        .json({ error: "Invalid payload: aiScore missing" });
    }

    const snapshot = new Snapshot({
      userId: req.user.id,
      timestamp: payload.timestamp || new Date(),
      crypto: payload.crypto,
      news: payload.news,
      community: payload.community,
      weather: payload.weather,
      aiScore: payload.aiScore,
    });

    await snapshot.save();

    res.status(201).json({ message: "Snapshot saved", id: snapshot._id });
  } catch (err) {
    console.error("POST /api/records error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/records -> list this user's snapshots
router.get("/", requireAuth, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const records = await Snapshot.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json(records);
  } catch (err) {
    console.error("GET /api/records error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
