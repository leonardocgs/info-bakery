import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import DatabaseError from "../../../../error/db-error/DatabaseError";
import pool from "../../dbconfig/db";
import Bread from "../../models/Bread/Bread";
import Baker from "../../models/Person/Baker";
import { bakerDoesNotExist, getBakerByCpf } from "../bakerService/bakerService";

const insertBread = (
  breadId: string,
  breadName: string,
  breadPrice: number,
  bakerCpf: string
) => {
  return new Bread(breadId, breadPrice, breadName, bakerCpf);
};
const insertBreadComplete = (
  breadId: string,
  breadName: string,
  breadPrice: number,
  baker: Baker
) => {
  const bread = new Bread(breadId, breadPrice, breadName, undefined, baker);

  return bread;
};
const getBreadArrays = async (databaseResponse) => {
  return new Promise((resolve, reject) => {
    try {
      const bread = Promise.all(
        databaseResponse.map(async (Element) => {
          const baker = await getBakerByCpf(Element.baker_cpf);
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

const getAllBreadsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new DatabaseError("Connection failed"));
      }
      connection.query("SELECT * FROM bread", (error, response) => {
        if (error) {
          reject(new DatabaseError("Select failed"));
        }
        connection.release();
        resolve(getBreadArrays(response));
      });
    });
  });
};

export const breadPost = async (request: Request, response: Response) => {
  const breadId = uuidv4();
  const { breadName, breadPrice, bakerCpf } = request.body;
  try {
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
