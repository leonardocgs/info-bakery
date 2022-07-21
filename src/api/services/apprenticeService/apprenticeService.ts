import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Apprentice from "../../models/Person/Apprentice";

const apprenticeAlreadyExists = (apprenticeCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }
      connection.query(
        `SELECT COUNT(apprentice_cpf) as apprentice_total FROM apprentices WHERE apprentice_cpf = ?`,
        [apprenticeCpf],
        (err, result) => {
          if (err) {
            reject(err);
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
    apprenticeCpf,
    apprenticeFirstName,
    apprenticeLastName,
    bakerCpf
  );
};
