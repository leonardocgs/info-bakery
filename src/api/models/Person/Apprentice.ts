import cpfIsValid from "../../../../aux/cpfVerifier";
import InvalidCpfError from "../../../../error/class-error/InvalidCpfError";
import Baker from "./Baker";
import Person from "./Person";

export default class Apprentice extends Person {
  bakerCpf: string;
  baker?: Baker;
  constructor(
    firstName: string,
    lastName: string,
    cpf: string,
    bakerCpf: string
  ) {
    super(firstName, lastName, cpf);
    if (!bakerCpf) {
      throw new Error("Baker cpf is null");
    }
    if (typeof bakerCpf !== "string") {
      throw new Error("Baker cpf is not a string");
    }
    if (!cpfIsValid(bakerCpf)) {
      throw new InvalidCpfError("Baker cpf is invalid", bakerCpf);
    }
    this.bakerCpf = bakerCpf;
  }
  getBaker() {
    return this.baker;
  }
}
