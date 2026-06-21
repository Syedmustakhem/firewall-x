import { Router } from "express";
import { db } from "../config/database.js";

const router = Router();

router.get("/db-test", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT NOW()"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

export default router;