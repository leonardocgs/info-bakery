import cpfIsValid from "../../../../aux/cpfVerifier";
import hasNullProperty from "../../../../aux/nullVerifier";
import hasInvalidNumber from "../../../../aux/type-verifiers/numberVerifier";
import hasInvalidString from "../../../../aux/type-verifiers/stringVerifier";
import InvalidCpfError from "../../../../error/InvalidCpfError";
import NullPropertyError from "../../../../error/NullPropertyError";
import InvalidNumberPropertyError from "../../../../error/type-error/InvalidNumberPropertyError";
import InvalidStringPropertyError from "../../../../error/type-error/InvalidStringPropertyError";

export default class Bread {
  private breadId: string;
  private breadPrice: number;
  private breadName: string;
  private bakerCpf: string;
  private breadTotal?: number;
  constructor(
    breadId: string,
    breadPrice: number,
    breadName: string,
    bakerCpf: string
  ) {
    const hasSomeNullProperties = hasNullProperty({
      breadId,
      breadPrice,
      breadName,
      bakerCpf,
    });
    if (hasSomeNullProperties.isNull) {
      throw new NullPropertyError(
        "Error",
        hasSomeNullProperties.nullProperties
      );
    }
    const hasSomeInvalidString = hasInvalidString({
      breadName,
      bakerCpf,
      breadId,
    });
    if (hasSomeInvalidString.isStringInvalid) {
      throw new InvalidStringPropertyError(
        "Error",
        hasSomeInvalidString.invalidString
      );
      const hasSomeInvalidNumber = hasInvalidNumber({
        breadPrice,
      });
      if (hasSomeInvalidNumber.isNumberInvalid) {
        throw new InvalidNumberPropertyError(
          "Error",
          hasSomeInvalidNumber.invalidNumber
        );
      }
      if (!cpfIsValid(bakerCpf)) {
        throw new InvalidCpfError("Error", bakerCpf);
      }
    }
    this.breadId = breadId;
    this.breadPrice = breadPrice;
    this.breadName = breadName;
    this.bakerCpf = bakerCpf;
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
      throw new InvalidStringPropertyError(
        "Error",
        breadIdIsValid.invalidString
      );
    }
    if (breadIdIsNull.isNull) {
      throw new NullPropertyError("Error", breadIdIsNull.nullProperties);
    }
    this.breadId = breadId;
  }
  public setBreadPrice(breadPrice: number) {
    const breadPriceIsValid = hasInvalidNumber({ breadPrice });
    const breadPriceIsNull = hasNullProperty({ breadPrice });
    if (breadPriceIsValid.isNumberInvalid) {
      throw new InvalidNumberPropertyError(
        "Error",
        breadPriceIsValid.invalidNumber
      );
    }
    if (breadPriceIsNull.isNull) {
      throw new NullPropertyError("Error", breadPriceIsNull.nullProperties);
    }
    this.breadPrice = breadPrice;
  }
  public setBreadName(breadName: string) {
    const breadNameIsValid = hasInvalidString({ breadName });
    const breadNameIsNull = hasNullProperty({ breadName });
    if (breadNameIsValid.isStringInvalid) {
      throw new InvalidStringPropertyError(
        "Error",
        breadNameIsValid.invalidString
      );
    }
    if (breadNameIsNull.isNull) {
      throw new NullPropertyError("Error", breadNameIsNull.nullProperties);
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
      throw new NullPropertyError("Error", bakerCpfIsNull.nullProperties);
    }
    if (cpfISInvalid.isStringInvalid) {
      throw new InvalidStringPropertyError("Error", cpfISInvalid.invalidString);
    }
    if (!isCPFValid) {
      throw new InvalidCpfError("Error", bakerCpf);
    }
  }
}
