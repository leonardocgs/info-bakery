import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Apprentice from "../../models/Person/Apprentice";
import { bakerDoesNotExist } from "../bakerService/bakerService";

const apprenticeAlreadyExists = (apprenticeCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT COUNT(apprentice_cpf) as apprentice_total FROM apprentice WHERE apprentice_cpf = ?`,
        [apprenticeCpf],
        (err, result) => {
          if (err) {
            reject(new DatabaseError("DataError"));
          }
          if (result[0].apprentice_total > 0) {
            reject(new DatabaseError("Apprentice already exists"));
          }
          connection.release();
          resolve(result);
        }
      );
    });
  });
};

const createApprentice = (
  apprenticeCpf: string,
  apprenticeFirstName: string,
  apprenticeLastName: string,
  bakerCpf: string
) => {
  return new Apprentice(
    apprenticeFirstName,
    apprenticeLastName,
    apprenticeCpf,
    bakerCpf
  );
};
const insertApprenticeIntoDatabase = (apprentice: Apprentice) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `INSERT INTO apprentice (apprentice_cpf, apprentice_first_name, apprentice_last_name, baker_cpf) VALUES (?, ?, ?, ?)`,
        [
          apprentice.getCpf(),
          apprentice.getFirstName(),
          apprentice.getLastName(),
          apprentice.getBakerCPf(),
        ],
        (err) => {
          if (err) {
            reject(
              new DatabaseError("Error inserting apprentice into database")
            );
          }
          connection.release();
          resolve(apprentice);
        }
      );
    });
  });
};
export const postApprentice = async (request, response) => {
  const { apprenticeCpf, apprenticeFirstName, apprenticeLastName, bakerCpf } =
    request.body;
  try {
    await apprenticeAlreadyExists(apprenticeCpf);
    await bakerDoesNotExist(bakerCpf);
    const apprentice = createApprentice(
      apprenticeCpf,
      apprenticeFirstName,
      apprenticeLastName,
      bakerCpf
    );
    await insertApprenticeIntoDatabase(apprentice);
    response.status(201).json(apprentice);
  } catch (err) {
    response.status(400).json(err.message);
  }
};
