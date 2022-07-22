import express from "express";

import {
  bakerPost,
  getAllBakers,
  updateBaker,
} from "../../services/bakerService/bakerService";

const router = express.Router();
router.post("/", bakerPost);
router.get("/", getAllBakers);
router.put("/:bakerCpf", updateBaker);
export default router;
