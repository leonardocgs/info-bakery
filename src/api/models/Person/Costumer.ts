import Person from "./Person";

export default class Costumer extends Person {
  // private Orders: Order[];
  constructor(firstName: string, lastName: string, cpf: string) {
    super(firstName, lastName, cpf);
  }
}
