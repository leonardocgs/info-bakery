import Person from "./Person";

export default class Baker extends Person {
  private salary: number;
  constructor(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    cpf: string | null | undefined,
    salary: number | null | undefined
  ) {
    if (!salary) {
      throw new Error("Null properties");
    }
    super(firstName, lastName, cpf);
    this.salary = salary;
  }
}
