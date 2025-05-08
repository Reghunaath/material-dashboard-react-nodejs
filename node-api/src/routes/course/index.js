import express from "express";
const router = express.Router();

import {
  getAllCoursesHandler,
  getPurchasedCoursesByEmailHandler,
  purchaseCourseHandler,
} from "../../services/course/index.js";

router.get("/", async (req, res) => {
  try {
    await getAllCoursesHandler(req, res);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
});
router.get("/purchased/:email", async (req, res) => {
  try {
    await getPurchasedCoursesByEmailHandler(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch purchased courses", error });
  }
});
router.post("/purchase", async (req, res) => {
  try {
    await purchaseCourseHandler(req, res);
  } catch (error) {
    res.status(500).json({ message: "Failed to add purchased course", error });
  }
});
export default router;
