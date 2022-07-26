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
const getCostumerArray = (databaseResult) => {
  return new Promise((resolve, reject) => {
    try {
      const costumerArray = Promise.all(
        databaseResult.map(async (costumer) => {
          const newCostumer = new Costumer(
            costumer.costumer_first_name,
            costumer.costumer_last_name,
            costumer.costumer_cpf
          );
          return newCostumer;
        })
      );
      resolve(costumerArray);
    } catch (error) {
      reject(error);
    }
  });
};

const getCostumersDataBase = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM costumer`, (err, result) => {
      if (err) {
        reject(new DatabaseError("DataError"));
      }
      resolve(result);
    });
  });
};
const updateCostumerInsideDatabase = (costumer: Costumer) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE costumer SET costumer_first_name = ?, costumer_last_name = ? WHERE costumer_cpf = ?",
      [costumer.getFirstName(), costumer.getLastName(), costumer.getCpf()],
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
const deleteCostumerInsideDatabase = (costumerCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM costumer WHERE costumer_cpf = ?",
      [costumerCpf],
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
            return;
          }
          connection.release();
          if (result[0].costumer_total === 0) {
            reject(new DatabaseError("Costumer does not exist"));
            return;
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
export const getCostumers = async (request: Request, response: Response) => {
  try {
    const databaseResult = await getCostumersDataBase();
    const costumerArray = await getCostumerArray(databaseResult);
    response.status(200).json(costumerArray);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
export const updateCostumers = async (request: Request, response: Response) => {
  const { costumerCpf } = request.params;
  const { costumerFirstName, costumerLastName } = request.body;
  try {
    await costumerDoesNotExist(costumerCpf);
    const costumer = new Costumer(
      costumerFirstName,
      costumerLastName,
      costumerCpf
    );

    await updateCostumerInsideDatabase(costumer);

    response.status(200).json(costumer);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
export const deleteCostumer = async (request: Request, response: Response) => {
  const { costumerCpf } = request.params;
  try {
    await costumerDoesNotExist(costumerCpf);
    await deleteCostumerInsideDatabase(costumerCpf);
    response.status(200).json({ message: "Costumer deleted" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
