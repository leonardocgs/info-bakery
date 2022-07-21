import cpfIsValid from "../../../aux/cpfVerifier";
import hasNullProperty from "../../../aux/nullVerifier";
import hasInvalidString from "../../../aux/type-verifiers/stringVerifier";
import InvalidCpfError from "../../../error/class-error/InvalidCpfError";
import NullPropertyError from "../../../error/class-error/NullPropertyError";
import InvalidNumberPropertyError from "../../../error/class-error/type-error/InvalidNumberPropertyError";
import IBreadGet from "../Interface/IBreadGet";
import IBreadOrder from "../Interface/IBreadOrder";
import IOrderConstructorArgs from "../Interface/IOrderConstructorArgs";
import Costumer from "./Person/Costumer";

export default class Order {
  orderId: string;
  costumerCpf?: string;
  costumer?: Costumer;
  breadPost?: IBreadOrder[];
  breadGet?: IBreadGet[];
  orderTotal: number;

  constructor(
    orderId: string,
    costumerCpf?: string,
    breadPost?: IBreadOrder[],
    breadGet?: IBreadGet[],
    costumer?: Costumer
  ) {
    let properties: IOrderConstructorArgs;
    if (costumerCpf) {
      properties = { orderId, costumerCpf };
    } else {
      properties = { orderId };
    }
    const hasSomeNullProperty = hasNullProperty(properties);
    if (hasSomeNullProperty.isNull) {
      throw new NullPropertyError(hasSomeNullProperty.nullProperties);
    }
    if (breadPost) {
      if (this.breadPostHasNullProperty(breadPost) && breadPost) {
        throw new Error("BreadPost has null property");
      }
      if (this.breadPostHasInvalidString(breadPost)) {
        throw new Error(
          "BreadPost has some invalid breadId Type. Expected: string"
        );
      }
      if (this.breadPostHasInvalidAmount(breadPost)) {
        throw new Error(
          "BreadPost has some invalid breadAmount Type. Expected: number"
        );
      }
      this.breadPost = breadPost;
    }
    if (breadGet) {
      this.breadGet = breadGet;
      this.calcOrderTotal();
    }

    const hasSomeInvalidString = hasInvalidString(properties);
    if (hasSomeInvalidString.isStringInvalid) {
      throw new InvalidNumberPropertyError(hasSomeInvalidString.invalidString);
    }
    if (costumerCpf) {
      if (!cpfIsValid(costumerCpf)) {
        throw new InvalidCpfError("Error", costumerCpf);
      }
      this.costumerCpf = costumerCpf;
    }

    this.orderId = orderId;

    if (costumer) {
      this.costumer = costumer;
    }
  }
  // auxiliar methodes to check if breadPost has some invalid property
  private breadPostHasInvalidString(breadPost: IBreadOrder[]): boolean {
    let invalidString = false;
    breadPost.forEach((bread: IBreadOrder) => {
      if (typeof bread.breadId !== "string") {
        invalidString = true;
      }
    });
    return invalidString;
  }
  private breadPostHasInvalidAmount(breadPost: IBreadOrder[]): boolean {
    let invalidAmount = false;
    breadPost.forEach((bread: IBreadOrder) => {
      if (typeof bread.breadAmount !== "number") {
        invalidAmount = true;
      }
    });
    return invalidAmount;
  }
  private breadPostHasNullProperty(breadPost: IBreadOrder[]): boolean {
    let nullProperty = false;
    breadPost.forEach((bread: IBreadOrder) => {
      if (!bread.breadId || !bread.breadAmount) {
        nullProperty = true;
      }
    });
    return nullProperty;
  }
  private calcOrderTotal() {
    const initialValue = 0;
    const total = this.breadGet.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        currentValue.bread.getBreadPrice() * currentValue.breadAmount
      );
    }, initialValue);
    this.orderTotal = total;
  }
  // Write all the getters
  getOrderId(): string {
    return this.orderId;
  }
  getCostumerCpf(): string {
    return this.costumerCpf;
  }
  getCostumer(): Costumer {
    return this.costumer;
  }
  getBreadPost(): IBreadOrder[] {
    return this.breadPost;
  }

  //
}
