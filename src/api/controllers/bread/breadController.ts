import express from "express";

import { breadPost, getBreads } from "../../services/breadService/breadService";

const router = express.Router();
router.post("/", breadPost);
router.get("/", getBreads);
export default router;
