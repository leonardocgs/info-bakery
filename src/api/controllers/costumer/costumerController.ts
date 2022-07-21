import express from "express";

import {
  postCostumer,
  getCostumers,
} from "../../services/costumerService/costumerService";

const router = express.Router();
router.post("/", postCostumer);
router.get("/", getCostumers);

export default router;
