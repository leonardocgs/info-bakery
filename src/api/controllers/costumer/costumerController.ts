import express from "express";

import {
  postCostumer,
  getCostumers,
  updateCostumers,
  deleteCostumer,
} from "../../services/costumerService/costumerService";

const router = express.Router();
router.post("/", postCostumer);
router.get("/", getCostumers);
router.put("/:costumerCpf", updateCostumers);
router.delete("/:costumerCpf", deleteCostumer);

export default router;
