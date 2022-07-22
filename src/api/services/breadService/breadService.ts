import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import NullPropertyError from "../../../../error/class-error/NullPropertyError";
import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import IBreadBaker from "../../Interface/IBreadBaker";
import Bread from "../../models/Bread/Bread";
import Baker from "../../models/Person/Baker";
import { bakerDoesNotExist, getBakerByCpf } from "../bakerService/bakerService";
/* Checks if a baker already made any bread. 
If yes, it returns the bread info from database
*/

export const didBakerAlreadyBakeBread = (
  bakerCpf: string
): Promise<IBreadBaker> => {
  const breadBaker: IBreadBaker = {
    alteradyBaked: false,
    databaseResponse: undefined,
  };
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT * FROM bread WHERE baker_cpf = ?`,
        [bakerCpf],
        (err, results: []) => {
          connection.release();
          if (err) {
            reject(new DatabaseError("error querying database"));
          }
          if (results.length > 0) {
            breadBaker.alteradyBaked = true;
            breadBaker.databaseResponse = results;
          }
          resolve(breadBaker);
        }
      );
    });
  });
};
// get array of breads class by baker cpf
export const getBreadsArrayBaker = (breadBaker) => {
  const breads: Bread[] = breadBaker.databaseResponse.map((Element) => {
    return new Bread(
      Element.bread_id,
      Number(Element.bread_price),
      Element.bread_name
    );
  });
  return breads;
};
// populates a bread class
const insertBread = (
  breadId: string,
  breadName: string,
  breadPrice: number,
  bakerCpf: string
) => {
  return new Bread(breadId, breadPrice, breadName, bakerCpf);
};
// populates a bread class
const insertBreadComplete = (
  breadId: string,
  breadName: string,
  breadPrice: number,
  baker: Baker
) => {
  const bread = new Bread(breadId, breadPrice, breadName, undefined, baker);

  return bread;
};
// get array of bread from database response
const getBreadArrays = async (databaseResponse) => {
  return new Promise((resolve, reject) => {
    try {
      const bread = Promise.all(
        databaseResponse.map(async (Element) => {
          let baker: Baker;
          if (Element.baker_cpf) {
            baker = await getBakerByCpf(Element.baker_cpf);
          }
          const bread = insertBreadComplete(
            Element.bread_id,
            Element.bread_name,
            Number(Element.bread_price),
            baker
          );
          return bread;
        })
      );

      resolve(bread);
    } catch (error) {
      reject(error);
    }
  });
};
export const breadDoesNotExist = (breadId: string) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
      }
      connection.query(
        `SELECT COUNT (bread_id) as breadTotal FROM bread where bread_id = ?`,
        [breadId],
        (err, results) => {
          connection.release();
          if (err) {
            reject(new DatabaseError("error querying database"));
          }
          connection.release();
          if (results[0].breadTotal === 0) {
            reject(new DatabaseError("bread does not exist"));
            return;
          }

          resolve(results);
        }
      );
    });
  });
};
export const getBreadByIdFromDatabase = (breadId: string): Promise<Bread> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Error connecting to database"));
        return;
      }
      connection.query(
        `SELECT * FROM bread WHERE bread_id = ?`,
        [breadId],
        (err, results) => {
          connection.release();
          if (err) {
            reject(new DatabaseError("error querying database"));
            return;
          }
          const bread = new Bread(
            results[0].bread_id,
            Number(results[0].bread_price),
            results[0].bread_name
          );
          resolve(bread);
        }
      );
    });
  });
};

// insert bread into database
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
          connection.release();
          resolve(response);
        }
      );
    });
  });
};

const getAllBreadsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query("SELECT * FROM bread", (error, response) => {
        if (error) {
          reject(new DatabaseError("Select failed"));
          return;
        }

        connection.release();

        resolve(getBreadArrays(response));
      });
    });
  });
};
const updateBreadInsideDatabase = (bread: Bread) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE bread SET bread_name = ?, bread_price = ? WHERE bread_id = ?",
      [bread.getBreadName(), bread.getBreadPrice(), bread.getBreadId()],
      (error, response) => {
        if (error) {
          reject(new DatabaseError("Update failed"));
          return;
        }
        resolve(response);
      }
    );
  });
};

export const breadPost = async (request: Request, response: Response) => {
  const breadId = uuidv4();
  const { breadName, breadPrice, bakerCpf } = request.body;
  try {
    if (!bakerCpf) {
      throw new NullPropertyError(undefined, "Baker cpf is null");
    }
    const bread = insertBread(breadId, breadName, breadPrice, bakerCpf);

    await bakerDoesNotExist(bakerCpf);
    await insertBreadIntoDatabase(bread);
    response.status(201).send(bread);
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
};
export const getBreads = async (request: Request, response: Response) => {
  try {
    const breads = await getAllBreadsFromDatabase();

    response.status(200).json({ breads });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
};
export const updateBread = async (request: Request, response: Response) => {
  const { breadId } = request.params;
  console.log(breadId);
  const { breadName, breadPrice } = request.body;
  try {
    await breadDoesNotExist(breadId);
    const bread = new Bread(breadId, breadPrice, breadName);
    bread.setBreadName(breadName);
    bread.setBreadPrice(breadPrice);
    await updateBreadInsideDatabase(bread);
    response.status(200).json({
      bread,
    });
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
};
