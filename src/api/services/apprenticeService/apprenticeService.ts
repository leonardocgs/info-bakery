import NullPropertyError from "../../../../error/class-error/NullPropertyError";
import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import IBakerTeaches from "../../Interface/IBakerTeaches";
import Apprentice from "../../models/Person/Apprentice";
import Baker from "../../models/Person/Baker";
import {
  bakerDoesNotExist,
  bakerAlreadyExists,
  getBakerByCpf,
} from "../bakerService/bakerService";

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
export const createApprenticeWithoutBakerCpf = (bakerTeacherResponse) => {
  console.log(bakerTeacherResponse);
  return new Apprentice(
    bakerTeacherResponse.dataBaseResponse[0].apprentice_first_name,
    bakerTeacherResponse.dataBaseResponse[0].apprentice_last_name,
    bakerTeacherResponse.dataBaseResponse[0].apprentice_cpf
  );
};

export const didBakerHasApprentice = (
  bakerCpf: string
): Promise<IBakerTeaches> => {
  const bakerTeaches: IBakerTeaches = {
    doesTeach: false,
    dataBaseResponse: undefined,
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT *  FROM apprentice WHERE baker_cpf = ?`,
        [bakerCpf],
        (err, result: []) => {
          if (err) {
            reject(new DatabaseError("DataError"));
          }
          connection.release();
          if (result.length > 0) {
            bakerTeaches.doesTeach = true;
            bakerTeaches.dataBaseResponse = result;
          }
          resolve(bakerTeaches);
        }
      );
    });
  });
};
const getApprenticesFromDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(`SELECT * FROM apprentice`, (err, results: []) => {
        connection.release();
        if (err) {
          reject(new DatabaseError("DataError"));
        }
        resolve(results);
      });
    });
  });
};
const createApprenticeArray = async (dataBaseResponse) => {
  return new Promise((resolve, reject) => {
    try {
      const apprentices = Promise.all(
        dataBaseResponse.map(async (apprentice) => {
          let bakerTeacher: Baker = null;
          if (apprentice.baker_cpf) {
            console.log(apprentice.baker_cpf);
            bakerTeacher = await getBakerByCpf(apprentice.baker_cpf);
          }

          return new Apprentice(
            apprentice.apprentice_first_name,
            apprentice.apprentice_last_name,
            apprentice.apprentice_cpf,
            undefined,
            bakerTeacher
          );
        })
      );

      resolve(apprentices);
    } catch (err) {
      reject(err);
    }
  });
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
    if (!bakerCpf) {
      throw new NullPropertyError(undefined, "bakerCpf is null");
    }
    await apprenticeAlreadyExists(apprenticeCpf);
    await bakerDoesNotExist(bakerCpf);
    await bakerAlreadyExists(apprenticeCpf);
    const bakerAlreadyHasApprentice = await didBakerHasApprentice(bakerCpf);
    if (bakerAlreadyHasApprentice.doesTeach) {
      throw new DatabaseError("Baker already has apprentice");
    }
    const apprentice = createApprentice(
      apprenticeCpf,
      apprenticeFirstName,
      apprenticeLastName,
      bakerCpf
    );
    await insertApprenticeIntoDatabase(apprentice);
    response.status(201).json(apprentice);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
export const getApprentices = async (request, response) => {
  try {
    const dataBaseResponse = await getApprenticesFromDatabase();
    const apprentices = await createApprenticeArray(dataBaseResponse);
    response.status(200).json(apprentices);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
