import cors from "cors";
import express from "express";

import apprenticeController from "./api/controllers/apprentice/apprenticeController";
import bakerController from "./api/controllers/baker/bakerController";
import breadController from "./api/controllers/bread/breadController";
import costumerController from "./api/controllers/costumer/costumerController";
import orderController from "./api/controllers/order/orderController";

export const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send();
  }
  app.use(cors());
  return next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/baker", bakerController);
app.use("/bread", breadController);
app.use("/apprentice", apprenticeController);
app.use("/costumer", costumerController);
app.use("/order", orderController);
