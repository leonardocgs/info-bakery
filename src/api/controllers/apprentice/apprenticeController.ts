import express from "express";

import { postApprentice } from "../../services/apprenticeService/apprenticeService";

const router = express.Router();
router.post("/", postApprentice);
export default router;
