export default class InvalidNumberPropertyError extends Error {
  private invalidProperties: string[];
  constructor(invalidProperties: string[], message?: string) {
    if (!message) {
      super(
        `Invalid Properties types : ${invalidProperties.join(
          ", "
        )}. Expected Number`
      );
    } else {
      super(message);
    }
    Object.setPrototypeOf(this, InvalidNumberPropertyError.prototype);
    this.invalidProperties = invalidProperties;
  }
}
