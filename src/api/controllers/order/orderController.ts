import express from "express";

import { orderPost, orderGet } from "../../services/orderService/orderService";

const router = express.Router();
router.post("/", orderPost);
router.get("/", orderGet);
export default router;
