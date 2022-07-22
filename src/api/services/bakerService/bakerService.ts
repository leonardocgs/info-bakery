import { Request, Response } from "express";

import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Bread from "../../models/Bread/Bread";
import Apprentice from "../../models/Person/Apprentice";
import Baker from "../../models/Person/Baker";
import {
  didBakerHasApprentice,
  createApprenticeWithoutBakerCpf,
} from "../apprenticeService/apprenticeService";
import {
  didBakerAlreadyBakeBread,
  getBreadsArrayBaker,
} from "../breadService/breadService";

const insertIntoBakerComplete = (
  bakerCpf: string,
  bakerFirstName: string,
  bakerLastName: string,
  bakerSalary: number,
  breads: Bread[],
  apprentice: Apprentice
) => {
  return new Baker(
    bakerFirstName,
    bakerLastName,
    bakerCpf,
    bakerSalary,
    breads,
    apprentice
  );
};
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
    bakerSalary,
    undefined
  );
  return newBaker;
};
const getBakerArray = async (databaseResponse) => {
  return new Promise((resolve, reject) => {
    try {
      const bakerArray = Promise.all(
        databaseResponse.map(async (Element) => {
          const bakerProperties: [
            string,
            string,
            string,
            number,
            Bread[] | [],
            Apprentice | undefined
          ] = [
            Element.baker_cpf,
            Element.baker_first_name,
            Element.baker_last_name,
            Number(Element.baker_salary),
            [],
            undefined,
          ];
          const didBakeAlready = await didBakerAlreadyBakeBread(
            Element.baker_cpf
          );
          const didBakerTeaches = await didBakerHasApprentice(
            Element.baker_cpf
          );
          if (didBakeAlready.alteradyBaked) {
            const breads = await getBreadsArrayBaker(didBakeAlready);

            bakerProperties[4] = breads;
          }
          if (didBakerTeaches.doesTeach) {
            const apprentice = createApprenticeWithoutBakerCpf(didBakerTeaches);
            bakerProperties[5] = apprentice;
          }

          return insertIntoBakerComplete(...bakerProperties);
        })
      );
      resolve(bakerArray);
    } catch (err) {
      reject(err);
    }
  });
};
const getAllBakersFromDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT * FROM baker ORDER BY baker_first_name, baker_last_name `,
        (err, results: []) => {
          connection.release();
          if (err) {
            reject(new DatabaseError("error querying database"));
            return;
          }

          resolve(getBakerArray(results));
        }
      );
    });
  });
};
const updateBakerInsideDatabase = (baker: Baker) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE  baker SET baker_first_name  = ?, baker_last_name = ?, baker_salary = ? where baker_cpf = ?",
      [
        baker.getFirstName(),
        baker.getLastName(),
        baker.getSalary(),
        baker.getCpf(),
      ],
      (err, response) => {
        if (err) {
          console.log(err);
          reject(new DatabaseError("Update failed"));
          return;
        }
        resolve(response);
      }
    );
  });
};
const deleteBakerInsideDatabase = (bakerCpf: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM baker WHERE baker_cpf = ?",
      [bakerCpf],
      (err, response) => {
        if (err) {
          reject(new DatabaseError("Delete failed"));
          return;
        }
        resolve(response);
      }
    );
  });
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
export const bakerAlreadyExists = (bakerCpf: string) => {
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
            reject(
              new DatabaseError(`There is a baker with this cpf ${bakerCpf}`)
            );
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
export const getBakerByCpf = (bakerCpf: string): Promise<Baker> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query(
        "Select * from baker where baker_cpf = ?",
        [bakerCpf],
        (err, response) => {
          if (err) {
            reject(new DatabaseError("Select failed"));
          }
          connection.release();
          try {
            const baker = insertIntoBaker(
              response[0].baker_cpf,
              response[0].baker_first_name,
              response[0].baker_last_name,
              Number(response[0].baker_salary)
            );
            resolve(baker);
          } catch (error) {
            reject(error);
          }
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
export const getAllBakers = async (request: Request, response: Response) => {
  try {
    const allBakers = await getAllBakersFromDatabase();
    return response.status(200).json(allBakers);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};
export const updateBaker = async (request: Request, response: Response) => {
  const { bakerCpf } = request.params;
  const { bakerFirstName, bakerLastName, bakerSalary } = request.body;
  try {
    await bakerDoesNotExist(bakerCpf);
    const baker = new Baker(
      bakerFirstName,
      bakerLastName,
      bakerCpf,
      Number(bakerSalary)
    );
    await updateBakerInsideDatabase(baker);
    response.status(200).json({ message: "Baker updated successfully" });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};
export const deleteBaker = async (request: Request, response: Response) => {
  const { bakerCpf } = request.params;
  try {
    await bakerDoesNotExist(bakerCpf);
    await deleteBakerInsideDatabase(bakerCpf);
    response.status(200).json({ message: "Baker deleted successfully" });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};
