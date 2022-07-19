import cpfIsValid from "../../../../aux/cpfVerifier";
import hasNullProperty from "../../../../aux/nullVerifier";
import hasInvalidString from "../../../../aux/type-verifiers/stringVerifier";
import InvalidCpfError from "../../../../error/InvalidCpfError";
import NullPropertyError from "../../../../error/NullPropertyError";
import InvalidStringPropertyError from "../../../../error/type-error/InvalidStringPropertyError";

export default class Person {
  protected firstName: string;
  protected lastName: string;
  protected cpf: string;

  constructor(firstName: string, lastName: string, cpf: string) {
    const nullVerifier = hasNullProperty({ firstName, lastName, cpf });

    if (nullVerifier.isNull) {
      throw new NullPropertyError("Error", nullVerifier.nullProperties);
    }
    const nameVerifier = hasInvalidString({ firstName, lastName, cpf });

    if (nameVerifier.isStringInvalid) {
      throw new InvalidStringPropertyError("Error", nameVerifier.invalidString);
    }
    if (!cpfIsValid(cpf)) {
      throw new InvalidCpfError("ERRO", cpf);
    }
    this.firstName = firstName;
    this.lastName = lastName;
    this.cpf = cpf;
  }

  getFirstName(): string {
    return this.firstName;
  }
  getLastName(): string {
    return this.lastName;
  }
  getCpf(): string {
    return this.cpf;
  }
  // setters

  setFirstName(firstName: string): void {
    const nullVerifier = hasNullProperty({ firstName });
    const nameVerifier = hasInvalidString({ firstName });
    if (nullVerifier.isNull) {
      throw new NullPropertyError("Error", nullVerifier.nullProperties);
    }

    if (nameVerifier.invalidString) {
      throw new InvalidStringPropertyError("Err", nameVerifier.invalidString);
    }

    this.firstName = firstName;
  }
  setLastName(lastName: string): void {
    const nullVerifier = hasNullProperty({ lastName });
    const nameVerifier = hasInvalidString({ lastName });
    if (nullVerifier.isNull) {
      throw new NullPropertyError("Error", nullVerifier.nullProperties);
    }
    if (nameVerifier.invalidString) {
      throw new InvalidStringPropertyError("Err", nameVerifier.invalidString);
    }

    this.lastName = lastName;
  }
  setCpf(cpf: string): void {
    const nullVerifier = hasNullProperty({ cpf });
    const stringVerifier = hasInvalidString({ cpf });
    if (nullVerifier.isNull) {
      throw new NullPropertyError("Error", nullVerifier.nullProperties);
    }
    if (stringVerifier.invalidString) {
      throw new InvalidStringPropertyError("Err", stringVerifier.invalidString);
    }

    if (!cpfIsValid(cpf)) {
      throw new InvalidCpfError("Invalid attribute", cpf);
    }
    this.cpf = cpf;
  }
}
