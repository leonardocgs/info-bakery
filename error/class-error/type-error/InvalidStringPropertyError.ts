export default class InvalidStringPropertyError extends Error {
  private invalidProperties: string[];
  constructor(invalidProperties: string[], message?: string) {
    if (!message) {
      super(
        `Invalid Properties types : ${invalidProperties.join(
          ", "
        )}. Expected String`
      );
    } else {
      super(message);
    }
    Object.setPrototypeOf(this, InvalidStringPropertyError.prototype);
    this.invalidProperties = invalidProperties;
  }
}
