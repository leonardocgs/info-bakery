export default class InvalidNumberPropertyError extends Error {
  private invalidProperties: number[];
  constructor(message: string, invalidProperties: number[]) {
    super(message);
    Object.setPrototypeOf(this, InvalidNumberPropertyError.prototype);
    this.invalidProperties = invalidProperties;
  }
  getMessage() {
    return `Invalid Properties types : ${this.invalidProperties.join(
      ", "
    )}. Expected Number`;
  }
}
