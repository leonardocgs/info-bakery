import express from "express";

import {
  bakerPost,
  getAllBakers,
  updateBaker,
  deleteBaker,
} from "../../services/bakerService/bakerService";

const router = express.Router();
router.post("/", bakerPost);
router.get("/", getAllBakers);
router.put("/:bakerCpf", updateBaker);
router.delete("/:bakerCpf", deleteBaker);
export default router;
