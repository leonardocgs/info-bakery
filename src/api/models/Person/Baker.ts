import hasNullProperty from "../../../../aux/nullVerifier";
import hasInvalidNumber from "../../../../aux/type-verifiers/numberVerifier";
import NullPropertyError from "../../../../error/class-error/NullPropertyError";
import InvalidNumberPropertyError from "../../../../error/class-error/type-error/InvalidNumberPropertyError";
import Bread from "../Bread/Bread";
import Person from "./Person";

export default class Baker extends Person {
  private salary: number;
  private breads?: Bread[];
  constructor(
    firstName: string,
    lastName: string,
    cpf: string,
    salary: number,
    breads?: Bread[]
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
  }
  public getSalary() {
    return this.salary;
  }
  public setBreads(breads: Bread[]) {
    this.breads = breads;
  }
}
