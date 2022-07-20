import { Request, Response } from "express";

import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Baker from "../../models/Person/Baker";

const insertIntoBaker = (
  bakerCpf: string,
  bakerFirstName: string,
  bakerLastName: string,
  bakerSalary: number
): Baker => {
  const newBaker = new Baker(
    bakerFirstName,
    bakerLastName,
    bakerCpf,
    bakerSalary
  );
  return newBaker;
};
const insertIntoDatabase = (baker: Baker) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query(
        "Insert into baker values (?,?,?,?)",
        [
          baker.getCpf(),
          baker.getFirstName(),
          baker.getLastName(),
          baker.getSalary(),
        ],
        (err, response) => {
          if (err) {
            reject(new DatabaseError("Insert failed"));
          }
          resolve(response);
          connection.release();
        }
      );
    });
  });
};
const bakerAlreadyExists = (bakerCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query(
        "Select COUNT(baker_cpf) as baker_total from baker where baker_cpf = ?",
        [bakerCpf],
        (err, response) => {
          if (err) {
            reject(new DatabaseError("Select failed"));
          }
          if (response[0].baker_total > 0) {
            reject(new DatabaseError("Baker already exists"));
          }
          connection.release();

          resolve(response);
        }
      );
    });
  });
};
export const bakerDoesNotExist = (bakerCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query(
        "Select COUNT(baker_cpf) as baker_total from baker where baker_cpf = ?",
        [bakerCpf],
        (err, response) => {
          if (err) {
            reject(new DatabaseError("Select failed"));
          }
          if (response[0].baker_total === 0) {
            reject(new DatabaseError("Baker does not exist"));
          }
          connection.release();

          resolve(response);
        }
      );
    });
  });
};

export const bakerPost = async (request: Request, response: Response) => {
  try {
    const { bakerCpf, bakerFirstName, bakerLastName, bakerSalary } =
      request.body;
    const newBaker = insertIntoBaker(
      bakerCpf,
      bakerFirstName,
      bakerLastName,
      bakerSalary
    );
    await bakerAlreadyExists(bakerCpf);

    await insertIntoDatabase(newBaker);
    return response
      .status(200)
      .json({ message: "Baker inserted successfully" });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};
