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
import { costumerDoesNotExist } from "../costumerService/costumerService";

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
const orderExists = async (orderId: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM buys WHERE order_id = ?`,
      [orderId],
      (err, result: []) => {
        if (err) {
          reject(new DatabaseError("DataError"));
          return;
        }
        if (result.length === 0) {
          reject(new DatabaseError("Order does not exist"));
          return;
        }
        resolve(result);
      }
    );
  });
};

const deleteOrderFromDatabase = async (orderId: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM buys WHERE order_id = ?`,
      [orderId],
      (err, result) => {
        if (err) {
          reject(new DatabaseError("DataError"));
          return;
        }
        resolve(result);
      }
    );
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
          insertOrderIntoDatabase(
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
const gettingDistincOrderId = async () => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(`SELECT DISTINCT order_id FROM buys`, (err, results) => {
        if (err) {
          reject(new DatabaseError("error querying database"));
          return;
        }
        resolve(results);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getBreadValueFromDatabase = async (order_id: string) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(
        `SELECT bread_id,bread_amount FROM buys WHERE order_id = ?`,
        [order_id],
        (err, results) => {
          if (err) {
            reject(new DatabaseError("error querying database"));
            return;
          }
          resolve(results);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
const breadOrderFactory = async (response): Promise<IBreadOrder[]> => {
  return new Promise((resolve, reject) => {
    try {
      const promise = Promise.all(
        response.map(async (order) => {
          const breadOrderFactory: IBreadOrder = {
            breadId: order.bread_id,
            breadAmount: order.bread_amount,
          };
          return breadOrderFactory;
        })
      );
      resolve(promise);
    } catch (error) {
      reject(error);
    }
  });
};

const createOrderArray = async (response) => {
  return new Promise((resolve, reject) => {
    try {
      const orderArray = Promise.all(
        response.map(async (order) => {
          const breadValues = await getBreadValueFromDatabase(order.order_id);
          const breadOrder = await breadOrderFactory(breadValues);
          const breadGet = await returnBreadGet(breadOrder);
          const orderClass = new Order(
            order.order_id,
            order.costumer_cpf,
            undefined,
            breadGet
          );

          return orderClass;
        })
      );
      resolve(orderArray);
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

export const orderGet = async (request: Request, response: Response) => {
  try {
    const orders = await gettingDistincOrderId();
    const orderArray = await createOrderArray(orders);
    response.status(200).send(orderArray);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export const orderDelete = async (request: Request, response: Response) => {
  const { orderId } = request.params;
  try {
    await orderExists(orderId);
    await deleteOrderFromDatabase(orderId);
    response.status(200).send({ message: "Order deleted" });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
