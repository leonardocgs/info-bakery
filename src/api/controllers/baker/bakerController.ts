import express from "express";

import { bakerPost } from "../../services/bakerService";

const router = express.Router();
router.post("/", bakerPost);
export default router;
