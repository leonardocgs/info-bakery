import express from "express";

import { orderPost } from "../../services/orderService/orderService";

const router = express.Router();
router.post("/", orderPost);
export default router;
