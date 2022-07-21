import express from "express";

import {
  orderPost,
  orderGet,
  orderDelete,
} from "../../services/orderService/orderService";

const router = express.Router();
router.delete("/:orderId", orderDelete);
router.post("/", orderPost);
router.get("/", orderGet);

export default router;
