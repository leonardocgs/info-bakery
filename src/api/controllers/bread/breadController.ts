import express from "express";

import { breadPost } from "../../services/breadService/breadService";

const router = express.Router();
router.post("/", breadPost);
export default router;
