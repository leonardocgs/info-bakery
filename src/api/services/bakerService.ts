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
const insertIntoDatabase = (baker: Baker, response: Response) => {
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
      (err) => {
        if (err) {
          throw new DatabaseError("Insert failed");
        }
        connection.release();
        response.status(201).json({ message: "Baker inserted" });
      }
    );
  });
};

export const bakerPost = (request: Request, response: Response) => {
  const { bakerCpf, bakerFirstName, bakerLastName, bakerSalary } = request.body;
  try {
    const newBaker = insertIntoBaker(
      bakerCpf,
      bakerFirstName,
      bakerLastName,
      bakerSalary
    );
    return insertIntoDatabase(newBaker, response);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return response.status(500).json({ message: error.message });
    }
    return response.status(400).json({
      error: error.getMessage(),
    });
  }
};
