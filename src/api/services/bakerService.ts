import { Request, Response } from "express";

import DatabaseError from "../../../error/db-error/DatabaseError";
import pool from "../dbconfig/db";
import Baker from "../models/Person/Baker";

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
const insertIntoDatabase = async (baker: Baker) => {
  console.log(baker.getCpf());
  pool.getConnection((err, connection) => {
    if (err) {
      throw new DatabaseError("Connection failed");
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
          throw new DatabaseError("Insert failed");
        }
        return response;
        connection.release();
      }
    );
  });
};

export const bakerPost = async (request: Request, response: Response) => {
  const { bakerCpf, bakerFirstName, bakerLastName, bakerSalary } = request.body;
  try {
    const newBaker = insertIntoBaker(
      bakerCpf,
      bakerFirstName,
      bakerLastName,
      bakerSalary
    );
    await insertIntoDatabase(newBaker);
    return response
      .status(200)
      .json({ message: "Baker inserted successfully" });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return response.status(500).json({ message: error.message });
    }
    return response.status(400).json({
      error: error.getMessage(),
    });
  }
};
