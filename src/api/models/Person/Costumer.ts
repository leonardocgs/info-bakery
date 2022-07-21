import Order from "../Order";
import Person from "./Person";

export default class Costumer extends Person {
  private orders?: Order[];
  constructor(
    firstName: string,
    lastName: string,
    cpf: string,
    orders?: Order[]
  ) {
    super(firstName, lastName, cpf);
    if (orders) {
      this.orders = orders;
    }
  }
}
