import express from "express";

import { postCostumer } from "../../services/costumerService/costumerService";

const router = express.Router();
router.post("/", postCostumer);

export default router;
