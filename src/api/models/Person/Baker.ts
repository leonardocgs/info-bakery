import hasNullProperty from "../../../../aux/nullVerifier";
import hasInvalidNumber from "../../../../aux/type-verifiers/numberVerifier";
import NullPropertyError from "../../../../error/class-error/NullPropertyError";
import InvalidNumberPropertyError from "../../../../error/class-error/type-error/InvalidNumberPropertyError";
import Bread from "../Bread/Bread";
import Apprentice from "./Apprentice";
import Person from "./Person";

export default class Baker extends Person {
  private salary: number;
  private breads?: Bread[];
  private apprentice?: Apprentice;
  constructor(
    firstName: string,
    lastName: string,
    cpf: string,
    salary: number,
    breads?: Bread[],
    apprentice?: Apprentice
  ) {
    const hasSomeNullProperties = hasNullProperty({ salary });
    const hasInvalidSalary = hasInvalidNumber({ salary });
    super(firstName, lastName, cpf);
    if (hasSomeNullProperties.isNull) {
      throw new NullPropertyError(hasInvalidSalary.invalidNumber);
    }
    if (hasInvalidSalary.isNumberInvalid) {
      throw new InvalidNumberPropertyError(hasInvalidSalary.invalidNumber);
    }
    this.salary = salary;
    if (breads) {
      this.breads = breads;
    }
    if (apprentice) {
      this.apprentice = apprentice;
    }
  }
  public getSalary() {
    return this.salary;
  }
  public setBreads(breads: Bread[]) {
    this.breads = breads;
  }
}
