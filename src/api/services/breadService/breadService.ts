import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Bread from "../../models/Bread/Bread";
import { bakerDoesNotExist } from "../bakerService/bakerService";

const insertBread = (
  breadId: string,
  breadName: string,
  breadPrice: number,
  bakerCpf: string
) => {
  return new Bread(breadId, breadPrice, breadName, bakerCpf);
};
const insertBreadIntoDatabase = (bread: Bread) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query(
        "INSERT INTO bread (bread_id, bread_name, bread_price, baker_cpf) VALUES (?, ?, ?, ?)",
        [
          bread.getBreadId(),
          bread.getBreadName(),
          bread.getBreadPrice(),
          bread.getBakerCpf(),
        ],
        (error, response) => {
          if (error) {
            reject(new DatabaseError("Insert failed"));
          }
          resolve(response);
          connection.release();
        }
      );
    });
  });
};

export const breadPost = async (request: Request, response: Response) => {
  const breadId = uuidv4();
  const { breadName, breadPrice, bakerCpf } = request.body;
  try {
    const bread = insertBread(breadId, breadName, breadPrice, bakerCpf);
    console.log(bread);
    await bakerDoesNotExist(bakerCpf);
    await insertBreadIntoDatabase(bread);
    response.status(201).send(bread);
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
};
