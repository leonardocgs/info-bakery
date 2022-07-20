export default class InvalidStringPropertyError extends Error {
  private invalidProperties: string[];
  constructor(message: string, invalidProperties: string[]) {
    super(message);
    Object.setPrototypeOf(this, InvalidStringPropertyError.prototype);
    this.invalidProperties = invalidProperties;
  }
  getMessage() {
    return `Invalid Properties types : ${this.invalidProperties.join(
      ", "
    )}. Expected String`;
  }
}
