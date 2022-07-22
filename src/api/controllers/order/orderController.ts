import express from "express";

import {
  orderPost,
  orderGet,
  orderDelete,
  changeBreadAmountInOrder,
} from "../../services/orderService/orderService";

const router = express.Router();
router.delete("/:orderId", orderDelete);
router.post("/", orderPost);
router.get("/", orderGet);
router.patch("/:orderId", changeBreadAmountInOrder);

export default router;
