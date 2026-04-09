import express from "express";
import EventCatalog from "../models/eventCatalog.model.js";
import ensureSeedData from "../utils/ensureSeedData.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    await ensureSeedData();
    const events = await EventCatalog.find().sort({ name: 1 });
    res.json({ events });
  } catch (error) {
    console.error("Event catalog list error:", error);
    res.status(500).json({ message: "Unable to load events right now." });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    await ensureSeedData();
    const event = await EventCatalog.findOne({ slug: req.params.slug });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({ event });
  } catch (error) {
    console.error("Event catalog detail error:", error);
    res.status(500).json({ message: "Unable to load the event details right now." });
  }
});

export default router;
