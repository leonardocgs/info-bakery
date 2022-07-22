import express from "express";

import {
  postApprentice,
  getApprentices,
  updateApprentice,
} from "../../services/apprenticeService/apprenticeService";

const router = express.Router();
router.post("/", postApprentice);
router.get("/", getApprentices);
router.put("/:apprenticeCpf", updateApprentice);
export default router;
