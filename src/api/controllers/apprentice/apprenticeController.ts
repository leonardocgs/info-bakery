import express from "express";

import {
  postApprentice,
  getApprentices,
  updateApprentice,
  deleteApprentice,
} from "../../services/apprenticeService/apprenticeService";

const router = express.Router();
router.post("/", postApprentice);
router.get("/", getApprentices);
router.put("/:apprenticeCpf", updateApprentice);
router.delete("/:apprenticeCpf", deleteApprentice);
export default router;
