import cpfIsValid from "../../../../aux/cpfVerifier";
import hasNullProperty from "../../../../aux/nullVerifier";
import hasInvalidNumber from "../../../../aux/type-verifiers/numberVerifier";
import hasInvalidString from "../../../../aux/type-verifiers/stringVerifier";
import InvalidCpfError from "../../../../error/class-error/InvalidCpfError";
import NullPropertyError from "../../../../error/class-error/NullPropertyError";
import InvalidNumberPropertyError from "../../../../error/class-error/type-error/InvalidNumberPropertyError";
import InvalidStringPropertyError from "../../../../error/class-error/type-error/InvalidStringPropertyError";
import Baker from "../Person/Baker";

export default class Bread {
  private breadId: string;
  private breadPrice: number;
  private breadName: string;
  private bakerCpf?: string;
  private baker?: Baker;
  private breadTotal?: number;
  constructor(
    breadId: string,
    breadPrice: number,
    breadName: string,
    bakerCpf?: string,
    baker?: Baker
  ) {
    let validProperties: object;
    let stringProperties: object;
    if (bakerCpf) {
      validProperties = { breadId, breadPrice, breadName, bakerCpf };
      stringProperties = {
        breadName,
        bakerCpf,
        breadId,
      };
    } else {
      validProperties = { breadId, breadPrice, breadName };
      stringProperties = { breadName, breadId };
    }

    const hasSomeNullProperties = hasNullProperty(validProperties);
    if (hasSomeNullProperties.isNull) {
      throw new NullPropertyError(hasSomeNullProperties.nullProperties);
    }

    const hasSomeInvalidString = hasInvalidString(stringProperties);
    if (hasSomeInvalidString.isStringInvalid) {
      throw new InvalidStringPropertyError(hasSomeInvalidString.invalidString);
    }

    const hasSomeInvalidNumber = hasInvalidNumber({
      breadPrice,
    });
    if (hasSomeInvalidNumber.isNumberInvalid) {
      throw new InvalidNumberPropertyError(hasSomeInvalidNumber.invalidNumber);
    }

    this.breadId = breadId;

    this.breadPrice = breadPrice;

    this.breadName = breadName;

    if (bakerCpf) {
      if (!cpfIsValid(bakerCpf)) {
        throw new InvalidCpfError(bakerCpf);
      }
      this.bakerCpf = bakerCpf;
    }

    if (baker) {
      this.baker = baker;
    }
  }
  // getters and setters
  // getters and setters

  public getBreadId() {
    return this.breadId;
  }
  public getBreadPrice() {
    return this.breadPrice;
  }
  public getBreadName() {
    return this.breadName;
  }
  public getBakerCpf() {
    return this.bakerCpf;
  }
  public getBreadTotal() {
    return this.breadTotal;
  }
  // setters
  public setBreadId(breadId: string) {
    const breadIdIsValid = hasInvalidString({ breadId });
    const breadIdIsNull = hasNullProperty({ breadId });
    if (breadIdIsValid.isStringInvalid) {
      throw new InvalidStringPropertyError(breadIdIsValid.invalidString);
    }
    if (breadIdIsNull.isNull) {
      throw new NullPropertyError(breadIdIsNull.nullProperties);
    }
    this.breadId = breadId;
  }
  public setBreadPrice(breadPrice: number) {
    const breadPriceIsValid = hasInvalidNumber({ breadPrice });
    const breadPriceIsNull = hasNullProperty({ breadPrice });
    if (breadPriceIsValid.isNumberInvalid) {
      throw new InvalidNumberPropertyError(breadPriceIsValid.invalidNumber);
    }
    if (breadPriceIsNull.isNull) {
      throw new NullPropertyError(breadPriceIsNull.nullProperties);
    }
    this.breadPrice = breadPrice;
  }
  public setBreadName(breadName: string) {
    const breadNameIsValid = hasInvalidString({ breadName });
    const breadNameIsNull = hasNullProperty({ breadName });
    if (breadNameIsValid.isStringInvalid) {
      throw new InvalidStringPropertyError(breadNameIsValid.invalidString);
    }
    if (breadNameIsNull.isNull) {
      throw new NullPropertyError(breadNameIsNull.nullProperties);
    }
    this.breadName = breadName;
  }
  public setBreadTotal(breadTotal: number) {
    this.breadTotal = breadTotal;
  }
  public setCpf(bakerCpf: string) {
    const isCPFValid = cpfIsValid(bakerCpf);
    const bakerCpfIsNull = hasNullProperty({ bakerCpf });
    const cpfISInvalid = hasInvalidString({ bakerCpf });
    if (bakerCpfIsNull.isNull) {
      throw new NullPropertyError(bakerCpfIsNull.nullProperties);
    }
    if (cpfISInvalid.isStringInvalid) {
      throw new InvalidStringPropertyError(cpfISInvalid.invalidString);
    }
    if (!isCPFValid) {
      throw new InvalidCpfError(bakerCpf);
    }
  }
}
