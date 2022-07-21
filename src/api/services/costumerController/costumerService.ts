import { Request, Response } from "express";

import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Costumer from "../../models/Person/Costumer";

const insertCostumerIntoDatabase = (costumer: Costumer) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `INSERT INTO costumer (costumer_first_name, costumer_last_name, costumer_cpf) VALUES (?, ?, ?)`,
        [costumer.getFirstName(), costumer.getLastName(), costumer.getCpf()],
        (err, result) => {
          if (err) {
            reject(new DatabaseError("DataError"));
          }
          connection.release();
          resolve(result);
        }
      );
    });
  });
};
const costumerAlreadyExists = (costumerCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT COUNT(costumer_cpf) as costumer_total FROM costumer WHERE costumer_cpf = ?`,
        [costumerCpf],
        (err, result) => {
          if (err) {
            reject(new DatabaseError("Entrou"));
          }
          connection.release();
          if (result[0].costumer_total > 0) {
            reject(new DatabaseError("Costumer already exists"));
          }
          resolve(result);
        }
      );
    });
  });
};
export const costumerDoesNotExist = (costumerCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT COUNT(costumer_cpf) as costumer_total FROM costumer WHERE costumer_cpf = ?`,
        [costumerCpf],
        (err, result) => {
          if (err) {
            reject(new DatabaseError("Entrou"));
          }
          connection.release();
          if (result[0].costumer_total === 0) {
            reject(new DatabaseError("Costumer does not exist"));
          }
          resolve(result);
        }
      );
    });
  });
};

export const postCostumer = async (request: Request, response: Response) => {
  try {
    const costumer = new Costumer(
      request.body.costumerFirstNamer,
      request.body.costumerLastName,
      request.body.costumerCpf
    );
    await costumerAlreadyExists(costumer.getCpf());
    await insertCostumerIntoDatabase(costumer);

    response.status(200).json(costumer);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
