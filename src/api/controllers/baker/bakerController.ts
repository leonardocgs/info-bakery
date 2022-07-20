import express from "express";

import { bakerPost } from "../../services/bakerService/bakerService";

const router = express.Router();
router.post("/", bakerPost);
export default router;
