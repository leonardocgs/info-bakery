export default class InvalidNumberPropertyError extends Error {
  private invalidProperties: string[];
  constructor(message: string, invalidProperties: string[]) {
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
