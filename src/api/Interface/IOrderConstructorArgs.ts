import Costumer from "../models/Person/Costumer";
import IBreadGet from "./IBreadGet";
import IBreadOrder from "./IBreadOrder";

export default interface IOrderConstructorArgs {
  orderId: string;
  costumerCpf?: string;
  breadPost?: IBreadOrder[];
  breadGet?: IBreadGet[];
  costumer?: Costumer;
}
