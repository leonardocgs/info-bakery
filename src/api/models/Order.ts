import cpfIsValid from "../../../aux/cpfVerifier";
import hasNullProperty from "../../../aux/nullVerifier";
import hasInvalidNumber from "../../../aux/type-verifiers/numberVerifier";
import hasInvalidString from "../../../aux/type-verifiers/stringVerifier";
import InvalidCpfError from "../../../error/InvalidCpfError";
import NullPropertyError from "../../../error/NullPropertyError";
import InvalidNumberPropertyError from "../../../error/type-error/InvalidNumberPropertyError";
import IBreadGet from "../../../Interface/IBreadGet";
import { IBreadOrder } from "./Interface/IBreadOrder";
import Costumer from "./Person/Costumer";

export default class Order {
  orderId: string;
  costumerCpf: string;
  costumer?: Costumer;
  breadPost?: IBreadOrder[];
  breadGet?: IBreadGet[];
  orderTotal: number;
  orderTime: string;
  constructor(
    orderId: string,
    costumerCpf: string,
    orderTotal: number,
    orderTime: string,
    breadPost?: IBreadOrder[],
    breadGet?: IBreadGet[]
  ) {
    const hasSomeNullProperty = hasNullProperty({
      orderId,
      costumerCpf,
      breadPost,
      orderTotal,
      orderTime,
    });
    if (hasSomeNullProperty.isNull) {
      throw new NullPropertyError("err", hasSomeNullProperty.nullProperties);
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
    }

    const hasSomeInvalidString = hasInvalidString({
      orderId,
      costumerCpf,
      orderTime,
    });
    if (hasSomeInvalidString.isStringInvalid) {
      throw new InvalidNumberPropertyError(
        "error",
        hasSomeInvalidString.invalidString
      );
    }
    if (!cpfIsValid(costumerCpf)) {
      throw new InvalidCpfError("Error", costumerCpf);
    }
    const hasSomeInvalidNumber = hasInvalidNumber({
      orderTotal,
    });

    if (hasSomeInvalidNumber.isNumberInvalid) {
      throw new InvalidNumberPropertyError(
        "Error",
        hasSomeInvalidNumber.invalidNumber
      );
    }
    this.orderId = orderId;
    this.costumerCpf = costumerCpf;
    this.orderTime = orderTime;
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
