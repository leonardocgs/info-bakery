import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import Bread from "../../models/Bread/Bread";
import { bakerDoesNotExist } from "../bakerService/bakerService";

const insertBread = (
  breadId: string,
  breadName: string,
  breadPrice: number,
  bakerCpf: string
) => {
  return new Bread(breadId, breadPrice, breadName, bakerCpf);
};
export const breadPost = async (request: Request, response: Response) => {
  const breadId = uuidv4();
  const { breadName, breadPrice, bakerCpf } = request.body;
  try {
    const bread = insertBread(breadId, breadName, breadPrice, bakerCpf);
    console.log(bread);
    await bakerDoesNotExist(breadId);
  } catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }
};
