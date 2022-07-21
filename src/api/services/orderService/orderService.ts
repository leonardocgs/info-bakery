import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import IBreadGet from "../../Interface/IBreadGet";
import IBreadOrder from "../../Interface/IBreadOrder";
import Order from "../../models/Order";
import {
  breadDoesNotExist,
  getBreadByIdFromDatabase,
} from "../breadService/breadService";
import { costumerDoesNotExist } from "../costumerController/costumerService";

const checksPostBread = async (breadPost: IBreadOrder[]) => {
  return new Promise((resolve, reject) => {
    try {
      const promicese = Promise.all(
        breadPost.map(async (bread) => {
          const promise = await breadDoesNotExist(bread.breadId);

          return promise;
        })
      );

      resolve(promicese);
    } catch (error) {
      reject(error);
    }
  });
};

const returnBreadGet = async (
  breadPost: IBreadOrder[]
): Promise<IBreadGet[]> => {
  return new Promise((resolve, reject) => {
    try {
      const breadGetters = Promise.all(
        breadPost.map(async (bread) => {
          const returnedBread = await getBreadByIdFromDatabase(bread.breadId);
          const breadGet: IBreadGet = {
            bread: returnedBread,
            breadAmount: bread.breadAmount,
          };
          return breadGet;
        })
      );
      resolve(breadGetters);
    } catch (error) {
      reject(error);
    }
  });
};

const insertOrderIntoDatabase = async (
  orderId: string,
  costumerCpf: string,
  breadId: string,
  breadAmount: number
) => {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(new DatabaseError("Error connecting to database"));
          return;
        }
        connection.query(
          `INSERT INTO buys (order_id, costumer_cpf, bread_id, bread_amount) VALUES (?,?,?,?)`,
          [orderId, costumerCpf, breadId, breadAmount],
          (err, results: []) => {
            connection.release();
            if (err) {
              console.log(err.message);
              reject(new DatabaseError("error querying database"));
              return;
            }
            resolve(results);
          }
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};
const insertWithOrderClass = async (order: Order) => {
  return new Promise((resolve, reject) => {
    try {
      const promise = Promise.all(
        order.getBreadPost().map(async (bread) => {
          console.log(bread);
          const promise = await insertOrderIntoDatabase(
            order.orderId,
            order.costumerCpf,
            bread.breadId,
            Number(bread.breadAmount)
          );
          return promise;
        })
      );
      resolve(promise);
    } catch (error) {
      reject(error);
    }
  });
};

export const orderPost = async (request: Request, response: Response) => {
  const orderId = uuidv4();
  const { costumerCpf, breadPost } = request.body;
  try {
    if (!costumerCpf) {
      throw new DatabaseError("CostumerCpf is required");
    }
    if (!breadPost) {
      throw new DatabaseError("BreadPost is required");
    }

    await checksPostBread(breadPost);
    await costumerDoesNotExist(costumerCpf);
    const breadGetters = await returnBreadGet(breadPost);
    const order = new Order(orderId, costumerCpf, breadPost, breadGetters);
    await insertWithOrderClass(order);
    response.status(201).send(order);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
