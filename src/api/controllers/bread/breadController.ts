import express from "express";

import {
  breadPost,
  getBreads,
  updateBread,
} from "../../services/breadService/breadService";

const router = express.Router();
router.post("/", breadPost);
router.get("/", getBreads);
router.put("/:breadId", updateBread);
export default router;
