import express from "express";

import {
  postApprentice,
  getApprentices,
} from "../../services/apprenticeService/apprenticeService";

const router = express.Router();
router.post("/", postApprentice);
router.get("/", getApprentices);
export default router;
