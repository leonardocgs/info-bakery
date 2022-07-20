import express from "express";

import {
  bakerPost,
  getAllBakers,
} from "../../services/bakerService/bakerService";

const router = express.Router();
router.post("/", bakerPost);
router.get("/", getAllBakers);
export default router;
