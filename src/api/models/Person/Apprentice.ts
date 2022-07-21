import cpfIsValid from "../../../../aux/cpfVerifier";
import hasNullProperty from "../../../../aux/nullVerifier";
import hasInvalidString from "../../../../aux/type-verifiers/stringVerifier";
import InvalidCpfError from "../../../../error/class-error/InvalidCpfError";
import NullPropertyError from "../../../../error/class-error/NullPropertyError";
import InvalidStringPropertyError from "../../../../error/class-error/type-error/InvalidStringPropertyError";
import Baker from "./Baker";
import Person from "./Person";

export default class Apprentice extends Person {
  bakerCpf?: string;
  baker?: Baker;
  constructor(
    firstName: string,
    lastName: string,
    cpf: string,
    bakerCpf?: string,
    baker?: Baker
  ) {
    super(firstName, lastName, cpf);
    if (bakerCpf) {
      const hasNullValue = hasNullProperty({ bakerCpf });

      if (hasNullValue.isNull) {
        throw new NullPropertyError(hasNullValue.nullProperties);
      }
      const hasInvalidStringType = hasInvalidString({ bakerCpf });
      if (hasInvalidStringType.invalidString) {
        throw new InvalidStringPropertyError(
          hasInvalidStringType.invalidString
        );
      }

      if (!cpfIsValid(bakerCpf)) {
        throw new InvalidCpfError(bakerCpf);
      }
      this.bakerCpf = bakerCpf;
    }
    if (baker) {
      this.baker = baker;
    }
  }
  getBaker() {
    return this.baker;
  }
  getBakerCPf() {
    return this.bakerCpf;
  }
}
